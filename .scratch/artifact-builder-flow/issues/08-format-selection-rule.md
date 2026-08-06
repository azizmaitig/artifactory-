# 08 - Format selection rule (JSX vs HTML)

Type: grilling
Status: resolved
Blocked by:
<!-- claimed 2026-08-06 by opencode (Sisyphus) — grilling session, HITL -->
<!-- resolved 2026-08-06 via grilling: 6 questions, all locked -->

## Answer

Decision table, checked in priority order at gate #2 (placement per 07):

| # | Rule | Outcome |
|---|------|---------|
| 1 | User preference: brief `format:` field (auto\|jsx\|html) if set; else keyword scan of brief ("in a jsx file", "react", "plain html", "vanilla js", "no react") | override |
| 2 | React-component lib required (recharts, lucide-react, or any extended React lib) | JSX |
| 3 | Pure-static brief (no behavior, no state: posters, docs, reference, landing pages) | HTML |
| 4 | Composition check (primary axis): composed multi-element UI with shared state (panels/sliders/readouts/charts coordinating) vs single-view imperative (canvas, game loop, raw 2D/WebGL) | JSX / HTML |
| 5 | Ambiguous after 1–4 | JSX (v1 primary per 02) |

Supporting decisions (grilled, HITL):

- **Q1 — primary axis is UI composition, not raw interactivity.** Corpus evidence: SpaceX landing sim (full physics loop, canvas, 4.4K likes) shipped vanilla HTML; festival-noise-sim (composed panels) is JSX — both interactive, different composition.
- **Q2 — React libs force JSX only.** recharts/lucide-react physically require JSX. mathjs/papaparse are format-agnostic: CDN in HTML path, bundled in JSX path; never force format. Non-whitelist libs follow the same split (extended on-demand per 02).
- **Q4 — static short-circuits before the composition check.** "Static" = no behavior, no state; prevents multi-section pages from being mis-binned as JSX.
- **Q5 — preference captured both ways:** explicit `format:` field in the brief (filled at HITL brainstorm, gate 1) + natural-language keyword scan fallback.
- **Q6 — gate emits `format: JSX|HTML` + one-line reason into the brief.** Gate 5 may flip mid-build only on a hard-constraint change (new React lib required, or composition proves trivial); flip is logged in the brief, no re-grill — format stays HITL-free per 07.

Record: rule embeds in SKILL.md as this decision table (built by 09). No ADR — flow logic, not design language (ADR-001 covers the design layer).

## Question

Given v1 supports both JSX (primary) and HTML (fallback), what rule decides which format a brief gets? Candidate axes: interactivity/statefulness (app-like → JSX), static/streaming content (static pages, data-viz dashboards → HTML), library needs (whitelist libs require JSX/bundling), user preference ("in a jsx file" when asked). Where does the rule live in the flow — a gate in the orchestration (07), or embedded in the creative-brief prompt layer?

<!-- surfaced by resolving 02 - Artifact scope matrix -->
<!-- placement settled by resolving 07 - flow orchestration shape: format gate = gate #2 in the orchestration, not the creative-brief layer. Remaining: the selection rule itself. -->
