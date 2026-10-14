// scripts/cutout-klong-sign.js
// One-shot: convert white background of klong-sign.png to transparent
// using a luminance-based alpha mask so the pencil drawing stays crisp.

const sharp = require("sharp");
const path = require("path");

const IN = path.join(__dirname, "..", "public", "images", "bar", "klong-sign.png");
const OUT = path.join(__dirname, "..", "public", "images", "bar", "klong-sign-cutout.png");

(async () => {
  const { data, info } = await sharp(IN).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const HI = 238; // luminance >= HI → fully transparent (white paper)
  const LO = 70;  // luminance <= LO → fully opaque (dark pencil)
  const range = HI - LO;

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let alpha;
    if (lum >= HI) alpha = 0;
    else if (lum <= LO) alpha = 255;
    else alpha = Math.round(255 * (HI - lum) / range);
    out[i + 3] = alpha;
  }

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log(`Wrote ${OUT}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
