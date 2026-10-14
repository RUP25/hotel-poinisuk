/* eslint-disable */
/**
 * One-shot rename: every .JPG / .JPEG / .PNG / .WEBP / .GIF inside `public/`
 * gets its extension lowercased. The basename is left unchanged.
 *
 * Why this exists:
 *   Windows is case-insensitive — `dine5.JPG` and `dine5.jpg` resolve to the
 *   same file locally. S3 + CloudFront are case-sensitive — they're treated
 *   as different objects. Result: pages render fine in dev but throw 403s
 *   in production on any URL with a casing mismatch.
 *
 *   This script normalises every extension to lowercase, eliminating the
 *   class of bug entirely. The filename body is preserved so existing code
 *   like `MIROR.jpg` continues to work; only the extension is touched.
 *
 * Why the two-step rename:
 *   Windows refuses a single fs.renameSync(`X.JPG`, `X.jpg`) with EPERM /
 *   EEXIST because it considers them the same path. Going through a
 *   temporary intermediate filename works around it.
 *
 * Run: node scripts/lowercase-image-extensions.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve("public");
const TARGET_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

let renamed = 0;
let skipped = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const ext = path.extname(entry.name);
    const lowerExt = ext.toLowerCase();
    if (!TARGET_EXT.has(lowerExt)) continue;
    if (ext === lowerExt) {
      skipped++;
      continue;
    }

    const base = path.basename(entry.name, ext);
    const tmp = path.join(dir, `${base}__tmp_rename__${ext}`);
    const dest = path.join(dir, `${base}${lowerExt}`);

    fs.renameSync(full, tmp);
    fs.renameSync(tmp, dest);
    renamed++;
    console.log(`  ${path.relative(process.cwd(), full)}  →  ${path.basename(dest)}`);
  }
}

console.log("Lowercasing image extensions in", ROOT, "...\n");
walk(ROOT);
console.log(`\nDone. Renamed ${renamed} file(s); ${skipped} already lowercase.`);
