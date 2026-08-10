# ARTIFACT-RECORD — orbit-sim

**Name:** orbit-sim
**Date:** 2026-08-07
**Format:** HTML — single-view imperative canvas loop; rule 4 (composition check: single canvas + readouts, no coordinated panels) → HTML
**Palette:** deep-space per-brief: `--bg:#05070B` · `--surface:#0C1016` · `--accent:#3FD8C4` (single cyan) · text `#E8EAED`/`#9AA4AE` · mono readouts. ADR-001 tokens, flat, no glow.

## Domain model (gate 3 — orbiter mechanics, normalized GM=1)

- Acceleration `a = -(GM/r³)·r`, symplectic (semi-implicit) Euler: `v += a·dt; r += v·dt`
- Two-body approx: massless satellite, central body fixed, strictly planar, no drag
- **Worked example:** launch at r=4 with v=0.5 tangential → circular orbit, T = 2π√(r³/GM) = 16π ≈ 50.27. Verified in-sim: T readout 50.266.
- Escape speed at r=4: v_e = √(2/r) ≈ 0.7071. Test: v=1.0 → ε=+0.25, ESCAPING; v=0.3 → ε=−0.204, BOUND, a_sma=2.449, T=23.93.
- Assumptions (error direction): no drag → overestimates stability; fixed dt + timeScale multiplier → symplectic energy drift at extreme scales; GM=1 normalization → sim units, not SI.

## Verification (gate 6 — minimum, ticket 05 locked)

Ran against `orbit-sim.html` (self-contained, the built artifact) via Playwright at `http://localhost:8321`:

1. **Headless render** — PASS. `#root`-free HTML path; body rendered; canvas 802×802 (DPR-aware); BOUND default state.
2. **Console-error-clean** — PASS. 0 page errors, 0 warnings on load + after interactions. (One isolated error was an instrumentation script null-selector, not page code.) Network trace: exactly 1 request, the page itself — zero external.
3. **Interaction smoke** — PASS.
   - r=4, v=0.5, timeScale=1 → LAUNCH: BOUND, r=4.00, ε=−0.125, a_sma=4.000, T=50.266 (≈16π), r_apo/r_peri≈4.0/4.0 (perfect circle outlier to reference ring).
   - v=1.0, timeScale=3 → LAUNCH: ESCAPING, ε=+0.25, r grows monotonically (59→93).
   - v=0.3 → LAUNCH: BOUND elliptical, a_sma=2.449 (analytic 2.439), T=23.93, r_apo=4.02/r_peri=0.88.
4. **Pause/Resume** — PASS: state frozen across 1.2s, resumes.
5. **Screenshot evidence** — PASS. `orbit-sim-verify.png` (full page): dark, single cyan accent, flat, canvas + trail + central body + dashed reference ring, 2×4 telemetry grid (STATUS/r/v/ε/a_sma/T/r_apo/r_peri, uppercase mono, ε as ε not E). Visual QA subagent confirmed PASS.

**Result: PASS — shipped.**

## Files

- `orbit-sim.html` — 13KB self-contained (inline `<style>` + `<script>`, no external, no localStorage)
- `orbit-sim-verify.png` — full-page verification screenshot

## Notes

- Fixed post-build: ε label was transformed by CSS `text-transform:uppercase` into capital Ε; added `.k.eps{text-transform:none}`.
- Auto-launch on load = default state IS the worked example (circular orbit) — zero-click demo.
- Sliders apply on next LAUNCH (pending values shown live); RESET restarts with current sliders; Space=pause, R=reset.