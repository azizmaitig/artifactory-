# 16 - Adopt experiment/completion loop into gate 3 research

Type: grilling
Status: resolved
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

## Comments

### Fork 1 — loop shape (LOCKED 2026-08-10, source: user's agent-loop project)

Evidence: `research/16-agent-loop-loop-mechanics.md` (extraction, user redirect mid-grill).

- Round log: append `{round, leg, event: verified|mismatch|stale, source-delta, error-delta}` to the brief — typed-log staleness (agent-loop `loop-run-log.md` shape).
- Caps: max **3 rounds** per high-stakes artifact. 2 consecutive stale rounds on the same leg → **structural change** (swap model formulation) within the cap. Stale + no unexplored T1/T2 sources left on the failing leg → stop spending rounds, escalate (WAKE/IDLE pre-check). One structural change per artifact; cooldown until validated.
- Stale = zero verification delta: same-leg mismatch, no new T1/T2 source entered the trace, no error reduction.
- Exit binary (honest terminal states):
  - REPRODUCED → COMPLETE: all reproduction targets verified within tagged tolerance vs ≥1 T1/T2 + worked example; confidence HIGH.
  - EXHAUSTED → ESCALATE: 3 rounds used, or stale with no fresh sources. Residual mismatches ride as error-direction assumption tags; HITL at gate-3 validate decides (accept-tagged / refine-with-human / abandon). Never hard-blocks build. **EXHAUSTED ≠ VERIFIED** — tag MED/LOW, never HIGH.
- Pilot check: festival run = round 1 mismatch → tagged assumptions → REPRODUCED-on-legs + EXHAUSTED-on-assumptions → escalate-tagged, HITL at validate. Same outcome as 13c; machinery only changes the genuinely-wrong-model case.

### Fork 2 — where it lives (LOCKED 2026-08-10)

**Gate-3 appendix as a conditional sub-mode of the existing research leg.** One leg, two modes: single-pass 4-step trace (default) / experiment loop (high-stakes only). Same machinery wrapped in a repeat edge; same outputs (confidence + assumption tags). Not a new numbered gate — a gate implies a step every artifact passes; this fires only on briefs requiring reproduction. Consistent with tickets 11/13 integration precedent. SKILL.md: one conditional block in gate 3; folds into ticket 15's edit; no renumbering.

### Fork 3 — default for non-high-stakes (LOCKED 2026-08-10)

1. **Single-pass 4-step trace is the unconditional default** for every artifact; the loop is never the baseline.
2. **Trigger = reproduction target in the brief**: the domain model contains ≥1 leg whose correctness depends on reproducing a published/measured value or derivable-from-first-principles quantity. User-importance alone does NOT fire the loop; reproducibility does. No reproduction target → single-pass, loop never appears.

### Fork 4 — final text (LOCKED 2026-08-10)

Locked as proposed (see `## Answer`, adopted text verbatim).

## Answer

All 4 forks locked (see Comments). Evidence: `research/16-agent-loop-loop-mechanics.md` (user's agent-loop project extraction — user redirect mid-grill) + `research/13c-pilot-festival-noise-trace.md`.

- **Fork 1 (loop shape)**: max 3 rounds per high-stakes artifact; stale = zero verification delta (same-leg mismatch, no new T1/T2 source, no error reduction); 2 consecutive stale on same leg → structural change within cap; WAKE/IDLE pre-check (skip round when no unexplored T1/T2 + no concrete model change); one structural change per artifact, cooldown until validated; typed round log `{round, leg, event, source-delta, error-delta}` in brief. Exit binary: REPRODUCED (within tagged tolerance vs ≥1 T1/T2 + worked example → confidence high) / EXHAUSTED (tag med/low, error-direction assumption tags, HITL at gate-3 validate: accept-tagged / refine-with-human / abandon). Never hard-blocks. **EXHAUSTED ≠ VERIFIED.**
- **Fork 2 (placement)**: gate-3 **appendix** as conditional sub-mode of the research leg — one leg, two modes (single-pass default / loop high-stakes). Not a new numbered gate; consistent with tickets 11/13 integration precedent; no renumbering.
- **Fork 3 (default)**: single-pass trace is the unconditional default; loop fires only on a **reproduction target** in the brief (published/measured value or derivable quantity), never on user-importance.
- **Fork 4 (text)**: adopted as below.

**Adopted gate-3 experiment-loop text (extends the ticket-13 trace text; applied via ticket 15's gate-3 edit):**

> **Experiment loop (high-stakes only — gate-3 appendix; single-pass trace stays the unconditional default).** Fires only when the brief's domain model must reproduce a published/measured value or derivable quantity (e.g. "~105 dB at 10 m, as measured on site"). The loop is the 4-step trace wrapped in a repeat edge — same search/score/dedup/gate legs, same outputs.
>
> **Round log.** Each round appends `{round, leg, event: verified | mismatch | stale, source-delta, error-delta}` to the brief — staleness reads from the typed log, not vibes.
>
> **Caps.** Max **3 rounds** per artifact. **Stale** = zero verification delta: same-leg mismatch, no new T1/T2 source entered the trace, no error reduction. **2 consecutive stale rounds on the same leg → structural change** (swap model formulation) within the cap. **WAKE/IDLE pre-check** before spending a round ≥2: re-search only if unexplored T1/T2 sources exist for the failing leg AND a concrete smallest-responsible model change is at hand; otherwise skip straight to escalate. One structural change per artifact; cooldown until validated.
>
> **Exit — binary, honest terminal states.** **REPRODUCED** → all reproduction targets verified within tagged tolerance against ≥1 T1/T2 + worked example; confidence **high**; proceed. **EXHAUSTED** → 3 rounds used, or stale with no fresh sources; residual mismatches ride as error-direction assumption tags; **HITL at gate-3 validate decides** (accept-tagged / refine-with-human / abandon). Never hard-blocks the build. **EXHAUSTED ≠ VERIFIED** — tag med/low, never high.
>
> (Evidence: research/16 agent-loop mechanics + research/13c pilot — festival trace = round 1.)

Follow-up: loop text folds into **ticket 15**'s pending gate-3 edit (scope noted there). No new ticket.