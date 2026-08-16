# 08 — Browser↔MCP bridge

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc: artifacts can connect to external services via **MCP** (Asana, Google Calendar, Slack, custom servers), with per-user approval on first interaction. The vault runs 20+ MCP servers, but built artifacts ship **browser-only** — no MCP client, and the browser can't reach MCP servers directly.

Should the pipeline build a **browser↔MCP bridge** (an artifact-side MCP client talking to a user-approved local relay, e.g. a WebSocket shim on the vault's localhost) so artifacts can read/write real services? Or is that squarely beyond the self-contained/no-server constraint, and the right answer is out-of-scope with a written rationale (mirror-model's server-side probe remains the sanctioned data-access pattern)?

Decide: build the bridge / out of scope / deferred until a real artifact needs it (note: deferred ≠ rejected — record the trigger).