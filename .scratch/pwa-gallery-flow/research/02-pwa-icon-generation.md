# Programmatic PWA icon generation

> Wayfinder ticket #3 (research) ┬À feeds #4 (envelope architecture) and #8 (pipeline integration).
> Question: how does a PowerShell single-HTML build (node v22 available) generate PWA icons ÔÇö 192, 512, apple-touch-icon 180 ÔÇö per artifact from a **name + accent color**, with no design tools?

## Recommendation (TL;DR)

**SVG template + rasterize with `sharp` (0.35.x).** One 512├ù512 SVG string built at build time from `{artifactName, accentColor}`, rasterized by a single `node` script to all sizes. `sharp` ships prebuilt win32-x64 binaries ÔÇö no node-gyp, no C++ toolchain, no system libs ÔÇö and is the de-facto standard for exactly this job. A PowerShell build script calls `node generate-icons.mjs <name> <accent> <outDir>`; the icons are generated in well under a second per artifact.

- **Exact packages (verified against the npm registry today):** `sharp` **0.35.3**. Fallbacks: `@resvg/resvg-js` **2.6.2** (same SVG, deterministic text engine, zero system deps), `pngjs` **7.0.0** + pure-JS draw (rarely needed), and **.NET `System.Drawing` from PowerShell** (zero-install offline fallback ÔÇö no npm at all).
- **Design is a branded placeholder**: full-bleed accent background + white initial(s) + artifact name. This satisfies both `any` and `maskable` in one template (see spec notes below).
- **One source SVG scales to all sizes.** Rasterize 512├ù512 once; emit 512, 192, and 180 from it. Text stays crisp because rasterization happens *at* each target size, not by up/downscaling pixels.
- **Avoid:** `node-canvas`/`@napi-rs/canvas` (needs a font-stack decision per OS; heavier), ImageMagick/Inkscape CLI (system deps that may not be installed), pure-JS pixel drawing for text (janky at 512).

## Comparison table

| Option | Deps / install | Windows-friendly | Text rendering | Fit |
|---|---|---|---|---|
| **`sharp` 0.35.x** (SVGÔåÆPNG via bundled librsvg) | 1 npm pkg, prebuilt win32-x64 binaries | Ô£à no build tools | SVG `<text>`, fonts resolved via bundled fontconfig (Arial etc. on Windows) | **Ô£à primary** |
| `@resvg/resvg-js` 2.6.x (Rust resvg) | 1 npm pkg, prebuilt `.node` binary | Ô£à no system deps | fontdb auto-scans system fonts; the most deterministic SVG-text engine | Ô£à fallback #1 (drop-in swap) |
| `@napi-rs/canvas` 1.x | 1 npm pkg, prebuilt N-API | Ô£à | Canvas 2D `fillText` (Skia) | ­ƒƒí overkill ÔÇö you'd draw instead of declare SVG |
| `jimp` 1.6.x (pure JS) | 1 npm pkg | Ô£à | bitmap drawing, no vector text | ­ƒƒí low quality text |
| `pngjs` 7.0.0 (pure JS) | 1 npm pkg | Ô£à | hand-drawn pixels only | ÔØî text impossible |
| ImageMagick / Inkscape CLI | system install | ­ƒƒí maybe absent | good, but external dep | ÔØî not dependency-light |
| PowerShell `.NET System.Drawing` | **zero install** (ships with Windows PS 5.1) | Ô£à | `Graphics.DrawString` | ­ƒƒí offline fallback only |
| Fixed static icon (no generation) | none | Ô£à | ÔÇö | ÔØî per-artifact branding required |

## Recipe

### 1. One-time setup (per machine, not per artifact)

```powershell
# in a tools/ dir next to the build script
npm init -y
npm i sharp            # ^0.35 (prebuilt win32-x64, ~20 MB)
```

### 2. `tools/generate-icons.mjs` (the whole generator)

```js
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [name, accent, outDir = 'dist'] = process.argv.slice(2);
const initial = [...name.trim()][0].toUpperCase() ?? '?';

// maskable=true shrinks the glyph so it stays inside the 80% safe circle
const svg = (maskable) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${accent}"/>
  <text x="256" y="330" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="${maskable ? 240 : 300}"
        font-weight="700" fill="#ffffff">${initial}</text>
</svg>`;

mkdirSync(outDir, { recursive: true });
for (const [file, size, maskable] of [
  ['icon-192.png',            192,  false],
  ['icon-512.png',            512,  false],
  ['icon-512-maskable.png',   512,  true],
  ['apple-touch-icon.png',    180,  false],
]) {
  await sharp(Buffer.from(svg(maskable))).resize(size, size).png().toFile(`${outDir}/${file}`);
}
```

~13 lines. `sharp` renders the SVG at each target size, so text scales cleanly. The accent background is opaque, which is exactly what both Apple and maskable want.

### 3. PowerShell build script wiring

```powershell
# after the single-HTML artifact is assembled
node tools/generate-icons.mjs "$artifactName" "$accentColor" "$outDir/icons"
```

### 4. Reference into the artifact's HTML + manifest

```html
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
```

```json
{ "icons": [
  { "src": "icons/icon-192.png",          "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "icons/icon-512.png",          "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
] }
```

## Spec notes (why the template looks like that)

- **Maskable safe zone**: critical content must fit inside a centered circle of radius **40% of the icon width**; the outer ~10% edge may be cropped by platform masks. Solid full-bleed background + centered initial satisfies this automatically ÔÇö the mask just trims the (already uniform) corners. Give the `maskable` variant a *smaller* glyph than `any` so the letter never drifts out of the safe circle.
- **`any` vs `maskable`**: don't reuse the same file for both. `maskable` icons add padding that looks wrong when used as `any`; ship one of each. Opaque backgrounds work fine for `any` too (no transparency is required for `any`).
- **Apple touch icon**: exactly **180├ù180 PNG, opaque** (iOS renders transparency as black ÔÇö ugly corners), **no pre-rounded corners** (iOS applies its own mask), and keep the glyph out of the outer 10%. Same accent-background design works unchanged.
- **Required sizes**: manifest needs ÔëÑ192 (Chrome install) and 512 (Play Store); iOS needs the 180 touch icon. One 512 SVG source covers all three.

## Fallbacks

1. **SVG text renders as boxes / missing glyphs through sharp's librsvg** ÔåÆ swap the rasterizer, keep the identical SVG string:
   ```js
   import { Resvg } from '@resvg/resvg-js';
   for (const [file, size, maskable] of [...]) {
     const png = new Resvg(Buffer.from(svg(maskable)), { fitTo: { mode: 'width', value: size } }).render().asPng();
     writeFileSync(`${outDir}/${file}`, png);
   }
   ```
   resvg's fontdb finds Windows system fonts directly ÔÇö no fontconfig layer. `npm i @resvg/resvg-js` (^2.6).
2. **No network / npm install impossible** ÔåÆ generate in PowerShell itself with built-in .NET (zero npm, zero node):
   ```powershell
   Add-Type -AssemblyName System.Drawing
   $b = New-Object System.Drawing.Bitmap 512,512
   $g = [System.Drawing.Graphics]::FromImage($b)
   $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#7C3AED'))
   $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
   $g.DrawString('A', (New-Object System.Drawing.Font('Arial',280,[System.Drawing.FontStyle]::Bold)),
     [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF 0,0,512,512),
     (New-Object System.Drawing.StringFormat))
   $b.Save('icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
   ```
   Repeat per size. Ship a `512` (and downsample via `$b.GetThumbnailImage`) if you want the other two without extra DrawString calls. Windows-only ÔÇö acceptable here because the whole pipeline is PowerShell-on-Windows.

## Sources

- `sharp` prebuilt Windows binaries & SVG support: https://sharp.pixelplumbing.com/install ┬À https://sharp.pixelplumbing.com/api-input (npm registry: 0.35.3)
- `@resvg/resvg-js`: https://github.com/yisibl/resvg-js (npm registry: 2.6.2)
- Maskable safe-zone spec (radius 40% of width, outer 10% croppable, `any` vs `maskable`): https://web.dev/articles/maskable-icon ┬À https://www.w3.org/TR/appmanifest/#icon-masks
- Apple touch icon (180├ù180, opaque, no pre-rounded corners, glyph safe margin): https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications.html (via https://faviconry.dev/guide/apple-touch-icon)
- npm registry (verified 2026-08-11): `sharp` 0.35.3 ┬À `@resvg/resvg-js` 2.6.2 ┬À `@napi-rs/canvas` 1.0.5 ┬À `pngjs` 7.0.0 ┬À `jimp` 1.6.1
