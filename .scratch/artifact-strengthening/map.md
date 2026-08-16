# Wayfinder map — Artifact Strengthening

## Destination

Decide which lessons from Claude's official artifacts documentation (help article "Que sont les artefacts et comment les utiliser ?") translate into concrete strengthening of the artifact-builder pipeline — as locked decisions, not feature adoption. When the map is done, every lesson from the doc that touches the pipeline has an explicit adopt / adapt / reject verdict against the existing constraints (ticket 02 scope matrix, gate 5, corpus standard), and the adoptions are wired into the skill.

## Notes

- Domain: artifact-builder pipeline (`10-Projects/11-Active/artifactory/`) + Claude platform artifacts documentation
- Skills every session should consult: grilling + domain-modeling (HITL tickets — all 8 are grilling), artifact-builder (constraint reference), research (if a ticket spawns an AFK sub-question)
- Standing preferences: terse/pragmatic; verified before shipped; no untested logic; decisions recorded, not deliverables
- Source document: Claude help article "Que sont les artefacts et comment les utiliser ?" (FR) — pasted in session; covers definition/criteria, AI-powered artifacts, MCP integration, persistent storage (20 Mo, text-only, published-only), Claude Code live publishing
- Constraint anchors: scope matrix ticket 02 (`artifact-builder-flow/issues/02-artifact-scope-matrix.md` — out: persistence/networking), gate 5 SKILL.md (never localStorage), corpus standard ticket 19, mirror-model record (server-side probe precedent, `exemples/mirror-model/probe-real.mjs`)

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

## Not yet specified

- Formal adoption of Anthropic's artifact *criteria* (>15 lines, self-contained, reusable) as gate-1/corpus vocabulary — overlaps tickets 01/02; may graduate after they resolve
- Implementation shape of whatever gets adopted (e.g. if the persistence boundary is redrawn: storage backend, gallery wiring) — graduates after the corresponding decision ticket resolves
- The doc's in-place editing workflow ("Modifier avec Claude", batch multi-file edit requests) as a pattern for editing the pipeline's own docs/skills — suspected, not yet sharp

## Out of scope

- Running artifacts inside claude.ai / Claude Desktop (Anthropic's platform) — pre-existing boundary, restated
- AI-powered artifacts hosted on Anthropic's infrastructure (that is claude.ai platform, not vault-native; ticket 05 only adapts the local probe pattern)
- Publishing to the claude.ai sidebar / "Publier" flow — the pipeline publishes to its own gallery (`azizmaitig/artifact-gallery`)
- General-purpose app framework beyond artifacts — pre-existing boundary (ticket 02), restated