// components/Seo.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import {
  SITE_NAME,
  SITE_URL,
  routeToTitle,
  buildCanonical,
  makeBreadcrumbLd,
  HOTEL_LD,
} from "@/lib/seo";

type SeoProps = {
  pageName?: string;     // If omitted, inferred from route
  description?: string;  // Meta description
  ogImage?: string;      // Absolute URL or site-relative path (/images/og/xxx.jpg)
  noindex?: boolean;
};

export default function Seo({ pageName, description, ogImage, noindex }: SeoProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  const computedPageName = pageName || routeToTitle(router.pathname);
  const fullTitle = `${SITE_NAME} | ${computedPageName}`;
  const canonical = buildCanonical(router.asPath);
  const desc =
    description ||
    (isHome
      ? "Boutique hotel in Shillong with rooftop dining, lounge, banquet hall, and easy access to attractions. Book direct for the best rates."
      : `${computedPageName} at ${SITE_NAME} — Shillong`);

  const og =
    ogImage?.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage || "/images/og/home-hero.jpg"}`;

  const robots = noindex
    ? "noindex,nofollow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  const breadcrumbLd = makeBreadcrumbLd(router.asPath);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Twitter */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={og} />
      <meta name="theme-color" content="#101418" />

      {/* JSON-LD */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {isHome && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOTEL_LD) }} />
      )}
    </Head>
  );
}
