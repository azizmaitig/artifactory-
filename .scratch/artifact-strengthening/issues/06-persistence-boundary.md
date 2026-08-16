# 06 — Persistence boundary: confirm or redraw

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc ships **persistent storage** for artifacts: 20 Mo per artifact, text-only, personal or shared, published artifacts only, deleted on unpublish. The pipeline's scope matrix (ticket 02) **deliberately excludes persistence/networking**, and gate 5 bans localStorage (React state / JS variables instead). The doc is the first official product signal that persistence is a legitimate artifact feature.

Does the doc change the locked boundary? Decide: **confirm** ticket 02 (artifacts stay stateless; the PWA envelope's SW cache is the only "persistence") / **redraw** (allow a narrow persistence carve-out — e.g. saved user states via a backend, which one, colliding with the self-contained no-server constraint) / defer with a written rationale.

Note: this is the highest-leverage ticket — a redraw ripples into gate 2 (format), gate 5 (impl), gate 6 (verify), and the envelope.