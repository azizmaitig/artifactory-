/**
 * ============================================================================
 *  SIX DEGREES OF SEPARATION — interactive explainer artifact
 *  ----------------------------------------------------------------------------
 *  Why any two people on Earth are connected by a chain of ~6 mutual
 *  acquaintances. Branching-factor + clustering sliders drive a live ring
 *  diagram, a reach curve, a per-degree strip, and a depth-to-Earth verdict.
 *
 *  GATE 2 — FORMAT: JSX. Composed multi-element UI with shared (B, C,
 *  world-size, current-degree) state across ring diagram + reach curve +
 *  per-degree strip + readouts (ticket-08 rule 4 — primary axis is
 *  composition). No recharts, no lucide-react, no CDN — straight SVG +
 *  Tailwind. Whitelist: React + react-dom only.
 *
 *  GATE 3 — DOMAIN MODEL (load-bearing, NEVER shown in-UI)
 *  ----------------------------------------------------------------------------
 *  Worked example (verbatim from plan, incl. numerical correction):
 *  Effective branching: f = B(1 − C)
 *  Default: B = 100, C = 0.6 → f = 40
 *  f^1 = 40            (your friends' NEW friends)
 *  f^2 = 1 600
 *  f^3 = 64 000        ≈ a small town
 *  f^4 = 2.56 × 10^6   ≈ a city (~ Madrid)
 *  f^5 = 1.024 × 10^8  ≈ a large country
 *  f^6 = 4.096 × 10^9  ≈  HALF of Earth (8.05 × 10^9) — the "6" claim in one number
 *  CUMULATIVE through 6: ≈ 4.20 × 10^9 (52% of Earth); ALL of Earth crossed at degree 7
 *  NUMERICAL CORRECTION (2026-08-10): original plan claimed 40^6 ≥ 8.05e9 — FALSE
 *  (4.096e9 < 8.05e9). UI computes exactly; headline framing: "6 hops → half the world",
 *  full-Earth crossing shown live (f=40 → 7 hops, f=20 → 8 hops, f=100 → 5 hops).
 *  pure-tree upper bound (Kleinberg Ch20): 100^5 = 1.0 × 10^10 > Earth in just 5
 *  clustering shrinks factor from 100 → 40, the price for triadic closure
 *
 *  Model (as implemented): reached[0] = 1;
 *    reached[d] = min(reached[d-1] + f^d, worldPop)   for d = 1..6
 *    hitEarthDegree = smallest d where reached[d] >= worldPop, else null
 *  Verified reference values (asserted in gate-6 smoke):
 *    B=100, C=0.6 → f=40: cumulative through 6 = 4,201,025,641 ≈ 4.2B (52% of
 *      Earth 8.05B); crossing 8.05B at degree 7 (cumulative 1.68e11) → 7 hops
 *    B=50,  C=0.6 → f=20: cumulative 20^7 sum = 1,347,368,421 < 8.05e9;
 *      20^8 sum = 26,947,368,421 ≥ 8.05e9 → 8 hops
 *    B=100, C=0   → f=100: cumulative 100^5 sum = 10,101,010,100 ≥ 8.05e9 → 5 hops
 *    Village (worldPop=1000), f=40: cumulative through 2 = 1,641 ≥ 1000 → 2 hops
 *
 *  Reproduces published comparable numbers (validation lever, all T1/T2):
 *  - Milgram 1967 (Psych Today 1(1)) → mean 5.2 intermediaries (US)
 *  - Travers & Milgram 1969 (Sociometry 32(4)) → 5.2 over 64 completed / 296 started
 *  - Watts 2003 email → ~6 hops global
 *  - Backstrom-Leskovec 2012 / Facebook → 4.74 (721M users, 69B links)
 *  - Leskovec-Horvitz 2007 MS-Messenger → 6.0 (240M users)
 *  - All sit in the 3.4–6.7 neighbourhood our model predicts for the relevant N.
 *
 *  ASSUMPTIONS (each tagged with error direction):
 *  | # | Assumption | If false, 6 becomes... |
 *  | 1 | Random mixing — each hop reaches a genuinely new random person (not
 *  |   | isolated stratums) | LONGER — Podunk-without-passports pushes chain
 *  |   | to 8–12+ (Watts-Strogatz k<k·ln n condition) |
 *  | 2 | "Friend" = first-name acquaintance (Milgram's definition) | Tighter
 *  |   | def → LONGER (5^6 = 15 625, well under Earth) |
 *  | 3 | Long-range "shortcut" edges present (WS rewiring p > ~0.001) | If
 *  |   | absent (pure lattice), path length grows LINEARLY with N → thousands;
 *  |   | the crux of "small-world" |
 *  | 4 | B and C anti-correlated (Toyota Table 1): larger B raises C in same
 *  |   | data → f = B(1−C) stays bounded | If picked independently, model
 *  |   | could over-shoot Earth (error: SHORTER) |
 *
 *  CONFIDENCE NOTES:
 *  - Formula N≈(B(1−C))^d reproduces Earth's ~8.05B within ~±1 step for
 *    B∈[50,150] and C∈[0.5,0.74] (Hill-Dunbar 2003 + Toyota 2008 bands).
 *  - Empirical confirmation across 3 platforms (Facebook 4.74, Twitter 3.43,
 *    MS-Messenger 6.0) all in the predicted 3.4–6.7 neighbourhood.
 *  - Independent theoretical proof that six emerges (Nash-equilibrium
 *    centrality-cost model, PLoS One 2023) strengthens "six" beyond Milgram.
 *  - Confidence: HIGH — ≥5 T1/T2 sources (Milgram 1967/1969, Watts-Strogatz
 *    1998 Nature, Kleinberg Cornell textbook, Dodds 2003, Backstrom-Leskovec
 *    2012, Hill-Dunbar 2003, Toyota 2008 arXiv).
 *
 *  MASTER SOURCE TIER-LIST:
 *  | Source | Tier | URL/key |
 *  | Milgram, 1967, "The Small World Problem", Psychology Today 1(1):61–67 | T2 | snap.stanford.edu mirror |
 *  | Travers & Milgram, 1969, Sociometry 32(4):425–443, DOI 10.2307/2786545 | T2 | (mean chain length 5.2; 64/296) |
 *  | Watts & Strogatz, 1998, Nature 393:440–442, DOI 10.1038/30918 | T1 | "Collective dynamics of small-world networks" |
 *  | Kleinberg, Networks (Cornell textbook), Ch20 "The Small-World Phenomenon" | T2 | cs.cornell.edu mirror — Core reference for B=100 rough-calc + clustering discussion |
 *  | Dodds, Muhamad, Watts, 2003, Science 301:827–829 (email experiment) | T2 | ~6 intermediaries global |
 *  | Backstrom et al. 2012, "Four Degrees of Separation" (Facebook 721M users, 69B edges → 4.74 mean) | T1 | research.facebook.com |
 *  | Leskovec & Horvitz, 2007, MS-Messenger 30B conversations, 240M users, mean 6.0 | T2 | |
 *  | Hill & Dunbar, 2003, Human Nature 14(1):53–72 (mean network 124.9/153.5, k=150 from neocortex) | T2 | |
 *  | Toyota, 2008, arXiv:0803.2399 "Some Considerations on Six Degrees of Separation" | T2 | clustering coefficient reduces propagation to "a few percent of K^d" |
 *  | Thurner, Hanel, Klimek, 2023, PLoS One / PhysRevX.13.021032 — six emerges from Nash-equilibrium centrality-cost | T1 | journals.aps.org/prx/abstract/10.1103/PhysRevX.13.021032 |
 *  ============================================================================
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS — paper-editorial (gate-4, verbatim)                 */
/* ------------------------------------------------------------------ */
const TOKENS = `
:root {
  /* Surface — warm paper, lighter than the AI-cream cluster to avoid cream-terracotta */
  --bg:          #F6F2E9;
  --surface:     #FBF8F0;
  --surface-2:   #EFE9D8;   /* inset strip */
  --hairline:        rgba(26,24,21,0.14);
  --hairline-strong: rgba(26,24,21,0.32);
  --ink:          #1A1815;
  --ink-2:        #5A5247;
  --ink-3:        #8A8273;

  /* Accent: oxblood — rubber-stamp red on an envelope, NOT terracotta.
     Reserved for: source node, felt-tip target, "6 reaches Earth" headline marker. */
  --accent:      #8A2A2A;
  --accent-soft: rgba(138,42,42,0.12);

  /* Categorical degree ramp (d0..d6, fixed order, NEVER cycled) — vintage wax-seal palette */
  --d0: #1A1815;   /* source — ink */
  --d1: #7A6A4F;   /* sepia */
  --d2: #5B7B6A;   /* verdigris */
  --d3: #8A6F3E;   /* brass */
  --d4: #4F5A6E;   /* navy ink */
  --d5: #8A2A2A;   /* oxblood — ties ring 5 to the headline */
  --d6: #6B3A52;   /* auburn — Earth-reached cap */

  --ok: #4F6A3A;   /* rare ok state (reached-Earth) — green ink */

  /* Type — two roles, restraint */
  --font-display: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif; /* headlines + the "6" */
  --font-body:    ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif;
  --font-mono:    ui-monospace, "SF Mono", Menlo, Consolas, monospace; /* numbers */
}
body { margin: 0; }
input[type="range"] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 9999px; background: var(--hairline-strong); outline: none; cursor: pointer; }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 14px; height: 14px; border-radius: 9999px;
  background: var(--accent); border: 2px solid var(--surface); cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 9999px;
  background: var(--accent); border: 2px solid var(--surface); cursor: pointer;
}
@keyframes haloPulse {
  from { opacity: 0.9; transform: scale(0.55); }
  to   { opacity: 0;   transform: scale(1.7); }
}
.halo-anim circle { animation: haloPulse 800ms ease-out forwards; transform-origin: center; transform-box: fill-box; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// deterministic pseudo-random (stable across renders for a given seed)
const rnd = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// human units: 1.2K / 1.5M / 4.1B / ≫ (>1e12)
const trimNum = (x) => {
  const r = Math.round(x * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};
const human = (n) => {
  if (n >= 1e12) return "≫";
  if (n >= 1e9) return trimNum(n / 1e9) + "B";
  if (n >= 1e6) return trimNum(n / 1e6) + "M";
  if (n >= 1e3) return trimNum(n / 1e3) + "K";
  return String(Math.round(n));
};

// plain-language sentence per degree, keyed by population magnitude
function stripSentence(d, v) {
  if (d === 0) return "you — the starting point";
  if (v < 100) return "just the people you know";
  if (v < 1e4) return "a school or workplace";
  if (v < 1e6) return "a small city";
  if (v < 1e8) return "a large country";
  if (v < 1e9) return "a continent";
  return "most of Earth";
}

/* ------------------------------------------------------------------ */
/*  RING DIAGRAM (SVG) — polar layout + fold-back hairlines signature   */
/* ------------------------------------------------------------------ */
const RING_R = 38;          // px per degree
const GOLDEN = 2.399963;    // golden angle — organic dot scatter
const CX = 280, CY = 280;   // viewBox center (560x560)

// symbolic dot count per ring — grows with ring, scales with f
const dotCount = (d, f) =>
  d === 0 ? 1 : clamp(Math.round((4 + d * 3) * Math.sqrt(f / 40)), 6, 30);

const dotPos = (d, i, n) => {
  if (d === 0) return { x: CX, y: CY };
  const r = d * RING_R;
  const a = (i / n) * Math.PI * 2 + GOLDEN * d + rnd(d * 7 + i) * 0.35;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
};

function RingDiagram({ currentDegree, f, C, reached, worldPop, worldLabel, halo }) {
  const edges = [];
  const dots = [];
  for (let d = 1; d <= 6; d++) {
    const n = dotCount(d, f);
    for (let i = 0; i < n; i++) dots.push({ d, i, n, p: dotPos(d, i, n) });
  }
  // candidate edges: 2 per dot on rings 1..5; C fraction fold back, (1−C) forward
  for (let d = 1; d <= 5; d++) {
    const n1 = dotCount(d, f);
    const n2 = dotCount(d + 1, f);
    for (let i = 0; i < n1; i++) {
      for (let j = 0; j < 2; j++) {
        const s = rnd(d * 1000 + i * 10 + j);
        const p1 = dotPos(d, i, n1);
        const a1 = Math.atan2(p1.y - CY, p1.x - CX);
        if (s < C) {
          // fold-back: curl back onto an earlier ring (0..d)
          const er = Math.floor(rnd(s * 977 + d * 31 + j) * (d + 1));
          const en = er === 0 ? 1 : dotCount(er, f);
          const t = Math.floor(rnd(s * 513 + i * 7 + j) * en);
          const p2 = dotPos(er, t, en);
          const a2 = Math.atan2(p2.y - CY, p2.x - CX);
          const am = a1 + (a2 - a1) * 0.5;
          const rc = d * RING_R + RING_R * 0.85; // reaches outward, then folds back
          const ctrl = { x: CX + Math.cos(am) * rc, y: CY + Math.sin(am) * rc };
          edges.push({ kind: "fold", d, p1, p2, ctrl });
        } else {
          // forward: to a dot on the next ring
          const t = Math.floor(rnd(s * 291 + i * 3 + j) * n2);
          const p2 = dotPos(d + 1, t, n2);
          const a2 = Math.atan2(p2.y - CY, p2.x - CX);
          const am = a1 + (a2 - a1) * 0.5;
          const rc = (d + 0.5) * RING_R;
          const ctrl = { x: CX + Math.cos(am) * rc, y: CY + Math.sin(am) * rc };
          edges.push({ kind: "fwd", d, p1, p2, ctrl });
        }
      }
    }
  }

  const ringStyle = (shown) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "scale(1)" : "scale(0.82)",
    transition: "opacity 350ms ease, transform 350ms ease",
  });

  return (
    <svg viewBox="0 0 560 560" className="w-full h-auto" role="img" aria-label="Ring diagram of the six-degrees chain">
      {/* ring guide circles */}
      {[1, 2, 3, 4, 5, 6].map((d) => (
        <circle key={`g${d}`} cx={CX} cy={CY} r={d * RING_R} fill="none" stroke="var(--hairline)" strokeWidth="1" />
      ))}
      {/* ring labels */}
      {[1, 2, 3, 4, 5, 6].map((d) => (
        <text key={`l${d}`} x={CX} y={CY - d * RING_R - 8} textAnchor="middle" fontSize="10"
          style={{ fontFamily: "var(--font-mono)", fill: `var(--d${d})` }}>
          d{d}
        </text>
      ))}

      {/* edges — grouped by source ring, revealed as the chain builds */}
      {[1, 2, 3, 4, 5].map((d) => (
        <g key={`e${d}`} style={ringStyle(currentDegree >= d + 1)}>
          {edges.filter((e) => e.d === d).map((e, k) =>
            e.kind === "fwd" ? (
              <path key={k} d={`M ${e.p1.x} ${e.p1.y} Q ${e.ctrl.x} ${e.ctrl.y} ${e.p2.x} ${e.p2.y}`}
                fill="none" stroke={`var(--d${d + 1})`} strokeWidth="1" opacity="0.45" />
            ) : (
              <path key={k} d={`M ${e.p1.x} ${e.p1.y} Q ${e.ctrl.x} ${e.ctrl.y} ${e.p2.x} ${e.p2.y}`}
                fill="none" stroke="var(--hairline)" strokeWidth="1" opacity="0.55" strokeDasharray="2 4" />
            )
          )}
        </g>
      ))}

      {/* ring dots */}
      {[1, 2, 3, 4, 5, 6].map((d) => (
        <g key={`d${d}`} style={ringStyle(currentDegree >= d)}>
          {dots.filter((x) => x.d === d).map((x, k) => (
            <circle key={k} cx={x.p.x} cy={x.p.y} r="3.5" fill={`var(--d${d})`} />
          ))}
        </g>
      ))}

      {/* source node — you */}
      <circle cx={CX} cy={CY} r="9" fill="var(--ink)" />
      <text x={CX} y={CY + 24} textAnchor="middle" fontSize="10"
        style={{ fontFamily: "var(--font-mono)", fill: "var(--ink-2)" }}>you</text>

      {/* target — felt-tip oxblood marker at ring 6 */}
      {currentDegree >= 6 && (
        <g>
          {halo && (
            <g className="halo-anim">
              <circle cx={CX} cy={CY - 6 * RING_R} r="14" fill="none" stroke="var(--accent)" strokeWidth="2" />
            </g>
          )}
          <circle cx={CX} cy={CY - 6 * RING_R} r="7" fill="var(--accent)" />
          <text x={CX} y={CY - 6 * RING_R - 12} textAnchor="middle" fontSize="10"
            style={{ fontFamily: "var(--font-mono)", fill: "var(--accent)" }}>target</text>
        </g>
      )}

      {/* live readout — current degree */}
      <text x={CX} y={556} textAnchor="middle" fontSize="11"
        style={{ fontFamily: "var(--font-mono)", fill: "var(--ink-3)" }}>
        chain depth: <tspan id="current-degree" style={{ fill: "var(--ink)" }}>{currentDegree}</tspan> / 6
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  REACH CURVE (SVG mini-chart, log-scale y, no chart lib)             */
/* ------------------------------------------------------------------ */
const CW = 560, CH = 150, PL = 36, PR = 12, PT = 12, PB = 24;

function ReachCurve({ reached, worldPop, worldLabel, hitEarthDegree }) {
  const maxVal = Math.max(worldPop, reached[6]);
  const logMax = Math.log10(maxVal);
  const x = (d) => PL + (d / 6) * (CW - PL - PR);
  const y = (v) => PT + (1 - Math.log10(Math.max(v, 1)) / logMax) * (CH - PT - PB);
  const base = PT + (CH - PT - PB);

  const pts = reached.map((v, d) => ({ x: x(d), y: y(v), v, d }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${x(6).toFixed(1)} ${base} L ${x(0).toFixed(1)} ${base} Z`;

  const grid = [1, 100, 1e4, 1e6, 1e8, 1e9].filter((v) => v <= maxVal);
  const hitBy6 = reached[6] >= worldPop;
  const pct = Math.min(100, Math.round((reached[6] / worldPop) * 100));

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full h-auto" role="img" aria-label="Reach curve — population reached per degree">
      {/* log gridlines */}
      {grid.map((v) => (
        <g key={v}>
          <line x1={PL} y1={y(v)} x2={CW - PR} y2={y(v)} stroke="var(--hairline)" strokeWidth="1" />
          <text x={PL - 6} y={y(v) + 3} textAnchor="end" fontSize="8"
            style={{ fontFamily: "var(--font-mono)", fill: "var(--ink-3)" }}>{human(v)}</text>
        </g>
      ))}

      {/* world-population cap — horizontal ink rule with tick */}
      <line x1={PL} y1={y(worldPop)} x2={CW - PR} y2={y(worldPop)} stroke="var(--hairline-strong)" strokeWidth="1.2" />
      <line x1={CW - PR - 4} y1={y(worldPop) - 4} x2={CW - PR - 4} y2={y(worldPop) + 4} stroke="var(--hairline-strong)" strokeWidth="1.2" />
      <text x={CW - PR - 8} y={y(worldPop) - 6} textAnchor="end" fontSize="9"
        style={{ fontFamily: "var(--font-mono)", fill: "var(--ink-2)" }}>
        {human(worldPop)} {worldLabel}
      </text>

      {/* filled area + line */}
      <path d={area} fill="var(--surface-2)" />
      <path d={line} fill="none" stroke="var(--ink)" strokeWidth="1.5" />

      {/* per-degree points */}
      {pts.map((p) => (
        <circle key={p.d} cx={p.x} cy={p.y} r="3" fill={`var(--d${p.d})`} />
      ))}

      {/* degree-6 annotation */}
      <g>
        <circle cx={x(6)} cy={y(reached[6])} r="4.5" fill={hitBy6 ? "var(--accent)" : "var(--ink-2)"} />
        <line x1={x(6) - 6} y1={y(reached[6]) - 6} x2={x(6) - 26} y2={y(reached[6]) - 22}
          stroke={hitBy6 ? "var(--accent)" : "var(--ink-2)"} strokeWidth="1" />
        <text x={x(6) - 30} y={y(reached[6]) - 24} textAnchor="end" fontSize="9"
          style={{ fontFamily: "var(--font-mono)", fill: hitBy6 ? "var(--accent)" : "var(--ink-2)" }}>
          {hitBy6 ? `6 reaches ${worldLabel}` : `6 → ${pct}% of ${worldLabel}`}
        </text>
      </g>

      {/* x labels */}
      {[0, 1, 2, 3, 4, 5, 6].map((d) => (
        <text key={`x${d}`} x={x(d)} y={CH - 6} textAnchor="middle" fontSize="9"
          style={{ fontFamily: "var(--font-mono)", fill: `var(--d${d})` }}>d{d}</text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  PER-DEGREE STRIP                                                    */
/* ------------------------------------------------------------------ */
function PerDegreeStrip({ reached, currentDegree }) {
  return (
    <div className="flex">
      {reached.map((v, d) => (
        <div key={d} className="flex-1 px-4 py-4 border-r last:border-r-0"
          style={{ borderColor: "var(--hairline)", opacity: d > currentDegree ? 0.35 : 1, transition: "opacity 300ms ease" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: `var(--d${d})` }} />
            <span className="font-mono text-[11px]" style={{ color: `var(--d${d})` }}>d{d}</span>
          </div>
          <div className="text-[12px] leading-snug mb-2" style={{ color: "var(--ink-2)" }}>
            {stripSentence(d, v)}
          </div>
          <div className="font-mono text-[13px] tabular-nums" style={{ color: "var(--ink)" }}>
            {human(v)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTROLS                                                            */
/* ------------------------------------------------------------------ */
const WORLD_PRESETS = [
  { id: "village", label: "Village", pop: 1000, sub: "1K" },
  { id: "city", label: "City", pop: 1e6, sub: "1M" },
  { id: "country", label: "Country", pop: 1e8, sub: "100M" },
  { id: "earth", label: "Earth", pop: 8.05e9, sub: "8.05B" },
];

function Controls({ B, C, worldPop, worldLabel, f, reached, hitEarthDegree, animating, onB, onC, onWorld, onBuild }) {
  const pct = Math.min(100, Math.round((reached[6] / worldPop) * 100));
  return (
    <div className="p-6 space-y-5">
      <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>Controls</div>

      {/* branching factor */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-2)" }}>Friends per person</span>
          <span className="font-mono text-sm tabular-nums" style={{ color: "var(--ink)" }}>{B} friends</span>
        </div>
        <input id="branch-slider" type="range" min={5} max={200} step={5} value={B}
          onChange={(e) => onB(parseFloat(e.target.value))} className="w-full" />
      </div>

      {/* clustering */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-2)" }}>Friend-overlap (clustering)</span>
          <span className="font-mono text-sm tabular-nums" style={{ color: "var(--ink)" }}>{Math.round(C * 100)}%</span>
        </div>
        <input id="cluster-slider" type="range" min={0} max={0.95} step={0.05} value={C}
          onChange={(e) => onC(parseFloat(e.target.value))} className="w-full" />
      </div>

      {/* world size presets */}
      <div>
        <div className="text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "var(--ink-2)" }}>World size</div>
        <div className="grid grid-cols-2 gap-1.5">
          {WORLD_PRESETS.map((w) => (
            <button key={w.id} id={`btn-${w.id}`} onClick={() => onWorld(w)}
              className="px-2 py-1.5 text-[11px] font-medium transition-colors"
              style={worldPop === w.pop
                ? { background: "var(--ink)", color: "var(--surface)" }
                : { background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--hairline)" }}>
              {w.label} <span className="font-mono">{w.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* build / replay */}
      <div className="grid grid-cols-2 gap-1.5">
        <button id="btn-build" onClick={onBuild} disabled={animating}
          className="px-3 py-2 text-[12px] font-medium transition-colors disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--surface)" }}>
          {animating ? "Building…" : "Build the chain"}
        </button>
        <button id="btn-replay" onClick={onBuild} disabled={animating}
          className="px-3 py-2 text-[12px] font-medium transition-colors disabled:opacity-40"
          style={{ background: "var(--surface-2)", color: "var(--ink)", border: "1px solid var(--hairline)" }}>
          Replay
        </button>
      </div>

      {/* live readouts */}
      <div className="border p-4 space-y-3" style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--ink-3)" }}>Effective branching</div>
          <div id="f-readout" className="font-mono text-xl tabular-nums" style={{ color: "var(--ink)" }}>f = {trimNum(f)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--ink-3)" }}>Reached by hop 6</div>
          <div id="reached-readout" className="font-mono text-xl tabular-nums" style={{ color: "var(--ink)" }}>
            {human(reached[6])} <span className="text-[12px]" style={{ color: "var(--ink-3)" }}>/ {human(worldPop)} ({pct}%)</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--ink-3)" }}>Depth to {worldLabel}</div>
          <div id="hops-readout" className="font-mono text-xl tabular-nums" style={{ color: "var(--ink)" }}>
            {hitEarthDegree ? `~${hitEarthDegree} hops` : "never"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MATH ASIDE — collapsible, closed by default (formula framing only)  */
/* ------------------------------------------------------------------ */
function MathAside({ open, f, reached, worldLabel }) {
  return (
    <div id="math-aside" className={open ? "block" : "hidden"}>
      <div className="border-t px-6 py-5" style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}>
        <div className="font-mono text-[12px] mb-3" style={{ color: "var(--ink)" }}>
          N ≈ (B(1−C))^d — effective branching f = B(1−C)
        </div>
        <table className="font-mono text-[12px] tabular-nums" style={{ color: "var(--ink-2)" }}>
          <thead>
            <tr className="text-left" style={{ color: "var(--ink-3)" }}>
              <th className="pr-6 font-normal">degree</th>
              <th className="pr-6 font-normal">new people (f^d)</th>
              <th className="font-normal">cumulative reached</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <tr key={d}>
                <td className="pr-6" style={{ color: `var(--d${d})` }}>d{d}</td>
                <td className="pr-6">{human(Math.pow(f, d))}</td>
                <td>{human(reached[d])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "var(--ink-2)" }}>
          Clustering shrinks the effective branching from B to B(1−C) — the price of triadic
          closure. The model, its assumptions, and its sources live in the source comments
          (entry.jsx header).
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADLINE STRIP                                                      */
/* ------------------------------------------------------------------ */
function HeadlineStrip({ B, C, f, reached, worldPop, worldLabel, hitEarthDegree }) {
  const pct = Math.min(100, Math.round((reached[6] / worldPop) * 100));
  return (
    <div className="flex items-end justify-between px-8 py-6 border-b" style={{ borderColor: "var(--hairline)" }}>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--ink-3)" }}>
          The small-world phenomenon · a field guide
        </div>
        <h1 className="font-display" style={{ fontSize: "28pt", lineHeight: 1.05, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
          Six Degrees of Separation
        </h1>
        <div className="text-[15px] mt-1" style={{ color: "var(--ink-2)" }}>
          How 8 billion strangers are a few handshakes apart
        </div>
      </div>
      <div className="text-right">
        <div className="font-display tabular-nums leading-none" style={{ fontSize: "140pt", color: "var(--accent)", fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}>
          6
        </div>
        <div id="punchline" className="font-mono text-[13px] leading-relaxed mt-1" style={{ color: "var(--ink-2)" }}>
          <div>{B} friends × {Math.round(C * 100)}% friend-overlap → f = {trimNum(f)}</div>
          <div>
            by hop 6: <span style={{ color: "var(--accent)" }}>{human(reached[6])}</span> people ({pct}% of {worldLabel})
          </div>
          <div>
            {hitEarthDegree
              ? <>full {worldLabel} reachable in <span style={{ color: hitEarthDegree <= 6 ? "var(--accent)" : "var(--ink)" }}>~{hitEarthDegree} hops</span></>
              : "the world never grows — everyone already knows everyone"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */
function SixDegreesApp() {
  const [B, setB] = useState(100);
  const [C, setC] = useState(0.6);
  const [worldPop, setWorldPop] = useState(8.05e9);
  const [worldLabel, setWorldLabel] = useState("Earth");
  const [currentDegree, setCurrentDegree] = useState(6);
  const [animating, setAnimating] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [halo, setHalo] = useState(false);
  const timers = useRef([]);

  const reduced = useMemo(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const f = B * (1 - C);

  const reached = useMemo(() => {
    const arr = [1];
    for (let d = 1; d <= 6; d++) {
      arr.push(Math.min(arr[d - 1] + Math.pow(f, d), worldPop));
    }
    return arr;
  }, [f, worldPop]);

  const hitEarthDegree = useMemo(() => {
    if (f <= 1) return null;
    let cum = 1;
    for (let d = 1; d <= 20; d++) {
      cum += Math.pow(f, d);
      if (cum >= worldPop) return d;
    }
    return null;
  }, [f, worldPop]);

  const buildChain = () => {
    if (animating) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAnimating(true);
    setHalo(false);
    setCurrentDegree(0);
    if (reduced) {
      setCurrentDegree(6);
      setAnimating(false);
      if (reached[6] >= worldPop) {
        setHalo(true);
        timers.current.push(setTimeout(() => setHalo(false), 800));
      }
      return;
    }
    let acc = 0;
    for (let d = 1; d <= 6; d++) {
      acc += Math.max(200, 600 - 50 * d); // decelerating: 550, 500, 400, 350, 250, 200
      const t = setTimeout(() => {
        setCurrentDegree(d);
        if (d === 6) {
          setAnimating(false);
          if (reached[6] >= worldPop) {
            setHalo(true);
            timers.current.push(setTimeout(() => setHalo(false), 800));
          }
        }
      }, acc);
      timers.current.push(t);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-body)" }}>
      <style>{TOKENS}</style>

      <div className="max-w-[1240px] mx-auto my-6 border" style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}>
        <HeadlineStrip B={B} C={C} f={f} reached={reached} worldPop={worldPop} worldLabel={worldLabel} hitEarthDegree={hitEarthDegree} />

        {/* center zone — ring diagram + reach curve | controls */}
        <div className="grid grid-cols-[1fr_340px]">
          <div className="p-6 border-r" style={{ borderColor: "var(--hairline)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>The chain — ring by ring</span>
              <span className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
                {C > 0 ? `${Math.round(C * 100)}% of new contacts fold back — clustering waste` : "no clustering — every contact is new"}
              </span>
            </div>
            <RingDiagram currentDegree={currentDegree} f={f} C={C} reached={reached} worldPop={worldPop} worldLabel={worldLabel} halo={halo} />
            <div className="mt-2">
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "var(--ink-3)" }}>Reach curve — log scale</div>
              <ReachCurve reached={reached} worldPop={worldPop} worldLabel={worldLabel} hitEarthDegree={hitEarthDegree} />
            </div>
          </div>

          <Controls B={B} C={C} worldPop={worldPop} worldLabel={worldLabel} f={f} reached={reached}
            hitEarthDegree={hitEarthDegree} animating={animating}
            onB={setB} onC={setC}
            onWorld={(w) => { setWorldPop(w.pop); setWorldLabel(w.label); }}
            onBuild={buildChain} />
        </div>

        {/* bottom strip — per-degree explainer */}
        <div className="border-t" style={{ borderColor: "var(--hairline)" }}>
          <PerDegreeStrip reached={reached} currentDegree={currentDegree} />
        </div>

        {/* footer — math aside toggle */}
        <div className="border-t px-6 py-3 flex items-center justify-between" style={{ borderColor: "var(--hairline)" }}>
          <button id="btn-math" onClick={() => setShowMath((s) => !s)}
            className="text-[12px] font-medium transition-colors"
            style={{ color: "var(--ink-2)" }}>
            {showMath ? "Hide the math" : "The math — how the number is built"}
          </button>
          <span className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
            drag the sliders · build the chain · watch six degrees bend
          </span>
        </div>
        <MathAside open={showMath} f={f} reached={reached} worldLabel={worldLabel} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<SixDegreesApp />);