# 09 — Prototype: gallery index page

Type: prototype
Status: open
Blocked by:

## Question

Design the gallery root index at https://azizmaitig.github.io/artifact-gallery/ — the page a phone hits before installing an artifact.

Forks to grill:

- Layout: how installed artifacts are listed (grid/cards), what each entry shows (name, one-line description, accent-colored icon tile)
- Install affordances: per-artifact "install" hint copy adapting Android (install prompt) vs iOS (Share → Add to Home Screen); link to the artifact page
- How the index is maintained as artifacts publish: static hand-edited list, generated snippet from the publish script, or something else
- Rough dark-theme take in ADR-001 token style; the index itself should be useable on a phone

Deliverable: a concrete prototype (drawing/stub/HTML) to react to, linked from this issue.

Context: gallery infra exists (03): repo azizmaitig/artifact-gallery, gh-pages branch, /artifacts/<name>/ per artifact, publish-artifact.ps1 pushes builds. Current index is a static placeholder list.