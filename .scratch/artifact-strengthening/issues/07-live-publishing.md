# 07 — Live publishing alongside the gallery

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc's Claude Code artifacts: a session can publish a **live page at a private URL that updates in place** as the session continues, shareable within the organization, never public. The pipeline publishes finished artifacts to a static GitHub Pages gallery (`azizmaitig/artifact-gallery`) — one-shot deploys, public.

Is there a place for the live-publishing model in the pipeline — e.g. a "preview-as-you-build" flow where gate 5's work-in-progress is visible at a private URL before the final gate-7 build lands in the gallery? Or does the existing preview workflow (ticket 20: `serve.mjs` on localhost) already cover the need, making live publishing out of scope?

Decide: adopt a live-preview publishing step / rely on serve.mjs + gallery / reject live publishing as outside the vault-native model.