// lib/event-display.ts
// Shared formatting for event cards (karaoke page + any future surfaces).

/**
 * Format a `YYYY-MM-DD` date into a friendly card title.
 * "2026-05-09" → weekday + day + month parts.
 */
export function formatEventDate(
  iso: string
): { weekday: string; day: string; month: string } {
  try {
    const d = new Date(`${iso}T00:00:00`);
    const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    return { weekday, day, month };
  } catch {
    return { weekday: "", day: "--", month: "" };
  }
}

/**
 * Format a `HH:mm` time as `8:00 PM`. Falls back to the raw string if it
 * doesn't parse.
 */
export function formatTime(hhmm?: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
}
