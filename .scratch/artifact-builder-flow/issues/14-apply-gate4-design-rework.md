# 14 - Apply gate-4 design rework + gate-6 critic to the artifact-builder skill

Type: task
Status: open
Blocked by: 12

## Question

Apply the locked ticket-12 decisions to the shipped skill (ticket 09 delivered `.opencode/skills/artifact-builder/SKILL.md`):

1. **SKILL.md gate 4 rewrite** — replace "stamp ADR-001 token block" with the adopted text from `issues/12` `## Answer` (direction pick from theme library / 3-direction step for vague briefs; constraint-doc-first plan with color/type/layout/signature; review-and-revise loop; theme-as-choice; M4 chart discipline; S3 UI-class rules; refreshed anti-slop ban list).
2. **ADR-001 revision** — `artifact-builder/docs/decisions/ADR-001-festival-design-language-template.md`: festival token block demoted from "the default template" to **one preset among N** (baseline, not house style); record the redirect rationale (near-black+accent is on Claude's AI-cluster list; ecosystem + Claude's own "starting point, not a house style" doctrine).
3. **Theme library** — create `artifact-builder/docs/design/themes.md`: festival-dark (current ADR-001 tokens, demoted) + 3-4 starter presets (paper-editorial, terminal, bold-signal…), each a token block + one-line voice + when-to-use; selection rule = subject-first, never default unasked.
4. **Gate 6 design critic** — add the second-pass critic step (fresh model pass over rendered screenshot; quality+originality decide PASS/FAIL; craft+functionality inform; four scores recorded in the artifact record; HITL only when direction ambiguous).

**Deliverable**: SKILL.md gate 4 + gate 6 updated, ADR-001 revised, themes.md created, committed. Validation: end-to-end brief run produces a festival-class artifact; critic step runs and scores are recorded.

## Comments

- Graduated from ticket 12 on resolution (2026-08-10): the edit is the separate follow-up task the ticket's deliverable always intended.
