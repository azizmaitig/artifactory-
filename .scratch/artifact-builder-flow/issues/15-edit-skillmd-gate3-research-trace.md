# 15 - Edit SKILL.md gate 3 with the adopted research trace

Type: task
Status: resolved
Blocked by: 13

## Answer

Applied to `.opencode/skills/artifact-builder/SKILL.md` gate 3:

- **Ticket-13 trace text verbatim** — the 4-step trace (2-engine search → T1–T4 trimmed scoring override-first → Jaccard ≥0.75 dedup via `source-dedup.js` with manual fallback → degraded gate no-hard-block) + evidence-based confidence + domain-notes block. Replaced the bare research leg ("Per ticket 03, run: research → explain → validate") — note: the "never an LLM guess" phrase ticket 15 referenced was not present in the current SKILL.md; the research-step description was the actual target.
- **Ticket-16 experiment-loop appendix text verbatim** (high-stakes conditional sub-mode: round log, caps 3/stale-2/WAKE-IDLE, REPRODUCED/EXHAUSTED exit, HITL at validate) after the domain-notes block.
- **Verified**: frontmatter intact, gate sequence unbroken (gate 3 → gate 4), outputs block preserved, no renumbering, references block untouched (ticket 14 owns gate 4; ticket 05 locked gate 6 unchanged).

References added inline: research/11, 13b, 13c, 16 as specified. Committed with ticket-16 resolution (3995e0c); this ticket's SKILL.md edit committed separately after verification.

## Question

Apply the adopted gate-3 research text (ticket 13 `## Answer`) to `.opencode/skills/artifact-builder/SKILL.md` gate 3 section, replacing the current unstructured research leg ("source the authoritative model, never an LLM guess") with the locked 4-step trace text.

## Scope

- Replace gate-3 research-step text with the adopted text verbatim from `issues/13-adopt-88labs-light-subset-into-gate3.md` (## Answer).
- **Also carry ticket 16's adopted experiment-loop text** (from `issues/16-experiment-loop-into-gate3.md` ## Answer) as the gate-3 appendix block — high-stakes conditional sub-mode, after the 4-step trace text.
- Keep gate 3's existing structure: research → explain → validate; triggered only when the brief has a domain model.
- Reference `research/11-gate3-88labs-research-mechanics.md` (mechanics), `research/13b-external-repo-audit.md` (ARIS/text-to-cad adoptions), `research/13c-pilot-festival-noise-trace.md` (worked example of the trace in action) as inline pointers.
- Do NOT touch gate 4 (ticket 14 owns that edit) or gate 6 (its own prior ticket).

## Deliverable

SKILL.md gate-3 section updated + committed. Verify the skill still parses (frontmatter/structure intact) after edit.