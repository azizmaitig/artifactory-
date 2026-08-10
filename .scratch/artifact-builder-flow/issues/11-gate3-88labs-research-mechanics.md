# 11 - Broaden gate 3 with 88-Labs-style research: targeted multi-source domain research before design

Type: research
Status: resolved
Blocked by:
<!-- resolved 2026-08-10 by research subagent (explore) — 88-Labs mechanics mapped to gate 3, light-subset proposal -->

## Question

Gate 3 (domain-model) currently runs research → explain → validate only when a
domain model exists, and its research leg is unstructured (single-pass web
search, no source-quality scoring). Can it adopt the architecture of the user's
**88-Labs** research loop (vault: `88-Labs/`) — multi-source search (websearch +
Exa), source-quality tier scoring (T1–T4), content-similarity dedup (Jaccard
3-gram), quality gates, completion signals — to make artifact domain research
more credible and precise? The user explicitly wants to "optimize the credibility
and precision of our artifacts" by learning from 88-Labs.

Research, from the actual 88-Labs implementation:

1. **Map 88-Labs' research pipeline** (`88-Labs/INDEX.md`, `config.md`,
   `lab-notes.md`, `scripts/`): the 7-phase loop (context bridge → search →
   search-results processor → synthesize → report → persist → signal check),
   source tier scoring rules, dedup threshold, quality gate, completion signals
   (SATISFACTORY×2 / EXHAUSTED / ABORT).
2. **Extract the reusable mechanics** — what specifically made 88-Labs outputs
   credible: domain tiers, dedup, quality thresholds, iteration loop. Which of
   these transfer to a single-artifact gate-3 research pass (sized to ONE
   artifact session, not a multi-iteration lab loop)?
3. **Deliverable**: a concrete gate-3 upgrade proposal — what gate 3 adds (e.g.
   multi-source search, source scoring, a lightweight quality gate, targeted
   pre-design research), how it integrates with the existing
   research→explain→validate sequence, what stays manual (per 03 the worked
   example + assumptions + confidence), and the limit of what's portable
   (88-Labs' multi-iteration loop is likely too heavy for gate 3 — recommend the
   light subset).

**Deliverable**: `research/11-gate3-88labs-research-mechanics.md` — the 88-Labs
mechanics mapped onto gate 3, with a concrete upgrade proposal + what to
exclude. Links from this ticket. Resolved by a `/research` subagent.

## Answer

**Verdict: port the LIGHT subset, not the loop.** Full analysis in `research/11-gate3-88labs-research-mechanics.md`.

88-Labs' credibility core is **Phase 1.5** (verified from INDEX.md, config.md, scripts, skills-archive/88-labs): T1–T4 + Blocked tier scoring (override-first, first-match-wins, Blocked dropped), Jaccard 3-gram dedup at ≥0.75 (survivor = higher authority score), quality gate (T1+T2)/total ≥ 0.5 with max 1 refinement, scores passed as metadata only. Real data: PASS 0.78 (dedup 38→18), FAIL 0.25 (completed with caution).

**What transfers to a single-artifact gate-3 pass** (no loop exists — one session):

- **YES**: 2-engine search (websearch deep + Exa academic, ~6-8 calls targeted to the model/standard/worked-example); manual T1–T4 scoring (≤20 sources, no script); dedup (Jaccard ≥0.75 or manual equivalent; `88-Labs/scripts/source-dedup.js` reusable as-is); **degraded quality gate** — feeds confidence notes + HITL escalation at validate, must NOT hard-block (gate 3 has no loop to refine into); tier-scored source trace into the brief as the evidence base for 03's confidence notes.
- **NO**: completion signals (SATISFACTORY/EXHAUSTED/ABORT), context bridge/lab-notes, dashboard/persist machinery, 6-engine search, synthesis/report sub-task pipeline, saturation/gap thresholds, state machine.

**Proposed integration** (inside research → explain → validate): a 4-step research trace — search (multi-source) → score (T1–T4) → dedup → gate. Placement: the trace is the INPUT to explain; confidence notes become evidence-based (high = ≥1 T1/T2 source + worked example reproducing a published value). Worked example/assumptions/confidence wording stay manual per 03. Cost ~10-15 min, no new infra.

**Decision inputs for the adoption session**: (a) reuse `source-dedup.js` directly vs encode a manual rule (report recommends reusing); (b) quality gate degrades to confidence-tag + HITL (report recommends yes). Note: 88-labs skill currently lives in `.opencode/skills-archive/88-labs/` (CHANGELOG claims `.opencode/skills/88-labs/` but that path is empty) — flag if the adoption session loads it via `skill()`.

## Comments
- Report: research/11-gate3-88labs-research-mechanics.md — 88-Labs loop mapped to gate 3; LIGHT subset recommended (2-engine search, T1-T4 tier scoring, Jaccard 0.75 dedup, single-pass quality gate feeding confidence notes + HITL validate); multi-iteration loop/completion-signal/dashboard machinery excluded; adoption decision deferred.
