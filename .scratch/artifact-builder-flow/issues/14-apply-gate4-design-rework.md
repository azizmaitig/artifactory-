# 14 - Apply gate-4 design rework + gate-6 critic to the artifact-builder skill

Type: task
Status: resolved
Blocked by: 12

## Answer

All four deliverables applied (2026-08-10):

1. **SKILL.md gate 4 rewrite** — replaced "stamp ADR-001 token block + per-brief palette" with ticket-12's adopted text: direction pick from theme library (or 3-direction step for vague briefs; `brief > theme preset > model choices`), constraint-doc-first design plan (color/type/layout/**signature**), review-and-revise loop, theme-as-choice test, charts-by-procedure, UI-class rules (summary-before-detail, state in form+number, semantic≠accent, interactive-looks-interactive), and the anti-slop **ban list of failure modes** (not an allowed look).
2. **ADR-001 revised** — festival demoted from "default template" to **festival-dark baseline preset** among N; redirect rationale recorded (near-black+accent on Claude's AI-cluster list; ecosystem multi-theme norm + Claude's "starting point, not a house style"; subject-first selection). Original decision kept as history.
3. **Theme library created** — `10-Projects/11-Active/artifactory/docs/design/themes.md`: festival-dark (ADR-001 tokens, demoted) + paper-editorial + terminal + bold-signal, each a token block + one-line voice + when-to-use; selection rule = subject-first, never default unasked.
4. **Gate 6 design critic** — second-pass step added: after Playwright passes, a **fresh model pass** grades the rendered screenshot on the four axes; **quality + originality decide PASS/FAIL**, craft + functionality inform; FAIL = coherent-but-generic or original-but-messy → fix, re-run; HITL only when direction ambiguous; four scores recorded in the artifact record.

Consistency sweep: gate-4 supporting-guard "Resist AI-house-style" line replaced (contradicted theme-as-choice) with a pointer to the ban list; gate-6 check 4 (screenshot eyeball) now references the chosen theme preset instead of ADR-001 tokens; Quality Checklist + References + Prerequisites updated (theme library first, ADR-001 as preset record). Frontmatter + 8-gate sequence verified intact. Validation (end-to-end brief run + recorded critic scores) rides on the next real artifact, per ticket-09 precedent.

## Question

Apply the locked ticket-12 decisions to the shipped skill (ticket 09 delivered `.opencode/skills/artifact-builder/SKILL.md`):

1. **SKILL.md gate 4 rewrite** — replace "stamp ADR-001 token block" with the adopted text from `issues/12` `## Answer` (direction pick from theme library / 3-direction step for vague briefs; constraint-doc-first plan with color/type/layout/signature; review-and-revise loop; theme-as-choice; M4 chart discipline; S3 UI-class rules; refreshed anti-slop ban list).
2. **ADR-001 revision** — `10-Projects/11-Active/artifactory/docs/decisions/ADR-001-festival-design-language-template.md`: festival token block demoted from "the default template" to **one preset among N** (baseline, not house style); record the redirect rationale (near-black+accent is on Claude's AI-cluster list; ecosystem + Claude's own "starting point, not a house style" doctrine).
3. **Theme library** — create `10-Projects/11-Active/artifactory/docs/design/themes.md`: festival-dark (current ADR-001 tokens, demoted) + 3-4 starter presets (paper-editorial, terminal, bold-signal…), each a token block + one-line voice + when-to-use; selection rule = subject-first, never default unasked.
4. **Gate 6 design critic** — add the second-pass critic step (fresh model pass over rendered screenshot; quality+originality decide PASS/FAIL; craft+functionality inform; four scores recorded in the artifact record; HITL only when direction ambiguous).

**Deliverable**: SKILL.md gate 4 + gate 6 updated, ADR-001 revised, themes.md created, committed. Validation: end-to-end brief run produces a festival-class artifact; critic step runs and scores are recorded.

## Comments

- Graduated from ticket 12 on resolution (2026-08-10): the edit is the separate follow-up task the ticket's deliverable always intended.
