/* eslint-disable */
/**
 * Builds browser-tab favicons: Hotel Poinisuk logo centred on a white circle.
 * Keeps dark / transparent logos visible on dark-themed browser chrome.
 *
 * Run: node scripts/generate-tab-favicon.js
 * Inputs: public/images/logo1.png
 * Outputs:
 *   public/favicon-16.png, public/favicon-32.png, public/favicon-48.png
 *   public/apple-touch-icon.png (180×180)
 *   public/favicon.ico (multi-size 16 / 32 / 48)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");

const SRC = path.join("public", "images", "logo1.png");

async function buildSize(size) {
  const svgCircle = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 0.25}" fill="#ffffff"/>
</svg>`;

  const pad = Math.max(2, Math.round(size * 0.13));
  const inner = size - pad * 2;

  const logoBuf = await sharp(SRC)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const lm = await sharp(logoBuf).metadata();
  const top = Math.max(0, Math.floor((size - (lm.height || inner)) / 2));
  const left = Math.max(0, Math.floor((size - (lm.width || inner)) / 2));

  return sharp(Buffer.from(svgCircle))
    .composite([{ input: logoBuf, top, left }])
    // Outside the SVG circle, pixels are transparent; dark browser tabs show
    // through and the mark looks “invisible”. Flatten onto solid white so
    // every pixel is opaque (#fff outside the matte reads as a white disc).
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();
}

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error("Missing", SRC);
    process.exit(1);
  }

  const tabSizes = [16, 32, 48];
  /** @type {Record<number, Buffer>} */
  const pngBySize = {};

  for (const s of tabSizes) {
    const out = await buildSize(s);
    pngBySize[s] = out;
    const dest = path.join("public", `favicon-${s}.png`);
    fs.writeFileSync(dest, out);
    console.log("Wrote", dest, `(${s}×${s})`);
  }

  const apple = await buildSize(180);
  fs.writeFileSync(path.join("public", "apple-touch-icon.png"), apple);
  console.log("Wrote public/apple-touch-icon.png (180×180)");

  const icoBuf = await toIco([pngBySize[16], pngBySize[32], pngBySize[48]]);
  fs.writeFileSync(path.join("public", "favicon.ico"), icoBuf);
  console.log("Wrote public/favicon.ico (16 + 32 + 48)");

  console.log("\nDone. pages/_document.tsx should reference favicon-*.png + favicon.ico + apple-touch-icon.png.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
