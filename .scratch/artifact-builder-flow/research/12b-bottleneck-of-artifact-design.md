# 12b - The bottleneck of artifact designing (web + GitHub research)

**Status**: researched (2026-08-10)
**Trigger**: user redirect while grilling ticket 12 — *"I don't want a single hardcoded designing element. Websearch + git search this bottleneck of artifact designing."*
**Method**: websearch (10 sources) + GitHub (repo search + phrase-level code search via `gh`; 7 repos deep-read by librarian subagent).

## The bottleneck — synthesized from evidence

1. **Generic-default collapse (distributional convergence).** Without explicit constraints the model falls back to "the aggregate visual style of every well-designed interface it's trained on... a well-executed Tailwind or Shadcn template" (MindStudio). Fueled (agency pilot, Claude Design): when AI carries too much creative direction, "the output often looks polished and familiar. Competent, but not especially ownable or distinctive."
2. **Token-pressure + cognitive overload.** Exocortex's spec is the canonical statement: *"limited aesthetic reasoning under token pressure, and cognitive load of simultaneous design + implementation = consistently poor results."* And: *"This is transport-compensation. The model can't reliably produce quality UI code, and this limitation doesn't improve with model capability — it's a token-budget and output-ceiling constraint."* The remedy: **separate content reasoning from aesthetic implementation** (model decides what to say; the system decides how it looks).
3. **The bottleneck moved upstream.** Anthropic Labs (Dan Carey, via rogerwong.me): once building gets cheap, "the bottleneck moved from building the feature to figuring out the right things to be building" — discovery/prototyping, not styling. Prototypes beat docs because "documents are imprecise."
4. **Silence = defaults.** "If your design system is silent on shadows, Claude adds shadows... Silence equals defaults" (MindStudio). Negative constraints are underused; explicit constraints (exact hex, exact fonts, pixel spacing, ban lists) are what models can honor.
5. **Self-grading leniency.** Anthropic harness research: "agents reliably skew positive when grading their own work. Separating the agent doing the work from the agent judging it is a strong lever" (already in research/10).
6. **The artifact surface is not the system.** Artifacts are single-file conversational previews; production needs routing, tokens, breakpoints, deploy config (PageAI). Out of scope for this flow but keeps single-file scope honest.

## GitHub evidence — nobody ships a single hardcoded design element

- Claude's own artifact pack (all mirrors, current + CDS-token versions): **"The default styling is a starting point, not a house style."** Restyling is *encouraged*; accent tuned *toward the subject*. (`gh search code "default styling is a starting point"` → 10 mirrors.)
- Theme/preset counts across 7 production kits: Exocortex **5 themes** (templates + theme JSON injection; model never writes CSS), editorial-artifact-skills **3 themes** (+ separate deterministic `critic.py`, 5 checks), polished-design **8 presets** + 5 explicit anti-presets, design-artifact-loop **59 DESIGN.md+tokens.css systems** + separate vision critic over rendered PNG (content-hash versioned, blocks ship gate), claude-design-skill **10 design philosophies × 5 schools** (3+ directions per brief), open-design **12 golden patterns** (0 fixed themes), html-artifact-kit **1 canonical system** (the outlier) compensated by per-type composition + machine conformance audit ≥85/100.
- open-design forbids verbatim the current flow's default: `"Minimal dark" page: #0E0E10 end-to-end, one purple accent, four sparse stat cards.`
- design-artifact-loop bottleneck quote: "Without explicit constraints, coding models tend to reuse familiar UI structures: centered gradient heroes, equal cards, default indigo... A concrete system gives the agent an actual target instead of asking it to improvise taste one CSS declaration at a time."

## Conclusions for gate 4 (replaces "M3 hard requirement + ADR-001 stamp")

1. **Kill the stamped token block as THE default.** ADR-001's festival tokens become **one preset in a small theme library** (multi-theme is the norm: 3–8 per system), selected per-brief from the subject — or a per-brief direction step when the brief is vague (advisor mode).
2. **Constraint-document-first discipline** (the dominant architecture): commit to tokens + tone + one signature idea *before* markup; never "improvise taste one CSS declaration at a time."
3. **Separate the grader from the builder.** Gate 6's screenshot eyeball upgrades to a design-pass/fail review: measured axes (quality/originality/craft/functionality), pixel-based (review what rendered, not what was intended), optionally deterministic checks + a second-pass critic like design-artifact-loop.
4. **Anti-slop = a ban list of failure modes, not one allowed look.** Name the forbidden patterns (centered gradient hero, #0E0E10+one-accent default, rounded-lg-everywhere, accent-bar-on-cards); scope is per-brief differentiation.
5. **Variance is structural**: 3+ directions for vague briefs, themes as a choice point, in-design tweaks over new files.

## Claude Design product skills — additional scan of asgeirtj/system_prompts_leaks (2026-08-10)

New material beyond research/10 (which used visualize.md + the Claude Code artifact pack + dataviz SKILL.md). Found in `Anthropic/Claude Design/Skills/` + `bundled-skills/`:

1. **create-design-system.md** — Claude Design's own design-system skill. Doctrine = per-brand systems **derived from the brand's own sources** (codebase/Figma), never invented: *"copy exact numeric values — paddings, radii, font sizes, line-heights — from the source; never round or snap them to a 4/8-px grid or a framework default. If the kit says 5px, write 5px, not 4px."* Anti-patterns: "bluish-purple gradients, emoji cards, cards with rounded corners and colored left-border only." Logo rule: *"Never draw, reconstruct, or approximate a company's real logo or brand mark from memory."* Components only as the source defines them — "a component with no counterpart in the source is an invention consumers will trust and designers won't recognize." This is subject-grounding pushed to its extreme: design comes from the subject's own world, a design system per brand, never one hardcoded look.
2. **options.md** — the multi-option mechanism, structurally verified: options as a vertical stack of turns, stable `{turn}{letter}` ids (`1a`, `1b`, `2a`…), cross-linked, newest turn on top, one-line `.dv-next` follow-ups ("more like 2a but with the serif from 1c"). Structural variance-by-default — the product answer to "no single design element," matching claude-design-skill's 3+ directions and open-design's 3 defaults.
3. **make-tweakable.md** — in-design tweak surface: "pick a few high-impact values — key colors, a layout variant, a feature flag, headline copy. Keep the Tweaks panel small and tasteful." Matches claude-design-skill's Tweaks panel; variance exposed in-canvas rather than as N artifacts.
4. Also present, not yet fetched: `artifact-capabilities.md` (+ mcp.d.ts/downloads.d.ts), `design-sync/SKILL.md` (design system import/sync between Claude Design and Claude Code — the June 2026 feature), `dataviz/references/{palette,color-formula,anti-patterns}.md` (would give exact M4 chart-color content), `Claude Design/Skills/frontend-design.md` + `Claude Code/skills/frontend-design.md` (bundled frontend-design).

Gate-4 consequence: the "no single hardcoded element" doctrine is now triple-sourced — leaked artifact pack ("starting point, not a house style"), the design-system skill ("derive from the source, never invent"), and the ecosystem (multi-theme norm).

## Sources

- Web: mindstudio.ai (design-system approach), fueled.com (Claude Design pilot), rogerwong.me (When the bottleneck moves), pageai.pro (artifact→production gap), support.claude.com ×2, dev.to operators' guide, wmedia.es (artifact-design skill), github.com/Stranglehold/Exocortex specs (bottleneck doc)
- GitHub (deep-read by librarian): Stranglehold/Exocortex, jiji262/claude-design-skill, QuangDao215/editorial-artifact-skills, davekim917/design-artifact-loop, tumbleweedlabs/polished-design, amol-patil/html-artifact-kit, Sma1lboy/open-design
- Phrase search: `gh search code "default styling is a starting point"` (10 mirrors incl. asgeirtj/system_prompts_leaks, mkusaka/ccskills, skrabe/lobotomized-claude-code)

**Original ticket 10 research:** research/10-claude-artifact-design-management.md (design management), research/01-artifact-prompts.md (mined rules).