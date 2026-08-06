# 07 - Flow orchestration shape

Type: grilling
Status: resolved
Blocked by:

<!-- claimed 2026-08-06 -->

## Question

How does a user request become an artifact? Option A: mini-wayfinder per artifact (name destination → decision tickets → resolve → build). Option B: single /artifact command with embedded gates (brainstorm → domain-model → design → build → verify). Where does the flow itself live — a skill, a command, a map?

## Answer

**Option B** — one `/artifact` command with embedded gates, one session per artifact. Rejected per-artifact wayfinder chains: ticket machinery (map + child tickets + blocking + claims) exists to chart fog across many sessions; a single build holds too few decisions to justify it. The gates ARE the decisions — resolved in conversation, not as tickets.

**Where it lives: a skill + a command.** The flow is one SKILL.md (gate sequence, HITL touchpoints, references to `build-artifact.mjs` from 06 and the ADR-001 token block); `/artifact` is the slash-command entry that loads it. The wayfinder map stays for system-level wayfinding only, never per artifact.

**Gate sequence (locked):**

1. **Brainstorm** — request → artifact brief (name, intent). **HITL.** Step-0 visual-translator style.
2. **Format gate** — JSX vs HTML. Placement settled here (gate #2 in the orchestration, not the creative-brief layer); the selection rule itself is ticket 08.
3. **Domain-model gate** — fires only when the brief has a domain model; skips pure-presentation. **HITL** (worked example + assumptions + confidence, per 03; never in-UI).
4. **Design** — ADR-001 token block stamped + per-brief palette (4–6 hex chosen before coding). No HITL (taste codified in tokens).
5. **Implement** — JSX + Tailwind + whitelisted libs → single entry.jsx. No HITL.
6. **Verify** — Playwright gate (headless render, console-error-clean, interaction smoke). **HITL** at iterate. Minimum strictness = ticket 05.
7. **Build & package** — `build-artifact.mjs` → single self-contained HTML. No HITL.
8. **Archive** — vault, version-tagged. No HITL.

HITL only at brainstorm, domain-validation (conditional), verify/iterate. The skill embeds gates 2 and 6 but defers their rules to 08 and 05 — embed the gates, defer the rules.
