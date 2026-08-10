# 13b - External repo audit: gate relevance of 7 targets

**Status**: draft (mid-grilling research redirect on ticket 13)
**Date**: 2026-08-10
**Agent**: 3× librarian subagents (parallel), verified against live repo content + serpapi docs
**Scope**: user asked, "does any of those repos relate to any of my gates? I want precise research" — 7 targets audited against the artifact-builder gates, focused on gate 3's 4-step research trace (2-engine search → T1-T4 scoring → Jaccard 0.75 dedup → degraded quality gate).

## Verdict table

| Target | Health | Gate 3 (research trace) | Gates 2 (format) / 3 (NL→model) | Gate 6 (verify) | Gates 4-5 (design/implement) | Verdict |
|---|---|---|---|---|---|---|
| **wanshuiyin/Auto-claude-code-research-in-sleep (ARIS)** | ⭐14.4k, MIT, commits 2026-08-09 | **STRONG — closest existing impl of the proposed trace** | Medium (strict-schema thinking) | Medium (render-html fidelity gate, posterly measured-layout checks) | High (markdown SKILL.md + typed gates + helper chain = same skill architecture) | **ADOPT selectively (pinned/vendored): degraded-gate semantics, dedup key chains, source-priority table, verify_papers.py 3-layer/4-state, iteration/completion doctrine** |
| **earthtojake/text-to-cad** | ⭐13.2k, MIT, pushed 2026-08-10 | Process template (cad-brief validation targets) | **STRONG — cad-brief NL→model scaffold** | **STRONG — deterministic checks + mandatory snapshot + repair loop** | — | **ADOPT as process template (zero code): brief → validate → snapshot → repair** |
| **microsoft/SkillOpt** | (prior research/02: Tier 1) | — | — | Skill-level validation gates | Skill-engineering (trajectory → skills) | Already vetted in research/02 — relevant to the artifact-builder SKILL itself, not gate 3; NO new action |
| **xyflow/xyflow** | ⭐(active), MIT, v12.11.2, commit 2026-08-03 | — | — | — | **Conditional gate-5 whitelist add** (node-graph artifacts; 58.8KB gz + React; no auto-layout built-in) | Rule out as pipeline tooling; worktree: "inside artifacts, not pipeline" (also research/02 Tier 2) |
| **vectorize-io/hindsight** | ⭐19.4k, MIT, push 2026-08-09 | **Med-Strong reference: TEMPR retrieval (4-strategy + RRF + cross-encoder rerank + budgeted trim)** | Medium (structured_output.py strict-schema + fail-loud 422) | None (retrieval relevance ≠ output verification) | — | Reference architecture for the search/fusion leg; **NOT a dependency** (pg+pgvector+LLM API key) |
| **serpapi.com/google-scholar-api** | Paid SaaS (Free 250/mo → $75 Dev 5k/mo) | **Weak-conditional**: scholarly metadata (publication_info, cited_by, as_ylo/as_rr) is ideal T1-T4 input, but **redundant with vault's free paper-lookup stack** (OpenAlex/Crossref/S2) | — | — | — | **RULE OUT on cost/redundancy**; optional HITL fallback only |
| **shatianming5/PaperFarm** | ⭐422, MIT, main dormant since 2026-03-20 (alpha 0.2.0b1) | Weak (optional web_search only; no engines/scoring/dedup) — but Critic `strong/weak/invalid/needs_repro` evidence taxonomy is a mature confidence-tag vocabulary | — | Medium (commit-per-experiment + rollback + smoke gate) | Orchestration reference (HITL checkpoints) | **Rule out for gate 3; optionally mine critic state machine + phase gates** |

## Transferable mechanics (verified, with source citations)

### From ARIS (the load-bearing adoptions for gate 3)
1. **Degraded quality gate, exact semantics**: `verify_papers.py` — 3-layer fallback verification (arXiv batch ≤40 IDs → CrossRef DOI → Semantic Scholar fuzzy title @0.6 overlap), per-paper 4-state status (`verified/unverified/verify_pending/error`), top-level `PASS/WARN/BLOCKED/ERROR`, hallucination threshold 0.2 → WARN. **Retention-over-silent-removal**: unverified papers stay in output tagged `[UNVERIFIED]`; missing helper degrades to tag-all instead of dropping (L556-579, L591-599). This is literally the recommended gate-3 answer: WARN, not BLOCK; confidence tag; HITL at validate.
2. **Dedup precedence chains**: "arXiv ID → DOI → normalized title" (S2/DeepXiv/Gemini/OpenAlex); "URL → normalized title" (Exa); venue metadata wins over preprint; S2 citation counts preferred, never Gemini's (`research-lit/SKILL.md` L252-455). Note: ARIS dedup is exact-key — the proposed Jaccard 0.75 is strictly stronger (kills scraped-blog echo).
3. **Source priority table**: 9-level ordered source list (Zotero→Obsidian→local→WebSearch→S2→DeepXiv→Exa→Gemini→OpenAlex), opt-ins excluded from default `all`; tiers *sources*, not per-result (the T1-T4 delta to note on adoption).
4. **Iteration/completion doctrine**: `iteration_log.py` — 2 stale rounds → structural change, 4 → human; `watchdog.py` — STALE, never acquit; `acceptance-gate.md` — "a loop can DRIVE, it cannot ACQUIT"; deterministic verifiers count as acquittal-capable; cross-model review invariant (executor never judges own output).
5. **Skill architecture**: plain-markdown SKILL.md + canonical helper-resolution chain (`.aris/tools → tools → $ARIS_REPO/tools → ~/.aris/repo`) + output-versioning/manifest protocols — same shape as the 8-gate skill pipeline; `render-html` produces single-file HTML with a fidelity gate (sibling of gate 7).

### From text-to-cad (gates 2/3/6 process discipline)
1. **cad-brief**: every input modality funnels into one prose brief with named parameters + explicit **validation targets** (bbox, solid count, labels, spec-driven measurements) — the "extract what must be true, then check it" pattern for the domain-model constraint doc. Conflict rule: flag conflicts, don't silently choose.
2. **Deterministic verification**: baseline facts/planes/positioning on every artifact, spec-driven measure/align/frame/diff checks; "Report only checks that actually ran."
3. **Mandatory snapshot review**: deterministic pass ≠ done; every visual finding must become a deterministic check before it's a claim.
4. **Repair loop**: failed check → smallest responsible source change → regenerate → rerun only that check.

### From hindsight (retrieval-fusion reference, for the search/fusion leg only)
- TEMPR: 4 parallel retrieval strategies (semantic vector, BM25 keyword, graph, temporal) → merge → reciprocal rank fusion → cross-encoder rerank → token-budget trim. `structured_output.py`: strict-schema generation + fail-loud boundary validation (422).
- Cost: PostgreSQL+pgvector, LLM API key — service addition, not a gate upgrade. Adopt as *studied reference* for fusion weights, not code.

### Rejected / already-vetted
- **serpapi Scholar**: ideal T1-T4 metadata inputs, but the vault's paper-lookup skill already hits the same academic sources free (OpenAlex/Crossref/S2 with citation counts + year filters). Marginal value = Google Scholar's non-DOI coverage + `author:`/`source:` syntax. Not worth the billing surface.
- **SkillOpt / xyflow**: prior verdicts in research/02 stand (Tier 1 skill-validation / Tier 2 render reference). xyflow re-verified today: MIT, React>=17, 184KB min / 58.8KB gz, no built-in layout — conditional gate-5 whitelist for node-graph artifacts only.
- **PaperFarm**: dormant main, alpha, no search machinery — critic evidence states only.

## Recommendation to ticket 13

The gate-3 trace wording should adopt: ARIS's WARN-not-BLOCK + `[UNVERIFIED]`-tagged retention + `verify_pending`-excluded-from-rate semantics (fork 2, confirmed by a production implementation); dedup keeps Jaccard 0.75 (strictly stronger than ARIS exact-key chains); source tier table stays T1-T4 (ARIS tiers sources — T1-T4 per-result is our delta); iteration/completion layer is out (gate 3 is single-pass; no loop — ARIS's 2/4-round doctrine belongs to fog, not this ticket). External repos are references + optional scaffolds, never dependencies.