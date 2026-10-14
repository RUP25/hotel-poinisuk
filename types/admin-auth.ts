// types/admin-auth.ts
// =============================================================================
// Hotel Poinisuk — Admin auth types
// Tiny shape contract between the AWS Lambda login endpoint and the client.
// =============================================================================

export interface AdminLoginInput {
  /** Plain-text password — only ever sent over HTTPS to the login Lambda. */
  password: string;
}

export interface AdminLoginResult {
  ok: boolean;
  /** JWT issued by the Lambda; valid for 24 hours. */
  token?: string;
  /** Display message — safe for Snackbar / Alert. */
  message: string;
  /** Unix epoch (seconds) when the token expires. */
  expiresAt?: number;
}

/**
 * Shape we cache in localStorage so the dashboard can render immediately on
 * page load without a network round-trip just to know whether we're logged
 * in. The token is treated as the source of truth — `expiresAt` is checked
 * locally to avoid hitting an expired-token request path.
 */
export interface AdminSession {
  token: string;
  expiresAt: number;
}
