# ARTIFACT RECORD — Nuit du Village

| Field | Value |
|---|---|
| Name | `nuit-du-village` |
| Format | **JSX** (React 19 + Tailwind v4 + recharts) |
| Format reason | Composed multi-screen UI sharing one phase state machine + recharts (whitelisted React lib) for the end-screen tally — ticket 08 rules 2 & 4 |
| Files | `entry.jsx` (source) · `nuit-du-village.html` (built, self-contained) |
| Build | `node 10-Projects/11-Active/artifactory/build-artifact.mjs` — structural verification passed (≥1KB, #root, inline style/script) |
| Size | 644 KB self-contained HTML |

## What it is

One-night social-deduction party game ("Loup-Garou" lineage) for **3–8 players on a single laptop**. The device replaces the human moderator: shuffles roles, runs the night script, times the debate, tallies the vote, declares the winner. Pass-the-device for secrets, standing screen for shared state. French, funny, flat.

## v2 — Stack A (advanced mode)

Classic/advanced toggle on setup.

- **Classique** = v1 exactly (5 roles, no hidden cards).
- **Avancée** adds the deep-deduction layer:
  - **3 centre cards** — unknown roles drawn at start, flipped at the end reveal; creates the "is the wolf behind them?" doubt.
  - **Le Charlatan** — at night swaps his role (blind) with a player **or a centre card**. The swap is never revealed to him; it surfaces only at the end reveal (`resolveRoles`), applied BEFORE the win check (ONUW rule).
  - **Le Bouc Émissaire** — passive role whose secret goal is to be *lynched*; if the vote eliminates him he "wins alone" (headline overrides, secondary camp win still shown).

### v2 domain-model delta (see entry.jsx header)

- `resolveRoles(players, centre, swap)` — single source of truth for post-swap identities.
- Worked example: charlatan swaps P3 (wolf) into centre slot 0 → P3 resolves as charlatan (village), charlatan-player becomes wolf; lynching P3 then resolves village-side. Assumptions A6–A8 added (stale seer info, centre duplicates possible, bouc wins only on vote death).

## Gate 3 — domain model (full model in entry.jsx header)

- Roles: **Loup / Tante Gertrude la Voyante / Tonton Marcel le Toubib / La Sorcière du Coin / Jeannot l'Innocent**, stacked per player count; public role list, secret assignment.
- Resolution: `deaths = wolf victim (if not doctor/witch-saved) + witch poison`; win when **any dead player is a wolf** else wolves win (classic One Night rule).
- Worked example (7p): wolves target P7, doctor protects P2 (miss), witch poisons P5 (a wolf), vote lynches P4 → dead = {P7, P5, P4} → **VILLAGE WINS** despite lynching a villager (witch-pays-off case).
- Assumptions A1–A8 (error-direction tagged) in code header; never in-UI.

## Gate 4 — design

ADR-001 token block stamped (dark `#0A0C0E`, layered surfaces, hairline borders, mono readouts, flat). Per-brief palette "nuit de village": **moon-gold accent `#E6B852`**; straw-grey secondary; semantic green (village) / red (wolf) / muted blue (mystery). Two type weights, 11px floor, no emoji.

## Gate 6 — verification (Playwright on the BUILT html)

- 3 full-game walks: **3p classique/open**, **3p avancée/secret**, **7p avancée/open** — each walked setup → role deal → night (wolf pick → charlatan swap+confirm → voyante → toubib → sorcière, adaptive stepper) → dawn → day → vote → secret-reveal step → lynch → end.
- **Zero console errors** in all runs. Both winner branches observed. Centre-card + vote-chart panels render (avancée). Tie→no-lynch path observed.
- v1 apostrophe bug (`\u2019` literal in JSX text) fixed and confirmed clean.

## Files

- `entry.jsx` — source (gate comments, tokens, all screens)
- `nuit-du-village.html` — built, self-contained, verified
- `package.json` — deps (react 19, recharts 2, lucide-react, tailwind v4, esbuild)

Archived 2026-08-07 · run: `node 10-Projects/11-Active/artifactory/build-artifact.mjs --entry .../entry.jsx --out .../nuit-du-village.html --title "Nuit du Village"`