# 20 — Preview workflow for generated artifacts

Type: research
Status: open
Blocked by:

## Question

How do generated artifacts get opened and iterated during a build session? Current practice discovered ad hoc in resonance-lab: Playwright blocks `file://`, so a throwaway `serve-tmp.mjs` static server was written, run hidden, then deleted post-verification. Options: formalize that pattern (canonical `artifact-builder/serve.mjs` + port convention), a persistent viewer page, or dev-server workflow via the build script.

Research: how the vault's other artifact sessions handled serving (nuit-du-village, orbit-sim) — check their records for the pattern; whether build-artifact.mjs or the .ps1 wrapper should grow a `--serve` flag.

Resolution: a locked preview workflow (one canonical command) recorded in SKILL.md gate 6/7 notes, replacing the per-session throwaway.