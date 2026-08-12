# Wayfinder map — PWA Gallery Flow (phone-ready installable artifacts)

## Destination

Every artifact from the artifact-builder pipeline ships phone-supported and installable as a home-screen shortcut (true PWA: manifest + icons + service worker + HTTPS), published to a GitHub Pages gallery, and gated by an installability verification check before ship. Pipeline-forward: existing artifacts are retrofitted only when touched.

## Notes

- Domain: static web artifacts, PWA install (Android + iOS), GitHub Pages hosting, PowerShell build pipeline
- Skills every session should consult: artifact-builder (gates + ADR-001 tokens; SKILL.md at `.opencode/skills/artifact-builder/`, pipeline scripts at THIS repo root: `build-artifact.mjs` / `build-artifact.ps1`), webapp-testing (verify), grilling + domain-modeling (HITL), research (AFK fact-finding)
- Parent flow: `artifact-builder-flow` (this effort extends the shipped 8-gate pipeline; the earlier `/artifact` demo session wrongly reported build-artifact.mjs as missing — it lives at this repo root, outside the skill dir)
- Reference artifact: traffic-flow-sim (vault `10-Projects/11-Active/traffic-flow-sim/`); gallery track: this effort's gallery infra (artifact-gallery)
- Decisions locked at charting: install = TRUE PWA (manifest + SW + icons + HTTPS) | hosting = GitHub Pages gallery | scope = pipeline-forward
- Gallery live: https://azizmaitig.github.io/artifact-gallery/ (repo azizmaitig/artifact-gallery, gh-pages branch) — see issue 03

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [Research: Android/iOS PWA installability 2026](issues/01-research-pwa-installability-2026.md) — service worker NOT required for installability (Chrome removed the fetch-handler check M108/mobile + M112/desktop 2023; Safari/Firefox never required one); SW needed only for offline + iOS Web Push. Manifest minimum: name/short_name, icons 192+512, start_url, display, prefer_related_applications false/absent. Android Chrome = beforeinstallprompt + WebAPK (WebAPK minting Chrome-exclusive, regulatory pressure); iOS = manual Share → Add to Home Screen only (no prompt), ignores display_override/background_color/maskable, needs static apple-touch-startup-image (NO auto-splash from manifest). GitHub Pages cannot send Service-Worker-Allowed → each artifact subpath carries its own sw.js, scope never leaves /artifacts/<name>/. Version-sensitive watchlist (install element / Web Install API origin trials, Play Protect PWA scanning) in research/01.
- [Research: programmatic PWA icon generation](issues/02-research-pwa-icon-generation.md) — one 512×512 SVG (full-bleed accent bg + centered white initial) rasterized with sharp 0.35.3 (prebuilt win32-x64) to 512/192/180 via a ~13-line generate-icons.mjs; PowerShell calls `node generate-icons.mjs <name> <accent> <outDir>`. Three output kinds: any (192/512), maskable 512 (glyph inside 80% safe circle per web.dev/W3C), opaque 180 apple-touch-icon (iOS renders transparency as black). Fallbacks: @resvg/resvg-js 2.6.2 (deterministic font swap) or zero-install .NET System.Drawing (no-network). One-time `npm i sharp` per machine.
- [Task: gallery repo + GitHub Pages setup](issues/03-task-gallery-setup.md) — dedicated public repo azizmaitig/artifact-gallery, Pages from gh-pages @ root. URL scheme /artifacts/<name>/. Publish = publish-artifact.ps1 in repo main (shallow work-clone of gh-pages, replace artifacts/<Name>/, commit, push; one-time `gh auth setup-git`). Verified live 2026-08-12: root index, /test.html, /artifacts/test/, and /artifacts/traffic-flow-sim/ (published end-to-end through the script) all HTTP 200 over HTTPS. Gotchas: PS 5.1 Join-Path takes exactly 2 positional args; EAP=Stop + native git stderr = terminating error (use EAP=Continue + $LASTEXITCODE + 2>&1); Pages sends no Service-Worker-Allowed header.
- [Grilling: PWA envelope architecture](issues/04-grilling-pwa-envelope-architecture.md) — envelope spec locked: per-artifact SW (pipeline-generated, relative ./ paths, gallery root gets its own SW), manifest from build flags (--accent, name/short_name, start_url/scope/id "./", standalone, 192/512/maskable/apple-touch icons via 02), offline = precache-only (pipeline artifacts inline all deps; 06 rebuilds TFS through pipeline to kill its CDN deps), parity = Android hard gate + iOS compatibility checklist (startup images deferred), cache-busting = revisioned precache (?v=<hash>) + cache-name prune in activate (start_url clean; no versioned SW filenames).
- [Grilling: pipeline integration + publish](issues/07-grilling-pipeline-integration-publish.md) — locked + implemented: envelope integrated into build-artifact.mjs (--accent required unless --no-envelope; generate-icons + envelope modules orchestrated; env-file check added), publish-artifact.ps1 vendored into artifactory root (explicit gate-8 step, never auto-publish; idempotent, failures leave remote untouched), SKILL.md gates 7/8 + prereqs updated. New artifacts ship enveloped by default.

## Not yet specified

- Retrofit process note for artifacts touched later - post-map
- Offline-first depth: now settled by 06 prototype — precache versioned assets + network-first navigation (see 06 deltas; replaces the open question)

## Out of scope

- Native packaging (APK / app-store wrapper) - destination is web PWA install
- LAN self-host - no HTTPS, breaks true PWA
- Retrofitting existing artifacts in this effort - decided pipeline-forward