# 03 - madewithclaude.com corpus extraction

Source: https://madewithclaude.com + https://claude.ai/public/artifacts (rendered via Playwright, code view). Gallery of community Claude artifacts — the real corpus behind awesome-claude-artifacts. Input for **04 - Artifact design-taste layer**.

## Gallery taxonomy (artifact categories)

Tools, Design, Data, Graphics, Education, Programming, Creative, Web Design, Game, Applications, Entertainment. 10 flagship artifacts on homepage: snake-game (AI), 3d-physics-playground, double-pendulum-chaos, word-cloud-wizard, buzzie (word game), pomodoro-timer, kid-friendly-car-game, space-x-landing-simulator, resume-builder, audio-visualizer.

## Extracted artifact #1 — SpaceX Starship Descent (game)

- **URL**: https://claude.ai/public/artifacts/590d0d2a-da07-4a08-9c83-2d3d11b4f63f
- **Format**: vanilla HTML/JS + canvas 2D — NO React, NO Tailwind, NO libs. Full source captured in session.
- **Design tokens**: bg `#000`; text `#fff`; font **Courier New, monospace** (system, no webfont); canvas border 2px `#fff`; ship silver `#e6e6e6`/`#c0c0c0`; thrust flame `#f84`; asteroids brown `#8B4513`; space gradient `#000033 → #660000`.
- **Physics**: hand-rolled — gravity 0.05, thrust 0.1, drag 0.99, inertia 0.99, camera follow, collision via distance check, landing criteria (speed ≤ 2, angle ≤ 0.1 = perfect). No physics engine.
- **UI pattern**: live telemetry readout top-left — `Altitude: 4633m, Speed: 2.13, Fuel used: 0.0` — same DNA as festival-noise-sim's tabular readout pane.
- **Structure**: single file, inline `<style>`, script at end. 4.4K likes.

## Extracted artifact #2 — Falling Cube (3D physics, three.js + cannon.js)

- **URL**: https://claude.ai/public/artifacts/5dcd7214-289c-499f-9cf3-4ea6bf34eadb
- **Format**: vanilla HTML/JS + **CDN libs** — three.js r128 + cannon.js 0.6.2 from **cdnjs.cloudflare.com** (matches Claude's CDN allowlist from 01). No React. Full source captured in session.
- **Design tokens**: sky-blue bg `0x87CEEB`; cube `0x00ff00`; platforms `0x8888ff`; ambient + directional + point lights, PCF soft shadows.
- **Physics**: CANNON.World (gravity −9.82), impulses, velocity caps, boundary clamps. Real physics engine via CDN — note: contradicts 01's "no physics engines" rule, but this is a community artifact, not Claude-system-generated; and it uses engine from CDN, not bundled.
- **Structure**: single file, CDN `<script src>`, inline style, resize handler. 9K likes.

## Findings for ticket 04

1. **Community artifacts are predominantly vanilla HTML/JS, not React** — the "3D Physics Playground" flagship is a plain CDN-HTML page; SpaceX sim is a plain canvas page. React artifacts exist in the corpus but the gallery's physics/game class skews plain HTML. Strong support for ticket 02's HTML fallback path.
2. **Dark + mono telemetry is a recurring community taste** — SpaceX sim uses #000 + Courier New + live readouts, matching festival's dark + tabular-nums mono pattern. Dark-with-readouts is not just Claude-house-style; it's community standard for sims.
3. **Hand-rolled physics scales to impressive results** — the SpaceX game does full landing physics (thrust, drag, inertia, collision, scoring) in ~200 lines, no engine. Validates 01's no-engine rule for v1; cannon.js remains an on-demand extension candidate.
4. **CDN loading is real usage** — three.js/cannon.js loaded from cdnjs in a shipped artifact; matches the CDN allowlist and argues for keeping CDN-import support in the HTML fallback path (esbuild external + CDN script tag, or plain HTML passthrough).
5. **Both use single-file structure with inline CSS/JS** — corpus-wide convention, matches the v1 single-HTML contract (06).

## Design-token table (corpus vs festival)

| Token | festival-noise-sim | SpaceX sim | Falling Cube |
|---|---|---|---|
| bg | #0A0C0E | #000 | sky #87CEEB |
| accent | teal (#3FD8C4) | #f84 (thrust) | green cube |
| font | tabular-nums mono | Courier New | system |
| readouts | pane + chart | top-left live text | none (game) |
| surfaces | layered + hairline | canvas border | 3D lit meshes |
| libs | recharts + Tailwind | none | three + cannon (CDN) |

## Design-management angle (extended for ticket 10)

How the corpus artifacts sequence and manage design decisions (palette → layout → typography → charts), read against the leaked artifact prompts (ticket 01 + ticket 10):

1. **Palette precedes everything, and it is subject-grounded.** SpaceX sim picks its tokens from the subject's world (space = black + thrust-orange + asteroid brown); Falling Cube from a playground world (sky-blue, vivid primaries). This matches the leaked artifact-design rule "the subject's own world is where distinctive choices come from" — the corpus shows the same behavior, palette chosen first, before layout.
2. **Layout is canvas-centric with a HUD layer.** Both sims put the interactive canvas first and overlay a telemetry/readout UI (SpaceX: top-left live text; Falling Cube: minimal controls). The readout pane is the "summary before detail" pattern the artifact-design skill prescribes for UI-class artifacts.
3. **Typography enters only where data must be read.** SpaceX uses Courier New mono solely for telemetry; Falling Cube uses system font and no readouts. Mono-for-numbers is a deliberate data role, not a blanket style — consistent with festival's tabular-nums readout rule but narrower: the corpus applies mono to data, not to whole-page chrome.
4. **Charts/readouts are the last layer, and only where data exists.** The SpaceX sim renders numbers as text readouts, not a chart — the dataviz rule "sometimes the answer is not a chart (a stat tile or hero number)" in action. Neither artifact fabricates a time axis or a chart for data it doesn't have (the anti-fabrication rule from the artifact skill pack).
5. **Single accent + restrained ramps is the corpus norm.** One semantic accent per artifact (thrust orange, green cube), everything else neutral or subject-derived. Matches visualize.md's "2–3 colors per diagram" complexity budget.