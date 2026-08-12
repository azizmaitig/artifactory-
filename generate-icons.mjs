// generate-icons.mjs — PWA icon generation per pwa-gallery research/02.
// Usage: node generate-icons.mjs <name> <accentHex> <outDir>
// Outputs (sharp 0.35.x, prebuilt win32-x64):
//   icon-512.png            purpose "any"   512x512
//   icon-192.png            purpose "any"   192x192
//   icon-512-maskable.png   purpose "maskable" (glyph inside 80% safe circle, radius 40%)
//   apple-touch-icon.png    180x180 opaque (iOS renders transparency as black)
// Design: full-bleed accent background + centered white initial of the artifact name.

import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const name = process.argv[2];
const accent = process.argv[3];
const outDir = resolve(process.argv[4] ?? ".");

if (!name || !accent) {
  console.error("usage: node generate-icons.mjs <name> <accentHex> <outDir>");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const initial = (name.trim()[0] ?? "A").toUpperCase();
const glyphColor = "#FFFFFF";

// Glyph geometry: normal icons fill ~50% of the canvas; maskable shrinks to 40%
// (radius 40% of width => glyph half-width 40% => centered inside the safe circle).
function svg(glyphSize) {
  const cx = 256;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${accent}"/>
  <text x="${cx}" y="${cx}" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        font-size="${glyphSize}" font-weight="700" fill="${glyphColor}"
        text-anchor="middle" dominant-baseline="central">${initial}</text>
</svg>`;
}

const anySvg = svg(240);       // initial ~47% width
const maskableSvg = svg(204);  // 40% => inside the 80% safe circle (radius 40%)

const jobs = [
  ["icon-512.png", anySvg, 512],
  ["icon-192.png", anySvg, 192],
  ["icon-512-maskable.png", maskableSvg, 512],
  ["apple-touch-icon.png", anySvg, 180],
];

for (const [file, source, size] of jobs) {
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(join(outDir, file));
  console.log(`[generate-icons] ${file} (${size}x${size})`);
}
console.log(`[generate-icons] done -> ${outDir}`);