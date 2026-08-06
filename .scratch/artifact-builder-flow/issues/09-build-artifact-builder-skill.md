# 09 - Build the artifact-builder skill

Type: task
Status: resolved
Blocked by: 07
<!-- claimed 2026-08-06 by opencode (Sisyphus) — build session -->
<!-- resolved 2026-08-06: SKILL.md + /artifact command shipped to vault -->

## Answer

**Shipped.** Two files, committed to the vault (`0931610`, `feat: add artifact-builder skill + /artifact command`):

- **`.opencode/skills/artifact-builder/SKILL.md`** — the 8-gate flow (gate sequence per 07): brainstorm (HITL, visual-translator Step-0 style) → format (gate 2, ticket-08 table embedded verbatim) → domain-model (conditional HITL, per 03) → design (ADR-001 token block + 10 mined rules inlined) → implement (single entry.jsx/HTML, whitelist per 02) → verify (Playwright, strictness deferred to 05) → build (`artifact-builder/build-artifact.mjs`) → archive. Reuses named skills via `skill(name=...)`: visual-translator, domain-modeling, webapp-testing.
- **`.opencode/commands/artifact.md`** — the `/artifact` slash-command entry: thin loader mirroring the vault's `exca.md` pattern (description frontmatter + step list + `skill(name="artifact-builder")` kickoff).

**Build corrections vs the ticket's assumptions** (discovered by explore during the build):

- **`frontend_aesthetics` is not a skill on disk or in git history** — it's a ticket-level name for the Anthropic-blog taste rules, which actually live in `research/01-artifact-prompts.md`. The SKILL.md inlines those rules (design=tokens, color-encodes-meaning, two type weights, flat, no emoji, 11px floor, resist-AI-house-style) instead of emitting a dangling reference.
- **"excalidraw-writer tokens" is a mislabel** — the excalidraw-writer skill is a diagram-schema skill; the token block the flow needs is ADR-001 (festival template). ADR-001 token block + per-brief palette freedom stamped at gate 4.
- **Gate 6 (verify)**: `webapp-testing`'s referenced `scripts/with_server.py` does not exist in the vault — the gate writes self-contained Playwright scripts (Playwright MCP available). Strictness minimum left as the ticket-05 placeholder (render + console-clean + control smoke).

**Validation bar**: skill run end-to-end on a brief → festival-class artifact (single self-contained HTML, dark + mono, verified in Playwright). Gate 2 is the only resolved-decision gate; gate 6 remains placeholder until 05 resolves. First real brief run is the acceptance test — see map "Not yet specified" (artifact corpus).
