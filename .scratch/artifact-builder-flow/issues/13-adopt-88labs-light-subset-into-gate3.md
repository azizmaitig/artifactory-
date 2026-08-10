# 13 - Adopt 88-Labs light-subset into gate 3 (SKILL.md domain-model research leg)

Type: grilling
Status: resolved
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

- 2026-08-10 — fork 1(a) LOCKED: **A** — reuse `88-Labs/scripts/source-dedup.js`; manual dedup rule stays as fallback line in SKILL.md (script unavailable, e.g. Termux). Redirect mid-grill: user requested precise research on 7 external repos (PaperFarm, SkillOpt, text-to-cad, Auto-claude-code-research-in-sleep, xyflow, hindsight, serpapi google-scholar) against the gates. Pending → fork 2.
- 2026-08-10 — repo audit DONE: `research/13b-external-repo-audit.md`. Verdicts: ARIS = selective adopt (degraded-gate semantics, dedup chains, source-priority table, verify_papers.py, iteration/completion doctrine); text-to-cad = process template for gates 2/3/6 (brief→validate→snapshot→repair); hindsight = retrieval-fusion reference only; SkillOpt + xyflow = prior research/02 verdicts stand; serpapi Scholar = ruled out (redundant with vault paper-lookup); PaperFarm = ruled out for gate 3 (critic states only).
- 2026-08-10 — LOCKED: repo audit folds INTO the gate-3 text explicitly (ARIS degraded-gate retention rule `[UNVERIFIED]`-tag-and-keep, verify_papers.py 3-layer/4-state semantics, dedup precedence chains; text-to-cad "report only checks that actually ran" + validation-targets discipline). Audit doc referenced from gate-3 text.
- 2026-08-10 — fork 2 LOCKED: **degrades** — quality-gate failure → one refinement (site:.edu/.gov/arxiv), then confidence tagged med/low + HITL escalation at validate. **No hard-block.** (research/11 recommend + ARIS ships exactly this.)
- 2026-08-10 — fork 3 LOCKED: **B tiered by stakes** — full 4-step trace for high-stakes models (parameters/formulas/published values); light path (single websearch + quick tier judgment, no dedup script) for simple models; degraded-gate tripwire both paths. Redirect: user proposes running an experiment (with an audited repo) verifying results by published values/deductions → an experiment/completion loop of gates. Broader than ticket 13 → holding for user decision (pilot vs chart new ticket).
- 2026-08-10 — redirect LOCKED (A now / B next / C option): **A** = pilot now, off-map: run the 4-step trace on a high-stakes brief (festival noise model) with websearch deep + Exa + `source-dedup.js`, verify against a published value → evidence feeds gate-3 text. **B** = next ticket 16 (adopt experiment/completion loop into gate 3, ARIS 2/4-round doctrine), blocked by 13. **C** = map fog: loop as per-artifact design-time option when an artifact needs published-value verification.
- 2026-08-10 — fork 4 LOCKED: **B — trimmed artifact-domain tier table** (same T1–T4 + Blocked structure as 88-Labs, but sources scored for the artifact domain: ISO/ANSI standards + physics/standards docs highest, GitHub mid, blogs/social low), **inline in SKILL.md** (gate 3 self-contained, no cross-repo coupling to 88-Labs config). All 4 forks locked. → PILOT: festival noise model verified against published ISO 9613 values.
- 2026-08-10 — PILOT DONE: `research/13c-pilot-festival-noise-trace.md`. Trace ran end-to-end on the festival noise model: 16 sources → dedup 15 (source-dedup.js validated live) → gate ratio 0.53 PASS → verification: spreading ✅, Maekawa barrier ✅ (cap 24 vs ISO 20 = tagged assumption), **air absorption ❌ 10× over-attenuation — ISO 9613-1 dB/km coefficients applied per 100 m (unit mismatch bug in the reference artifact)**. Trace caught a real model bug: credibility mechanism operational.

## Answer

All 4 forks + redirect locked (see Comments): (1a) **A** reuse `source-dedup.js` (manual fallback line in SKILL.md); (2) **degrade, no hard-block** (one refinement → confidence med/low + HITL at validate; unverified sources stay tagged, not dropped); (3) **B tiered by stakes** (full 4-step trace for high-stakes models, light path for simple); (4) **trimmed artifact-domain tier table, inline in SKILL.md**. Repo audit (`research/13b`) folds into the gate-3 text (ARIS retention rule + verify_papers semantics, text-to-cad check discipline). Pilot (`research/13c`) validated the trace end-to-end and caught a real 10× unit bug in the festival reference model — evidence-based confidence works.

**Adopted gate-3 research text:**

> **Research (4-step trace, tiered by stakes).** High-stakes models (parameters/formulas/published values): (1) **Search** — 2 engines: `websearch` deep + Exa academic; targeted queries `"{model} standard|specification|paper"`, `"{model} worked example"`, `"{model} parameters table"`; cap ~6-8 calls, ~10-20 raw sources. (2) **Score** — trimmed artifact-domain tier table (inline): T1 standards/ISO/ANSI/official specs, T2 peer-reviewed/arxiv/DOI/pubmed/authoritative technical, T3 technical web/GitHub/professional tools, T4 forums/social/upload copies; Blocked (SEO/content mills) dropped; override-first. (3) **Dedup** — Jaccard ≥0.75 via `88-Labs/scripts/source-dedup.js` (manual fallback: drop near-duplicates, keep highest tier, when the script is unavailable). (4) **Gate** — (T1+T2)/total ≥0.5 → high-confidence path; <0.5 → one refinement (`site:.edu OR site:.gov OR site:arxiv.org` + model name), then confidence **med/low + HITL escalation at validate** — never hard-block; unverified low-tier sources stay tagged, not silently dropped. Simple models: light path = single targeted search + quick tier judgment, same tripwire.
> **Confidence becomes evidence-based:** high = ≥1 T1/T2 source backing the model **AND** a worked example reproducing a published/measured value; med/low = low-tier sources only → validate tripwire: "model sourced only from T3/T4 — confirm the formula before build."
> **Domain notes:** source list + tiers + quality metrics land in the brief's domain note; worked-example target value must come from a T1/T2 source; report only checks that actually ran. (References: research/11, research/13b §from ARIS, research/13c pilot.)

Follow-ups graduated: **ticket 15** (SKILL.md gate-3 edit — task), **ticket 16** (experiment/completion loop into gate 3 — grilling, per redirect "B next").