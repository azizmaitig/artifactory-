# 15 - Edit SKILL.md gate 3 with the adopted research trace

Type: task
Status: open
Blocked by: 13

## Question

Apply the adopted gate-3 research text (ticket 13 `## Answer`) to `.opencode/skills/artifact-builder/SKILL.md` gate 3 section, replacing the current unstructured research leg ("source the authoritative model, never an LLM guess") with the locked 4-step trace text.

## Scope

- Replace gate-3 research-step text with the adopted text verbatim from `issues/13-adopt-88labs-light-subset-into-gate3.md` (## Answer).
- Keep gate 3's existing structure: research → explain → validate; triggered only when the brief has a domain model.
- Reference `research/11-gate3-88labs-research-mechanics.md` (mechanics), `research/13b-external-repo-audit.md` (ARIS/text-to-cad adoptions), `research/13c-pilot-festival-noise-trace.md` (worked example of the trace in action) as inline pointers.
- Do NOT touch gate 4 (ticket 14 owns that edit) or gate 6 (its own prior ticket).

## Deliverable

SKILL.md gate-3 section updated + committed. Verify the skill still parses (frontmatter/structure intact) after edit.