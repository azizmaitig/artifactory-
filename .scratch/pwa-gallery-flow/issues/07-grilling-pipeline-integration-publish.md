# 07 — Grilling: pipeline integration + gallery publish workflow

Type: grilling
Status: open
Blocked by: 04, 03

## Question

Pipeline integration: how does envelope generation (manifest JSON, icons, service worker) hook into the artifact build pipeline, and how does publishing to the gallery work?

Forks to grill:

- Where the envelope steps live: `build-artifact.mjs` / `build-artifact.ps1` (repo root) vs a shared envelope script invoked by them vs the SKILL.md gates
- Tokens feeding the manifest: title → name/short_name, accent → theme_color, slug → start_url/scope
- Versioning + cache-busting on rebuild (artifact version in SW/manifest)
- Publish command per artifact (draft from 03's publish-artifact.ps1); failure semantics (build succeeds, publish fails → what ships?)

Resolution: locked pipeline changes + SKILL.md edits; after this, new artifacts ship enveloped by default.