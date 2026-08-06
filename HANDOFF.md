# Artifact-Builder Wayfinder Flow — Session Handoff

**Date:** 2026-08-06 (updated after tickets 03/04/06/07/08/09)
**User:** azizmaitig
**Next mission:** Resolve **05 - Verification gate** (last open ticket) — one ticket per session.

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
| 09 Build the artifact-builder skill | SHIPPED: `.opencode/skills/artifact-builder/SKILL.md` (8-gate flow, gate-2 table verbatim, gate-6 placeholder, ADR-001 token block + 10 mined rules inlined) + `.opencode/commands/artifact.md` (/artifact loader, exca.md pattern). Vault commit `0931610`. Corrections: `frontend_aesthetics` is NOT a real skill (rules live in research/01 — inlined); "excalidraw-writer tokens" = ADR-001, not the schema skill; webapp-testing's with_server.py missing — gate 6 writes self-contained Playwright scripts |

## Open tickets

- **05 - Verification gate (NEXT, frontier, unblocked since 06):** what counts as "verified rendering" (headless render, screenshot, interaction smoke test, console-error-clean); minimum gate before ship, hooks into build-artifact pipeline. Currently a placeholder inside the shipped skill's gate 6 (self-contained Playwright scripts; strictness minimum deferred)

## Inputs for ticket 05

- 09's shipped skill: gate 6 embeds the verify gate with the placeholder minimum (render + console-clean + control smoke) — the strictness rule is the open question
- 06's pipeline: build-artifact.mjs already structurally verifies output (size ≥1KB, #root, inline style/script) — the runtime rendering gate is separate
- Research/03 corpus + festival session: the checks used for festival-noise-sim.html were headless render + console-error-clean + interaction smoke in Playwright
- Vault note: webapp-testing skill's `scripts/with_server.py` does NOT exist — gate 6 must use self-contained Playwright scripts or the playwright MCP
- The skill is otherwise complete: all 8 gates defined, gate 2 rule locked (08), HITL points per 07. Resolving 05 completes the flow; next step after is a real end-to-end artifact run (acceptance)

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

`wayfinder` · `grill-me` (resolve 05 — verify strictness) · `webapp-testing`/`playwright` (the gate under discussion + acceptance run) · `verification-before-completion` (the gate's own discipline) · `documentation-and-adrs` (if ADR-002 needed)
