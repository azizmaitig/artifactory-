# 01 - Mine artifact-generation prompts

Type: research
Status: resolved
Blocked by:

## Question

What do Anthropic's own system prompts (system_prompts_leaks repo + web sources) tell the model about building artifacts — artifact type selection, design/styling rules, library whitelist, structure/quality directives? Which of those rules should our artifact-builder flow adopt?

<!-- resolving via background librarian task bg_68231b4d (session ses_02b60e9ceffeixyUpjatkLV0HM); findings appended as Answer on completion -->

## Answer

The repo DOES contain the claude.ai artifact prompts — prominently (bare `claude-<model>.md` files are the web-app system prompts; `visualize.md` is the artifact/visual creation spec; `Claude Code/bundled-skills/artifacts/` + `dataviz/` are the artifact skill pack). No web search needed.

**Key rules the flow should adopt** (full detail + verbatim excerpts in `../research/01-artifact-prompts.md`):
1. Text in the response, visual ONLY in the artifact — separate channels.
2. Format by intent: interactive widget for "how X works" (with a control for every real-world control), structural diagram for architecture, Mermaid for ERD, stat tile not chart for a single number, artifact only >20 lines of code.
3. "If the real-world system has a control, give the diagram that control" — sliders, toggles, live readouts.
4. Design = tokens (CSS vars, mandatory dark mode via token redefinition).
5. Typography: two weights (400/500), sentence case, no emoji, 11px floor.
6. Flat: no gradients/shadows/glow; streaming-safe structure; inline styles preferred.
7. Color encodes meaning: 2-3 ramps max, purple/teal/coral/pink preferred, semantic states reserved for blue/green/amber/red.
8. Charts: form first, color last; never dual-axis; legends with values.
9. Whitelist (React): recharts, d3, plotly, three r128, chart.js, mathjs, lucide-react, shadcn/ui, tone, tensorflow, papaparse, xlsx; HTML CDN allowlist: cdnjs/esm.sh/jsdelivr/unpkg; **never localStorage**.
10. Resist the AI-house-style; sketch a 4-6 hex palette + type roles + layout concept BEFORE coding.

**Gap**: prompts cap animation ("no physics engines") — Claude builds schematic sims with hand-rolled behavior, not full physics engines. Our flow should follow suit.

Source clone: `C:\Users\azizm\AppData\Local\Temp\opencode\system_prompts_leaks` (may be cleaned — re-clone from https://github.com/asgeirtj/system_prompts_leaks if needed).
