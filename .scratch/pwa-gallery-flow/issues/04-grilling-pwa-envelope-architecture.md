# 04 — Grilling: PWA envelope architecture (SW scope, manifest, offline strategy)

Type: grilling
Status: resolved
Blocked by: 01

## Question

PWA envelope architecture: what shape does the install envelope take for gallery-hosted artifacts?

Forks to grill:

- Service worker: one gallery-level SW vs per-artifact SW in its subdirectory (scope implications on `/artifacts/<name>/` — 01 says per-artifact is forced by Pages, confirm the edge cases)
- Manifest: per-artifact manifest generated from artifact name + palette (theme_color = accent), start_url/scope for subpaths
- Offline strategy: runtime-cache CDN deps (cache-first, versioned) vs bundle deps locally (kills Tailwind/Babel CDN warnings too)
- Platform parity bar: Android install-first, iOS as compatible (meta tags, icons) vs full iOS parity
- Cache-busting on artifact rebuild (versioned SW or query strings)

## Resolution — locked envelope spec (feeds 06 prototype, 07 pipeline integration)

Grilled in session 2026-08-12, all forks locked with recommendations.

1. **Service worker — per-artifact, pipeline-generated.** Pages cannot send `Service-Worker-Allowed` (01), so each artifact at `/artifacts/<name>/` ships its own `sw.js` inside its directory with relative `./` paths only (`start_url`, `scope`, `id`, precache list) — a bare `/` resolves to the account root. The gallery index page gets its own separate root-scoped SW (built by 09). No gallery-level SW ever reaches into `/artifacts/*`.
2. **Manifest — generated from build flags.** `build-artifact.mjs` gains `--accent <hex>` (fallback default). Manifest fields: `name`/`short_name` from `--title`, `start_url: "./"`, `scope: "./"`, `id: "./"`, `display: "standalone"`, `theme_color`/`background_color` from accent, `prefer_related_applications` absent. Icons produced by `generate-icons.mjs` (ticket 02): `any` 192/512, `maskable` 512, opaque `apple-touch-icon` 180.
3. **Offline — precache-only, corpus-wide.** Pipeline artifacts are fully self-contained (Tailwind CLI + esbuild inline all deps; no CDN runtime refs), so the SW precaches exactly one HTML + envelope assets (manifest, icons, sw.js) — no runtime-cache code path exists in the pipeline. 06 prototype rebuilds traffic-flow-sim through the pipeline (its entry.jsx + react/recharts stack esbuilds cleanly), which kills its Tailwind/Babel/unpkg CDN deps and makes precache-only true for it too. Network requests outside precache fall back to network (no cache-first strategies).
4. **Parity bar — Android hard gate, iOS compatibility checklist.** Android: installability is the verification gate — real install smoke on device/emulator in 06, and static checks (manifest fields, 192+512 icons, HTTPS) in gate-8 extension (08). iOS: no automated install test (needs physical device); compatibility checklists only — `apple-touch-icon` 180, `apple-mobile-web-app-capable`/`apple-mobile-web-app-status-bar-style` metas, manual Share → Add to Home Screen steps documented in ARTIFACT-RECORD. Startup images (`apple-touch-startup-image`) deferred — iOS default splash (screenshot of last launch) accepted for now; revisit if splash quality matters.
5. **Cache-busting — revisioned precache + cache-name prune.** Build emits a short revision token (hash of artifact HTML). Precache list = `index.html?v=<rev>` + envelope assets; cache name carries the rev. `sw.js` content changes per build → the browser byte-diff update flow fires on next navigation → `activate` prunes old-named caches. `start_url` stays clean (revisioning on precache URLs only, never on manifest `start_url`). No versioned SW filenames — breaks Pages scope.

## Deliverables fanned out

- 06 (prototype): envelope on rebuilt traffic-flow-sim, Android install verified, precache-only SW
- 07 (pipeline): `--accent` flag, envelope generation step (manifest + sw.js + icons via 02's script), publish flow carries the envelope
- 08 (gate): static installability checks per fork 4
- 09 (gallery): root index + its own root-scoped SW

## Comments

- 2026-08-12: grilled with human-in-the-loop, one fork at a time (SW shape, accent source, iOS splash, TFS offline path, parity bar, cache-busting). All locked above.