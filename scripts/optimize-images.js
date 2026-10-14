/* eslint-disable */
/**
 * Image optimizer for the static-export S3 deploy.
 *
 * Why this exists:
 *   We ship `next.config.ts` with `output: "export"` + `images.unoptimized: true`,
 *   which means Next/Image cannot do its runtime AVIF/WebP conversion. Instead we
 *   pre-process source images to .webp at build time so the browser always
 *   downloads a smaller payload than the source JPEG/PNG.
 *
 * What it does (per input file):
 *   - Reads the source image
 *   - Writes a `.webp` sibling at quality 85, effort 6 (high compression effort)
 *   - Preserves original dimensions (no resize)
 *   - Skips the conversion if the .webp already exists AND is newer than source
 *     (so re-running the script is a no-op for already-optimized assets)
 *   - Prints a summary with per-file before/after sizes and total savings
 *
 * Output convention:
 *   /images/foo.jpeg   ──►  /images/foo.webp     (sibling, original kept as backup)
 *   /images/foo.jpg    ──►  /images/foo.webp
 *   /images/foo.png    ──►  /images/foo.webp     (only if --include-png passed)
 *
 * Usage:
 *   node scripts/optimize-images.js                    # default: home hero rotation
 *   node scripts/optimize-images.js --all              # every JPG/JPEG in /public
 *   node scripts/optimize-images.js path/a.jpg path/b.jpeg   # explicit list
 *   node scripts/optimize-images.js --include-png      # also convert PNGs
 *   node scripts/optimize-images.js --avif             # also emit .avif siblings
 *   node scripts/optimize-images.js --quality=80       # override webp quality
 *   node scripts/optimize-images.js --max-width=2560   # downscale very large sources
 *
 * After conversion: update the source code references from `.jpg/.jpeg` to `.webp`.
 * The originals are NOT deleted so you can still serve them as fallbacks if
 * needed (or simply revert by reverting the source-code reference change).
 */

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// ─────────────────────────────────────────────────────────────────────────────
// Defaults — the home page hero rotation only.
// Edit this list (or pass file paths on the CLI) to expand the scope.
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_TARGETS = [
  "public/images/image2.jpeg",
  "public/images/image5.jpg",
];

const DEFAULT_QUALITY = 85;
const DEFAULT_EFFORT = 6;
const AVIF_QUALITY = 60;

// ─────────────────────────────────────────────────────────────────────────────
// CLI parsing
// ─────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")).map((a) => a.split("=")[0]));
const positional = argv.filter((a) => !a.startsWith("--"));

const optAll = flags.has("--all");
const optIncludePng = flags.has("--include-png");
const optAvif = flags.has("--avif");
const optDryRun = flags.has("--dry-run");

const qualityFlag = argv.find((a) => a.startsWith("--quality="));
const quality = qualityFlag ? parseInt(qualityFlag.split("=")[1], 10) : DEFAULT_QUALITY;

const maxWidthFlag = argv.find((a) => a.startsWith("--max-width="));
const maxWidth = maxWidthFlag ? parseInt(maxWidthFlag.split("=")[1], 10) : null;

// ─────────────────────────────────────────────────────────────────────────────
// Resolve target file list
// ─────────────────────────────────────────────────────────────────────────────
function walk(dir, exts) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, exts));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

let targets;
if (positional.length > 0) {
  targets = positional;
} else if (optAll) {
  const exts = new Set([".jpg", ".jpeg"]);
  if (optIncludePng) exts.add(".png");
  targets = walk(path.resolve("public/images"), exts);
} else {
  targets = DEFAULT_TARGETS;
}

if (targets.length === 0) {
  console.error("No images matched.");
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Run conversions
// ─────────────────────────────────────────────────────────────────────────────
function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function convert(srcAbs) {
  const src = path.resolve(srcAbs);
  if (!fs.existsSync(src)) {
    console.warn(`  skip (not found): ${srcAbs}`);
    return null;
  }
  const ext = path.extname(src).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    console.warn(`  skip (unsupported ext): ${srcAbs}`);
    return null;
  }
  const base = src.slice(0, -ext.length);
  const webpDest = `${base}.webp`;
  const avifDest = `${base}.avif`;

  const srcStat = fs.statSync(src);

  // Build a reusable pipeline so resize is applied identically to every encoder.
  const meta = await sharp(src).metadata();
  const willResize = maxWidth && meta.width && meta.width > maxWidth;
  const dimsBefore = `${meta.width}×${meta.height}`;
  const dimsAfter = willResize
    ? `${maxWidth}×${Math.round((meta.height * maxWidth) / meta.width)}`
    : dimsBefore;

  const makePipeline = () => {
    let p = sharp(src);
    if (willResize) p = p.resize({ width: maxWidth, withoutEnlargement: true });
    return p;
  };

  let wroteWebp = false;
  let webpSize = 0;
  if (fs.existsSync(webpDest) && fs.statSync(webpDest).mtimeMs > srcStat.mtimeMs) {
    webpSize = fs.statSync(webpDest).size;
    console.log(`  ✓ ${path.relative(process.cwd(), webpDest)} (already up to date, ${fmt(webpSize)})`);
  } else if (optDryRun) {
    console.log(`  [dry-run] would write ${path.relative(process.cwd(), webpDest)}`);
  } else {
    await makePipeline()
      .webp({ quality, effort: DEFAULT_EFFORT })
      .toFile(webpDest);
    webpSize = fs.statSync(webpDest).size;
    wroteWebp = true;
  }

  let avifSize = 0;
  if (optAvif) {
    if (fs.existsSync(avifDest) && fs.statSync(avifDest).mtimeMs > srcStat.mtimeMs) {
      avifSize = fs.statSync(avifDest).size;
      console.log(`  ✓ ${path.relative(process.cwd(), avifDest)} (already up to date, ${fmt(avifSize)})`);
    } else if (optDryRun) {
      console.log(`  [dry-run] would write ${path.relative(process.cwd(), avifDest)}`);
    } else {
      await makePipeline()
        .avif({ quality: AVIF_QUALITY, effort: 6 })
        .toFile(avifDest);
      avifSize = fs.statSync(avifDest).size;
    }
  }

  if (wroteWebp || (optAvif && avifSize)) {
    const beforeStr = fmt(srcStat.size);
    const afterStr = fmt(webpSize);
    const pct = ((1 - webpSize / srcStat.size) * 100).toFixed(0);
    const dimsLabel = willResize ? `${dimsBefore} → ${dimsAfter}` : dimsBefore;
    console.log(`  ✓ ${path.relative(process.cwd(), src)}  [${dimsLabel}]  ${beforeStr}  →  ${afterStr}  (-${pct}%)`);
    if (optAvif && avifSize) {
      const pctA = ((1 - avifSize / srcStat.size) * 100).toFixed(0);
      console.log(`           AVIF  →  ${fmt(avifSize)}  (-${pctA}%)`);
    }
  }

  return { src: srcStat.size, webp: webpSize, avif: avifSize };
}

(async () => {
  console.log(`\nOptimizing ${targets.length} image(s) — quality=${quality}${optAvif ? ", +AVIF" : ""}${optDryRun ? ", DRY RUN" : ""}\n`);

  const results = [];
  for (const t of targets) {
    const res = await convert(t);
    if (res) results.push(res);
  }

  const totalSrc = results.reduce((a, r) => a + r.src, 0);
  const totalWebp = results.reduce((a, r) => a + r.webp, 0);
  const totalAvif = results.reduce((a, r) => a + r.avif, 0);

  console.log("\n──────────────────────────────────");
  console.log(`Total source:  ${fmt(totalSrc)}`);
  console.log(`Total WebP:    ${fmt(totalWebp)}  (-${((1 - totalWebp / totalSrc) * 100).toFixed(0)}%)`);
  if (optAvif) {
    console.log(`Total AVIF:    ${fmt(totalAvif)}  (-${((1 - totalAvif / totalSrc) * 100).toFixed(0)}%)`);
  }
  console.log("──────────────────────────────────\n");
  console.log("Next steps:");
  console.log("  1. Update source-code references from .jpg/.jpeg to .webp");
  console.log("  2. Verify pages render correctly (npm run dev)");
  console.log("  3. Commit only the new .webp files OR delete the originals to save repo size\n");
})().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
