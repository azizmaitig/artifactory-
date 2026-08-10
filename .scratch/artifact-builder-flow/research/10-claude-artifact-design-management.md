# 10 - How does Claude manage the design of their artifacts

**Status**: researched (2026-08-10)
**Agent**: librarian subagent (ticket 10)
**Scope**: how claude.ai's artifact system manages design, distilled into adoptable rules for gate 4 (currently = ADR-001 token block + 10 mined rules + per-brief palette freedom).

## Verdict (one paragraph)

Claude manages artifact design as a **three-layer stack with a fixed sequence**: (1) a hard system-level design system (tokens, ramps, typography, flatness) enforced by `visualize.md`; (2) a per-artifact-type template pack (artifact-design + artifact-{dashboard,report,explainer,data-table} + plan-artifact) that blesses a baseline look but explicitly says "the default styling is a starting point, not a house style"; (3) published aesthetic guidance (frontend-design skill, frontend_aesthetics prompt) that pushes per-brief distinctiveness and bans the AI-house-style. The design decision sequence is: **read request → calibrate treatment (utilitarian vs editorial) → honor what exists → ground in the subject → sketch plan (color 4-6 hex → type roles → layout → signature) → review plan against generic defaults and revise → build → (charts: form → color → validate → marks → interaction → a11y)**. Crucially, page-level palette comes FIRST while chart color comes LAST; and the anti-house-style is enforced by a *review-and-revise loop*, not by a rule. Most of this is beyond the 10 mined rules — the biggest gap is the **design-plan review loop, the signature element, treatment calibration, and the four-axe grading criteria**.

## Sources (all VERIFIED, fetched 2026-08-10)

| Source | URL | What it is |
|---|---|---|
| visualize.md (current) | https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/visualize.md | claude.ai injected fragment — the artifact/visual system prompt: tokens, 9 color ramps, typography, streaming, complexity budget, chart rules |
| artifact-design.md (current 2.1.211) | https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/Claude%20Code/bundled-skills/artifacts/artifact-design.md | Artifact skill pack — "Design guidance and fundamentals for Artifacts": process, fundamentals, editorial treatment |
| artifact-dashboard.md / artifact-report.md / artifact-explainer.md / artifact-data-table.md / plan-artifact.md | https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/Claude%20Code/bundled-skills/artifacts/ | Per-type artifact templates: slot-filling + "restyle on top" |
| dataviz/SKILL.md | https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/Claude%20Code/bundled-skills/dataviz/SKILL.md | Chart design method: form → color → validate → marks → interaction → a11y; runnable palette validator |
| frontend-design SKILL.md (official) | https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md | Anthropic's published design skill: process (brainstorm, explore, plan, critique, build, critique again), signature element |
| Anthropic blog "Improving frontend design through Skills" (2025-11-12) | https://claude.com/blog/improving-frontend-design-through-skills | Official: distributional convergence, the ~400 token frontend_aesthetics prompt |
| Anthropic engineering "Harness design for long-running application development" (2026-03-24) | https://www.anthropic.com/engineering/harness-design-long-running-apps | Official: 4 grading criteria, generator/evaluator separation |
| madewithclaude.com corpus | research/03-madewithclaude-corpus.md (+ extension below) | Community artifact corpus — how artifacts actually look |

## 1. How Claude manages artifact design (VERIFIED from primary sources)

### 1.1 Three-layer management stack

1. **System layer — `visualize.md`** fixes the non-negotiables: tokens via CSS variables, 9 color ramps with 7 stops each, Anthropic Sans with 2 weights, flat (no gradients/shadows/blur), dark mode mandatory, streaming-safe structure (`<style>` → content → `<script>`), complexity budget ("Box subtitles: ≤5 words", "Colors: ≤2 ramps per diagram", "Horizontal tier: ≤4 boxes"). This is the *token architecture* — what ADR-001 already copied.
2. **Template layer — artifact skill pack**: blessed per-type templates (dashboard = KPI tiles + chart + table; report = masthead + TOC + sections; explainer = steps; data-table = sortable grid; plan = "one blessed template so they read as a family"). Every template ships with **SLOT markers** and says the same thing: the template is mechanics + baseline, *"The default styling is a starting point, not a house style"* (artifact-dashboard.md) — restyle on top is the expected move.
3. **Aesthetic layer — published guidance**: the frontend-design skill (official) and the `frontend_aesthetics` ~400-token prompt (official blog) push deliberate per-brief choices and ban the AI cluster.

### 1.2 The design decision sequence (the ticket's core question)

VERIFIED from artifact-design.md + frontend-design SKILL.md + dataviz SKILL.md:

```
1. Read the request first — calibrate treatment, not whether to design
   (utilitarian vs editorial; "Most pages do not need a flashy, gigantic hero")
2. Honor what's already there — precedence: user's words > existing system > your choices
3. Ground it in the subject — one concrete subject, its audience, the page's single job;
   "The subject's own world... is where distinctive choices come from"
4. Sketch a short design plan BEFORE coding:
   a. Color: 4-6 named hex values
   b. Type: 2+ roles (display with restraint, body, utility for captions/data)
   c. Layout: 1-2 sentence concept
   d. SIGNATURE (2026 addition): "the single unique element this page will be remembered by"
5. Review the plan against the subject:
   "if any part of it reads like the generic default you would produce for any similar page,
   revise that part, and note what you changed and why" → only then build
6. Build, deriving every color/type decision from the plan
7. Charts/data-viz LAST — and inside charts, color comes LAST:
   form → color → VALIDATE → marks → interaction → a11y → render
```

**Key nuance — palette-first at page level, color-last at chart level.** The design plan starts with the palette (4-6 hex) because it anchors the page's identity; but within a chart, "Color comes LAST. Most bad charts pick colors first" (dataviz). Gate 4's current rule-10 sketch covers (a)-(c); it does NOT cover step 5 (review/revise loop) or step 4d (signature).

### 1.3 House style vs per-artifact expression

VERIFIED: the artifact system *wants* both simultaneously.
- House style = tokens + typography + flatness (visualize.md) + per-type templates (pack) — this is consistency.
- Per-artifact expression = the design plan + signature + "restyle on top" + the anti-AI-list.
- The mechanism that keeps expression from collapsing into house style is the **review-and-revise loop** (step 5) plus the refreshed AI-cluster list (artifact-design.md 2.1.211 adds: everything centered, `rounded-lg` everywhere, accent bar/rail on rounded cards).

INFERRED (not in any prompt): claude.ai does not run a separate "design manager" agent for inline artifacts; the sequence lives in one model pass with the injected system prompt + skill text. The generator/evaluator split is Anthropic's *harness research* (verified published) — whether the product uses it internally is not disclosed.

### 1.4 Design grading (VERIFIED from Anthropic engineering)

The harness blog publishes the grading criteria Anthropic used to make design "gradable":
- **Design quality** — "a coherent whole rather than a collection of parts" (colors, typography, layout, imagery combine into a distinct mood)
- **Originality** — custom decisions vs "template layouts, library defaults, and AI-generated patterns"
- **Craft** — typography hierarchy, spacing consistency, color harmony, contrast ratios
- **Functionality** — usability independent of aesthetics

Weighted design quality + originality over craft + functionality ("Claude already scored well on craft and functionality by default"). And: "agents reliably skew positive when grading their own work. Separating the agent doing the work from the agent judging it is a strong lever." — This is the strongest single finding for gate 4: define **pass = the four axes**, and keep the grader separate from the builder.

## 2. Corpus extension (design-management angle)

Extended research/03-madewithclaude-corpus.md with a design-management section (appended): corpus artifacts sequence palette-first and subject-grounded (space = black + thrust-orange; playground = sky-blue + primaries), layout = canvas-centric + HUD readout layer, mono type enters only for data, charts appear only where data exists (SpaceX renders numbers as text readouts, not a chart — the dataviz "hero number" path), single semantic accent per artifact.

## 3. What gate 4 must adopt — candidates (why: credibility/precision/taste; coverage vs 10 mined rules)

| # | Candidate practice | Source | WHY | Covered by 10 mined rules? |
|---|---|---|---|---|
| 1 | **Treatment calibration** — read the request, pick utilitarian vs editorial intensity ("a plan, a memo, a demo" gets craft but no flashy hero) | artifact-design.md | precision (right-sized design per artifact class) | NO |
| 2 | **Subject grounding** — pin subject/audience/single job; derive choices from the subject's world | artifact-design.md + frontend-design | taste + credibility (distinctiveness from the brief, not the template) | NO (rule 10's sketch is generic) |
| 3 | **Precedence chain** — brief's words > existing tokens > model's choices | artifact-design.md | credibility (respect the brief) | partial (ADR-001 allows palette freedom, but no explicit precedence) |
| 4 | **Design-plan review-and-revise loop** — if plan reads like the generic default, revise and note what changed | artifact-design.md + frontend-design | taste (THE anti-house-style mechanism) | NO (rule 10 says sketch; nothing reviews) |
| 5 | **Signature element** — 4th plan axis: the one memorable thing per artifact | frontend-design SKILL.md | taste (deliberate risk, anti-convergence) | NO (rule 10 = color/type/layout only) |
| 6 | **Spend boldness in one place** — one accent/signature, everything else quiet | artifact-design.md + frontend-design | taste | NO |
| 7 | **UI-vs-document shift** — for sims/tools: summary before detail, state in form as well as number, semantic color separate from accent, "what's interactive should look interactive" | artifact-design.md | precision (festival sims are UI-class, not documents) | NO |
| 8 | **Neutrals chosen, not defaulted** — hue-bias the neutral toward the accent | artifact-design.md | taste | NO |
| 9 | **Theme commitment as a choice** — dark-only is legitimate when deliberate ("make it a choice, not an omission") | artifact-design.md | precision + credibility (legitimizes ADR-001's dark-only) | partial (rule 4 mandates dark; nothing about single-theme deliberation) |
| 10 | **Chart color validation + a11y + interaction as procedure** — runnable validator, text wears text tokens never series color, color follows entity never rank, status colors reserved w/ icon+label, hover by default | dataviz SKILL.md | precision + credibility | partial (rule 8 has form-first/legend/rounding; NOT validator, text-tokens, entity-follow, a11y) |
| 11 | **No invented data / no fabricated time axes / no placeholder numbers** | artifact-dashboard.md + dataviz | credibility | partial (01 noted it as secondary; not in top-10) |
| 12 | **Four grading axes as gate pass-criteria** (quality/originality/craft/functionality, weighted quality+originality) | Anthropic harness blog | credibility (objective-ish gate; "does it follow principles" beats "is it beautiful") | NO |
| 13 | **Separate grader from builder** (self-leniency) | Anthropic harness blog | credibility (gate 4 = the separate reviewer) | NO |
| 14 | **Refreshed AI-cluster ban list** (adds centered-everything, rounded-lg-everywhere, accent-bar-on-cards) | artifact-design.md 2.1.211 | taste | partial (rule 10 has the older list) |
| 15 | **Per-type template family** — token block variants per artifact class (sim/tool vs document) so a family reads coherently | artifact pack (plan-artifact "one blessed template... read as a family") | credibility + precision | NO |

## 4. Adopt into gate 4 — prioritized list

### MUST
- **M1 — Design-plan review-and-revise loop (candidate 4).** After the gate's plan step, run the explicit check: "if any part of the plan reads like the generic default you would produce for any similar page, revise that part and note what you changed and why." *Why: taste* — this is the actual mechanism behind mined rule 10; the rule without the loop is inert.
- **M2 — Subject grounding + precedence (candidates 2+3).** Gate 4 prompt must pin subject/audience/single job and state precedence: creative brief > ADR-001 token block > model choices. *Why: taste + credibility*.
- **M3 — Signature element (candidate 5).** Add a 4th axis to the design plan: one memorable element per artifact, chosen deliberately. *Why: taste* — it's the escape hatch from ADR-001's "may be reshaped" house-style risk.
- **M4 — Chart color discipline (candidate 10, chart subset).** In the chart path: text wears text tokens, never series color; color follows the entity, never its rank; status colors reserved with icon+label; run the palette through the validated ramp stops. *Why: precision + credibility*.

### SHOULD
- **S1 — Treatment calibration (candidate 1).** Gate 4 decides utilitarian vs editorial before applying tokens; docs/reports get the same craft but no flashy hero. *Why: precision*.
- **S2 — Four grading axes as the gate's pass-criteria (candidate 12), grader separated from builder (13).** Replace/augment "does it look right" with the four axes, weighted quality+originality; the gate evaluates, the builder doesn't self-judge. *Why: credibility* — matches the flow's existing "plan, don't do" stance.
- **S3 — UI-class rules for sim artifacts (candidate 7).** When the artifact is interactive (festival-noise-sim class): summary before detail, encode state in form + number, semantic color separate from accent, interactive-looks-interactive. *Why: precision*.
- **S4 — No invented data/time axes (candidate 11).** Hard rule: never fabricate a trend/time axis; replace every placeholder; say what was cut. *Why: credibility*.
- **S5 — Refreshed AI-cluster ban list (candidate 14).** Update rule 10's examples with the 2.1.211 additions (centered-everything, rounded-lg-everywhere, accent-bar/rail on rounded cards). *Why: taste*.
- **S6 — Theme commitment as a choice (candidate 9).** Keep ADR-001's dark-only, but state it as a deliberate single-theme commitment (one visual world), not an omission; keep the "if background were near-black, would every text still be readable" mental test. *Why: precision + credibility*.

### COULD
- **C1 — Per-type template family (candidate 15).** Later: blessed token-block variants per artifact class (sim/tool vs report/explainer) so the flow's output reads as a family — echoes the plan-artifact "one blessed template" pattern. *Why: credibility + precision*.
- **C2 — Runnable palette validation (candidate 10, validator subset).** Adopt a small ΔE/contrast check (dataviz runs `validate_palette.js`; a scripted check in the flow beats eyeballing). *Why: precision*.
- **C3 — ~400 token frontend_aesthetics prompt as optional add-on** for briefs that want the "distinctive frontend" treatment (motion axis, backgrounds axis) where it doesn't fight ADR-001's flat rule. *Why: taste*.

## Notable gaps / no-fabrication notes

- No leaked "design-manager" or "design-taster" prompt beyond visualize.md + the artifact pack; the frontend_aesthetics prompt is official-published, not leaked. No claim is made about claude.ai internals beyond what the prompts say (marked INFERRED where relevant).
- The festival look itself (near-black + single accent) is on Claude's own AI-cluster list ("near-black with a lone acid-green or vermilion pop") — the leak says such looks are "legitimate for some briefs, but defaults rather than choices." That is a direct argument for M3 (signature) + S5 (refreshed ban list): keep festival as the default template but force per-brief differentiation so it never reads as the generic near-black accent look.

## Files touched

- research/03-madewithclaude-corpus.md — appended "Design-management angle (extended for ticket 10)" section
- This report (research/10-claude-artifact-design-management.md)
- issues/10-claude-artifact-design-management.md — Comments pointer appended (this ticket stays open; adoption is a separate session)
