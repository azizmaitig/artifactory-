# 12 - Adopt Claude design-management into gate 4 (SKILL.md design gate)

Type: grilling
Status: open
Blocked by: 10

## Question

Which of ticket 10's findings ("How does Claude manage the design of their artifacts",
research at `research/10-claude-artifact-design-management.md`) get adopted into
gate 4, and how are they phrased? Gate 4 currently = ADR-001 token block + 10 mined
rules + per-brief palette freedom. The report prioritizes: MUST = M1 design-plan
review-and-revise loop, M2 subject grounding + precedence, M3 signature element
(4th plan axis), M4 chart color discipline; SHOULD = S1 treatment calibration,
S2 four grading axes (quality/originality/craft/functionality), S3 UI-class sim
rules, S4 no invented data axes, S5 refreshed AI-cluster ban list, S6 theme as
deliberate choice; COULD = C1 per-type template family, C2 runnable palette
validation, C3 optional ~400-token prompt.

Decide, one question at a time (grill-me + domain-modeling skills), HITL:

1. Which MUST/SHOULD/COULD items are adopted, deferred, or rejected — each with
   a one-line reason.
2. **Open tension to resolve first**: the report flags that the festival look
   (near-black + single accent) is itself on Claude's AI-cluster "defaults rather
   than choices" list → does ADR-001 get revised (not just gate 4 phrasing), and
   does M3 (signature) become a hard requirement for every artifact?
3. S2's "grader separated from builder" — how does that coexist with the flow's
   one-session / no-HITL-at-design stance (ADR-001 rejected per-artifact design
   review)? Options: in-model self-grade with the four axes, or a lightweight
   post-build check at gate 6.
4. The exact finalized gate-4 section text (what changes in SKILL.md gate 4).

**Deliverable**: the adopted gate-4 text + the adopt/defer/reject table (with
reasons), recorded here on resolution. Adoption touches `.opencode/skills/
artifact-builder/SKILL.md` gate 4 + possibly `docs/decisions/ADR-001...` — but
that edit is a separate follow-up task once the decision is locked.

## Comments