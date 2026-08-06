# Artifact-Builder Wayfinder Flow — Session Handoff

**Date:** 2026-08-06 (updated after tickets 03/04/06/07)
**User:** azizmaitig
**Next mission:** Resolve **08 - Format selection rule** (grilling, HITL) — one ticket per session.

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

## Open tickets

- **08 - Format selection rule (NEXT, frontier):** JSX vs HTML choice rule. Placement already settled by 07: it is gate #2 in the orchestration, NOT the creative-brief layer. Remaining: the rule content — candidate axes in the ticket body (interactivity/statefulness, static/streaming content, whitelist lib needs, user preference)
- **09 - Build the artifact-builder skill (frontier, unblocked since 07):** task — build the SKILL.md implementing the 8-gate flow + `/artifact` command; reuses visual-translator Step-0, excalidraw-writer tokens, frontend_aesthetics, domain-modeling, webapp-testing; gates 2/6 placeholder-shaped until 08/05 resolve (embed gates, defer rules)
- **05 - Verification gate:** unblocked since 06 resolved — what counts as "verified rendering" (headless render, screenshot, interaction smoke test, console-error-clean); minimum gate before ship, hooks into build-artifact pipeline

## Inputs for ticket 08

- 07's answer: format gate sits at gate #2 of the orchestration — only the selection rule is left to decide
- Candidate axes (from 08's body): interactivity/statefulness → JSX; static/streaming content, data-viz dashboards → HTML; whitelist libs require JSX/bundling; user preference ("in a jsx file")
- Format context from 02: JSX primary + HTML fallback, interactive on demand; whitelist recharts/lucide-react/mathjs/papaparse
- Corpus evidence (research/03): community sims skew vanilla HTML/JS + CDN libs — relevant to when HTML is the right call
- Copilot's draft 7-step pipeline in `research/02-copilot-repo-research.md` for the flow shape (already decided in 07)

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

`wayfinder` · `grill-me` · `domain-modeling` · `documentation-and-adrs` (if ADR-002 needed) · `playwright` (only if prototyping runnable artifacts)
