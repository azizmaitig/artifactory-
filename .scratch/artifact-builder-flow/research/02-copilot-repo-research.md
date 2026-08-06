# 02 - Copilot handoff repo research

Source: HANDOFF.md (Copilot coding-agent session, 2026-08-06) — starred-repo scan for artifact generation + workflow orchestration patterns. Decision-relevant input for **05 - Verification gate** and **07 - Flow orchestration shape**.

## Tier 1: Direct reuse candidates

### Graphify-Labs/graphify — skill artifact generation
- Pattern: `RenderedArtifact` dataclass + platform abstraction (platforms.toml → fragments → markdown artifacts)
- Tests: byte-idempotence checks, drift guards for committed artifacts
- Reusable for: template composition, linting pipeline for generated code
- Entry point: `graphify/tools/skillgen/gen.py` (RenderedArtifact + render_all orchestration)
- Link: https://github.com/Graphify-Labs/graphify

### microsoft/conductor — multi-agent workflow orchestration
- Pattern: agent composition for progressive pipeline (visual → validation → ship)
- Post-processing: `conductor/executor/linkify.py` — markdown-aware text processing, protection of code blocks
- Reusable for: agent-to-agent handoff, gate-prompt rendering
- Link: https://github.com/microsoft/conductor

### microsoft/SkillOpt — trajectory-driven skill optimization
- Pattern: train reusable skills via edit trajectories + gating validation
- Reusable for: best-skill extraction, validation gates
- Purpose: validates that skills converge on high-quality outputs
- Link: https://github.com/microsoft/SkillOpt

## Tier 2: Domain / interactive validation overlap

- **repowise-dev/repowise** — MCP codebase intelligence; overlaps the HITL domain-modeling layer (validates artifact logic against codebase context)
- **xyflow/xyflow** — React Flow; reference for interactive rendering patterns
- **abhigyanpatwari/GitNexus** — client-side knowledge graphs; validates the self-contained preview paradigm

## Copilot's proposed 7-step orchestration (input for ticket 07)

1. Spec interview (visual-translator) → artifact brief
2. Wireframe + design (excalidraw-writer → frontend_aesthetics)
3. React implementation (JSX + Tailwind + Recharts/SVG)
4. Domain validation (domain-modeling, HITL)
5. QA + Playwright (webapp-testing)
6. Build & package (esbuild + tailwind-cli, NODE_ENV define)
7. Deploy & archive (vault, version-tagged)

Equivalent to ticket 07's Option B (single command with embedded gates). Note: no wayfinder-per-artifact step (Option A) — that choice remains open for 07.

## Notes

- Candidate repos come from the user's curated starred collection (30+ repos, skill-gen / workflow / dataviz focused)
- Copilot flagged `Electricity-monitoring` (PZEM004t + Grafana/node-RED) as domain-modeling inspiration for future artifacts
- Handoff predates ticket 02's resolution: no HTML-fallback path, no whitelist-vs-on-demand — treat its workflow as draft, not decided
