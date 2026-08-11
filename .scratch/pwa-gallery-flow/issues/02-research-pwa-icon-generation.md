# 02 — Research: programmatic PWA icon generation

Type: research
Status: resolved
Blocked by:

## Question

Best way to programmatically generate PWA icons per artifact from a name + accent color (no manual design), fitting a Windows PowerShell build with node v22. Sizes: 192, 512 (manifest) + 180 (apple-touch-icon); maskable vs any.

## Answer

Research completed (AFK subagent, 2026-08-11). Full detail: [research/02-pwa-icon-generation.md](research/02-pwa-icon-generation.md).

- **Recommendation**: one 512×512 SVG (full-bleed accent-color background + centered white initial from the artifact name) rasterized with **sharp 0.35.3** (prebuilt win32-x64 binaries, no node-gyp) via a ~13-line `generate-icons.mjs`; PowerShell calls `node generate-icons.mjs <name> <accent> <outDir>`.
- **Output kinds**: `icon-192.png` + `icon-512.png` (purpose `any`), `icon-512-maskable.png` (glyph shrunk inside the 80% safe circle — radius 40% of width, outer 10% croppable per web.dev/W3C), `apple-touch-icon.png` 180 (opaque, no pre-rounded corners; iOS renders transparency as black).
- **Fallbacks**: `@resvg/resvg-js` 2.6.2 as a drop-in rasterizer swap (same SVG, deterministic system-font resolution via fontdb) if librsvg text misrenders; zero-install .NET `System.Drawing` PowerShell snippet for the no-network case.
- Version data verified from npm registry at research time (sharp 0.35.3, resvg-js 2.6.2, pngjs 7.0.0, @napi-rs/canvas 1.0.5).

## Comments

- 2026-08-11: charted in wayfinder. Resolved by research subagent; deliverable extracted from vault branch (research/pwa-icon-generation) into this flow's research/02.