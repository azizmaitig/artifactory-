# 06 — Prototype: PWA envelope on traffic-flow-sim, install on phone

Type: prototype
Status: open
Blocked by: 04, 03

## Question

Prototype the envelope on traffic-flow-sim: manifest + icons + service worker + responsive pass, deployed to the gallery, installed on a real phone. What breaks, what is missing?

Do:

- Build the envelope per the architecture grilling (04), using the icon recipe from research (02)
- Deploy to the gallery (03), verify install works over HTTPS
- HITL: user installs on their phone and reacts — install prompt, standalone launch, offline behavior, layout on their device
- Report what the prototype proves and what the envelope spec must change

Resolution: envelope validated on a real install, spec deltas recorded; unblocks 08 (verification gate).

## Prototype status (2026-08-12) — envelope built + verified, phone install PENDING (HITL)

**Done, all verified:**
- **Rebuilt traffic-flow-sim through the pipeline** (04 decision): `entry.jsx` gained self-mount (`createRoot(...).render(<App/>)` — it previously relied on the CDN-era `build-tfs.ps1` footer; entries must self-mount per pipeline convention). New build: 0 external `<script src>`/`<link href>` refs, ~416–555 KB self-contained.
- **Envelope per 04**: `generate-icons.mjs` + `envelope.mjs` created at artifactory repo root (deliverables of 02/04, fed to 07):
  - `generate-icons.mjs <name> <accent> <outDir>` — 512 SVG (accent bg + white initial) → sharp → icon-192/512 (any), icon-512-maskable (40% glyph), apple-touch-icon 180. Glyph presence verified by pixel analysis (3.6–3.9% non-bg).
  - `envelope.mjs --dir --name --accent [--title --short]` — writes manifest.json (name/short_name, `./` scope/start_url/id, standalone, theme_color/background_color = accent, 3 icon entries), sw.js (revisioned cache, prune-on-activate, skipWaiting+claim), patches HTML with head links (manifest, theme-color, icon, apple-touch-icon, iOS metas) + sw registration; writes index.html.
- **Published + verified live** (https://azizmaitig.github.io/artifact-gallery/artifacts/traffic-flow-sim/): all 8 URLs HTTP 200 over HTTPS; Playwright pass — title clean, React renders (root populated), manifest link present and JSON-parseable ("Traffic Flow Sim"), SW registered + controlling with `updateViaCache: imports`, 0 page/console errors (favicon 404 eliminated with `data:,` icon), screenshot recorded.

**Spec deltas found (feed 07):**
1. **Rev must hash the FINAL patched index.html**, not the source artifact HTML — envelope-only changes must bump the revision or SW updates never fire (byte-diff check).
2. **Never precache `./` (the directory URL)** — it is THE navigation URL; cache-first on it pins a stale copy forever (the rev'd URL is never the navigation URL). Navigation must be **network-first with rev'd-copy fallback** for offline; cache-first only for versioned assets. This refines 04 fork 5.
3. **GitHub Pages HTML HTTP-cache staleness**: after publish, the directory URL can serve the previous HTML from the browser HTTP cache for a while (per-file; sw.js/index.html converge at different times). Transient; query-string URL bypasses it. Envelope is not at fault — document "wait ~1–5 min after publish before verifying" in 07/08.
4. Old `build-tfs.ps1` is obsolete: replace it with a note pointing to the pipeline (or delete) — it emits CDN/Babel HTML that defeats the envelope.

**Remaining (HITL):** install on a real phone: open https://azizmaitig.github.io/artifact-gallery/artifacts/traffic-flow-sim/ in Android Chrome → install prompt/WebAPK; then offline test (airplane mode → page still loads); then iOS checklist (Share → Add to Home Screen, standalone launch, apple-touch icon). Record reactions + any layout issues (phone viewport pass is ticket 05's home turf).