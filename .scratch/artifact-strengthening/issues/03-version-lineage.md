# 03 — Visible version lineage

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc describes an artifact **version selector** and editing that "ne changera pas la mémoire de Claude du contenu original" — exploring directions without losing prior work. The pipeline already versions artifacts *externally* (records track v1/v2, e.g. resonance-lab, fps-kitchen, mirror-model), but the built artifact itself carries no version marker.

Should built artifacts carry **visible version lineage in-UI** — a small "v2 · delta from v1" marker (what changed, why, when) so a reader opening the shipped file knows it is a revision, not the original? Or does the ARTIFACT-RECORD.md already own that story, and in-UI markers add noise?

Decide: add in-UI version lineage / keep versioning in records only / add a minimal version stamp without delta narrative.