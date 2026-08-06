# 06 - Package the build pipeline

Type: task
Status: resolved
Blocked by:

## Question

Turn the working esbuild + Tailwind CLI → single self-contained HTML pipeline (used to build festival-noise-sim.html) into a reusable vault script (build-artifact.mjs + build-artifact.ps1 wrapper): inputs = entry.jsx + deps, outputs = one verified HTML. Include the NODE_ENV define fix (build.mjs, not CLI quoting) and the lessons from the Babel detour (automatic-runtime imports; use esbuild, not in-browser Babel).

## Answer

Resolved by Sisyphus (AFK, 2026-08-06). Delivered: `build-artifact.mjs` + `build-artifact.ps1` at repo root.

**Pipeline:** entry.jsx → esbuild bundle (minify, NODE_ENV define) + Tailwind v4 CLI (input.css `@source` entry) → both inlined into one self-contained HTML shell → structural verification (size ≥ 1KB, `#root` div, inline `<script>`/`<style>`), temp-dir intermediate, cleanup in `finally`.

**NODE_ENV define fix (from the festival session):** define lives in the build script (`define: { 'process.env.NODE_ENV': '"production"' }`), never CLI quoting — PowerShell mangling was the original failure mode.

**Babel detour lesson:** abandoned in-browser Babel (`build-viewer.ps1`, `text/babel`, UMD globals, CDN tailwind) in favor of esbuild compiling JSX at build time; React 19 automatic runtime handled natively by esbuild — no runtime import shims needed.

**Windows portability fixes (found during testing):**
1. esbuild/tailwindcss resolve from the ENTRY's project (createRequire anchored at entry's package.json), not the script's own dir — script is project-agnostic
2. npx is a .cmd shim — execFileSync can't run it; invoke Tailwind CLI's real JS entry (`node_modules/@tailwindcss/cli/dist/index.mjs`) with `process.execPath`
3. `@import "tailwindcss"` resolves relative to input.css — input.css must live in the entry's project dir, not the temp dir (cleaned up after)
4. Tailwind CLI exports map blocks `require.resolve` on the subpath — use direct file path

**Verified end-to-end:** built festival-noise-sim from `festival-viewer/entry.jsx` → 610,371 bytes (original: 611,231; diff = title). Rendered in Playwright: React mounted, 5 sliders, 2 SVGs, no console errors (only favicon 404).

<!-- resolved by Sisyphus (AFK task) -->
