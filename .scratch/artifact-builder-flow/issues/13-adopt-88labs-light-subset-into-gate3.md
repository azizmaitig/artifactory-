# 13 - Adopt 88-Labs light-subset into gate 3 (SKILL.md domain-model research leg)

Type: grilling
Status: open
Blocked by: 11

## Question

Which of ticket 11's findings ("Broaden gate 3 with 88-Labs-style research",
research at `research/11-gate3-88labs-research-mechanics.md`) get adopted into
gate 3, and how are they phrased? Gate 3 currently = research → explain →
validate (fires only when the brief has a domain model); the research leg is an
unstructured "source the authoritative model, never an LLM guess." The report
proposes a 4-step research trace inside the research step: search (2-engine:
websearch deep + Exa academic, ~6-8 calls) → score (T1-T4 + Blocked, override-first)
→ dedup (Jaccard ≥0.75; `88-Labs/scripts/source-dedup.js` reusable) → degraded
quality gate ((T1+T2)/total ≥0.5; fail → one refinement, then confidence tagged
med/low + HITL at validate). Confidence notes become evidence-based (high = ≥1
T1/T2 source + worked example reproducing a published value).

Decide, one question at a time (grill-me + domain-modeling skills), HITL:

1. **Report's two open decision inputs**: (a) reuse `88-Labs/scripts/source-dedup.js`
   directly (self-contained CLI) vs encode a manual dedup rule in the skill
   (report recommends reuse); (b) confirm the quality gate degrades to
   confidence-tag + HITL escalation and does NOT hard-block (report recommends yes).
2. Scope of the trace — does it apply to ALL gate-3 research legs (domain model
   present) or is multi-source search reserved for high-stakes models (physics/
   data-heavy briefs) with a lighter default for simple ones?
3. Source scoring table — adopt the 88-Labs tier table verbatim vs a trimmed
   artifact-domain table (arxiv/doi/pubmed → T2, github → T3, etc.). Where the
   tier rules live: inline in SKILL.md vs reference `88-Labs/config.md` + the
   88-labs skill's `references/04-domain-authority.md`.
4. The exact finalized gate-3 text (what changes in SKILL.md gate 3 + how it
   feeds the domain notes in the brief).

**Deliverable**: the adopted gate-3 text + the decision record (input (a) and (b)
locked, scope + tier-table sources decided), recorded here on resolution. The
SKILL.md edit is a separate follow-up task once the decision is locked.

## Comments