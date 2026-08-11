# 05 — Grilling: responsive + touch baseline for ADR-001

Type: grilling
Status: open
Blocked by:

## Question

Responsive + touch baseline to codify into the artifact design language (ADR-001): what are the phone-support rules every artifact must follow?

Forks to grill:

- Viewport + safe-area-insets handling
- Tap-target minimums (44px), no hover-only controls, touch slider/button behavior
- Panel/chart mobile layout rules: grid collapse breakpoints, recharts minimum height, readout strip wrapping
- Perf budget for phones (animation loops, tick rates on low-end devices)
- Which rules land in the ADR-001 token block vs the per-brief checklist

Resolution: new ADR-001 section + per-brief checklist additions, edited into the artifact-builder SKILL.md gate 4.