# 17 — Adopt pedagogy spine into gate 1 (house style lock)

Type: task
Status: resolved
Blocked by:

## Question

Apply the user-locked pedagogy spine ("artifacts must be human-understandable — like a physicist explaining a phenomenon to an 18-year-old, guided with interactive artifacts and smart ways to explain interactively") into the artifact-builder SKILL.md. The decision was locked by the user directly ("ok lock") after piloting on resonance-lab v2 — this ticket records the application, not a new decision.

## Answer

SKILL.md edited 2026-08-10 (commit pending):

- **Gate 1 brief template** — `Audience/interaction` split into `Audience` (comprehension target) + `Interaction`; new `Hook` field (the real-world phenomenon that opens the artifact).
- **New locked block after gate-1 guardrails — "Pedagogy spine (house style)"**: Hook (never open on abstract sliders), Staircase (see → tweak → explain; math after intuition), Predict-then-observe (guess-first reveals, sim restart from rest), Plain-language readouts (physicist's translation line for key numbers), Guided + sandbox modes (lesson ends where the sandbox begins).
- **Gate 6 check 5** — Guided walkthrough: scripted path completes end-to-end from fresh load; every step mutates observable state; no dead-end steps; reveal numbers asserted against the domain model; new console errors = FAIL.
- **Quality checklist** — new pedagogy-spine item.

**Pilot evidence**: resonance-lab v2 (this repo, exemples/resonance-lab) — Lesson mode: Tacoma Narrows hook → ring frequency (student sweeps drive slider) → resonance reveal (guess-first, sim resets, tiles hit exactly 10.0× / 90° / 0.253 m) → damping reveal (1.4×) → completion → free play. Playwright-verified: full walkthrough, 0 console errors, plain-language line rendered. This is the validation carrier for the spine; gates 3/4/6 compliance of the same artifact is ticket 18's scope.