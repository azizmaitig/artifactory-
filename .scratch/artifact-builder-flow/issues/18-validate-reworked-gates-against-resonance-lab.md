# 18 — Validate reworked gates 3/4/6 against resonance-lab

Type: task
Status: open
Blocked by: 14

## Question

Ticket 14 promised: "Validation rides on the next real artifact." resonance-lab v1/v2 (built 2026-08-10, `artifact-builder/exemples/resonance-lab/`) is the first artifact produced after the gate-4 rework (theme library + constraint-doc-first + design critic) and the gate-3 research-trace upgrade. Audit it against the current SKILL.md gates and record compliance + deltas:

- **Gate 4**: theme direction picked from `docs/design/themes.md` (preset or explicit 3-direction step) or implicitly festival-dark? Design plan (color/type/layout/signature) committed before coding in the artifact record? Signature element present? Anti-slop self-check?
- **Gate 6**: design critic second pass (fresh model, 4 axes, quality+originality PASS/FAIL) recorded in the artifact record — or was it replaced (computed-style audit due to host-model-no-vision)? What are the 4 scores?
- **Gate 3**: 4-step research trace (2-engine search → T1–T4 score → dedup → gate) run in-session, or closed-form textbook validation only? Worked example assertion status.
- **Pipeline**: build health, console-clean status, walkthrough (check 5, ticket 17) status.

Resolve with a compliance table + gaps + any corrective edits to resonance-lab record or future-artifact rules. Note: the gate-5 encoding trap discovered during this build (PowerShell ANSI re-read double-encoding entry.jsx) is a pipeline finding worth recording here or as its own ticket.