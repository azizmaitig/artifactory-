# ADR-001: Festival design language — baseline preset (rev. 2026-08-10)

## Status

**Revised 2026-08-10** — original "default artifact template" superseded: festival is now **one preset among N** in the theme library (`10-Projects/11-Active/artifactory/docs/design/themes.md`), a baseline not a house style. Original decision text retained below for history.

## Device support baseline (2026-08-12 — pwa-gallery ticket 05, applies to ALL presets)

Phone support is a **platform contract, not taste** — the PWA envelope (04/06/07) ships artifacts to phones, so every artifact follows this baseline regardless of preset. Locked by grill 2026-08-12; enforced in gate 4 (plan) + gate 5 (impl) + gate 6 (verify, check 6).

1. **Viewport & safe areas.** `viewport` meta includes `viewport-fit=cover`. Any fixed/absolute bottom UI (readout strips, sticky controls) pads with `env(safe-area-inset-bottom)` so the standalone-iOS home indicator never overlaps. No `user-scalable=no` (a11y anti-pattern; ignored since iOS 10). Interactive text elements ≥16px (`font-size`) — kills iOS focus-zoom.
2. **Tap targets & no-hover.** Interactive targets ≥44px preferred (Apple HIG), **40px hard floor** (dense slider tracks), ≥8px gap between adjacent targets. Every interactive element must be operable without hover — `:active` + `:focus-visible` states required; `@media (prefers-coarse)` may enlarge but never gates function. No hover-only affordances (touch has no hover).
3. **Layout collapse.** Grids collapse to single column ≤640px; ≥960px may use 2 columns. Recharts containers get explicit `min-height` (220px single, 300px multi-panel) so `ResponsiveContainer` never collapses to 0. Readout strips/control groups wrap (`flex-wrap`) rather than shrink-fight. **Horizontal overflow is a hard FAIL** — `document.scrollWidth <= clientWidth` at 375px.
4. **Phone perf.** Sim/animation loops cap at 60fps and pause when `document.hidden`; no per-tick layout thrash (batch DOM writes); animations `transform`/`opacity` only (already gate 4). Gate 6 verify adds a **throttled mobile pass**: Playwright `CPU 4x` at 375×667 — render + interaction smoke must pass under throttle.

Cross-references: 06 (envelope prototype — first real-phone validation), 08 (verification gate reuses checks 1/2/4 as the static mobile leg).

## Revision (2026-08-10) — why the demotion

Gate 4 was restructured by user directive (ticket 12): **no single hardcoded design element**. The festival token block is demoted from "the default template, stamped into every artifact" to a baseline preset, because:

1. **The festival look is itself on Claude's AI-cluster list.** Near-black `#0A0C0E` + single accent is a trained aggregate default ("minimal dark: #0E0E10 end-to-end, one accent, sparse stat cards" — open-design forbids it verbatim; research/12b). Stamping it as the default ships exactly the generic look the flow exists to avoid.
2. **Ecosystem + Claude's own doctrine.** Claude's artifact pack: "the default styling is a starting point, not a house style." Multi-theme libraries are the norm (3–8 themes per system: Exocortex 5, editorial-artifact-skills 3, polished-design 8 presets + 5 anti-presets, design-artifact-loop 59 systems; research/12b). "Derive, never invent" (Claude Design create-design-system).
3. **Subject-first selection.** `brief > theme preset > model choices` — the preset is chosen from the subject's world, never defaulted unasked. Vague briefs get a 3-direction step instead.

## Decision (original, 2026-08-06 — historical)

The festival design language becomes the **default artifact template**: a token block (CSS variables for bg/surface/accent/text, type roles, layout rules) stamped into every generated artifact, shared identically by the JSX and HTML fallback paths. Per-brief freedom is limited to the palette (4–6 hex, chosen before coding per mined rule 10) and layout concept. Structure is fixed; expression is per-brief.

The token block ships as a fixed section of the flow's prompt layer (creative-brief → build), not a separate design-review step.

## Current status (post-revision)

- The festival token block lives in `10-Projects/11-Active/artifactory/docs/design/themes.md` as **festival-dark** — one of four starter presets (festival-dark, paper-editorial, terminal, bold-signal), each a token block + one-line voice + when-to-use.
- Gate 4 (SKILL.md) no longer stamps a token block: it picks a direction from the theme library (or 3 directions for vague briefs), commits a constraint doc (color/type/layout/**signature**) before coding, and runs the review-and-revise loop against the anti-slop ban list.
- ADR-001 remains canonical as the **festival-dark preset's** record and the flow's design-history anchor; it is NOT the flow's single source of taste.

## Alternatives Considered (original)

### Fixed frozen token set (option a)

- Pros: deterministic output, zero design decisions per artifact
- Cons: every artifact converges into one house style — exactly the "AI-house-style" mined rule 10 warns against; HTML and JSX paths would drift
- Rejected: no per-brief expression

### Design-axes prompt only (option b)

- Pros: full flexibility, no convergence
- Cons: no guardrails; quality depends entirely on the model's taste that run; violates mined rule 4 (design = tokens)
- Rejected: drifts without a fixed token architecture

### Per-artifact design-review step

- Pros: human sign-off on taste
- Cons: extra HITL step per artifact, contradicts "plan, don't do" and fast iteration
- Rejected: taste is codified in tokens, not reviewed per artifact

## Consequences

- Generated artifacts no longer converge on one house style; preset + per-brief signature keep each artifact ownable (ticket 12 doctrine).
- Festival-dark remains a first-class, validated look for sim/tool class artifacts (corpus-consistent: dark + mono readouts).
- Preset library lives in `docs/design/themes.md`; new presets earn their place through real projects (corpus standard pending, map fog).
- Gate 6 gains a second-pass design critic (quality + originality decide pass/fail) so taste regressions are caught on the rendered output, not self-graded (ticket 12 Q3/Q4).