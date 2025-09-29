// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en-IN">
      <Head>{/* static, site-wide tags only (e.g., font preconnects) */}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
