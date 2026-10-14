/**
 * Self-hosted brand fonts via next/font/google.
 *
 * Why this exists:
 *   Loading fonts from fonts.googleapis.com costs us:
 *     1. A third-party CSS round-trip (~80-150 ms on cold connections)
 *     2. Layout shift (~0.05 CLS) when the webfont swaps in over the system
 *        fallback because the fallback's metrics differ.
 *     3. A GDPR concern (every visitor's IP is sent to Google).
 *
 * What next/font/google does:
 *   - Downloads the woff2 files at *build time* and bundles them with the
 *     static export, so they ship from our own origin (S3/CloudFront).
 *   - Generates CSS with `size-adjust`, `ascent-override`, and
 *     `descent-override` on the fallback font so the fallback occupies
 *     the same vertical space as the webfont — eliminating CLS at swap.
 *   - Emits a stable CSS variable (`--font-cinzel`, etc.) that every
 *     component consumes via `var(...)`.
 *
 * Works perfectly with `output: "export"` in next.config.ts because
 * everything resolves at build time (no runtime needed).
 */

import { Cinzel, Cormorant_Garamond, Allura, Montserrat } from "next/font/google";

// Display serif — used in headlines, navigation labels, and brand marks.
// Cinzel is uppercase-only by design; we ship 4 weights to cover h1–h6 +
// button labels with a wide tracking range.
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cinzel",
  fallback: ["Trajan Pro", "Georgia", "Times New Roman", "serif"],
});

// Body serif — used for prose, italic emphasis, and editorial content.
// We need both normal + italic at 400/500/600 to match the existing
// typography treatments across pages (especially About, Dine, Klong).
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  fallback: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
});

// Signature script — used sparingly for handwritten brand accents (e.g.
// Klong tagline, About signature). Single weight 400 is plenty.
export const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-allura",
  fallback: ["Great Vibes", "Pinyon Script", "Brush Script MT", "cursive"],
});

// UI sans — used in buttons, microcopy, prices, and the MUI theme baseline.
// Includes 700 for emphasis (e.g. price tags) and 500 for navigation labels.
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

// Concatenated CSS variable classes for the four brand fonts.
// Apply this to a wrapping element in _app.tsx so descendants can resolve
// `var(--font-cinzel)`, `var(--font-cormorant)`, etc.
export const fontVariables = [
  cinzel.variable,
  cormorant.variable,
  allura.variable,
  montserrat.variable,
].join(" ");
