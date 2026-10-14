// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";
import { fontVariables } from "@/lib/fonts";

export default function Document() {
  // Search-engine verification tokens (set in .env.local to enable)
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
  const facebookVerification = process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION;

  // Apply the four next/font CSS-variable classes to <html>. This is the
  // recommended Next.js static-export pattern: variables on <html> cascade
  // to every element AND every portal (MUI Drawer, Modal, Tooltip), since
  // portals are children of <body> which is a child of <html>.
  return (
    <Html lang="en-IN" className={fontVariables}>
      <Head>
        {/* Charset (must be first 1024 bytes — placed early) */}
        <meta charSet="utf-8" />

        {/* Brand fonts (Cinzel, Cormorant Garamond, Allura, Montserrat) are
            self-hosted via `next/font/google` — see `lib/fonts.ts`. The
            woff2 files are bundled with the static export and served from
            our own origin (S3/CloudFront), eliminating the third-party
            round-trip and the layout shift caused by font-metric mismatch.
            No external preconnect or CSS link is needed. */}

        {/* DNS Prefetch for analytics (only fires if you load these scripts) */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Compatibility */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* `format-detection` enabled in <Seo> per page (telephone+address+email) */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Favicons — logo centred on a white circular matte so dark glyphs remain
            readable on dark browser chrome (see scripts/generate-tab-favicon.js).
            Flat PNG avoids transparency punching through dark tab strips.
            ?v= cache-busts stale favicons after regenerating assets. */}
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png?v=4" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=4" />

        {/* Apple Touch Icon — same white-circle treatment as tab icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4" />

        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* SEO discovery — explicit sitemap link (some aggregators read this
            even when robots.txt is missed). */}
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap.xml"
        />

        {/* Brand colour for mobile chrome / Windows Tile / Safari pinned tab */}
        <meta name="theme-color" content="#5f02ab" />
        <meta name="msapplication-TileColor" content="#5f02ab" />
        <meta name="msapplication-TileImage" content="/apple-touch-icon.png?v=4" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Search-engine verification (env-driven — only renders if set). */}
        {googleVerification && (
          <meta name="google-site-verification" content={googleVerification} />
        )}
        {bingVerification && (
          <meta name="msvalidate.01" content={bingVerification} />
        )}
        {yandexVerification && (
          <meta name="yandex-verification" content={yandexVerification} />
        )}
        {facebookVerification && (
          <meta name="facebook-domain-verification" content={facebookVerification} />
        )}

        {/* Reference to humans.txt (brand/team metadata) */}
        <link
          rel="author"
          type="text/plain"
          href="/humans.txt"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
