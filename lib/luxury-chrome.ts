/**
 * Shared chrome tokens for the header, hero, and showcase strip.
 *
 * Layout follows the Wellington reference; colour stays on the Hotel Poinisuk
 * brand palette (deep purple + lavender on a near-black plum base).
 */

export const RESERVATION_URL =
  "https://www.swiftbook.io/inst/#/home?propertyId=223NTUo30r6ZPJm6O5Mzg=&JDRN=Y&RoomID=226166,226165,226164,226163,226162&noofrooms=1&adult0=1&child0=0&ap=1&gsId=223NTUo30r6ZPJm6O5Mzg=";

export const PHONE_DISPLAY = "(0364) 7100030";
export const PHONE_HREF = "tel:+913647100030";

/** Brand palette */
export const PURPLE = "#5f02ab";
export const PURPLE_DEEP = "#320953";
export const PURPLE_HOVER = "#76046b";
export const LAVENDER = "#caa6ff";
/** Soft lavender wash for the scrolled header glass bar */
export const LAVENDER_GLASS = "rgba(202, 166, 255, 0.38)";
export const LAVENDER_GLASS_BORDER = "rgba(95, 2, 171, 0.18)";
/** Near-black plum used as the base for dark surfaces (matches the footer) */
export const INK = "#0c0815";

export const SERIF_DISPLAY =
  "var(--font-cormorant), 'Playfair Display', 'Georgia', serif";
export const SANS_UI =
  "var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif";

/**
 * Header logo — trimmed wordmark from scripts/generate-header-wordmark.js.
 * Colour lockup for light chrome (scrolled lavender bar). Reverse lockup for
 * dark chrome (hero overlay, splash, admin). Sizing is width-led because the
 * file is edge-to-edge ink with no padding.
 */
export const HEADER_LOGO_SRC = "/images/logo-wordmark.png";
export const HEADER_LOGO_ON_DARK_SRC = "/images/logo-wordmark-on-dark.png";
export const HEADER_LOGO_W = 991;
export const HEADER_LOGO_H = 450;
export const HEADER_LOGO_SIZES =
  "(max-width:600px) 112px, (max-width:900px) 128px, (max-width:1200px) 144px, 156px";

/**
 * Homepage H1 — the Poinisuk letters cropped from the wordmark so the hero
 * uses the real lockup (black/white + purple K), not a stand-in serif.
 */
export const HERO_POINISUK_SRC = "/images/logo-poinisuk.png";
export const HERO_POINISUK_ON_DARK_SRC = "/images/logo-poinisuk-on-dark.png?v=7";
export const HERO_POINISUK_W = 991;
export const HERO_POINISUK_H = 245;
export const HERO_POINISUK_SIZES =
  "(max-width:600px) 300px, (max-width:900px) 400px, (max-width:1200px) 500px, 560px";

export const headerLogoWrapperSx = {
  display: "block",
  width: { xs: 112, sm: 128, md: 144, lg: 156 },
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
    userSelect: "none",
  },
} as const;

/**
 * The scrolled header is a compact bar, so it carries its own smaller lockup
 * rather than reusing the hero-sized one above.
 */
export const STICKY_LOGO_SIZES =
  "(max-width:600px) 100px, (max-width:900px) 112px, (max-width:1200px) 124px, 136px";

export const stickyLogoWrapperSx = {
  display: "block",
  width: { xs: 100, sm: 112, md: 124, lg: 136 },
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
    userSelect: "none",
  },
} as const;