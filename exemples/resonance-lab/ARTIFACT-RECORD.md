# ARTIFACT RECORD — Resonance Lab

**Date**: 2026-08-10 (v1 sandbox · v2 lesson mode)
**Format**: JSX (recharts required — ticket 08 rule 2; composed multi-panel UI with shared state — rule 4)
**Files**: `entry.jsx` (source) · `resonance-lab.html` (built, self-contained, 630 KB) · `resonance-lab-verify.png` (v1) + `resonance-lab-verify-v2.png` (v2 evidence)

## v2 — pedagogy retrofit ("physicist explains to an 18-year-old")

Two modes:
- **Lesson** — guided 4-step walkthrough: Tacoma Narrows hook ("the bridge that shook itself apart") → find the ring frequency (student sweeps the drive slider) → the resonance explosion (guess 2×/10×/100×, reveal: 10×, Q = 1/(2ζ), sim restarts from rest) → damping as safety net (guess, reveal: 10× → 1.4×; completion screen shows the 1.4× insight + free-play exit).
- **Explore** — the v1 sandbox unchanged (sliders, presets, theory overlay, charts, play/pause/reset).

Predict-then-observe is the spine: every reveal is a guess first; each reveal patches params + resets the sim so the transient is seen from rest. Plain-language "Physicist's translation" line under the tiles ("a slow, steady push bends the spring 0.025 m; at this drive it swings 0.253 m — 10.0× farther").

## Brief (v1, still valid for the sandbox)

| Field | Value |
|---|---|
| Name | resonance-lab |
| Intent | Reveal why amplitude explodes when driving frequency ≈ natural frequency, and how damping tames it |
| Audience | Curious learner; sliders (drive freq, damping ζ, natural freq), play/pause, reset, presets, theory-overlay toggle |
| Content | Mass-on-spring SVG animation · response curve (amplification vs ω/ω₀, resonance band + live marker) · position-vs-time chart (live + analytic theory overlay) · readout tiles (amplification, Q, phase lag, steady amplitude) |

## Palette (gate 4) — "lab bench at night"

`--bg #0A0C0E` · `--surface #14171A` · `--surface2 #1B1F23` · hairline `rgba(255,255,255,0.08)` · `--accent #3FD8C4` (teal: live/drive/active) · `--theory #A78BFA` (purple: analytic overlay) · `--band #FFB454` (amber: resonance zone) · `--text-primary #E8EAED` · `--text-secondary #9AA4AE`. Mono tabular readouts, uppercase tracking labels, 11px floor, flat (no gradients/shadows).

## Domain model (gate 3)

Driven damped oscillator: `x″ + 2ζω₀x′ + ω₀²x = f₀·cos(ωt)`, m = 1 kg, f₀ = 1 N/kg.
Closed-form steady state: `A = f₀/√((ω₀²−ω²)²+(2ζω₀ω)²)`, amplification `ω₀²/denom`, peak = 1/(2ζ), phase `atan2(2ζω₀ω, ω₀²−ω²)`.
Numerics: semi-implicit Euler, dt = 1/240 s, 4 substeps/frame (visual only; charts analytic).

**Worked example**: f_nat = 1 Hz, ζ = 0.05 → ω₀ = 6.283 rad/s → A_static = 0.0253 m, Q = 10.0, A(ω₀) = 0.253 m, φ = 90°. **Verified in-browser**: default tiles showed exactly `10.0× static · 10.0 · 90deg · 0.253m`; ζ=0.3 → Q 1.7; ζ=0.35 preset → Q 1.4; ratio 0.80/ζ 0.05 → 2.7× and 12.5° (all match closed form to displayed precision).

**Assumptions** (error direction): A1 linear spring/damping → over-predicts amplitude near resonance (optimistic); A2 single DOF (stiffer than reality); A3 first-order integrator → slow phase/energy drift at very low ζ over long runs (transient view only); A4 15 s history cap (windowed truth).

## Gate-compliance audit (ticket 18, 2026-08-10)

| Gate | Requirement (current SKILL.md) | Status | Evidence / notes |
|---|---|---|---|
| G1 + pedagogy (17) | Brief with Audience/Hook; hook-first, staircase, predict-then-observe, plain readouts, lesson+sandbox | PASS | Tacoma hook; "Physicist's translation" line; guess-first reveals with sim restart; Lesson/Explore; walkthrough asserted 10.0×/1.4× tile-exact |
| G2 format | JSX via rules 2+4 (React lib + composition) | PASS | recharts + composed panels; reason recorded |
| G3 research trace | 4-step trace (2-engine search → T1–T4 → dedup → gate) | NOT RUN (low-risk gap) | Build session validated closed-form only: worked example + 6 in-browser cross-asserts (10.0×/90°/0.253 m; ζ=0.3→Q1.7; ratio 0.8→2.7×/12.5°; ζ=0.35→1.4×). Analytic textbook model, all asserts matched — no bug (contrast festival 10× unit bug, which had a wrong formula). Rule: run the trace when the model claims published values or formulas are non-trivial |
| G4 doctrine | Direction pick from themes.md / 3-direction step; constraint-doc-first plan (color/type/layout/signature); review-and-revise | PARTIAL (mitigated, root-caused) | Session executed a STALE command snapshot: `.opencode/commands/artifact.md` still carried pre-rework gate-4 text ("ADR-001 token block + per-brief palette") — fixed by ticket 18. Post-hoc compliance: direction = festival-dark, subject-derived (physics-sim class); tokens match preset; palette tuned (surface2/theory/band semantic); plan recorded (palette+layout) but no explicit SIGNATURE line, no review-and-revise log |
| G5 implement | single file, whitelist, no localStorage | PASS | single entry.jsx; recharts only; no storage. Encoding trap discovered (PS cmdlet round-trip) → future-artifact rule added to SKILL.md gate 5 |
| G6 checks 1–4 | render, console-clean, smoke, screenshot | PASS | 0 console errors; all controls smoke (v1) + lesson walkthrough (v2); screenshots archived |
| G6 check 5 (17) | guided walkthrough end-to-end | PASS | fresh-load → 4 steps → completion → free play; reveals asserted; 0 errors |
| G6 design critic (12) | fresh-model 4-axis pass, quality+originality decide, scores recorded | RETRO-RUN → PASS | Build-time used computed-style audit (host model no vision, honestly documented). This audit ran the real critic via a fresh vision subagent over `resonance-lab-verify-v2.png`: **Quality 8 / Originality 7 / Craft 8 / Functionality 8 → PASS** (coherent AND distinctive; anti-slop pass). Advisory: step-4 insight callout density (11px callout) — optional polish, queued with next artifact iteration |
| G7 build | structural verification | PASS | 4/4 checks, exit 0, 630 KB |
| G8 archive | record + index + commit | PASS | record, README row, commits (artifact-builder 7d5ec27; vault 90a170e) |

**Root cause of partials:** `.opencode/commands/artifact.md` (the /artifact entry point) was never synced by tickets 12/14 — it still instructed the old gate 4. Sessions started via /artifact read that text first, so the reworked gates 3/4/6 did not reliably reach the builder. Corrected in this ticket.

**Follow-ups:** (a) critic advisory on step-4 callout density (font bump) — optional; (b) gate-3 trace skip acceptable for closed-form models, revisit when a model claims published values; (c) preview/serve pattern (serve-tmp.mjs) → ticket 20 scope.

## Verification (gate 6, on BUILT html — PASS, v1 + v2)

**v1 (sandbox)**: 1. Render: `#root` mounts, all panels present. 2. Console: 0 errors / 0 warnings after load AND interaction sweep. (One `favicon.ico 404` appeared on an intermediate build's first load; final builds — 0. Not whitelisted.) 3. Interaction smoke (every control once): drive 1.0→1.5 Hz (amp 10.0→0.8×, phase 90→173°); damping 0.05→0.3 (Q 10.0→1.7); fNat 1.0→2.0 Hz (ratio →0.75); Pause → PAUSED + x frozen 1.2 s; Play → oscillates; Reset → x ≈ 0 restart; presets Deadened/At-resonance/Off-resonance (Q 1.4 / amp 10.0× @ 90° / ratio 0.80, amp 2.7×); theory toggle Off (line + chip unmount) → On (remount). 4. Screenshot + computed-style audit (host model without vision): panel bg = `--surface`, hairline border, flat (no gradients), no horizontal overflow, response + live teal paths, theory dashed path, amber reference line + "resonance" label, accent marker dot.

**v2 (lesson walkthrough)**: Lesson toggle → step 1 hook panel ("The bridge that shook itself apart", Step 1/4) → Begin → step 2 + plain-language line ("0.025 m → 0.253 m — 10.0× farther") → drive slider still live in lesson (sweep → ratio 0.40) → Next → step 3 + guess prompt → Reveal 1 → tiles exactly 10.0×/10.0/90°/0.253 m + insight box + sim reset → step 4 → Reveal 2 → tiles 1.4×/1.4/90°/0.036 m → completion screen shows the 1.4× insight → Finish → explore restored (presets visible, panel gone). Console: 0 errors after the full walkthrough. Screenshot `resonance-lab-verify-v2.png` archived.

**Build**: `node build-artifact.mjs --entry entry.jsx --out resonance-lab.html --title "Resonance Lab"` → structural checks PASS (≥1 KB, #root, inline style/script), exit 0.