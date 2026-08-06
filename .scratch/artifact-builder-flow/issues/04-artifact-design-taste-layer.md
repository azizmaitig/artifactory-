# 04 - Artifact design-taste layer

Type: grilling
Status: resolved
Blocked by: 01

## Question

What design tokens/rules should generated artifacts follow? Adapt the frontend_aesthetics principles (typography, color, motion, backgrounds, anti-convergence guardrails) and deconstruct festival-noise-sim (dark #0A0C0E, single teal accent, tabular-nums mono readouts, uppercase tracking labels, layered surfaces, hairline borders). Fixed skill section or design-axes prompt? Where does it live in the flow?

## Answer

Resolved via grilling (2026-08-06). Decision recorded in **ADR-001** (`docs/decisions/ADR-001-festival-design-language-template.md`) — may be reshaped after first artifacts ship.

**Decision:** festival design language = **default artifact template** — a token block (CSS vars: dark bg `#0A0C0E`, single accent, tabular-nums mono readouts, uppercase tracking labels, layered surfaces, hairline borders; type roles; layout rules) stamped into every generated artifact, shared identically by JSX and HTML fallback paths. Per-brief freedom limited to palette (4–6 hex, chosen before coding per mined rule 10) + layout concept. Structure fixed; expression per-brief. Lives as a fixed section of the flow's prompt layer, not a per-artifact review step.

**Evidence gathered:**
- Ticket 01 mined rules (tokens-not-hardcoded, dark-mode-via-token-redefinition, 2 type weights, no emoji, 11px floor, color-encodes-meaning, sketch-palette-first, anti-AI-house-style)
- Corpus extraction (`research/03-madewithclaude-corpus.md`): community artifacts skew vanilla HTML/JS; dark + mono telemetry is community-wide sim taste (SpaceX sim: #000 + Courier New + live readouts, 4.4K likes); single-file inline CSS/JS convention; CDN libs (three/cannon via cdnjs) are real shipped usage

**Alternatives rejected:** frozen token set (house-style convergence), design-axes-only (no guardrails), per-artifact design review (HITL overhead).

**Corpus bonus finding:** community physics/game artifacts are predominantly plain HTML — strengthens ticket 02's HTML fallback path; hand-rolled physics scales (~200 lines for full landing sim), validating the no-engine v1 rule.

<!-- resolved by Sisyphus via grilling; ADR-001 is the canonical record -->
