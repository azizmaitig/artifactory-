# Artifact-Builder Wayfinder Flow — Session Handoff

**Date:** 2026-08-06 (updated after tickets 03/04/06/07/08)
**User:** azizmaitig
**Next mission:** Resolve **09 - Build the artifact-builder skill** — one ticket per session.

---

## Where everything lives

- **Map (canonical):** `.scratch/artifact-builder-flow/map.md` — Destination, Notes, Decisions so far
- **Tickets:** `.scratch/artifact-builder-flow/issues/NN-<name>.md` (local-markdown tracker)
- **Research:** `.scratch/artifact-builder-flow/research/`
- **ADR:** `docs/decisions/ADR-001-festival-design-language-template.md`
- **Build pipeline (SHIPPED):** `build-artifact.mjs` + `build-artifact.ps1` (repo root)
- **Repo:** https://github.com/azizmaitig/artifactory- (branch `main`)

## Resolved decisions (do not re-open)

| Ticket | Decision |
|---|---|
| 01 Mine artifact prompts | 10 quality rules mined from claude.ai leaks (React whitelist, never-localStorage, color-encodes-meaning, interactive-over-static, tokens-not-hardcoded) |
| 02 Artifact scope matrix | v1 = JSX primary + HTML fallback, interactive on demand; whitelist recharts/lucide-react/mathjs/papaparse, rest extended on-demand; out: multi-file, physics engines, persistence/networking, non-JSX/HTML formats, server-side |
| 03 Domain-modeling gate | Triggered gate (fires on briefs with a domain model): research→explain→validate; outputs worked example (load-bearing) + assumptions + confidence notes; lives in brief + JSX comments, never in-UI |
| 04 Design-taste layer | Festival look = default template (token block, per-brief palette freedom) — ADR-001 |
| 06 Build pipeline | `build-artifact.mjs` → entry.jsx + deps → one verified HTML (esbuild + Tailwind v4 CLI, NODE_ENV define in-script, no Babel). Verified: festival rebuild 610KB, Playwright-clean |
| 07 Flow orchestration shape | Option B: single `/artifact` command, one session. Flow lives in one SKILL.md (8 gates: brainstorm → format → domain-model → design → implement → verify → build → archive) + `/artifact` command entry; HITL only at brainstorm/domain/verify. Format gate = #2 (rule → 08); verify strictness → 05. Skill build graduated to ticket 09 |
| 08 Format selection rule | Gate #2 emits `format: JSX\|HTML` + one-line reason via 5-step priority table: (1) user preference — brief `format:` field or keyword scan → override; (2) React-component lib (recharts/lucide-react) → JSX, mathjs/papaparse format-agnostic; (3) pure-static (no behavior/state) → HTML; (4) composition check — shared-state panels → JSX, single-view imperative (canvas/loop) → HTML; (5) ties → JSX. Primary axis = UI composition, not interactivity. Mid-build flip on hard-constraint change, logged, no re-grill. No ADR; embeds in SKILL.md gate #2 |

## Open tickets

- **09 - Build the artifact-builder skill (NEXT, frontier, unblocked since 07):** task — build the SKILL.md implementing the 8-gate flow + `/artifact` command; reuses visual-translator Step-0, excalidraw-writer tokens, frontend_aesthetics, domain-modeling, webapp-testing. Gate 2 rule now RESOLVED (08 — decision table in the ticket, embed directly); gate 6 placeholder-shaped until 05 resolves (embed gate, defer strictness)
- **05 - Verification gate:** unblocked since 06 resolved — what counts as "verified rendering" (headless render, screenshot, interaction smoke test, console-error-clean); minimum gate before ship, hooks into build-artifact pipeline

## Inputs for ticket 09

- 08's answer: gate #2 decision table (5 rows, priority order) — ready to embed in SKILL.md verbatim
- 07's answer: the 8-gate sequence + HITL points (brainstorm/domain/verify) + single `/artifact` command entry — the skeleton the skill implements
- 02's scope matrix: whitelist recharts/lucide-react/mathjs/papaparse, extended on-demand; HTML fallback with CDN support
- ADR-001: festival design-language template (token block, per-brief palette freedom)
- 03 corpus + 06 pipeline: build-artifact.mjs → one verified self-contained HTML (esbuild + Tailwind v4 CLI)
- Skill pack for reuse: visual-translator Step-0 (brainstorm), excalidraw-writer (tokens), frontend_aesthetics (taste), domain-modeling, webapp-testing (verify)

## Conventions

- Claim ticket first (`<!-- claimed ... -->`), resolve via `## Answer` section + `Status: resolved`, append line to map "Decisions so far"
- Commit: `docs: resolve ticket NN - <name>` (English, SEMANTIC), push to `main`, NO attribution footers
- PowerShell 5.1; git commands need `$env:GIT_MASTER='1';` prefix; no `sed` on PATH
- User is terse/decisive ("ok" = locked). Recommend each option; one question at a time (grill-me skill)

## Standing preferences

Dark theme + single accent · tabular-nums mono readouts · verified before shipped · no untested logic · terse/pragmatic tone.

## Guardrail (user's correction this session)

The TARGET is producing artifacts like festival-noise-sim (physics + sliders + SVG + recharts, dark, self-contained HTML). Keep grilling concrete and artifact-facing — avoid meta-questions about where things live in the flow. When design decisions are locked, move to building.

## Suggested skills for next session

`wayfinder` · `writing-skills`/`skill-creator` (building SKILL.md) · `domain-modeling` (embedding gate 3) · `webapp-testing`/`playwright` (end-to-end QA of the built skill against a real brief) · `documentation-and-adrs` (if ADR-002 needed)
