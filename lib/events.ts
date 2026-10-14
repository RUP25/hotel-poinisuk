/**
 * Hotel Poinisuk — Events API client
 *
 * Single source of truth for talking to the AWS Lambda events backend.
 * Mirrors the shape and conventions of `lib/contact.ts` so the codebase
 * stays consistent — both pieces of dynamic data (contact form + events)
 * use the same API Gateway in `ap-south-1`.
 *
 * Endpoint layout (see /aws/README.md for the full deployment guide):
 *   GET    /events                  → public, list of upcoming + ongoing events
 *   POST   /admin/events            → JWT-protected, create
 *   PUT    /admin/events/{id}       → JWT-protected, update
 *   DELETE /admin/events/{id}       → JWT-protected, delete
 *   POST   /admin/upload-url        → JWT-protected, returns a presigned S3 URL
 *
 * The base URL is taken from `NEXT_PUBLIC_EVENTS_API_BASE` so we can swap
 * staging / production without code changes. Falls back to a sensible
 * placeholder so the build never fails before the env var is set.
 */

import type {
  EventInput,
  EventRecord,
} from "@/types/events";
import { getAdminToken } from "@/lib/admin-auth";

// -----------------------------------------------------------------------------
// Endpoint configuration
// -----------------------------------------------------------------------------

/**
 * Base URL for the events API. Set this in `.env.local` (and in your
 * production env) once the AWS stack is deployed:
 *
 *     NEXT_PUBLIC_EVENTS_API_BASE=https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com
 *
 * The trailing slash is stripped so we can safely concatenate paths.
 */
export const EVENTS_API_BASE = (
  process.env.NEXT_PUBLIC_EVENTS_API_BASE ||
  "https://REPLACE-ME.execute-api.ap-south-1.amazonaws.com"
).replace(/\/$/, "");

/** Build an update payload from a stored record (admin quick actions). */
export function eventRecordToInput(r: EventRecord): EventInput {
  return {
    title: r.title,
    subtitle: r.subtitle ?? "",
    date: r.date,
    startTime: r.startTime,
    endTime: r.endTime ?? "",
    description: r.description,
    imageUrl: r.imageUrl ?? "",
    category: r.category,
    isHighlighted: r.isHighlighted ?? false,
    showInPastHighlights: r.showInPastHighlights ?? false,
    cover: r.cover ?? "",
  };
}

// -----------------------------------------------------------------------------
// Result helpers
// -----------------------------------------------------------------------------

interface ApiResult<T> {
  ok: boolean;
  data?: T;
  message: string;
  status?: number;
}

const NETWORK_FAILURE =
  "Network error. Please check your connection and try again.";

/**
 * Some Lambda + API Gateway integrations wrap the real response in
 * `{ statusCode, body }` — this helper unwraps both shapes uniformly.
 */
async function unwrapResponse<T>(res: Response): Promise<{ ok: boolean; data?: T; message?: string }> {
  let parsed: any = null;
  try {
    parsed = await res.json();
  } catch {
    // body wasn't JSON — fall through with res.ok
  }

  if (parsed && typeof parsed === "object" && "statusCode" in parsed) {
    const ok = parsed.statusCode >= 200 && parsed.statusCode < 300;
    let inner: any = parsed.body;
    if (typeof inner === "string") {
      try {
        inner = JSON.parse(inner);
      } catch {
        inner = { message: inner };
      }
    }
    return { ok, data: inner, message: inner?.message };
  }

  return { ok: res.ok, data: parsed, message: parsed?.message };
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Fetches the list of events for the public karaoke page. No auth needed.
 * Returns an empty array on any failure so the page never crashes.
 */
export async function fetchPublicEvents(): Promise<EventRecord[]> {
  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/events`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // Always pull fresh — events change daily and we don't want
      // CloudFront / browser cache to hide them.
      cache: "no-store",
    });
  } catch {
    return [];
  }

  const { ok, data } = await unwrapResponse<{ events: EventRecord[] }>(res);
  if (!ok || !data?.events) return [];
  return data.events;
}

// -----------------------------------------------------------------------------
// Admin API (JWT-protected)
// -----------------------------------------------------------------------------

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function createEvent(input: EventInput): Promise<ApiResult<EventRecord>> {
  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/admin/events`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, message: NETWORK_FAILURE };
  }

  const { ok, data, message } = await unwrapResponse<EventRecord>(res);
  return {
    ok,
    data: ok ? (data as EventRecord) : undefined,
    message: message || (ok ? "Event created." : "Could not create event."),
    status: res.status,
  };
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<ApiResult<EventRecord>> {
  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/admin/events/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, message: NETWORK_FAILURE };
  }

  const { ok, data, message } = await unwrapResponse<EventRecord>(res);
  return {
    ok,
    data: ok ? (data as EventRecord) : undefined,
    message: message || (ok ? "Event updated." : "Could not update event."),
    status: res.status,
  };
}

export async function deleteEvent(id: string): Promise<ApiResult<null>> {
  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/admin/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  } catch {
    return { ok: false, message: NETWORK_FAILURE };
  }

  const { ok, message } = await unwrapResponse<null>(res);
  return {
    ok,
    message: message || (ok ? "Event deleted." : "Could not delete event."),
    status: res.status,
  };
}

export async function fetchEventById(id: string): Promise<EventRecord | null> {
  // We reuse the public list endpoint and find the record client-side. This
  // keeps the Lambda surface tiny — there's no per-id GET to maintain. Given
  // the catalog rarely exceeds a few dozen events, this is essentially free.
  const events = await fetchPublicEvents();
  return events.find((e) => e.id === id) ?? null;
}

// -----------------------------------------------------------------------------
// Image upload (presigned S3 URL)
// -----------------------------------------------------------------------------

interface UploadUrlResponse {
  uploadUrl: string; // S3 presigned PUT URL
  publicUrl: string; // Final public URL once upload completes
  contentType: string;
}

/**
 * Uploads an image to S3 in two steps:
 *   1. Ask the Lambda for a presigned PUT URL.
 *   2. PUT the file directly to S3.
 *
 * Returns the final public URL on success, or `null` on any failure.
 */
export async function uploadEventImage(file: File): Promise<string | null> {
  // 1) Ask the Lambda for a presigned URL.
  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/admin/upload-url`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      }),
    });
  } catch {
    return null;
  }

  const { ok, data } = await unwrapResponse<UploadUrlResponse>(res);
  if (!ok || !data?.uploadUrl || !data?.publicUrl) return null;

  // 2) PUT the file directly to S3 using the presigned URL.
  try {
    const putRes = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": data.contentType },
      body: file,
    });
    if (!putRes.ok) return null;
  } catch {
    return null;
  }

  return data.publicUrl;
}
