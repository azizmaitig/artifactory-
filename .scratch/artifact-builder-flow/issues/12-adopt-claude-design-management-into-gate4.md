# 12 - Adopt Claude design-management into gate 4 (SKILL.md design gate)

Type: grilling
Status: resolved
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

- **Q1 (A — locked)** — ADR-001 gets revised: token block = baseline, not stamped default. M3 (signature element) = hard requirement for every artifact, included in the design plan (4th axis), verified in the review-vs-generic pass. Rationale: festival look is on Claude's AI-cluster defaults list; adopting the review loop without the signature requirement would ship the default we set out to avoid.
- **Q2 (reshaped — locked via user directive)** — Gate 4 drops the single hardcoded design element entirely: stamped festival token block → **theme library** (festival = one-of-N presets, selected per-brief from the subject; vague briefs get a direction step). Constraint-document-first (commit tokens + tone + one signature idea before markup). Anti-slop = ban list of failure modes, not one allowed look. Research: `research/12b-bottleneck-of-artifact-design.md` (+ Claude Design product skills scan: create-design-system "derive, never invent", options.md variance mechanism, make-tweakable.md).
- **Q3 (A — locked)** — Gate 6 gains a **second-pass design critic**: after the Playwright gate passes, a fresh model pass grades the RENDERED screenshot on the four axes (quality/originality/craft/functionality, weighted quality+originality). FAIL on low quality/originality → iterate. Axes recorded in the artifact record. Rationale: Anthropic harness research (self-grading leniency) + design-artifact-loop's separate vision critic over rendered PNG; same-pass self-grade rejected as weakest form.
- **Q4 (A — locked)** — Four grading axes confirmed: quality / originality / craft / functionality, **weighted quality+originality (pass/fail decided by those two only)** — Anthropic's exact rubric ("models default-pass craft+functionality"). Fail = reads generic or incoherent → iterate. Gate 6 Playwright already owns functionality; critic owns quality/originality.

## Answer

**Directed by the user (2026-08-10):** *"I don't want a single hardcoded designing element. Websearch + git search this bottleneck of artifact designing."* The gate-4 decision pivoted from "which of ticket 10's items to adopt" to "restructure gate 4 around no-hardcoded-element." Evidence: `research/12b-bottleneck-of-artifact-design.md` (web+GitHub; 7 kits deep-read; Claude Design product skills scan of asgeirtj/system_prompts_leaks: create-design-system "derive never invent", options.md, make-tweakable.md) + `research/10-claude-artifact-design-management.md`.

**Bottleneck finding (one line):** artifact design fails by generic-default collapse (no constraints → aggregate trained look), token-pressure/cognitive overload (design+implementation in one pass), silence=defaults, and self-grading leniency — and the ecosystem answer is multi-theme libraries + constraint-doc-first + a grader separated from the builder (Claude's own pack: "the default styling is a starting point, not a house style").

### Decisions (Q1–Q4, all locked)

| # | Decision | Verdict |
|---|----------|---------|
| Q1 | ADR-001 + signature | ADR-001 token block demoted: **baseline preset, not stamped default**. Signature (M3) = per-brief design-plan axis, **never a fixed element** (later superseded by the redirect: no single hardcoded element at all) |
| Q2 | Gate-4 shape | Theme library (festival = one-of-N presets; vague brief → 3 directions), constraint-doc-first, anti-slop ban list of failure modes (not one allowed look), subject-grounding + precedence |
| Q3 | Grader separation | **Second-pass design critic at gate 6** (fresh model pass over the rendered screenshot) — not same-pass self-grade, not deterministic-only |
| Q4 | Grading rubric | 4 axes, **quality + originality decide pass/fail**; craft + functionality inform (Anthropic's exact rubric) |

### Adopt / defer / reject table

| # | Item | Verdict | Reason |
|---|------|---------|--------|
| M1 | Design-plan review-and-revise loop | ADOPT | The anti-house-style mechanism; sketch without the loop is inert |
| M2 | Subject grounding + precedence | ADOPT | brief > theme preset > model choices; "derive, never invent" |
| M3 | Signature idea (plan axis) | ADOPT (reframed) | Per-brief, chosen in the plan, never a fixed element; verified in review loop |
| M4 | Chart color discipline | ADOPT | text-tokens-not-series-color; color follows entity never rank; status colors w/ icon+label |
| S1 | Treatment calibration | ADOPT | utilitarian vs editorial decided before theme; docs get craft, no flashy hero |
| S2 | Four grading axes | ADOPT (Q3+Q4) | second-pass critic at gate 6, weighted quality+originality |
| S3 | UI-class sim rules | ADOPT | summary-before-detail; state in form+number; semantic≠accent; interactive-looks-interactive |
| S4 | No invented data/time axes | ADOPT | never fabricate; replace placeholders; say what was cut |
| S5 | Refreshed AI-cluster ban list | ADOPT | + centered-everything, rounded-lg-everywhere, accent-bar-on-cards, #0E0E10+one-accent default → named failure modes, not the look |
| S6 | Theme commitment as a choice | ADOPT (reframed) | dark = one of N deliberate presets + readability test, not "dark-only by rule" |
| C1 | Per-type template family | DEFER | direction-based library chosen per brief; class families wait for corpus standard |
| C2 | Runnable palette validation | DEFER | critic + eyeball cover v1; scripted ΔE check later |
| C3 | ~400-token aesthetics prompt | REJECT | M1+M3+theme library already deliver distinctiveness; second taste authority fights the tokens |

### Adopted gate-4 text (deliverable; edit = ticket 14)

**Gate 4 — Design:** No HITL during design; taste is a **system, not a single element**. Constraint-document-first: commit the plan BEFORE coding. **1. Pick the direction** — never default unasked: one preset from the theme library (`10-Projects/11-Active/artifactory/docs/design/themes.md` — festival-dark, paper-editorial, terminal, bold-signal…), or 3 directions for a vague brief (conservative / bold / subject-derived) → pick strongest. Derive from the subject's world: **brief > theme preset > model choices**; never invent a look the brief didn't ask for. Treatment calibration: utilitarian (sim/tool → craft, no flashy hero) vs editorial (report/explainer → stronger typographic voice). **2. Sketch the design plan**: color 4–6 hex from the preset's ramp tuned to the subject (neutral hue-biased toward accent); type ≥2 roles (display with restraint, body, mono utility for readouts); layout 1–2 sentence concept; **signature** — the one memorable per-brief element (custom glyph, unexpected layout accent, hand-drawn chart style), never fixed. **3. Review-and-revise loop** — if any part reads like the generic default for any similar page (or a preset untouched), revise it and note what changed and why; only then build. **Theme as a choice**: dark stays legitimate when chosen — keep the test "if the background were near-black, would every text still be readable?" **Charts by procedure** — form first, color last; text wears text tokens never series color; color follows entity never rank; status colors reserved w/ icon+label; legend for ≥2 series; round every displayed number; colorblind-safe. **UI-class rules** (interactive/sim): summary before detail · state in form + number · semantic color separate from accent · interactive looks interactive. **Anti-slop — ban list of failure modes, not an allowed look**: everything centered · rounded-lg everywhere · accent bar/rail on cards · cream+serif+terracotta · near-black + lone accent as an undifferentiated default · purple gradient hero · Inter/Space Grotesk default · emoji markers · "minimal dark: #0E0E10 end-to-end, one accent, sparse stat cards" · no invented data/time axes (replace every placeholder, say what was cut).

**Gate 6 delta — Design critic (second pass):** after Playwright passes, a **fresh model pass** grades the rendered screenshot: **quality + originality decide PASS/FAIL**; craft + functionality inform only. FAIL = coherent-but-generic or original-but-messy → fix, re-run; HITL only if the direction itself is ambiguous. Record the four scores in the artifact record.

**Follow-up:** SKILL.md gate-4 rewrite + gate-6 critic + ADR-001 revision + `docs/design/themes.md` creation → ticket 14 (Blocked by: 12).