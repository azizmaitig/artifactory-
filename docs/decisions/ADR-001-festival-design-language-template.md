# ADR-001: Festival design language as default artifact template

## Status

Accepted (may be reshaped after first artifacts ship)

## Date

2026-08-06

## Context

The artifact-builder flow must produce artifacts with "distinctive design taste" (map destination). The reference artifact festival-noise-sim established a concrete look the user wants as the quality bar:

- Dark `#0A0C0E` background
- Single teal accent (`#3FD8C4`)
- Tabular-nums mono readouts
- Uppercase tracking labels
- Layered surfaces + hairline borders
- Flat (no gradients/shadows/glow) — per mined rule 6 from ticket 01

Open question (ticket 04): fixed token set vs design-axes prompt vs hybrid. Sources of truth at decision time:

- **Ticket 01 mined rules**: design = tokens (CSS vars), mandatory dark mode via token redefinition; two type weights (400/500), sentence case, no emoji, 11px floor; color-encodes-meaning (2–3 ramps, semantic states reserved); sketch 4–6 hex palette + type roles + layout concept BEFORE coding; resist AI-house-style.
- **madewithclaude.com corpus extraction** (research/03): community artifacts skew vanilla HTML/JS; dark + mono telemetry is community-wide taste for sims (SpaceX sim: `#000`, Courier New, live readouts, 4.4K likes); single-file inline CSS/JS is the corpus convention.
- Ticket 02 decided v1 = JSX primary + HTML fallback — both formats need the same taste applied.

## Decision

The festival design language becomes the **default artifact template**: a token block (CSS variables for bg/surface/accent/text, type roles, layout rules) stamped into every generated artifact, shared identically by the JSX and HTML fallback paths. Per-brief freedom is limited to the palette (4–6 hex, chosen before coding per mined rule 10) and layout concept. Structure is fixed; expression is per-brief.

The token block ships as a fixed section of the flow's prompt layer (creative-brief → build), not a separate design-review step.

## Alternatives Considered

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

- Generated artifacts share a recognizable, validated visual language (corpus-consistent: dark + mono readouts)
- Per-brief palette freedom prevents house-style convergence
- One token block serves both JSX and HTML paths — single source of truth for the flow
- Token block is prompt-layer content; reshaping it later means editing one section, not re-architecting (supports the "might reshape later" caveat)
- First artifacts shipped through the flow will validate the template; ADR may be superseded if the look doesn't generalize beyond festival-class artifacts
