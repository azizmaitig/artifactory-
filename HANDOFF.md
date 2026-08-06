# Artifact-Builder Wayfinder Flow — Session Handoff

**Date:** 2026-08-06  
**User:** azizmaitig  
**Session Focus:** Artifact generation system design + reference implementation scoping

---

## Context

Building a **vault-native artifact-builder flow** — a wayfinder-style decision map + reusable skills that generates Claude-quality interactive artifacts on demand.

**Reference Implementation:** `festival-noise-sim.jsx`  
A physics-based field attenuation simulator combining:
- Domain modeling (spherical/cylindrical spreading, barrier diffraction, air absorption)
- Interactive sliders + frequency band selector
- Live SVG side-profile diagram
- Recharts SPL-vs-distance graph
- Readout pane with component breakdown
- Dark theme + tabular-nums mono readouts
- Single self-contained HTML build (esbuild + Tailwind CLI)

**Example Artifact:** [festival-noise-sim.jsx](/attached)

---

## Current State

### Destination (from map.md)

A complete artifact-generation system that:
1. Takes user PRDs → generates interactive frontend artifacts
2. Validates domain modeling (physics/logic is correct before shipping)
3. Renders with distinctive design (dark theme, single accent color, interactive-over-static)
4. Tests before deployment (Playwright QA, no untested logic)
5. Outputs self-contained HTML + shared skill reusable artifacts

### Prior Work Captured

Reference artifact corpus mining (not in this session):
- **Issue:** Mine artifact-generation prompts
- **Source:** claude.ai's leaked prompts (visualize.md + artifact skill pack)
- **Output:** 10 rules for artifact quality (React whitelist, no-localStorage, color-encodes-meaning, interactive-over-static, tokens-not-hardcoded)

### Decisions Not Yet Made

- Artifact corpus / regression standard (how "Claude-quality" is measured)
- Integration with existing skill stack (visual-translator, excalidraw-writer, frontend_aesthetics)
- Preview workflow (how artifacts get opened/iterated locally)
- Creative-brief prompt layer (user prompt → artifact brief conversion)

---

## Relevant Repository References

**Repo Overview:** Searched starred repos for patterns relevant to artifact generation + workflow orchestration. Key findings:

### Tier 1: Direct Reuse (Skill Generation + QA Pipeline)

1. **Graphify-Labs/graphify** — Multi-platform skill artifact generation
   - Pattern: `RenderedArtifact` dataclass + platform abstraction (platforms.toml → fragments → markdown artifacts)
   - Test: Byte-idempotence checks, drift guards for committed artifacts
   - **Reusable:** Template composition, linting pipeline for generated code
   - *Docs:* `graphify/tools/skillgen/gen.py` (RenderedArtifact + render_all orchestration)

2. **microsoft/conductor** — Multi-agent workflow orchestration
   - Pattern: Agent composition for progressive pipeline (visual → validation → ship)
   - Post-processing: `conductor/executor/linkify.py` (markdown-aware text processing, protection of code blocks)
   - **Reusable:** Agent-to-agent handoff, gate-prompt rendering
   - *Docs:* `src/conductor/executor/linkify.py` (fenced-code-aware auto-linkification model for QA gates)

3. **microsoft/SkillOpt** — Trajectory-driven skill optimization
   - Pattern: Train reusable skills via edit trajectories + gating validation
   - **Reusable:** Best-skill extraction, validation gates
   - *Purpose:* Validates that skills converge on high-quality outputs

### Tier 2: Domain / Interactive Validation

4. **repowise-dev/repowise** — Codebase intelligence (MCP-based)
   - **Overlap:** HITL domain-modeling layer; validates that artifacts' logic aligns with codebase context

5. **xyflow/xyflow** — React Flow (node-based UIs)
   - **Overlap:** Reference for interactive rendering patterns (festival-noise-sim is interactive; this library excels at that category)

6. **abhigyanpatwari/GitNexus** — Client-side knowledge graphs (zero-server)
   - **Overlap:** Artifact preview runs locally; this pattern validates self-contained paradigm

---

## Suggested Skills for Next Agent

Invoke these in order when continuing artifact-builder work:

### 1. **visual-translator** (Brainstorm + Artifact Brief)
   - **When:** Converting user PRD → artifact design spec
   - **Output:** Structured brief (domain, UI components, interactivity model, color scheme)
   - **Reference:** Noted in map.md as "Step-0 brainstorm"

### 2. **excalidraw-writer** (Wireframe + Palette)
   - **When:** Drafting visual mockup of artifact layout
   - **Output:** SVG wireframe + color palette JSON
   - **Standing Preference:** Dark theme + single accent color (e.g., #3FD8C4 from festival-noise-sim)

### 3. **frontend_aesthetics** (Design Validation)
   - **When:** After React JSX is drafted
   - **Reference:** Anthropic blog (Nov 2025) + festival-noise-sim precedent
   - **Output:** Design critique (spacing, typography, color contrast, interactive feedback)

### 4. **domain-modeling** (Physics/Logic HITL)
   - **When:** Validating that the artifact's domain logic is sound
   - **Input:** User-provided spec + reference docs
   - **Output:** Corrected equations/algorithms (e.g., barrier diffraction validation)
   - **Note:** Interactive grill-me pattern for question-answer loops

### 5. **playwright-qa** / **webapp-testing** (Artifact Verification)
   - **When:** After artifact renders locally
   - **Scope:** Validate interactive behaviors (slider feedback, graph re-renders, SVG updates)
   - **Output:** Test report + video capture (optional)

### 6. **esbuild + tailwind-cli** (Build Pipeline)
   - **When:** Final packaging to self-contained HTML
   - **Reference:** Working build from festival-noise-sim session
   - **Key Fix:** `NODE_ENV=production` define (minification + dead-code elimination)

---

## Standing Preferences (From map.md)

- **Tone:** Terse, pragmatic
- **Theme:** Dark mode + single accent color (mint #3FD8C4 preferred; validate per spec)
- **Numbers:** Tabular-nums monospace readouts (e.g., `font-mono` + `tabular-nums`)
- **Logic:** Verified before shipped (no untested domain models; Playwright-validated interactivity)
- **Scope:** Interactive frontend artifacts only (simulations, data-viz, tools)
- **Build:** Single self-contained HTML file (no SPA or bundler artifacts exposed to user)

---

## Workflow Outline (Next Steps)

1. **Spec Interview** (visual-translator)
   - User provides PRD or problem statement
   - Brainstorm → artifact brief (domain, components, interactivity)

2. **Wireframe + Design** (excalidraw-writer → frontend_aesthetics)
   - Visual mockup + palette
   - Design review loop

3. **React Implementation** (frontend_aesthetics)
   - JSX with Tailwind + Recharts / SVG
   - Pass to domain-modeling if physics/logic required

4. **Domain Validation** (domain-modeling)
   - Verify correctness of algorithms (math/physics review)
   - HITL loops if edge cases exist

5. **QA + Playwright** (webapp-testing)
   - Interactive behavior validation
   - Slider feedback, chart re-renders, SVG responsiveness

6. **Build & Package** (esbuild + tailwind-cli)
   - Minify → single HTML
   - Verify NODE_ENV define is set

7. **Deploy & Archive**
   - Save to user's artifacts vault
   - Tag with version + domain (e.g., `artifact-v1-acoustics.html`)

---

## Key Files & References

| Item | Link | Purpose |
|------|------|---------|
| Example Artifact | festival-noise-sim.jsx | React component + physics model |
| Skill Gen Model | https://github.com/Graphify-Labs/graphify/blob/main/tools/skillgen/gen.py | RenderedArtifact pattern + idempotence |
| QA Gate Pattern | https://github.com/microsoft/conductor/blob/main/src/conductor/executor/linkify.py | Post-processing validation (code-block aware) |
| Skill Optimization | https://github.com/microsoft/SkillOpt | Trajectory-driven reuse + gating |
| Wayfinder Map | map.md (in conversation context) | Decisions + out-of-scope |

---

## Out of Scope (Explicit Non-Goals)

- Running artifacts inside claude.ai platform itself (Anthropic's infrastructure)
- General-purpose app framework (artifacts only, not SPA builder)
- Festival soundproofing physics problem itself (was the example, not the goal)

---

## Notes for Continuity

- **Starred repos:** User has curated collection of 30+ repos. Many are skill-generation, workflow orchestration, and data-viz libraries. Check those if new tool patterns are needed.
- **User's own projects:** Starred repo includes user's `Electricity-monitoring` (PZEM004t sensor + Grafana/node-RED/InfluxDB/MQTT) — may inform domain-modeling patterns for future artifacts.
- **No sensitive data:** No API keys, credentials, or PII in conversation.
- **Local workspace:** User's Obsidian vault at `D:\projects\obsidian\second brain\artifact-builder` — next agent can sync notes there.

---

## Handoff Checklist

- [ ] Next agent reviews this document
- [ ] Next agent loads relevant skills (visual-translator, excalidraw-writer, etc.)
- [ ] Next agent confirms user PRD or example artifact to start with
- [ ] Next agent checks starred repos if new tool patterns needed
- [ ] Progress logged back to map.md (decisions + blockers)
- [ ] Sync updates to local Obsidian vault

