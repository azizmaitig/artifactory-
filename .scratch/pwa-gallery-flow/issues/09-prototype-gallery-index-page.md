# 09 — Prototype: gallery index page

Type: prototype
Status: resolved
Blocked by:

## Question

Design the gallery root index at https://azizmaitig.github.io/artifact-gallery/ — the page a phone hits before installing an artifact. Per 04: the index ships with its own root-scoped service worker.

Forks to grill:

- Layout: how installed artifacts are listed (grid/cards), what each entry shows (name, one-line description, accent-colored icon tile)
- Install affordances: per-artifact "install" hint copy adapting Android (install prompt) vs iOS (Share → Add to Home Screen); link to the artifact page
- How the index is maintained as artifacts publish: static hand-edited list, generated snippet from the publish script, or something else
- Rough dark-theme take in ADR-001 token style; the index itself should be useable on a phone

## Resolution — prototype built, published, verified (2026-08-12)

**Live:** https://azizmaitig.github.io/artifact-gallery/ · Source: `prototype-gallery-index/` (this flow) — index.html + sw.js.

1. **Layout**: card list (one per artifact) — 52px accent-colored tile (white initial), name, one-line desc, install line. ADR-001 festival-dark tokens (bg #0A0C0E, surface #14171A, hairline, mono utility), `viewport-fit=cover` + safe-area bottom pad, single column ≥375px, no horizontal overflow at 375 (verified).
2. **Install affordances**: per-card copy links the artifact page and gives both paths — Android ⋮ → Install app (install prompt auto-fires on the artifact page) / iOS Share → Add to Home Screen; footer repeats the pair once. No app install prompts from the index itself (installability lives on the artifact pages).
3. **Maintenance**: **static artifact array** (`<script type="application/json">` block at top of the page — slug/name/accent/desc per entry). Adding an artifact = add one object + push (documented in source comment). Generated-from-publish deferred — revisit when the corpus grows past ~10; publish script stays artifact-subpath-only.
4. **Root-scoped SW** (per 04): `sw.js` at gallery root — 06 pattern (network-first navigation, cached-copy offline fallback, `gallery-*` cache prune, skipWaiting+claim). No gallery manifest: artifacts are the installable units, not the gallery.

**Verified:** Playwright at 375×667 + desktop — 2 cards render (Traffic Flow Sim, Test), correct relative hrefs, zero console/page errors (fixed the account-root favicon 404 with `data:,` icon), no h-overflow, screenshot recorded. Live HTML confirmed via cache-buster probe (icon link + SW registration + cards data present, 4241 B). Note: Pages HTTP-cache convergence applies to the root URL as everywhere (06 delta 3).

## Comments

- 2026-08-12: prototype shipped; install-copy + cards formula doubles as the template for future corpus growth.