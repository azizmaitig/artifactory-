# 09 - Build the artifact-builder skill

Type: task
Status: open
Blocked by: 07

## Question

Build the flow locked in ticket 07: one `artifact-builder` skill (SKILL.md) implementing the 8-gate sequence — brainstorm → format gate → domain-model gate → design → implement → verify → build → archive — plus the `/artifact` slash-command entry that loads it.

Reuse the named skills, don't rewrite them: visual-translator Step-0 (brainstorm), excalidraw-writer tokens + frontend_aesthetics (design), domain-modeling (gate 3), webapp-testing/playwright (gate 6). The skill references `build-artifact.mjs` (ticket 06) and the ADR-001 token block. Gates 2 (format) and 6 (verify) are placeholder-shaped until tickets 08 and 05 resolve — embed the gates, defer their rules.

Validation bar: the skill, run end-to-end on a brief, produces a festival-noise-sim-class artifact (single self-contained HTML, dark + mono readouts, verified in Playwright).

<!-- graduated from map fog by resolving 07 - flow orchestration shape -->
