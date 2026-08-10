# 13c - Pilot: 4-step research trace on the festival noise model

**Status**: complete (pilot for ticket 13, decision "A now")
**Date**: 2026-08-10
**Subject under test**: the domain model of the reference artifact `festival-noise-sim.jsx` (source SPL at 10 m → distance loss → barrier loss → air loss)
**Purpose**: run the adopted gate-3 research trace end-to-end on a real high-stakes brief and verify the model against published values; evidence feeds the gate-3 SKILL.md text (ticket 13) and ticket 16 (experiment loop).

## 1. Search (2-engine)

- Engine 1: `websearch` deep — query: `ISO 9613-1 atmospheric sound absorption coefficient table dB per km frequency ... temperature humidity`
- Engine 2: Exa academic — query: `outdoor sound propagation model spherical and line source spreading attenuation, barrier Fresnel attenuation, worked example with published SPL values`
- Calls: 2 total (under the ~6-8 cap — this was a compact model)
- Raw sources: 16 (9 websearch + 7 Exa)

## 2. Score (trimmed artifact-domain table, override-first)

T1 (standards/official, 4): iso.org ISO 9613-1 OBP ×2 (merged), iso.org ISO 9613-2:2024, standards.iteh.ai ISO 9613-1 PDF preview
T2 (peer-reviewed/authoritative technical, 3): DAFx 2022 paper (air-absorption closed form), ETH Zurich acoustics lecture (ISO 9613-2 formulation), ARUP Strutt barrier reference (Maekawa + ISO 9613-2 exact), UCF thesis (Kurze-Anderson + spreading laws)
T3 (technical/professional web, 2): AcousPlan worked example, SonarDocs implementation, Sengpiel Audio, ST-LINE barrier calculator, NovaSolver Maekawa calculator
T4 (upload copies, 1): Scribd ISO upload, Academia.edu upload → both dropped below Blocked-equivalent importance, kept as T4

## 3. Dedup (`source-dedup.js`, Jaccard ≥ 0.75)

```
node 88-Labs/scripts/source-dedup.js --file pilot-sources.json
before: 16 → after: 15, merged: 1   (the two iso.org OBP pages — same standard)
```
Script works as-is on the pilot input — fork 1 (A) validated in practice.

## 4. Quality gate

(T1+T2)/total = 8/15 = **0.53 ≥ 0.5 → PASS** — no refinement needed. Confidence path: high.

## 5. Verification — model legs vs published values

| Leg | Festival model | Published / authoritative | Verdict |
|---|---|---|---|
| Spreading, point | `20·log10(d/10)` | 20·log10(d/dref); −6 dB per doubling (ST-LINE, UCF, ISO 9613-2) | ✅ VERIFIED |
| Spreading, line | `10·log10(d/10)` | −3 dB per doubling cylindrical (ST-LINE, UCF) | ✅ VERIFIED |
| Air absorption coefficients | 63:0.1, 125:0.3, 250:1.0, 500:2.5, 1k:5.0, 4k:24.0, applied as `air × (d/100)` | ISO 9613-1 Table 1 coefficients **in dB/km** (AcousPlan worked ex., 10°C/70%RH: 63:0.1, 125:0.4, 250:1.0, 500:1.9, 1k:3.7, 2k:9.7, 4k:32.8; sim values ≈ same table at ~20°C) | ❌ **UNIT MISMATCH — 10× over-attenuation** |
| Air absorption application | `air × d/100` (dB per 100 m) | ISO: `α × d/1000` (dB/km) → at 200 m, 1 kHz: published 0.74 dB vs sim 5.0×2 = 10 dB | ❌ **BUG CONFIRMED** |
| Barrier | Maekawa `10·log10(3+20N)`, N=2δ/λ, λ=343/f, cap 24 dB | Maekawa 1968 identical formula, 25 dB cap (ST-LINE; NovaSolver N≈1.2 → ~8 dB @500Hz, ~15 dB @2kHz — sim reproduces); ISO 9613-2 caps 20 dB single | ✅ FORMULA VERIFIED (cap choice 24 vs ISO 20 = assumption to tag) |

**Found bug**: `FREQ_PRESETS.air` values are ISO 9613-1 dB/km coefficients (they match Table 1), but `airLoss` applies them per 100 m (`air * distance/100`) — 10× the published attenuation. At 100 m / 1 kHz the sim takes 5.0 dB where ISO says ~0.5 dB; at 4 kHz it takes 24 dB where ISO says ~2.6 dB. Actual distance loss in the sim is dominated by an over-strong air term once distance > ~50 m.

**How the trace caught it**: T1 source (ISO 9613-1 table, via AcousPlan worked example carrying the same α values + the standard PDF) + worked-example reproduction — the exact "≥1 T1/T2 source + worked example reproducing a published value" confidence rule from research/11. Without the trace, the reference artifact ships a 10× air-absorption error.

**Assumption tags produced** (error-direction): barrier cap 24 dB vs ISO 20 dB single-edge (overestimates screening by up to 4 dB in high-N regimes); air table fixed at ~20°C (no T/RH inputs — errors grow at extremes); no ground-effect/vegetation terms (ISO 9613-2 includes both; omission underestimates attenuation over grass >10 m vegetation).

## 6. Pilot verdict

- The 4-step trace **works end-to-end** and **caught a real domain-model bug in the reference artifact** — the credibility mechanism is operational.
- Fork A/B decisions validated in practice: A (source-dedup.js reuse) ran clean; degraded gate did not need to fire (0.53 pass), but the confidence rule + HITL tripwire were exercised by the bug finding.
- Feed-forward for ticket 16 (experiment loop): this pilot is iteration #1 of exactly that loop — search → verify → find mismatch → refine. One pass surfaced the bug; a loop would also cover the cap/omission assumptions with targeted re-search per leg.

## Sources (post-dedup, 15)

T1: iso.org/obp 9613-1 · innorpi mirror · iso.org/standard/74047 (9613-2:2024) · cdn.standards.iteh.ai PDF
T2: DAFx 2022 paper · ETH Zurich lecture · strutt.arup.com · stars.library.ucf.edu thesis
T3: acousplan.com · gorbatschow.github.io · sengpielaudio.com · stline.it · novasolver.jp
T4: scribd.com · academia.edu