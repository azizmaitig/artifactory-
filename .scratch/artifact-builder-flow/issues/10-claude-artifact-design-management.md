# 10 - How does Claude manage the design of their artifacts

Type: research
Status: resolved
Blocked by:
<!-- resolved 2026-08-10 by research subagent (librarian) — report + analysis complete -->

## Question

How does claude.ai's artifact system actually manage design? We built our design
gate (gate 4) from the festival look + 10 mined rules — but the source system
itself (Claude generating artifacts) presumably manages design somehow, and we
should learn from it directly to strengthen gate 4.

Research, from primary sources:

1. **The artifact generation system** — how Claude applies design when generating
   artifacts: its design principles, token/layout conventions, how it sequences
   design decisions (palette → layout → typography → charts), and how it balances
   per-artifact expression against a house style.
2. **Primary sources to mine**: leaked artifact system prompts / artifact skill
   packs (claude.ai's own artifact-writing instructions, e.g. visualize.md and
   any artifact skill pack leaks), Anthropic's published design guidance (Anthropic
   blog Nov 2025 frontend aesthetics, e.g. "visualizers"/data-viz guidance), the
   madewithclaude.com corpus (research/03 already exists — extend it with the
   design-management angle).
3. **What gate 4 must adopt** — deliverable is a concrete, load-bearing list:
   which Claude design-management practices should gate 4 adopt beyond the
   10 mined rules, each tagged with why (credibility/precision/taste).

**Deliverable**: `research/10-claude-artifact-design-management.md` — the
design-management method Claude uses, distilled into adoptable rules for gate 4,
with sources cited. Links from this ticket. Resolved by a `/research` subagent.

## Answer

**How Claude manages artifact design** (3-layer stack, per `research/10-claude-artifact-design-management.md`):

1. **Layer 1 — injected token/visual system** (`visualize.md`, current 2.1.211 leak): hard token block (9 color ramps w/ stops, complexity budget, mandatory dark theme, streaming rules).
2. **Layer 2 — per-artifact-type templates** (artifact pack: dashboard/data-table/explainer/report/plan): slot-filling, restyle-on-top, token scope discipline.
3. **Layer 3 — published aesthetic guidance**: frontend-design skill (design plan: color/type/layout/**signature** + review-vs-generic + critique loop) + the ~400-token frontend_aesthetics prompt.

Design decision sequence: **calibrate treatment → ground in subject → precedence (brief > existing system > model) → sketch plan (color/type/layout/signature) → review-vs-generic & revise → build → charts (form→color→validate)**.

**Gate-4 adoption candidates** (full table in report):

- **MUST**: M1 design-plan review-and-revise loop (the mechanism behind mined rule 10); M2 subject grounding + precedence; M3 **signature element** (4th plan axis — escape hatch from ADR-001 house-style risk); M4 chart color discipline (text-wears-tokens, entity-follows-color).
- **SHOULD**: S1 treatment calibration (utilitarian/editorial); S2 four grading axes (quality/originality/craft/functionality, grader separated from builder); S3 UI-class rules for sims; S4 no invented data/time axes; S5 refreshed AI-cluster ban list; S6 theme commitment as a deliberate choice.
- **COULD**: C1 per-type template family; C2 runnable palette validation; C3 optional ~400-token prompt.

**Notable**: the festival look itself (near-black + single accent) is on Claude's own AI-cluster "defaults rather than choices" list — a direct argument for M3 (signature) + S5 (ban-list refresh). Corpus extended with design-management angle (`research/03-madewithclaude-corpus.md`).

## Comments
[Report](research/10-claude-artifact-design-management.md) — Claude's artifact design = 3-layer stack (visualize.md tokens + per-type templates + published aesthetic guidance) with a fixed sequence: calibrate treatment → ground in subject → sketch plan (color/type/layout/signature) → review-vs-generic & revise → build → charts (form→color→validate); gate 4's top adoptions are the review-and-revise loop, the signature element, the four grading axes (quality/originality/craft/functionality), and chart color discipline (text-wears-tokens, entity-follows-color).
