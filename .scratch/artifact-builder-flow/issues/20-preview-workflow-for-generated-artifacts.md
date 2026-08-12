# 20 — Preview workflow for generated artifacts

Type: research
Status: resolved
Blocked by:

## Question

How do generated artifacts get opened and iterated during a build session? Current practice discovered ad hoc in resonance-lab: Playwright blocks `file://`, so a throwaway `serve-tmp.mjs` static server was written, run hidden, then deleted post-verification. Options: formalize that pattern (canonical `10-Projects/11-Active/artifactory/serve.mjs` + port convention), a persistent viewer page, or dev-server workflow via the build script.

Research: how the vault's other artifact sessions handled serving (nuit-du-village, orbit-sim) — check their records for the pattern; whether build-artifact.mjs or the .ps1 wrapper should grow a `--serve` flag.

## Resolution — canonical preview workflow locked (2026-08-12)

1. **Research findings**: every session used a throwaway server with an ad-hoc port — orbit-sim record: `http://localhost:8321`; six-degrees record: `http://127.0.0.1:8765`; resonance-lab record §Follow-ups (c) explicitly flags *"preview/serve pattern (serve-tmp.mjs) → ticket 20 scope"*; pwa-gallery 06/09 sessions re-invented the same throwaway (8770). No session reused another's server; each deleted it after.
2. **Decision**: canonical `serve.mjs` at the artifactory repo root (next to build-artifact.mjs) + **port convention 8770** + a **`--serve` flag on build-artifact.mjs** (starts the server as a detached child after the build verifies, printing URL + PID). A persistent viewer page was rejected: serving local files is the job; the index/gallery already owns "viewer" concerns. A dev-server-inside-the-build (long-lived) was rejected: build must exit 0 fast; preview is a separate concern on the same artifact dir.
3. **serve.mjs contract**: binds 127.0.0.1 only (never LAN-exposed), no-store headers (verified HTML must not ride the browser HTTP cache), `index.html` fallback for bare directory requests (enveloped artifacts + the gallery index preview exactly as published). **localhost is a secure context** → envelope service workers register and can be exercised locally before publishing (install prompt works on localhost).
4. **SKILL.md gate 7**: preview workflow recorded (canonical command, port 8770, --serve, stop instructions; "never write per-session throwaway servers").
5. Verified: serve.mjs serves index.html + envelope assets (200s, correct title) on :8770.

## Deliverables

- `serve.mjs` (artifactory root)
- `build-artifact.mjs --serve` (detached preview after build; `--serve` not in the .ps1 wrapper — the wrapper stays a build pass-through; use the flag or serve.mjs directly)
- SKILL.md gate 7 preview note

## Comments

- 2026-08-12: claimed 2026-08-11 by prior session; resolved with research trace + implementation.