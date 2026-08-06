# 02 - Artifact scope matrix

Type: grilling
Status: resolved
Blocked by:

## Question

Which artifact types and libraries does the flow support in v1? (Interactive React sims, HTML pages, SVG, Mermaid, dashboards; library whitelist candidates: recharts, three.js, lucide, d3, mathjs, papaparse — mirroring Claude.ai's frozen set.) What's explicitly out for v1?

## Answer

Resolved via grilling (2026-08-06), with a research sub-question on the JSX/React rationale (librarian, sources: Pragmatic Engineer interview, Reid Barber teardown, Anthropic engineering posts, current system prompts).

**Formats (v1):** React JSX as the primary artifact format, bundled to one self-contained HTML; plus a **first-class HTML fallback path**. Interactivity is conditional: interactive when the domain demands it *or* when the user asks — not an unconditional rule. SVG, dashboards, and Mermaid are capabilities *inside* React/HTML, not sibling formats.

**Why the HTML fallback (research finding):** Anthropic's own surfaces split formats — Claude Code artifacts are **HTML/Markdown only** (no React), and Claude Design explicitly avoids JSX for new UI because *"it doesn't stream"*. Streaming is the deciding constraint: JSX streams source-then-compiles; HTML paints incrementally. React remains first-class for app-like artifacts on claude.ai (expanded whitelist in current prompts), so both paths are grounded in Claude's own behavior.

**Library whitelist (v1):** recharts, lucide-react, mathjs, papaparse. Everything else (three.js, d3, plotly, chart.js, tone, shadcn/ui, tensorflow, xlsx…) is **extended on-demand** — added to the whitelist only when a specific artifact genuinely needs it, after load-testing. Mirrors Claude.ai's frozen-set approach with a tight v1 core; festival-noise-sim proved recharts + lucide + hand-rolled math suffices for the reference class.

**Why JSX/React at all (research finding, no official rationale statement exists):**
1. *Containment first* — iframe sandbox + full-site process isolation + CSP ("secure playground"); React chosen inside that model, dispatched by MIME type, run on a distinct origin via postMessage. Sandbox-imposed: no localStorage (later `window.storage` bridge), no `<form>`, CDN allowlist only.
2. *No build step* — Babel in browser → instant execution + hot re-render on iteration.
3. *Model fit* — whitelist curated to React-ecosystem libs the model reliably emits; Anthropic's own harness defaults to React+Vite.
4. *Portability* — JSX drops into real projects (artifact-runner, Netlify KB).
5. *Nuance* — React artifacts are MORE locked down than HTML (fixed whitelist vs CDN); streaming argues against React for inline surfaces.

**Explicitly out for v1:** multi-file/multi-page apps (single HTML only); physics engines/heavy animation libs (hand-rolled behavior); persistence & networking (no localStorage, no fetch-to-API, data embedded); formats beyond JSX/HTML (no raw .md/.excalidraw/standalone-mermaid/.pdf pipeline outputs); server-side anything.

<!-- resolved by Sisyphus via grilling; surfaced follow-up: format selection rule (08) -->
