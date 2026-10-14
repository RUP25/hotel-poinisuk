/**
 * Shared contact-form submission logic.
 *
 * Single source of truth for:
 *   - The AWS API Gateway endpoint URL (Lambda-backed)
 *   - The payload shape we POST
 *   - The response interpretation (handles both raw fetch responses and the
 *     `{ statusCode, body }` shape that some Lambda integrations return)
 *
 * Both the full-page contact section (`components/ContactSection.tsx`) and
 * the in-page dialog (`components/ContactDialog.tsx`) use this helper so
 * their behaviour stays identical regardless of which entry-point the user
 * fills in.
 */

export const CONTACT_ENDPOINT =
  "https://udvt0prn89.execute-api.ap-south-1.amazonaws.com/contact";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Optional human-readable label for which form/page the lead came from. */
  source?: string;
}

export interface ContactResult {
  ok: boolean;
  /** User-facing message — safe to show in a Snackbar / toast. */
  message: string;
}

const DEFAULT_SUCCESS = "Thank you! We’ve received your message.";
const DEFAULT_FAILURE =
  "Sorry, something went wrong while sending your message. Please try again.";
const NETWORK_FAILURE =
  "Network error. Please check your connection and try again.";

/**
 * POSTs the contact form to the AWS endpoint and returns a normalised
 * `{ ok, message }` result that callers can pass straight into a Snackbar.
 *
 * Never throws — all error paths are converted into `ok: false`.
 */
export async function submitContactForm(
  input: ContactInput
): Promise<ContactResult> {
  const payload = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    subject: input.subject ?? "",
    message: input.message,
    source: input.source ?? "hotelpoinisuk.com",
    submittedAt: new Date().toISOString(),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "server",
  };

  let res: Response;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, message: NETWORK_FAILURE };
  }

  // Some Lambda integrations wrap the real response in { statusCode, body }
  // — treat both that and a plain HTTP response uniformly.
  let ok = res.ok;
  let message = DEFAULT_SUCCESS;

  try {
    const data = await res.json().catch(() => null);
    if (data && typeof data === "object") {
      if ("statusCode" in data && typeof data.statusCode === "number") {
        ok = data.statusCode >= 200 && data.statusCode < 300;
        if (data.body) {
          try {
            const inner = JSON.parse(data.body);
            if (inner?.message) message = inner.message;
          } catch {
            // body wasn't JSON — keep the default message
          }
        }
      } else if (data?.message) {
        message = data.message;
      }
    }
  } catch {
    // parse failure → keep defaults
  }

  if (!ok) return { ok: false, message: DEFAULT_FAILURE };
  return { ok: true, message };
}

/**
 * Lightweight client-side validation. Returns an error string if the input
 * is incomplete, otherwise `null`. Mirrors the rules used by both forms.
 */
export function validateContactInput(input: ContactInput): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (!name || !email || !message) {
    return "Please fill in your name, email, and message.";
  }
  // Loose email shape — rely on the browser's `type="email"` validator for
  // strict checks. We just guard against trivially-empty submissions here.
  if (!email.includes("@") || !email.includes(".")) {
    return "Please enter a valid email address.";
  }
  return null;
}
