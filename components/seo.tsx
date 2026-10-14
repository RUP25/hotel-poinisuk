// components/Seo.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOCALE,
  SITE_KEYWORDS,
  CONTACT_INFO,
  TWITTER_HANDLE,
  routeToTitle,
  buildCanonical,
  getOgType,
  makeBreadcrumbLd,
  HOTEL_LD,
  LOCAL_BUSINESS_LD,
  ORGANIZATION_LD,
  WEBSITE_LD,
  RESTAURANT_LD,
  BAR_LD,
  BANQUET_VENUE_LD,
} from "@/lib/seo";

type SeoProps = {
  pageName?: string; // If omitted, inferred from route
  description?: string; // Meta description
  ogImage?: string; // Absolute URL or site-relative path (/images/og/xxx.jpg)
  keywords?: string; // Additional keywords (merged with site keywords)
  noindex?: boolean;
  schema?: object | object[]; // Additional schema markup
};

export default function Seo({
  pageName,
  description,
  ogImage,
  keywords,
  noindex,
  schema,
}: SeoProps) {
  const router = useRouter();
  const pathname = router.pathname ?? "";
  const asPath = router.asPath ?? (pathname || "/");
  const isHome = pathname === "/";
  const isDine = pathname === "/dine";
  const isKlong = pathname === "/klong";
  const isBanquet = pathname === "/banquet";

  const computedPageName = pageName || routeToTitle(pathname);
  const fullTitle = pageName
    ? pageName.includes("|")
      ? pageName
      : `${SITE_NAME} | ${pageName}`
    : isHome
    ? `Hotel in Shillong | ${SITE_NAME}`
    : `${SITE_NAME} | ${computedPageName}`;

  const canonical = buildCanonical(asPath);
  const desc =
    description ||
    (isHome
      ? "Hotel Poinisuk — Boutique hotel in Shillong with rooftop dining, Klong Lounge, banquet hall, and easy access to Ward's Lake & Lady Hydari Park. Book direct for the best rates."
      : `${computedPageName} at ${SITE_NAME} — Shillong, Meghalaya`);

  const og = ogImage?.startsWith("http")
    ? ogImage
    : `${SITE_URL}${ogImage || "/images/og/home-hero.jpg"}`;

  const getImageType = (url: string): string => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "webp") return "image/webp";
    if (ext === "gif") return "image/gif";
    return "image/jpeg";
  };

  const ogImageType = getImageType(og);
  const ogType = getOgType(pathname);

  const robots = noindex
    ? "noindex,nofollow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  const allKeywords = keywords ? `${SITE_KEYWORDS}, ${keywords}` : SITE_KEYWORDS;

  // Build the JSON-LD graph.
  // Order matters for readability but Google reads them all regardless.
  const breadcrumbLd = makeBreadcrumbLd(asPath);
  const schemas: object[] = [];

  // Site-wide entities — emit on every page so Google can resolve the
  // organization / website regardless of entry point.
  schemas.push(ORGANIZATION_LD, WEBSITE_LD);

  // Hotel knowledge-panel entities — only on the home page so Google has a
  // single canonical home for the Hotel entity.
  if (isHome) {
    schemas.push(HOTEL_LD, LOCAL_BUSINESS_LD);
  }

  if (isDine) schemas.push(RESTAURANT_LD);
  if (isKlong) schemas.push(BAR_LD);
  if (isBanquet) schemas.push(BANQUET_VENUE_LD);

  // Breadcrumb on every non-home route — never on home (prevents single-item
  // breadcrumbs which Google warns about).
  if (!isHome) schemas.push(breadcrumbLd);

  // Page-specific schemas passed in via the `seo.schema` prop.
  if (schema) {
    if (Array.isArray(schema)) schemas.push(...schema);
    else schemas.push(schema);
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={desc} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}`} />
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="IN-ML" />
      <meta name="geo.placename" content="Shillong" />
      <meta
        name="geo.position"
        content={`${CONTACT_INFO.geo.latitude};${CONTACT_INFO.geo.longitude}`}
      />
      <meta
        name="ICBM"
        content={`${CONTACT_INFO.geo.latitude}, ${CONTACT_INFO.geo.longitude}`}
      />

      {/* Canonical & Robots */}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={og} />
      <meta property="og:image:secure_url" content={og} />
      <meta property="og:image:type" content={ogImageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${computedPageName}`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta
        property="place:location:latitude"
        content={CONTACT_INFO.geo.latitude}
      />
      <meta
        property="place:location:longitude"
        content={CONTACT_INFO.geo.longitude}
      />

      {/* Additional image meta for legacy crawlers */}
      <link rel="image_src" href={og} />
      <meta name="image" content={og} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={og} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${computedPageName}`} />
      {TWITTER_HANDLE && (
        <>
          <meta name="twitter:site" content={`@${TWITTER_HANDLE}`} />
          <meta name="twitter:creator" content={`@${TWITTER_HANDLE}`} />
        </>
      )}

      {/* Mobile / PWA */}
      <meta name="theme-color" content="#5f02ab" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=yes,address=yes,email=yes" />

      {/* JSON-LD Structured Data */}
      {schemas.map((schemaObj, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
        />
      ))}
    </Head>
  );
}
