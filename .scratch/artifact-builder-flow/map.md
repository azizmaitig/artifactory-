# Wayfinder map — Artifact Builder Flow

## Destination

A vault-native artifact-builder flow — wayfinder-style decision map + skills — that generates Claude-quality interactive artifacts on demand: correct domain modeling, distinctive design taste, verified rendering. Validated against artifacts like the festival-noise-sim (physics model + interactive sliders + live SVG diagram + recharts chart).

## Notes

- Domain: interactive frontend artifacts (simulations, data-viz, tools) + physics/domain modeling
- Skills every session should consult: visual-translator Step-0 brainstorm, excalidraw-writer tokens, frontend_aesthetics (Anthropic blog, Nov 2025), brainstorming, grill-me + domain-modeling (HITL), playwright/webapp-testing (QA)
- Standing preferences: terse/pragmatic; dark theme + single accent; tabular-nums mono readouts; verified before shipped; no untested logic
- Reference artifacts: festival-noise-sim.jsx (`C:\Users\azizm\Downloads\mon-festival\festival-noise-sim.jsx`); working build pipeline from that session (esbuild + Tailwind CLI → single self-contained HTML, NODE_ENV define fix)

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

## Not yet specified

- Artifact corpus / regression standard — how "Claude-quality" is measured over time
- Integration with existing skill stack — which existing skills get reused (visual-translator Step 0, excalidraw-writer palette, frontend skills) vs replaced
- Preview workflow — how generated artifacts get opened/iterated (local server pattern from the viewer session?)
- Creative-brief prompt layer — what the user prompt → artifact brief looks like

## Out of scope

- Running artifacts inside claude.ai itself (Anthropic's platform)
- A general-purpose app framework beyond artifacts
- The 0dB festival soundproofing physics problem itself (it was the example artifact, not the destination)
