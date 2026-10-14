/* eslint-disable */
// One-off script: converts dopwai-leaf.png into a pure ink overlay, so the
// drawing blends seamlessly into any background.
//
// For every source pixel:
//   - color  → pure black (the ink)
//   - alpha  → 255 − brightness   (the ink density)
//
// White pixels become fully transparent; black pixels stay fully opaque
// black; mid-grays become semi-transparent black. The result composites
// correctly onto the cream card OR any other background, and `drop-shadow`
// applied in CSS will follow the leaf silhouette instead of a rectangle.
//
// Usage: node scripts/process-dopwai-leaf.js
// Safe to delete once run.

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const inputPath = path.join(__dirname, "..", "public", "images", "dine", "dopwai-leaf.png");
const backupPath = path.join(__dirname, "..", "public", "images", "dine", "dopwai-leaf-original.png");
const outputPath = inputPath;

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("Input not found:", inputPath);
    process.exit(1);
  }

  // Back up the original on first run only so every re-run reads the
  // pristine source — the script is idempotent.
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log("Backed up original →", backupPath);
  }

  const sourcePath = backupPath;

  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;

    data[i]     = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = Math.max(0, Math.min(255, Math.round(255 - brightness)));
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(outputPath);

  const inSize = fs.statSync(backupPath).size;
  const outSize = fs.statSync(outputPath).size;
  console.log(`Processed ${width}×${height}, ${inSize}B → ${outSize}B`);
  console.log("Pure-ink overlay (alpha = ink density, color = black).");
  console.log("Wrote:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
