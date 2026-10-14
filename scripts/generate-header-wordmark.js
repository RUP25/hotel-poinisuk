/* eslint-disable */
/**
 * Builds header wordmarks by trimming transparent padding off the master logo.
 *
 * `logo1.png` is the canonical colour lockup (transparent background) used for
 * schema.org URLs in lib/seo.ts and the favicon generator. The header sizes
 * against a tightly trimmed copy so empty padding never shrinks the mark.
 *
 * Also writes a reverse (dark-ink → white) wordmark for dark chrome, and a
 * crop of just the Poinisuk letters for the homepage H1.
 *
 * Run: node scripts/generate-header-wordmark.js
 * Input:  public/images/logo1.png
 * Output: public/images/logo-wordmark.png
 *         public/images/logo-wordmark-on-dark.png
 *         public/images/logo-poinisuk.png
 *         public/images/logo-poinisuk-on-dark.png
 */

const sharp = require("sharp");
const path = require("path");

const SRC = path.join("public", "images", "logo1.png");
const OUT = path.join("public", "images", "logo-wordmark.png");
const OUT_DARK = path.join("public", "images", "logo-wordmark-on-dark.png");
const OUT_POINISUK = path.join("public", "images", "logo-poinisuk.png");
const OUT_POINISUK_DARK = path.join("public", "images", "logo-poinisuk-on-dark.png");

function lumaOf(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chromaOf(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isPurpleHue(r, g, b) {
  const chroma = chromaOf(r, g, b);
  return chroma >= 28 && b >= r - 16 && r > g + 4;
}

function isCorePurple(r, g, b, a) {
  return a >= 80 && isPurpleHue(r, g, b) && lumaOf(r, g, b) <= 78;
}

/**
 * suK still composites with a light rim because edge pixels are a lighter
 * purple (gray backdrop mixed into the ink). Snap every purple-adjacent
 * pixel to the dark core ink and leave alpha alone so antialiasing stays.
 * Opaque black/white letter bodies (Poini, HOTEL) are not touched.
 */
async function remattePurple(srcPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const src = data;
  const out = Buffer.from(data);
  const idx = (x, y) => (y * w + x) * 4;

  let sr = 0;
  let sg = 0;
  let sb = 0;
  let n = 0;
  for (let i = 0; i < src.length; i += 4) {
    if (!isCorePurple(src[i], src[i + 1], src[i + 2], src[i + 3])) continue;
    if (src[i + 3] < 200) continue;
    sr += src[i];
    sg += src[i + 1];
    sb += src[i + 2];
    n += 1;
  }
  if (!n) return;
  const coreR = Math.round(sr / n);
  const coreG = Math.round(sg / n);
  const coreB = Math.round(sb / n);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      const a = src[i + 3];
      if (a < 1) continue;

      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const luma = lumaOf(r, g, b);
      const chroma = chromaOf(r, g, b);
      const palePurpleRim = isPurpleHue(r, g, b) && luma > 70;
      const opaqueLetter =
        a >= 250 && chroma < 18 && (luma >= 220 || luma <= 80);
      if (opaqueLetter && !palePurpleRim) continue;

      let nearCore = isCorePurple(r, g, b, a) || palePurpleRim;
      if (!nearCore) {
        for (let dy = -4; dy <= 4 && !nearCore; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            const j = idx(xx, yy);
            if (isCorePurple(src[j], src[j + 1], src[j + 2], src[j + 3])) {
              nearCore = true;
              break;
            }
          }
        }
      }
      if (!nearCore) continue;

      out[i] = coreR;
      out[i + 1] = coreG;
      out[i + 2] = coreB;
    }
  }

  await sharp(out, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(srcPath);
}

async function writeReverse(srcPath, destPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const a = px[i + 3];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (chroma >= 28 || a <= 8) continue;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const lift = Math.max(0, Math.min(1, (168 - luma) / 168));
    px[i] = Math.round(r * (1 - lift) + 255 * lift);
    px[i + 1] = Math.round(g * (1 - lift) + 255 * lift);
    px[i + 2] = Math.round(b * (1 - lift) + 255 * lift);
  }

  await sharp(px, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(destPath);
}

/** Isolate the Poinisuk letters (skip HOTEL above and the brush below). */
async function cropPoinisuk(srcPath, destPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  let top = h;
  let bottom = 0;
  for (let y = 0; y < h; y++) {
    let purple = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 24) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma >= 28) purple += 1;
    }
    if (purple >= 8) {
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  if (bottom <= top) {
    throw new Error(`Could not find Poinisuk crop in ${srcPath}`);
  }

  const pad = 4;
  const extractTop = Math.max(0, top - pad);
  const extractHeight = Math.min(h - extractTop, bottom - extractTop + 1 + pad);

  await sharp(srcPath)
    .extract({ left: 0, top: extractTop, width: w, height: extractHeight })
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9 })
    .toFile(destPath);
}

async function main() {
  const before = await sharp(SRC).metadata();

  await sharp(SRC)
    // threshold keeps faint antialiased edges from defeating the trim
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  await remattePurple(OUT);
  await writeReverse(OUT, OUT_DARK);
  await remattePurple(OUT_DARK);
  await cropPoinisuk(OUT, OUT_POINISUK);
  await cropPoinisuk(OUT_DARK, OUT_POINISUK_DARK);

  const after = await sharp(OUT).metadata();
  const poinisuk = await sharp(OUT_POINISUK).metadata();

  console.log(`in  ${SRC}  ${before.width}x${before.height}`);
  console.log(`out ${OUT}  ${after.width}x${after.height}`);
  console.log(`out ${OUT_DARK}  ${after.width}x${after.height}`);
  console.log(`out ${OUT_POINISUK}  ${poinisuk.width}x${poinisuk.height}`);
  console.log(`out ${OUT_POINISUK_DARK}  ${poinisuk.width}x${poinisuk.height}`);
  console.log(
    `aspect ratio ${(after.width / after.height).toFixed(4)} — use these dimensions for next/image width/height`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
