/**
 * Hotel Poinisuk — Admin auth client
 *
 * Manages the lifecycle of the admin JWT issued by the AWS Lambda login
 * endpoint. The site is statically exported (`output: "export"`), so all
 * auth state lives in `localStorage` on the user's device and is checked
 * against the server only when an admin action is performed.
 *
 * Security model:
 *   - Password is checked server-side (Lambda holds the bcrypt hash in an
 *     env var).
 *   - On success, Lambda signs a JWT with a 24-hour expiry.
 *   - The frontend stores the JWT in localStorage and attaches it to every
 *     admin request as `Authorization: Bearer <token>`.
 *   - The Lambda verifies the JWT signature on every protected route, so
 *     the admin's permissions cannot be forged client-side.
 *
 * This is appropriate for a single-admin owner-operator setup. If multiple
 * admins or audit logs are needed later, swap to AWS Cognito with minimal
 * frontend changes (the helpers below are the only call sites).
 */

import type {
  AdminLoginInput,
  AdminLoginResult,
  AdminSession,
} from "@/types/admin-auth";
import { EVENTS_API_BASE } from "@/lib/events";

// -----------------------------------------------------------------------------
// Storage helpers
// -----------------------------------------------------------------------------

const STORAGE_KEY = "hp_admin_session_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readSession(): AdminSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (
      typeof parsed?.token !== "string" ||
      typeof parsed?.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: AdminSession): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable / full — fail silently; the user can re-login.
  }
}

function clearSession(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// -----------------------------------------------------------------------------
// Public auth API
// -----------------------------------------------------------------------------

/**
 * Returns the raw JWT for use in `Authorization: Bearer ...` headers.
 * Returns `null` if no session, or the session has expired.
 */
export function getAdminToken(): string | null {
  const session = readSession();
  if (!session) return null;
  // 5-second clock skew tolerance — same convention used by AWS SDKs.
  if (Date.now() / 1000 >= session.expiresAt - 5) {
    clearSession();
    return null;
  }
  return session.token;
}

/**
 * Sync check — returns `true` if a non-expired token is in storage.
 * Suitable for client-side route guards.
 */
export function isAdminAuthenticated(): boolean {
  return getAdminToken() !== null;
}

/**
 * POST /admin/login — exchange a password for a JWT. Never throws; all
 * failure paths are surfaced as `{ ok: false, message }`.
 */
export async function loginAdmin(
  input: AdminLoginInput
): Promise<AdminLoginResult> {
  if (!input.password?.trim()) {
    return { ok: false, message: "Please enter the admin password." };
  }

  let res: Response;
  try {
    res = await fetch(`${EVENTS_API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input.password }),
    });
  } catch {
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }

  // Unwrap both `{ statusCode, body }` and plain shapes — same as lib/events.
  let parsed: any = null;
  try {
    parsed = await res.json();
  } catch {
    // ignore
  }

  let ok = res.ok;
  let inner: any = parsed;
  if (parsed && typeof parsed === "object" && "statusCode" in parsed) {
    ok = parsed.statusCode >= 200 && parsed.statusCode < 300;
    if (typeof parsed.body === "string") {
      try {
        inner = JSON.parse(parsed.body);
      } catch {
        inner = { message: parsed.body };
      }
    } else {
      inner = parsed.body;
    }
  }

  if (!ok || !inner?.token) {
    return {
      ok: false,
      message:
        inner?.message ||
        (res.status === 401
          ? "Incorrect password."
          : "Could not sign in. Please try again."),
    };
  }

  const expiresAt: number =
    typeof inner.expiresAt === "number"
      ? inner.expiresAt
      : Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  writeSession({ token: inner.token, expiresAt });

  return {
    ok: true,
    token: inner.token,
    expiresAt,
    message: inner.message || "Signed in.",
  };
}

/**
 * Clears the local session. There is no remote logout — the JWT simply
 * stops being attached to requests, and the Lambda will reject it once it
 * expires.
 */
export function logoutAdmin(): void {
  clearSession();
}
