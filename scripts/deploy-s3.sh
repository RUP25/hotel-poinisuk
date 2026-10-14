#!/usr/bin/env bash
# =============================================================================
# Hotel Poinisuk — S3 deploy
#
# Uploads the static export in `out/` to S3 with the cache headers Google
# expects from a fast site:
#   - Hashed assets in /_next/static/*  → 1 year, immutable
#   - Hashed font files                 → 1 year, immutable
#   - Site images                       → 1 year, immutable
#   - HTML, sitemap, robots             → no-cache (always revalidate)
#   - PWA manifest, browserconfig       → 1 day cache
#
# Requires: AWS CLI v2 + an IAM identity with s3:PutObject on the bucket.
#
# Usage:
#   chmod +x scripts/deploy-s3.sh
#   BUCKET=hotelpoinisuk.com DISTRIBUTION_ID=E1AB2CD3EF4 ./scripts/deploy-s3.sh
#
# Env vars (override at call time):
#   BUCKET            (required)  S3 bucket name (e.g. hotelpoinisuk.com)
#   AWS_PROFILE       (optional)  named profile for the AWS CLI
#   AWS_REGION        (optional, default ap-south-1)
#   DISTRIBUTION_ID   (optional)  CloudFront distribution to invalidate
# =============================================================================
set -euo pipefail

: "${BUCKET:?Set BUCKET=your-s3-bucket-name before running}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROFILE_FLAG=""
[ -n "${AWS_PROFILE:-}" ] && PROFILE_FLAG="--profile ${AWS_PROFILE}"

if [ ! -d out ]; then
  echo "[deploy] out/ not found — run 'npm run build' first."
  exit 1
fi

S3_URI="s3://${BUCKET}"
echo "[deploy] Region:  ${AWS_REGION}"
echo "[deploy] Bucket:  ${BUCKET}"
echo "[deploy] Source:  out/"
echo

# ── Pass 1: long-cache assets (everything that has a content-hash in the path)
echo "[deploy] Uploading hashed assets (1 year cache)..."
aws s3 sync out/ "${S3_URI}/" \
  ${PROFILE_FLAG} --region "${AWS_REGION}" \
  --delete \
  --exclude "*" \
  --include "_next/static/*" \
  --include "images/*" \
  --include "favicon-*.png" \
  --include "apple-touch-icon.png" \
  --cache-control "public, max-age=31536000, immutable"

# ── Pass 2: short-cache files that change on every deploy
echo "[deploy] Uploading HTML + sitemap + robots (no-cache)..."
aws s3 sync out/ "${S3_URI}/" \
  ${PROFILE_FLAG} --region "${AWS_REGION}" \
  --exclude "*" \
  --include "*.html" \
  --include "sitemap*.xml" \
  --include "robots.txt" \
  --include "humans.txt" \
  --include ".well-known/*" \
  --cache-control "public, max-age=0, must-revalidate"

# ── Pass 3: medium-cache config files
echo "[deploy] Uploading manifest + tile config (1 day cache)..."
aws s3 sync out/ "${S3_URI}/" \
  ${PROFILE_FLAG} --region "${AWS_REGION}" \
  --exclude "*" \
  --include "site.webmanifest" \
  --include "browserconfig.xml" \
  --include "favicon.ico" \
  --cache-control "public, max-age=86400"

# ── Pass 4: catch-all sweep so anything we forgot still uploads + delete stale
echo "[deploy] Final sync sweep + prune..."
aws s3 sync out/ "${S3_URI}/" \
  ${PROFILE_FLAG} --region "${AWS_REGION}" \
  --delete \
  --exclude "_next/static/*" \
  --exclude "images/*" \
  --exclude "favicon-*.png" \
  --exclude "apple-touch-icon.png" \
  --exclude "*.html" \
  --exclude "sitemap*.xml" \
  --exclude "robots.txt" \
  --exclude "humans.txt" \
  --exclude ".well-known/*" \
  --exclude "site.webmanifest" \
  --exclude "browserconfig.xml" \
  --exclude "favicon.ico"

# ── Optional: invalidate CloudFront so the new HTML is served immediately
if [ -n "${DISTRIBUTION_ID:-}" ]; then
  echo "[deploy] Invalidating CloudFront distribution ${DISTRIBUTION_ID}..."
  aws cloudfront create-invalidation \
    ${PROFILE_FLAG} \
    --distribution-id "${DISTRIBUTION_ID}" \
    --paths "/*" >/dev/null
  echo "[deploy] CloudFront invalidation queued."
fi

echo
echo "[deploy] ✓ Done. Site is live at https://${BUCKET}/"
echo
echo "[deploy] If /klong, /dine, etc. show XML AccessDenied on refresh, your CDN"
echo "         must map extensionless URLs to *.html (see scripts/cloudfront-function-append-html.js)."
