# Wayfinder map — Artifact Builder Flow

## Destination

A vault-native artifact-builder flow — wayfinder-style decision map + skills — that generates Claude-quality interactive artifacts on demand: correct domain modeling, distinctive design taste, verified rendering. Validated against artifacts like the festival-noise-sim (physics model + interactive sliders + live SVG diagram + recharts chart).

## Notes

- Domain: interactive frontend artifacts (simulations, data-viz, tools) + physics/domain modeling
- Skills every session should consult: visual-translator Step-0 brainstorm, excalidraw-writer tokens, frontend_aesthetics (Anthropic blog, Nov 2025), brainstorming, grill-me + domain-modeling (HITL), playwright/webapp-testing (QA)
- Standing preferences: terse/pragmatic; dark theme + single accent; tabular-nums mono readouts; verified before shipped; no untested logic
- Reference artifacts: festival-noise-sim.jsx (`C:\Users\azizm\Downloads\mon-festival\festival-noise-sim.jsx`); working build pipeline from that session (esbuild + Tailwind CLI → single self-contained HTML, NODE_ENV define fix)
- Copilot-handoff repo research (Graphify RenderedArtifact, conductor linkify, SkillOpt) → `research/02-copilot-repo-research.md` — input for tickets 05/07

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [Mine artifact-generation prompts](issues/01-mine-artifact-prompts.md) — claude.ai's own prompts leaked (visualize.md + artifact skill pack); 10 rules for artifact quality extracted, incl. React whitelist, never-localStorage, color-encodes-meaning, interactive-over-static, tokens-not-hardcoded
- [Artifact scope matrix](issues/02-artifact-scope-matrix.md) — v1 = JSX primary + first-class HTML fallback (interactive on demand); whitelist recharts/lucide-react/mathjs/papaparse, rest extended on-demand; out: multi-file apps, physics engines, persistence/networking, non-JSX/HTML formats, server-side. Research: why JSX — containment/sandbox, no-build-step, model fit, portability; Claude's own split (Claude Code = HTML-only, JSX doesn't stream)
- [Domain-modeling gate](issues/03-domain-modeling-gate.md) — triggered gate (fires on briefs with a domain model, hard gate, skips pure-presentation); checks: research→explain→validate; outputs: worked example (load-bearing, known reference value) + assumptions (error-direction tagged) + confidence notes; lives in brief + JSX code comments, never in-UI
- [Artifact design-taste layer](issues/04-artifact-design-taste-layer.md) — festival look = default artifact template (token block shared by JSX + HTML paths, per-brief palette freedom only); ADR-001 is the canonical record. Corpus evidence: community sims are vanilla HTML/JS, dark+mono taste, CDN libs real

## Not yet specified

- Artifact corpus / regression standard — how "Claude-quality" is measured over time
- Integration with existing skill stack — which existing skills get reused (visual-translator Step 0, excalidraw-writer palette, frontend skills) vs replaced
- Preview workflow — how generated artifacts get opened/iterated (local server pattern from the viewer session?)
- Creative-brief prompt layer — what the user prompt → artifact brief looks like

## Out of scope

- Running artifacts inside claude.ai itself (Anthropic's platform)
- A general-purpose app framework beyond artifacts
- The 0dB festival soundproofing physics problem itself (it was the example artifact, not the destination)
