/* eslint-disable no-unused-vars */
/**
 * CloudFront Functions — viewer-request handler
 *
 * Why: `next build` with `output: "export"` writes pages as `klong.html`,
 * `dine.html`, `rooms/deluxe-ac.html`, etc. Browsers still navigate to
 * `/klong`, `/dine`, `/rooms/deluxe-ac`. S3 returns an XML error body with
 * <Code>AccessDenied</Code> when that exact key (no “.html”) does not exist.
 *
 * Attach via AWS Console, **or** from repo root:
 *   npm run cloudfront:html-rewrite -- --distribution-id E1234567890ABC
 *
 * Scripted deploy: scripts / cloudfront-html-rewrite / attach.cjs
 *
 * Skips paths that already look like files (contain “.”) and `/_next/*`.
 */

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.indexOf(".") !== -1) {
    return request;
  }
  if (uri.indexOf("/_next/") === 0) {
    return request;
  }

  if (uri.length > 1 && uri.charAt(uri.length - 1) === "/") {
    uri = uri.slice(0, -1);
  }

  if (uri === "" || uri === "/") {
    request.uri = "/index.html";
  } else {
    request.uri = uri + ".html";
  }
  return request;
}
