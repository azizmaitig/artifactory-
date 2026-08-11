# Research — 88-Labs mechanics mapped to gate 3 (Ticket 11)

**Status**: draft (research leg of ticket 11; adoption decision deferred)
**Date**: 2026-08-10
**Agent**: research subagent (wayfinder ticket 11)
**Scope**: map the vault's 88-Labs research-loop mechanics onto artifact-builder gate 3 (domain-model research); recommend the LIGHT subset that fits a single-artifact pass.

**Sources verified by reading the actual files** (not from memory):
- `88-Labs/INDEX.md`, `88-Labs/config.md`, `88-Labs/CHANGELOG.md`, `88-Labs/lab-notes.md`
- `88-Labs/scripts/scaffold-experiment.js`, `88-Labs/scripts/source-dedup.js`, `88-Labs/scripts/finalize-experiment.js`, `88-Labs/scripts/update-loop-stats.js`
- `88-Labs/loop-stats.js` (real `sourceQuality` data, incl. a FAILED gate)
- `.opencode/skills-archive/88-labs/SKILL.md` + `references/01-phase-execution.md`, `references/04-domain-authority.md`
- Current gate 3: `10-Projects/11-Active/artifactory/.scratch/artifact-builder-flow/issues/03-domain-modeling-gate.md`, `.opencode/skills/artifact-builder/SKILL.md` (gate 3 section)

## 1. The 88-Labs loop as implemented

### 1.1 The 7-phase loop (INDEX.md diagram + SKILL.md)

Phase 0 Context Bridge → Phase 1 Search → Phase 1.5 Search Results Processor → Phase 2 Synthesize → Phase 3 Report → Phase 4 Persist → Phase 5 Signal Check → loop (INCOMPLETE) or stop.

- **Phase 0**: load `88-Labs/lab-notes.md`, extract prior clusters/gaps/next-focus. `lab-notes.md` is the inter-iteration context bridge.
- **Phase 1**: up to 6 engines — websearch (20), Exa academic (20), parallel-search (20), agent-reach (explore+librarian subagents; textual, bypasses Phase 1.5), last30day (10), platform-search (site:-scoped, 5-10 each). URL-canonicalization + URL dedup, provenance log.
- **Phase 1.5**: score → dedup → quality gate (details below).
- **Phase 2**: deep sub-task → synthesis JSON (clusters, consensus, contradictions, gaps, evidence_scores, completion_signal).
- **Phase 3**: deep sub-task → structured brief with Source Quality section + `[T1]`-`[T4]` badges in Source Index (cap 30, T1/T2 first).
- **Phase 4**: write `88-Labs/output/{slug}-{ts}/report.md`, append iteration block to lab-notes.md, agentmemory save, loop-stats.js regeneration via `finalize-experiment.js`, recovery manifest.
- **Phase 5**: signal decision (below).

### 1.2 Phase 1.5 — Search Results Processor (verified: `references/01-phase-execution.md` §Phase 1.5)

1. **Authority scoring** — URL Pattern Overrides checked first, first match wins (doi.org→T2, arxiv.org→T2, github.com→T3, pubmed.ncbi.nlm.nih.gov→T2, youtube.com→T3, reddit.com→T4, x.com/twitter.com→T4, news.ycombinator.com→T3, producthunt.com→T3, devpost.com→T3); else TLD rules:
   - T1 (score 4): `.edu`, `.gov`, `.org`, nature.com, science.org, cell.com, official docs
   - T2 (3): IEEE/ACM/Springer/Elsevier, arXiv, PubMed, DOI
   - T3 (2): `.com`/`.io`/`.dev`, Stack Overflow, GitHub, Medium, Substack, tech news
   - T4 (1): forums, social media, `.xyz`/`.club`/`.info`, personal sites
   - Blocked (0): SEO spam farms / content mills — **removed immediately** from the pipeline.
   (Verified identical in `config.md` §Domain Authority Tiers + `references/04-domain-authority.md`.)
2. **Content-similarity dedup** — `node 88-Labs/scripts/source-dedup.js`: Jaccard similarity on 3-char n-grams of combined title+snippet; `SIMILARITY_THRESHOLD = 0.75`; survivor = higher authorityScore, tie = longer combined text; emits `{sources, stats:{before, after, merged}}`. (Verified in `source-dedup.js` lines 21, 99-121.)
3. **Quality gate** — `qualityRatio = (T1_count + T2_count) / total_count`. If ratio < `QUALITY_GATE_THRESHOLD` (0.5): ONE refinement allowed (`QUALITY_GATE_REFINEMENT_MAX` = 1) — re-search appending `site:.edu OR site:.gov OR site:arxiv.org` + topic keywords, re-run Phase 1.5; if still failing, proceed with a warning. Phase 2 receives scores as **metadata only** — synthesis is NOT score-weighted.
4. **Per-iteration stats** — qualityRatio, tierBreakdown, dedupStats, qualityGate persisted to lab-notes, parsed by `update-loop-stats.js` into `loop-stats.js` `sourceQuality` (verified lines 242-296).

### 1.3 Completion signals (INDEX.md, config.md, SKILL.md)

| Signal | Threshold | Meaning |
|--------|-----------|---------|
| SATISFACTORY | 2 consecutive | research questions substantially answered |
| EXHAUSTED | 1 | all sources explored, no new ground |
| ABORT | 1 | investigation not viable (zero useful sources) |
| INCOMPLETE | — | continue to next iteration |

Quantitative stop rules in config.md: saturation ratio θ_d < 0.15 AND critical gaps θ_g = 0 for 2 consecutive → STOP; EXHAUSTED = 5+ iterations with θ_d < 0.05 × 3; ABORT = 2 iterations with zero useful sources. lab-notes.md shows the loop shape: `## Experiment:` boundary → per-iteration blocks (`**Completion Signal:**`, Search Queries, Search Results, Clusters Found, Evidence Summary) → `## Final Conclusion` STOP/CONTINUE + `<!-- status: -->`. Real example: Bitcoin Puzzle BIP32 Seed Recovery — Iter 1 INCOMPLETE → CONTINUE with listed gaps → Iter 2 SATISFACTORY → STOP.

### 1.4 Real quality data (verified in `88-Labs/loop-stats.js`)

- PASS example: qualityRatio 0.78, tier T1:4 / T2:8 / T3:6 / T4:0, dedup 38→18 (20 merged), gate PASSED.
- FAIL example: qualityRatio 0.25, tier T1:0 / T2:1 / T3:20 / T4:4, gate FAILED — investigation still completed, with caution.

## 2. What transfers to a single-artifact gate-3 pass (the LIGHT subset)

Gate 3 is one research leg inside one artifact session — no iteration loop, no dashboard, no context bridge. The portable core is **a 2-engine Phase 1 + Phase 1.5**, sized to a domain model:

| Mechanic | Ports to gate 3? | Gate-3 form |
|---|---|---|
| Multi-source search (websearch + academic) | YES | 2 engines: `websearch` (deep) + Exa academic. Targeted queries: `"{model} standard|specification|paper"`, `"{model} worked example"`, `"{model} parameters table"`. Cap ~6-8 search calls, ~10-20 raw sources |
| T1-T4 + Blocked tier scoring | YES | Manual scoring table with the override-first rule (arxiv/doi/pubmed→T2, github→T3). Blocked dropped. No script needed for ≤20 sources |
| Jaccard 3-gram dedup (0.75) | YES (optional script) | `88-Labs/scripts/source-dedup.js` is a self-contained CLI — reusable as-is on a JSON array. For ≤20 sources a manual rule (drop near-duplicates, keep highest tier) is equivalent |
| Quality gate (ratio ≥ 0.5) | YES, degraded | Compute (T1+T2)/total. PASS → high-confidence path. FAIL → one refinement attempt (site:.edu/.gov/arxiv), then proceed with confidence tagged med/low. Must NOT hard-block — gate 3 has no loop; it feeds the confidence notes + HITL at validate |
| Tier-scored source trace into output | YES | Source list + quality metrics land in the brief's domain note — the evidence base for 03's mandatory confidence notes |
| Completion signals (SATISFACTORY/EXHAUSTED/ABORT/INCOMPLETE) | NO | Single pass; no loop-termination semantics |
| Context bridge (lab-notes.md, Phase 0) | NO | No cross-iteration state in one artifact session |
| Persist/dashboard machinery (loop-stats.js, finalize-experiment.js, live-refresh.js, loop-tracker.html, recovery manifest, agentmemory save) | NO | The brief IS the output; no dashboard exists for artifacts |
| 6-engine search (parallel-search, agent-reach, last30day, platform-search) | NO | Overkill for one model lookup |
| Synthesis sub-task JSON schema / report sub-task pipeline | NO | Explain + validate steps already cover model statement and verification |
| Saturation/gap-convergence thresholds, token budgets, formal state machine | NO | Loop-termination + context-management machinery for multi-day investigations |

## 3. Proposed gate-3 integration

Insert a structured **research trace** into the existing research step of research → explain → validate (SKILL.md gate 3; ticket 03). It upgrades the current unstructured "source the authoritative model, never an LLM guess" into a 4-step mini-pass:

1. **Search (multi-source)**: websearch + Exa academic, targeted to the domain model — `"{model} standard|specification|paper"`, `"{model} worked example"`, `"{model} parameters table"`. Cap ~6-8 calls total.
2. **Score**: assign T1-T4 per source (override-first rule). Drop Blocked. Record tier per source in the brief.
3. **Dedup**: drop near-identical copies (Jaccard ≥ 0.75, or manual equivalent), keep highest tier — kills a "consensus" that is actually one source echoed across scraped blogs.
4. **Gate**: (T1+T2)/total ≥ 0.5 → proceed with high-confidence path. < 0.5 → one refinement attempt (`site:.edu OR site:.gov OR site:arxiv.org` + model name), then proceed with confidence tagged med/low and HITL escalation at validate: "model sourced only from T3/T4 — confirm the formula before build."

Placement: the trace is the INPUT to explain. The confidence notes (03 mandatory output) become evidence-based: high confidence requires ≥ 1 T1/T2 source backing the model AND a worked example reproducing a published/measured value.

**Stays manual** (per 03 — domain judgment, not search output): the worked example (load-bearing target number — but the target value should now come from a T1/T2 source), the assumptions list with error directions, the final confidence wording.

**What gate 3 adds**: a verifiable source trail behind every formula; evidence-based confidence; a HITL tripwire when the model can only be sourced from low-authority domains. Cost: ~10-15 min added to the research leg, ≤20 sources, no new infra — the only reusable script (`source-dedup.js`) already exists in the vault.

**Credibility/precision mechanism**: prevents LLM-guess formulas (03 check #1) by making the authoritative source explicit before explain; dedup removes echo-chamber "consensus"; gate-fail forces the user to approve a weakly-sourced model at validate instead of discovering drift at verify (ticket 05 cross-checks the running artifact against the brief's worked example).

## 4. Decision inputs for the adoption session

- **Port**: multi-source search (2 engines), T1-T4 tier scoring, dedup, single-pass quality gate, tier-tagged source trace in the brief's domain note.
- **Exclude**: iteration loop, completion signals, context bridge, dashboard/persist machinery, 6-engine search, synthesis/report sub-task JSON pipeline.
- **Open questions**: (a) reuse `88-Labs/scripts/source-dedup.js` directly (recommended — self-contained CLI) vs. encode a manual dedup rule in the skill; (b) whether the gate-3 quality gate hard-fails (recommend no — degrade to confidence tag + HITL escalation, since gate 3 has no loop to refine into).

## Source index

- `88-Labs/INDEX.md` — 7-phase loop diagram, source-quality summary, completion-signal table, output structure
- `88-Labs/config.md` — iteration params, engine configs, completion thresholds, token budgets, domain authority tiers, URL pattern overrides, quality-gate config, content-similarity config, state machine
- `88-Labs/CHANGELOG.md` — evolution v1.0.0→v4.2.0; v3.0.0 introduced Phase 1.5; v4.x added engines
- `88-Labs/lab-notes.md` — context bridge; loop shape + real INCOMPLETE→SATISFACTORY sequence
- `88-Labs/scripts/scaffold-experiment.js` — experiment scaffold + success criteria (≥10 sources, ≥3 clusters, ≥1 contradiction/gap)
- `88-Labs/scripts/source-dedup.js` — Jaccard 3-gram dedup CLI (threshold 0.75)
- `88-Labs/scripts/finalize-experiment.js` — loop-stats regeneration + sourceQuality preservation
- `88-Labs/scripts/update-loop-stats.js` — lab-notes→loop-stats parser (sourceQuality schema)
- `88-Labs/loop-stats.js` — real sourceQuality data (PASS 0.78 / FAIL 0.25)
- `.opencode/skills-archive/88-labs/SKILL.md` — loop instructions, phase summaries, error handling
- `.opencode/skills-archive/88-labs/references/01-phase-execution.md` — Phase 1.5 operative spec (scoring/dedup/gate steps)
- `.opencode/skills-archive/88-labs/references/04-domain-authority.md` — tier table + overrides + scoring procedure
- `10-Projects/11-Active/artifactory/.scratch/artifact-builder-flow/issues/03-domain-modeling-gate.md` — current gate-3 contract (triggered, research→explain→validate, worked example + assumptions + confidence, never in-UI)
- `.opencode/skills/artifact-builder/SKILL.md` — gate 3 section (fires only when brief has a domain model; HITL at validate)