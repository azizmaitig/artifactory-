# 05 — Grilling: responsive + touch baseline for ADR-001

Type: grilling
Status: resolved
Blocked by:

## Question

Responsive + touch baseline to codify into the artifact design language (ADR-001): what are the phone-support rules every artifact must follow?

Forks to grill:

- Viewport + safe-area-insets handling
- Tap-target minimums (44px), no hover-only controls, touch slider/button behavior
- Panel/chart mobile layout rules: grid collapse breakpoints, recharts minimum height, readout strip wrapping
- Perf budget for phones (animation loops, tick rates on low-end devices)
- Which rules land in the ADR-001 token block vs the per-brief checklist

## Resolution — locked 2026-08-12, implemented

Phone support is a **platform contract, not taste** — it rides on the PWA envelope (04/06/07) and applies to ALL presets. All four forks grilled HITL with recommendations (all adopted). Placement (fork 5): new ADR-001 "Device support baseline" section (cross-theme technical) + gate-4 plan requirement + gate-6 check 6.

1. **Viewport & safe areas**: `viewport-fit=cover`; fixed/absolute bottom UI pads `env(safe-area-inset-bottom)` (standalone-iOS home indicator); no `user-scalable=no`; interactive text ≥16px (kills iOS focus-zoom).
2. **Tap targets & no-hover**: ≥44px preferred, **40px hard floor**, ≥8px gaps; `:active` + `:focus-visible` states required; no hover-only affordances; `prefers-coarse` may enlarge, never gates function.
3. **Layout collapse**: single column ≤640px, 2-col ≥960px; recharts explicit min-height 220px (300 multi-panel); readouts wrap; **horizontal overflow at 375px = hard FAIL** (`scrollWidth <= clientWidth`).
4. **Phone perf**: sim loops 60fps cap + pause when `document.hidden`; no per-tick layout thrash; gate 6 adds throttled mobile pass (Playwright 375×667 + CPU 4x — render + interaction smoke must pass).

## Deliverables

- ADR-001 §"Device support baseline" (2026-08-12)
- SKILL.md gate 4 (phone baseline part of the design plan) + gate 6 check 6 (mobile/throttled pass)
- Feeds 08 (verification gate reuses the mobile pass) and 06 HITL (phone layout review bar)

## Comments

- 2026-08-12: grilled 4 forks HITL, all recommendations adopted; ADR section + SKILL.md edits landed; committed with the ticket.