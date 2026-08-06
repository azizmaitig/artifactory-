# 08 - Format selection rule (JSX vs HTML)

Type: grilling
Status: open
Blocked by:

## Question

Given v1 supports both JSX (primary) and HTML (fallback), what rule decides which format a brief gets? Candidate axes: interactivity/statefulness (app-like → JSX), static/streaming content (static pages, data-viz dashboards → HTML), library needs (whitelist libs require JSX/bundling), user preference ("in a jsx file" when asked). Where does the rule live in the flow — a gate in the orchestration (07), or embedded in the creative-brief prompt layer?

<!-- surfaced by resolving 02 - Artifact scope matrix -->
<!-- placement settled by resolving 07 - flow orchestration shape: format gate = gate #2 in the orchestration, not the creative-brief layer. Remaining: the selection rule itself. -->
