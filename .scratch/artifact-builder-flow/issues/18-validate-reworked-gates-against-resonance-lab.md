# 18 — Validate reworked gates 3/4/6 against resonance-lab

Type: task
Status: resolved
Blocked by: 14

## Question

Ticket 14 promised: "Validation rides on the next real artifact." resonance-lab v1/v2 (built 2026-08-10, `artifact-builder/exemples/resonance-lab/`) is the first artifact produced after the gate-4 rework (theme library + constraint-doc-first + design critic) and the gate-3 research-trace upgrade. Audit it against the current SKILL.md gates and record compliance + deltas:

- **Gate 4**: theme direction picked from `docs/design/themes.md` (preset or explicit 3-direction step) or implicitly festival-dark? Design plan (color/type/layout/signature) committed before coding in the artifact record? Signature element present? Anti-slop self-check?
- **Gate 6**: design critic second pass (fresh model, 4 axes, quality+originality PASS/FAIL) recorded in the artifact record — or was it replaced (computed-style audit due to host-model-no-vision)? What are the 4 scores?
- **Gate 3**: 4-step research trace (2-engine search → T1–T4 score → dedup → gate) run in-session, or closed-form textbook validation only? Worked example assertion status.
- **Pipeline**: build health, console-clean status, walkthrough (check 5, ticket 17) status.

Resolve with a compliance table + gaps + any corrective edits to resonance-lab record or future-artifact rules. Note: the gate-5 encoding trap discovered during this build (PowerShell ANSI re-read double-encoding entry.jsx) is a pipeline finding worth recording here or as its own ticket.
## Answer

VALIDATION DONE (2026-08-10). Full compliance table in exemples/resonance-lab/ARTIFACT-RECORD.md (section "Gate-compliance audit"); summary:

- PASS: gates 1–2, 5, 6-check-1..4, 6-check-5 (pedagogy walkthrough), 7, 8.
- PARTIAL: gate 4 — ROOT-CAUSED to a stale entry point: .opencode/commands/artifact.md still carried the pre-rework gate-4 text (ticket 12/14 never synced it), so the build session executed "ADR-001 token block + per-brief palette" instead of the theme-library doctrine. Post-hoc the artifact still lands on festival-dark subject-derived with tuned palette; missing: explicit SIGNATURE line + review-and-revise log. Command file corrected in this ticket.
- NOT RUN: gate-3 4-step trace — build session used closed-form textbook validation only; 6 in-browser cross-asserts all matched (worked example + presets), no bug found; low-risk gap for analytic models, revisit when a model claims published values.
- G6 design critic: NOT RUN at build (replaced by computed-style audit, documented honestly) -> RETRO-RUN this session via fresh vision subagent over the v2 screenshot: Quality 8 / Originality 7 / Craft 8 / Functionality 8 -> PASS. Scores recorded in the artifact record.
- PIPELINE finding: PS 5.1 Get-Content/Set-Content round-trip double-encodes non-ASCII in entry.jsx (mojibake in built HTML) — verified root cause during this build, fix = write tool only. Rule added to SKILL.md gate 5.

Corrective edits shipped: .opencode/commands/artifact.md synced to current doctrine; SKILL.md gate-5 encoding rule; ARTIFACT-RECORD.md audit section. Advisory follow-ups: step-4 callout density (critic), gate-3 trace threshold for published-value models, serve-pattern -> ticket 20.
