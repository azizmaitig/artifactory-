# 19 — Artifact corpus and regression standard

Type: grilling
Status: resolved
Blocked by:

## Question

How is "Claude-quality" measured over time — what is the artifact corpus / regression standard? This also governs theme-library curation: what earns a NEW theme preset (cf. polished-design "presets must earn their place through two real projects" — the library currently ships 4 starter presets from ticket 14).

Forks to grill (one at a time):

- Corpus composition: which artifacts form the quality bar set (festival-noise-sim? resonance-lab? orbit-sim? nuit-du-village?) and what axes are measured (render-verified, design-critic scores, pedagogy spine compliance)?
- Regression mechanism: when does an artifact/record get re-measured (on skill change? on new artifact?) and who scores it (fresh model pass per ticket 12)?
- Theme preset promotion path: the criteria + review for promoting a per-brief palette to a library preset; vault of rejected looks?

Resolution: the corpus standard section, either in SKILL.md or its own doc, plus the preset-promotion rule.

## Answer

RESOLVED 2026-08-10 (grilling, user-locked — all three forks):

- **Corpus composition**: corpus = every shipped, verified artifact in `exemples/` (built HTML + record). **No official theme — every artifact is unique; the design system is dynamic.** The bar is a moving exemplar, not a fixed look; current best = **six-degrees** (user: closest to Claude outputs — destination bar moves from festival-noise-sim). Axes: (1) it works (gate-6 evidence: render/console/pedagogy/worked-example), (2) it looks unique (anti-slop applies to the corpus; verbatim reuse is the failure mode), (3) your verdict (gate-8 interrogation).
- **Regression mechanism**: post-build interrogation (HITL) — after the artifact is built and opened for the user, the AI asks 3 terse questions one at a time (explained? unique look? vs best — better/same/worse + what's missing). Verdict recorded in `ARTIFACT-RECORD.md`; better-than-best → new exemplar (map destination updates). No automatic re-measurement of old artifacts on skill changes — on-demand retro-runs only (ticket-18 pattern); pre-rework artifacts tagged "unmeasured on this axis", not excluded.
- **Preset promotion**: two-real-projects rule — a per-brief look earns a library slot in `docs/design/themes.md` only when a second real artifact deliberately builds on it AND ships verified (lineage recorded); until then it stays per-brief. Rejected looks stay documented in their artifact's record — **the records are the vault of rejected looks**.

SHIPPED: `.opencode/skills/artifact-builder/SKILL.md` — gate 8 gains the HITL interrogation + verdict in the record list; new locked **"Corpus & regression standard"** section (corpus, 3 axes, interrogation, re-measurement, two-real-projects promotion); quality checklist item added. Map destination updated (exemplar six-degrees).