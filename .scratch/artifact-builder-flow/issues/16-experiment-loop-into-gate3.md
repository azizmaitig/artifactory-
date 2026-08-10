# 16 - Adopt experiment/completion loop into gate 3 research

Type: grilling
Status: open
Blocked by: 13

## Question

After ticket 13's light subset lands (single-pass 4-step trace), should gate 3 also adopt an **experiment/completion loop** for high-stakes models — iterate: search → verify model against published/measured value or derivation → refine → repeat until reproduced (confidence high) or exhausted (ARIS 2/4-round doctrine: 2 stale rounds → structural change, 4 → escalate human)?

Scope: per-artifact option ("verify by published or deduptions"), fired only when the brief's artifact must reproduce a published/measured value. Reuses the light subset's search/score/dedup/gate legs as the loop body. Never hard-blocks; loop exit = confidence tag + HITL.

## Context

- User decision on ticket 13 redirect: "A now (pilot), B next (this ticket), C as option when designing the artifact when needed."
- Pilot evidence: `research/13c-pilot-*.md` (run during ticket 13) — does the 4-step trace reproduce a published value on a real brief, and how many iterations did it take?
- Reference implementations: ARIS `iteration_log.py` (2/4-round pivots), `watchdog.py` (STALE, never acquit), `acceptance-gate.md` ("a loop can DRIVE, it cannot ACQUIT"); research/11 excluded loops from the light subset (completion signals NOT portable — this ticket reopens that exclusion deliberately, for high-stakes only).

## Deliverable

Decision: loop shape (iteration count caps, exit conditions, escalation), where it lives (gate-3 appendix vs separate gate), and confirmation that single-pass trace remains the default for non-high-stakes. SKILL.md edit folds into the ticket-13 edit (ticket 15) or a follow-up.