# Artifact-Builder Wayfinder Flow — Session Handoff

**Date:** 2026-08-06 (updated after tickets 03/04/06)
**User:** azizmaitig
**Next mission:** Resolve **07 - Flow orchestration shape** (grilling, HITL) — one ticket per session.

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

## Open tickets

- **07 - Flow orchestration shape (NEXT, frontier):** How does a user request become an artifact? Option A: mini-wayfinder per artifact (destination → decision tickets → resolve → build). Option B: single /artifact command with embedded gates (brainstorm → domain-model → design → build → verify). Where does the flow live — skill, command, map?
- **08 - Format selection rule (sibling):** JSX vs HTML choice rule; may be a gate in orchestration (07) or in the creative-brief layer
- **05 - Verification gate:** unblocked since 06 resolved — what counts as "verified rendering" (headless render, screenshot, interaction smoke test, console-error-clean); minimum gate before ship, hooks into build-artifact pipeline

## Inputs for ticket 07

- Copilot's draft 7-step pipeline in `research/02-copilot-repo-research.md` (spec interview → wireframe → React impl → domain validation → QA → build → deploy/archive) = a concrete Option B shape
- Ticket 08's question: where the JSX/HTML format choice lives
- Build contract from 06: entry.jsx → single verified HTML
- Domain gate from 03: hard step when brief has a domain model
- Token template from ADR-001: stamped on every artifact

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
