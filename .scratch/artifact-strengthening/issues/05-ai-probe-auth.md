# 05 — AI-powered probe: BYO-account vs key-based

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc's AI-powered artifacts model: users authenticate with **their own Claude account**, zero API key for the creator, free at scale, runs on Anthropic's infra. mirror-model's live probe (`probe-real.mjs`) is the opposite shape: server-side, needs the creator's `NVIDIA_API_KEY`, CORS blocks browser use.

For the pipeline's own "live probe" pattern (mirror-model pioneered it), which auth model is right? Options: (a) keep creator-keyed server-side probes (simple, but every consumer needs the key and a server); (b) BYO-account — each user supplies their own key/account via the artifact's UI, stored where? (collides with ticket 02's no-persistence + gate 5's no-localStorage); (c) drop live probes entirely; (d) something between.

Decide: keep / BYO-account / drop / hybrid — and what the probe pattern's contract becomes in the skill.