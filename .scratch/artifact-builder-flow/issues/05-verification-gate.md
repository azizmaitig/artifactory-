# 05 - Verification gate

Type: grilling
Status: resolved
Blocked by: 06

## Question

What counts as "verified rendering" for a generated artifact? (headless render, screenshot, interaction smoke test, console-error-clean — the checks used for festival-noise-sim.html.) What is the minimum gate before an artifact ships, and how does it hook into the packaged build pipeline?

## Answer

Resolved by Sisyphus (AFK, 2026-08-06).

**Two-tier verification.** Build-time structural checks (ticket 06, already in `build-artifact.mjs`: size ≥ 1KB, `#root`, inline `<script>`/`<style>`) are the **build gate** — exit 0 = structurally verified, no browser needed. Runtime verification is a **mandatory post-build gate** executed via Playwright MCP against the **built** HTML (the artifact ships as built, never as source) — this is what "verified rendering" means.

**Minimum gate before an artifact ships (all must pass):**

1. **Headless render** — page loads without crashing; `#root` mounts and has children (JSX) or body renders expected content (HTML). Blank page / mount failure = FAIL.
2. **Console-error-clean** — zero `console.error` + zero uncaught page errors after load AND after interaction. Ignorable noise must be listed verbatim in the artifact record (known case: favicon 404 in festival). Silent whitelisting is forbidden — every ignored message gets a documented reason.
3. **Interaction smoke** — operate each control once (every slider, toggle, button, input): observable state change required (value/DOM/readout mutation), no new console errors during or after the interaction.
4. **Screenshot evidence** — full-page screenshot captured into the artifact folder; agent eyeballs it against the ADR-001 tokens (dark + mono + accent, flat) as a sanity check. Screenshot is evidence for the archive record, not a re-review of taste (gate 4 owns taste).

**Fail = don't ship.** PASS/FAIL is binary; anything else fails. Evidence (screenshot, console dump, control list) goes into the archive record (gate 8).

**Pipeline hook:** `build-artifact.mjs` stays node-only and project-agnostic — no Playwright dependency added. Verification lives in the skill (gate 6) as a fixed checklist executed via Playwright MCP / self-contained scripts (per 09: `with_server.py` does not exist in this vault). Order: build (structural gate) → verify built HTML (runtime gate) → archive. HTML-path artifacts run the same gate minus the `#root` check.

**Deferred (not part of the minimum):** multi-browser matrix, pixel-diff regression, Lighthouse — the corpus/regression standard is the map's "Not yet specified" item, not this gate.

<!-- resolved by Sisyphus (AFK) -- locked into SKILL.md gate 6 -->
