# Research — Mine artifact-generation prompts (Ticket 01)

**Status**: resolved (2026-08-06)
**Source**: `https://github.com/asgeirtj/system_prompts_leaks` — cloned to `C:\Users\azizm\AppData\Local\Temp\opencode\system_prompts_leaks`
**Agent**: librarian (bg_68231b4d)

## Verdict

The repo DOES contain claude.ai artifact-generation prompts — prominently. Per its own `Anthropic/README.md`: the bare `claude-<model>.md` files are the claude.ai web-app system prompts, and `visualize.md` is a claude.ai injected fragment covering artifacts. No web search was needed.

## Key file paths (under `Anthropic/`)

| Path | What it is |
|---|---|
| `visualize.md` | **The artifact/visual creation system prompt** ("Imagine — Visual Creation Suite"): design system, streaming rules, SVG/HTML/Chart.js specs, color palette, interactive-widget recipes |
| `claude-opus-4.8.md`, `claude-sonnet-5.md`, `claude-fable-5.md`, ... | claude.ai model prompts — `<artifact_usage_criteria>`, Visualizer routing (Steps 0–3), `<persistent_storage_for_artifacts>` |
| `Claude Code/bundled-skills/artifacts/` | Published-artifact skill pack: `artifact-design.md`, `artifact-dashboard.md`, `artifact-data-table.md`, `artifact-explainer.md`, `artifact-report.md`, `plan-artifact.md`, `artifact-capabilities/` |
| `Claude Code/bundled-skills/dataviz/` | Chart design method: `SKILL.md` + `references/` (choosing-a-form, color-formula, palette, marks-and-anatomy, interaction, anti-patterns) |
| `claude-design.md`, `Claude Design/Skills/` | Claude Design prompt + skills (frontend-design, hi-fi-design, make-tweakable, interactive-prototype, create-design-system) |
| `Claude Code/skills/frontend-design.md` | Frontend design skill |

## Top 10 rules Anthropic's prompts encode

1. **Text and visual are separate channels.** All explanation lives in the chat response; the artifact contains ONLY the visual/interactive element.
2. **Format decided by intent, not subject.** "How does X work" → interactive illustrative widget; architecture → structural diagram; steps → flowchart; ERD/schema → Mermaid never SVG; a single number → stat tile not bar chart; >20 lines of code → artifact, short answers → inline.
3. **Prefer interactive over static** — *"if the real-world system has a control, give the diagram that control."* Sliders, toggles, live readouts. Animations animate transform/opacity only, <2s loops, wrapped in `prefers-reduced-motion`.
4. **Design system = tokens.** CSS custom properties for everything; dark mode is mandatory and built via token redefinition, never hardcoded hex for text.
5. **Typography discipline**: two weights (400/500), sentence case, no emoji, 11px floor, no mid-sentence bolding. Headings 22/18/16px at 500; body 16px/400/1.7.
6. **Flat and clean** — no gradients, shadows, blur, glow, neon. 0.5px borders, generous whitespace. Streaming-safe structure: `<style>` → content → `<script>`, inline styles preferred.
7. **Color encodes meaning, not sequence.** 2–3 ramps max; gray for neutral; prefer purple/teal/coral/pink for categories; reserve blue/green/amber/red for semantic states; text on colored fills uses the 800/900 stop of the same ramp.
8. **Charts by procedure: form first, color last.** Never dual-axis; categorical hues in fixed order never cycled; legend always present for ≥2 series with selective direct labels; custom HTML legends with values; round every displayed number; colorblind-safe palettes (ΔE ≥ 8).
9. **Library whitelist + hard constraints.** React: recharts, d3, plotly, three (r128 quirks), chart.js, mathjs, lucide-react, shadcn/ui, tone, tensorflow, papaparse, xlsx. HTML: CDN allowlist (cdnjs/esm.sh/jsdelivr/unpkg only). **Never localStorage** — use React state or JS variables. Single-file artifacts.
10. **Resist the AI-house-style** (cream+serif+terracotta, near-black+acid green, purple gradient hero, Inter/Space Grotesk, emoji markers, `rounded-lg` everywhere). Sketch a short design plan — palette (4–6 named hex), type roles, layout concept — and derive every decision from it before coding.

## Notable verbatim excerpts

### Artifact vs inline (`claude-opus-4.8.md` L1189–1204)
```
# Use artifacts for
- Custom code solving a specific user problem; data visualizations, algorithms, technical reference
- Any code snippet >20 lines
- Content for use outside the conversation (reports, articles, presentations, blog posts)
- Long-form creative writing
# Do NOT use artifacts for
- Short code answering a question (≤20 lines)
- Lists, tables, enumerated content, regardless of length
- Brief structured/reference content; single recipes
```

### React library whitelist (`claude-opus-4.8.md` L1217–1228)
```
### React
For React elements, functional/Hook/class components. No required props (or provide defaults);
use a default export. Only Tailwind core utility classes (no compiler...). Base React is importable;
for hooks, `import { useState } from "react"`.
Available libraries: lucide-react@0.383.0, recharts, mathjs, lodash, d3, plotly, three
(r128: THREE.OrbitControls unavailable; don't use THREE.CapsuleGeometry, it's r142+...), papaparse,
SheetJS (xlsx), shadcn/ui (from '@/components/ui/alert'; mention to user if used), chart.js, tone,
mammoth, tensorflow.
```

### No browser storage (`claude-opus-4.8.md` L1230–1232)
```
# CRITICAL BROWSER STORAGE RESTRICTION
**NEVER use localStorage, sessionStorage, or ANY browser storage APIs in artifacts**. These are
NOT supported and artifacts will fail in Claude.ai. Use React state (useState, useReducer) for
React, JS variables/objects for HTML, and keep all data in memory during the session.
```

### Visualizer routing (`claude-opus-4.8.md` L1268–1286)
```
## Step 0 — Does the request need a visual at all?
Most requests are conversational... A visual earns its place when it conveys something text can't:
spatial relationships, data shape, system structure, process flow, or an interactive tool.
## Step 1 — MCP tools first
Claude scans connected MCP servers. If any tool's name or description handles this category of
output, Claude uses that tool — not the Visualizer.
## Step 2 — File request?
Claude looks for: "create a file," "save as," ... If so → Claude uses file tools...
## Step 3 — Visualizer (default inline visual)
No MCP tool fits, no file request → Claude uses the Visualizer for inline diagrams, charts, and
interactive explainers.
```

### Design philosophy (`visualize.md` L25–29)
```
### Philosophy
- **Seamless**: Users shouldn't notice where claude.ai ends and your widget begins.
- **Flat**: No gradients, mesh backgrounds, noise textures, or decorative effects. Clean flat surfaces.
- **Compact**: Show the essential inline. Explain the rest in text.
- **Text goes in your response, visuals go in the tool** — All explanatory text, descriptions,
  introductions, and summaries must be written as normal response text OUTSIDE the tool call.
  The tool output should contain ONLY the visual element...
```

### Streaming/implementation rules (`visualize.md` L33–43)
```
Output streams token-by-token. Structure code so useful content appears early.
- **HTML**: `<style>` (short) → content HTML → `<script>` last.
- Prefer inline `style="..."` over `<style>` blocks — inputs/controls must look correct mid-stream.
- Keep `<style>` under ~15 lines...
- Gradients, shadows, and blur flash during streaming DOM diffs. Use solid flat fills instead.
```
```
### Rules
- No `<!-- comments -->` or `/* comments */` (waste tokens, break streaming)
- No font-size below 11px
- No emoji — use CSS shapes or SVG paths
- No gradients, drop shadows, blur, glow, or neon effects
- No dark/colored backgrounds on outer containers (transparent only — host provides the bg)
```

### Typography (`visualize.md` L45–48)
```
- **Typography**: The default font is Anthropic Sans. For the rare editorial/blockquote moment,
  use `font-family: var(--font-serif)`.
- **Headings**: h1 = 22px, h2 = 18px, h3 = 16px — all `font-weight: 500`... Body text = 16px,
  weight 400, `line-height: 1.7`. **Two weights only: 400 regular, 500 bold.** Never use 600 or 700...
- **Sentence case** always. Never Title Case, never ALL CAPS. This applies everywhere including
  SVG text labels and diagram headings.
- **No mid-sentence bolding**... Entity names, class names, function names go in `code style`.
```

### Dark mode mandatory (`visualize.md` L70–74)
```
**Dark mode is mandatory** — every color must work in both modes:
- In SVG: use the pre-built color classes (`c-blue`, `c-teal`, `c-amber`, etc.)... Never write
  `<style>` blocks for colors.
- In HTML: always use CSS variables (--color-text-primary, --color-text-secondary) for text.
  Never hardcode colors like color: #333 — invisible in dark mode.
- Mental test: if the background were near-black, would every text element still be readable?
```

### Color semantics (`visualize.md` L106–111)
```
**How to assign colors**: Color should encode meaning, not sequence. Don't cycle through colors
like a rainbow...
- Group nodes by **category** — all nodes of the same type share one color.
- Use **2-3 colors per diagram**, not 6+. More colors = more visual noise.
- **Prefer purple, teal, coral, pink** for general diagram categories. Reserve blue, green, amber,
  and red for cases where the node genuinely represents an informational, success, warning, or
  error concept...
```

### Prefer interactive over static (`visualize.md` L450)
```
**Prefer interactive over static.** A static cross-section is a good answer; a cross-section you
can *operate* is a great one. The decision rule: if the real-world system has a control, give the
diagram that control. A water heater has a thermostat — so give the user a slider that shifts the
hot/cold boundary, a toggle that fires the burner and animates convection currents... Reach for
`imagine_html` with inline SVG first; only fall back to static `imagine_svg` when there's
genuinely nothing to twiddle.
```

### CDN allowlist (`visualize.md` L60)
```
- **CDN allowlist (CSP-enforced)**: external resources may ONLY load from `cdnjs.cloudflare.com`,
  `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`. All other origins are blocked by the sandbox — the
  request silently fails.
```

### Chart.js rules (`visualize.md` L733–741)
```
- Canvas cannot resolve CSS variables. Use hardcoded hex or Chart.js defaults.
- Wrap `<canvas>` in `<div>` with explicit `height` and `position: relative`.
- Canvas sizing: set height ONLY on the wrapper div, never on the canvas element itself...
- Load UMD build via `<script src="https://cdnjs.cloudflare.com/ajax/libs/...">`...
- **Legends** — always disable Chart.js default and build custom HTML... Include the
  value/percentage in each label when the data is categorical (pie, donut, single-series bar).
```

### Avoid AI-generated design (`artifact-design.md` L34)
```
**Avoid AI-generated design** AI-generated design currently clusters around a few looks: warm
cream (#F4F1EA) with a serif display and terracotta accent; near-black with a lone acid-green or
vermilion pop; broadsheet hairline rules with dense columns; a purple-to-blue gradient hero on
white; Inter or Space Grotesk as the "safe" face; emoji as section markers; everything centered;
`rounded-lg` everywhere; accent bar/rail on rounded cards. Where the user pins down a visual
direction, follow it exactly... Where nothing is specified, don't spend that freedom on one of
these defaults.
```

### Design-before-code process (`artifact-design.md` L48–55)
```
Before writing code, sketch a short design plan — a compact token system with color, type, and layout:
- **Color**: describe the palette as 4–6 named hex values.
- **Type**: typefaces for 2+ roles — a characterful display face used with restraint, a
  complementary body face, and a utility face for captions or data if needed.
- **Layout**: a layout concept in one or two sentences.
Then build, following the plan and deriving every color and type decision from it.
```

### Dataviz procedure (`dataviz/SKILL.md` L38–46, L78–80)
```
## The procedure — do these in order
Color comes LAST. Most bad charts pick colors first.
1. **Pick the form.** What is the data's job — magnitude, identity, polarity, a single headline,
   change-over-time? The job picks the chart type, and sometimes the answer is *not a chart*
   (a stat tile or hero number).
2. **Assign color by the job it does.** Categorical (identity), sequential (magnitude), diverging
   (polarity), or status (state) — each has one rule. Assign categorical hues in fixed order,
   never cycled.
```
```
- **One axis.** Never a dual-axis chart (two y-scales). Two measures of different scale → two
  charts, small multiples, or indexed to a common base. *(This is the #1 chart mistake...)*
```

## Notable gap for the physics-simulation goal

The leaked prompts are strong on design system, layout, charts, and interactivity (sliders/toggles/steppers) — but they deliberately cap animation ("No physics engines or heavy libraries"). Claude builds **schematic** simulations with hand-rolled behavior, not full physics engines. The vault artifact-builder should follow the same playbook: token-based theming + hand-authored SVG/Canvas + sliders, not heavyweight simulation libs.

## Secondary finds (useful but not core)

- **Claude Design** (`make-tweakable.md` — slider/tweak panel patterns, very relevant to interactive sliders)
- Other artifact skill recipes: no placeholder numbers, no fabricated time axes, color deltas by meaning not direction, `role="img"` + `aria-label` on SVGs, 3–6 steps for explainers
- `default-styles.md` is NOT design styles — it's Concise/Explanatory/Formal/Learning modes (irrelevant to artifact building)
