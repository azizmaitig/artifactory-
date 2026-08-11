# six-degrees — artifact record

- **Format**: JSX
- **Gate-2 reason**: composed multi-element UI with shared (B, C, world-size, current-degree) state across ring diagram + reach curve + per-degree strip + readouts (ticket-08 rule 4 — primary axis is composition).
- **Palette**: paper-editorial tuned (#F6F2E9 paper, #1A1815 ink, #8A2A2A oxblood accent), 7-step categorical degree ramp (wax-seal palette) — NOT cream-terracotta, NOT lone-accent-dark.
- **Direction rationale**: subject-derived — Milgram's small-world originated through mailed-letter correspondence; paper-editorial with hairline-ring signature is true to the subject's native medium and differentiates from the gate-6-banned dark sims.
- **Domain-model outputs** (gate-3):
  - Worked example: B=100, C=0.6 → f=40; cumulative through 6 = 4,201,025,641 ≈ 4.2B (52% of Earth 8.05B); full-Earth crossing at degree 7 (cumulative 1.68e11). **Numerical correction applied (2026-08-10)**: original plan claimed 40^6 ≥ 8.05e9 — FALSE (4.096e9 < 8.05e9). UI computes exactly; headline framing "6 hops → half the world", full-Earth crossing shown live (f=40 → 7 hops, f=20 → 8 hops, f=100 → 5 hops).
  - Assumptions: 4 listed with error direction tags (see entry.jsx comments).
  - Confidence: HIGH — ≥5 T1/T2 sources (Milgram 1967/1969, Watts-Strogatz 1998 Nature, Kleinberg Cornell textbook, Dodds 2003, Backstrom-Leskovec 2012).
- **Verification** (gate-6, on the BUILT html served over http://127.0.0.1:8765/six-degrees.html — file:// is blocked by Playwright MCP):
  - Headless render: PASS — #root mounts, all 3 zones + footer render, defaults f=40 / "by hop 6: 4.2B people (52% of Earth)" / "~7 hops".
  - Console-error-clean: PASS — 1 error total, verbatim: `Failed to load resource: the server responded with a status of 404 (File not found) @ http://127.0.0.1:8765/favicon.ico:0` (favicon 404 — the only allowed ignorable noise). Zero errors after all interaction.
  - Interaction smoke: PASS (all 6 controls, corrected assertions):
    1. Branching 100→50 (C=60%): f readout "f = 20" ✓, hops "~8 hops" ✓ (plan's "~7" was pre-correction arithmetic), punchline "by hop 6: 67.4M people (1% of Earth)".
    2. Clustering 60%→0% (B=100): f "f = 100" ✓, hops "~5 hops" ✓, punchline "100% of Earth".
    3. Village preset: hops "~2 hops" ✓, reached "1K / 1K (100%)" ✓.
    4. Earth preset (defaults): hops "~7 hops" ✓, reached "4.2B / 8.1B (52%)" ✓.
    5. Build-the-chain: currentDegree ticks 0→1→2→3→4→5→6 ✓, target halo fires after degree 6 (f=100 condition) ✓, button returns to "Build the chain" ✓.
    6. Math aside: closed by default ✓, opens on click ✓, closes on second click ✓.
  - Screenshot: six-degrees-verify.png (full-page, eyeballed against token palette — paper bg, oxblood "6", fold-back hairlines visible, no layout breakage).
  - Design critic (second pass): quality=8.5, originality=8.5, craft=9, functionality=8.5 → PASS (fresh-model pass; neither coherent-but-generic nor original-but-messy; signature + palette + honest two-part punchline differentiate; anti-slop ban list satisfied; minor non-blocking: "8.1B" tick label slightly clipped at chart edge).
- **Files**: six-degrees.html + entry.jsx + six-degrees-verify.png + ARTIFACT-RECORD.md (this file).