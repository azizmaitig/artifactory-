/**
 * ============================================================================
 *  RESONANCE LAB v2 — driven damped oscillator simulator
 *  ----------------------------------------------------------------------------
 *  Two modes:
 *    LESSON  — a guided 4-step explainer: a physicist walks an 18-year-old
 *              through resonance. Hook (Tacoma Narrows) → ring frequency →
 *              resonance explosion → damping. Predict-then-observe: every
 *              reveal is a guess first. Plain-language readouts.
 *    EXPLORE — free sandbox: sliders, presets, theory overlay, live charts.
 *
 *  GATE 2 — FORMAT: JSX — recharts required (response + time-series charts)
 *  + composed multi-panel UI with shared state (ticket 08 rules 2 & 4).
 *
 *  GATE 3 — DOMAIN MODEL (load-bearing, never shown in-UI)
 *    Equation of motion (m = 1 kg):  x'' + 2ζω₀x' + ω₀²x = f₀·cos(ωt)
 *      ω₀ = 2π·f_nat (rad/s)   ζ = damping ratio   f₀ = F₀/m = 1 N/kg
 *    Steady-state amplitude (closed form):
 *      A(ω) = f₀ / √((ω₀²−ω²)² + (2ζω₀ω)²)
 *    Amplification over static deflection (A_static = f₀/ω₀²):
 *      Q(ω) = ω₀² / √((ω₀²−ω²)² + (2ζω₀ω)²),  peak Q(ω₀) = 1/(2ζ)
 *    Phase lag:  φ = atan2(2ζω₀ω, ω₀²−ω²)  ∈ [0, π]
 *    Peak of A is at ω_peak = ω₀√(1−2ζ²) (≈ ω₀ for light damping).
 *
 *    WORKED EXAMPLE: f_nat = 1.0 Hz → ω₀ = 6.283 rad/s, ζ = 0.05.
 *      A_static = 1/ω₀² = 0.0253 m.  At ω = ω₀:
 *      Q = 1/(2·0.05) = 10.0 → A = 0.253 m.  Verified:
 *      A(ω₀) = 1/√((2ζω₀²)²) = 1/(2·0.05·39.48) = 0.2533 m ✓ (10.0× static)
 *      Phase at resonance: φ = atan2(2ζω₀², 0) = 90° ✓ (classic result)
 *
 *    ASSUMPTIONS (error direction tagged):
 *    A1. Linear spring + linear viscous damping — model OVER-predicts
 *        amplitude near resonance at low ζ (real systems go nonlinear /
 *        saturate; error direction: optimistic).
 *    A2. Single DOF, no coupling, base fixed — real mounts flex; error
 *        direction: model slightly stiffer than reality.
 *    A3. Numerical integration: semi-implicit Euler, dt = 1/240 s, 4 steps
 *        per animation frame. First-order — phase drifts slowly at very low
 *        ζ over long runs (energy drift); error direction: transient
 *        accuracy degrades, steady state visually correct (charts use the
 *        closed-form solution, which is exact).
 *    A4. History buffer caps at 15 s — older transient is discarded; the
 *        windowed view is the artifact's truth (not a bug).
 *
 *    CONFIDENCE: charts are closed-form textbook identities (checked against
 *    the worked example above); animation validated by watching the transient
 *    converge to the analytic envelope and to the theory overlay. Lesson
 *    reveals assert the same worked values (10.0× at ζ=0.05, 1.4× at ζ=0.35).
 *  ============================================================================
 */
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ReferenceDot, ReferenceArea,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS — ADR-001 + per-brief palette ("lab bench at night") */
/* ------------------------------------------------------------------ */
const TOKENS = `
:root {
  --bg: #0A0C0E;
  --surface: #14171A;
  --surface2: #1B1F23;
  --hairline: rgba(255,255,255,0.08);
  --accent: #3FD8C4;
  --theory: #A78BFA;
  --band: #FFB454;
  --text-primary: #E8EAED;
  --text-secondary: #9AA4AE;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --font-body: system-ui, sans-serif;
}
.c-accent { color: var(--accent); stroke: var(--accent); fill: var(--accent); }
.c-theory { color: var(--theory); stroke: var(--theory); fill: var(--theory); }
.c-band { fill: var(--band); }
.c-dim { color: var(--text-secondary); stroke: var(--text-secondary); fill: var(--text-secondary); }
.c-track { stroke: var(--hairline); }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 12px; height: 12px; border-radius: 9999px;
  background: var(--accent); border: 2px solid var(--bg); cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  width: 12px; height: 12px; border-radius: 9999px;
  background: var(--accent); border: 2px solid var(--bg); cursor: pointer;
}
`;

// Recharts renders SVG attributes — var() does not resolve in attributes,
// so chart colors are the same palette as JS constants (single source).
const C = {
  accent: "#3FD8C4",
  theory: "#A78BFA",
  band: "#FFB454",
  text: "#E8EAED",
  dim: "#9AA4AE",
  grid: "rgba(255,255,255,0.06)",
};

/* ------------------------------------------------------------------ */
/*  PHYSICS                                                             */
/* ------------------------------------------------------------------ */
const DT = 1 / 240;       // physics substep (s)
const SUB = 4;            // substeps per animation frame
const F0 = 1;             // drive force amplitude (N), m = 1 kg
const HIST_MAX = 60 * 15; // 15 s window at 60 Hz

function steadyState(fDrive, zeta, fNat) {
  const w0 = 2 * Math.PI * fNat;
  const w = 2 * Math.PI * fDrive;
  const denom = (w0 * w0 - w * w) ** 2 + (2 * zeta * w0 * w) ** 2;
  const A = 1 / Math.sqrt(denom);              // m (f₀ = 1 N/kg)
  const phi = Math.atan2(2 * zeta * w0 * w, w0 * w0 - w * w); // [0, π]
  const amp = w0 * w0 / Math.sqrt(denom);      // amplification × A_static
  const q = 1 / (2 * zeta);                    // quality factor
  return { w0, w, A, phi, amp, q };
}

function responseCurve(zeta, fNat, ratioMax) {
  const w0 = 2 * Math.PI * fNat;
  const pts = [];
  for (let r = 0.02; r <= ratioMax; r += 0.02) {
    const w = r * w0;
    const q = w0 * w0 / Math.sqrt((w0 * w0 - w * w) ** 2 + (2 * zeta * w0 * w) ** 2);
    pts.push({ r: +r.toFixed(2), q: +q.toFixed(3) });
  }
  return pts;
}

/* ------------------------------------------------------------------ */
/*  LESSON CONTENT — the physicist's script                            */
/* ------------------------------------------------------------------ */
const LESSON = [
  {
    title: "The bridge that shook itself apart",
    body:
      "Tacoma Narrows Bridge, 1940. A breeze — 18 m/s, nothing extreme — twisted a " +
      "highway deck 1.5 m up and down until the road tore apart in 45 minutes. The wind " +
      "wasn't unusually strong: it was pushing at exactly the frequency the bridge wanted " +
      "to swing at. That's resonance. This spring is the same physics in miniature.",
    question: null,
    action: { label: "Begin — meet the spring", patch: null, to: 1 },
    insight: null,
  },
  {
    title: "Every system has a ring frequency",
    body:
      "Tap a wine glass: it rings at one pitch — its natural frequency. The spring and mass " +
      "ring at f_nat, here 1.0 Hz. Drag the driving frequency slider below from 0.2 to 4 Hz " +
      "and watch the mass — or the marker on the response curve. It wakes up exactly when " +
      "the drive matches the ring.",
    question: "Try it: sweep the slider until the bounce is biggest. Where does that happen?",
    action: { label: "Next — why it explodes", patch: null, to: 2 },
    insight: null,
  },
  {
    title: "The resonance explosion",
    body:
      "At the ring frequency, every push lands at the same spot of the swing, and energy " +
      "piles up. Pushed slowly, this mass deflects 2.5 cm. Pushed at its ring frequency " +
      "with just 5% damping, it swings much, much farther.",
    question: "Guess first: how many times farther? 2×? 10×? 100×?",
    action: { label: "Reveal — push it at the ring frequency", patch: { driveMult: 1.0, zeta: 0.05 }, to: 3 },
    insight:
      "10× farther — from a push that barely moved it. Q = 1/(2ζ) = 1/(2·0.05) = 10. " +
      "Each swing adds a small push to the one before.",
  },
  {
    title: "Damping is the safety net",
    body:
      "Structures can't stop the wind from driving them, but they can bleed the energy. " +
      "Going from 5% damping to 35% damping turns the 10× peak into a small bump.",
    question: "Guess: with seven times more damping, the peak drops from 10× to…?",
    action: { label: "Reveal — crank the damping", patch: { driveMult: 1.0, zeta: 0.35 }, to: 4 },
    insight:
      "1.4×. Same wind, same bridge — just energy losses. Tuned mass dampers do exactly " +
      "this for modern skyscrapers.",
  },
];

function LessonPanel({ step, insight, onAction, onFinish }) {
  if (step >= LESSON.length) {
    return (
      <div className="rounded-lg border p-4" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
        <div className="font-mono text-[11px] c-dim mb-2">Step 4 / 4</div>
        <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>You found the secret</div>
        <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
          Resonance = energy piling up when the drive matches the ring frequency.
          Damping = the bleed valve. Now break it yourself: push at 2× the ring
          frequency and watch the mass fight the drive — phase lag flips past 90°.
        </p>
        {insight && (
          <div className="text-[11px] leading-relaxed mb-2 p-2 rounded"
            style={{ background: "rgba(63,216,196,0.08)", color: "var(--accent)" }}>
            {insight}
          </div>
        )}
        <button
          onClick={onFinish}
          className="w-full py-1.5 text-[11px] font-medium rounded-md transition-colors"
          style={{ background: "var(--accent)", color: "var(--bg)" }}
        >
          Finish — free play
        </button>
      </div>
    );
  }

  const s = LESSON[step];
  return (
    <div className="rounded-lg border p-4" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider c-dim">Lesson · guided</span>
        <span className="font-mono text-[11px] tabular-nums c-dim">Step {step + 1} / 4</span>
      </div>
      <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</div>
      <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{s.body}</p>
      {s.question && (
        <div className="text-[11px] leading-relaxed mb-2 border-l-2 pl-2"
          style={{ borderColor: "var(--accent)", color: "var(--text-primary)" }}>
          {s.question}
        </div>
      )}
      {insight && (
        <div className="text-[11px] leading-relaxed mb-2 p-2 rounded"
          style={{ background: "rgba(63,216,196,0.08)", color: "var(--accent)" }}>
          {insight}
        </div>
      )}
      <button
        onClick={() => onAction(s.action)}
        className="w-full py-1.5 text-[11px] font-medium rounded-md transition-colors"
        style={s.action.patch
          ? { background: "var(--accent)", color: "var(--bg)" }
          : { background: "var(--surface2)", color: "var(--text-primary)", border: "1px solid var(--hairline)" }}
      >
        {s.action.label}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  UI ATOMS                                                            */
/* ------------------------------------------------------------------ */
function Slider({ label, value, unit, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] uppercase tracking-wider c-dim">{label}</span>
        <span className="font-mono text-sm tabular-nums" style={{ color: "var(--text-primary)" }}>
          {value.toFixed(2)}
          <span className="c-dim ml-0.5">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: "var(--surface2)", accentColor: "var(--accent)" }}
      />
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "var(--hairline)" }}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt)}
          className="flex-1 py-1.5 text-[11px] font-medium transition-colors"
          style={
            value === opt.value
              ? { background: "var(--accent)", color: "var(--bg)" }
              : { background: "var(--surface2)", color: "var(--text-secondary)" }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ReadoutTile({ label, value, unit }) {
  return (
    <div className="rounded-lg border p-3" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
      <div className="text-[11px] uppercase tracking-wider c-dim mb-1">{label}</div>
      <div className="font-mono text-xl tabular-nums" style={{ color: "var(--text-primary)" }}>
        {value}
        <span className="text-xs c-dim ml-1">{unit}</span>
      </div>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] c-dim">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
      <span className="uppercase tracking-wider">{label}</span>
      <span className="font-mono tabular-nums" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SPRING DIAGRAM (SVG)                                                */
/* ------------------------------------------------------------------ */
const VW = 640, VH = 230, TRACK_Y = 178;
const WALL_X = 44, MASS_W = 40, MASS_H = 48;

function SpringDiagram({ x, v, drive, running, w }) {
  const px = WALL_X + 26 + x * 46;             // mass left edge
  const cy = TRACK_Y - MASS_H / 2;             // coil centerline
  const coils = 9;
  const coilW = Math.max(6, px - WALL_X - 22); // available coil span
  const coilH = 18;
  const pts = [];
  for (let i = 0; i <= coils * 2; i++) {
    const t = i / (coils * 2);
    pts.push(`${WALL_X + 14 + coilW * t},${cy + (i % 2 === 0 ? -coilH / 2 : coilH / 2)}`);
  }
  const coilPath = "M " + pts.join(" L ");
  const fScale = Math.cos(w * drive) * 52;     // drive arrow length (px)
  const midX = px + MASS_W / 2;

  return (
    <div className="rounded-lg border" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[11px] uppercase tracking-wider c-dim">Mass on spring — live view</span>
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded"
          style={
            running
              ? { background: "rgba(63,216,196,0.12)", color: "var(--accent)" }
              : { background: "var(--surface2)", color: "var(--text-secondary)" }
          }
        >
          {running ? "RUNNING" : "PAUSED"}
        </span>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto px-2 pb-2" role="img" aria-label="Spring-mass oscillator diagram">
        {/* equilibrium marker */}
        <line x1={WALL_X} y1={cy + coilH / 2 + 14} x2={px + MASS_W / 2} y2={cy + coilH / 2 + 14}
          className="c-track" strokeDasharray="3 3" strokeWidth="1" />
        <text x={WALL_X + 8} y={cy + coilH / 2 + 26} fontSize="9" className="c-dim" style={{ fontFamily: "var(--mono)" }}>
          equilibrium x = 0
        </text>

        {/* track */}
        <line x1={WALL_X - 4} y1={TRACK_Y} x2={VW - 24} y2={TRACK_Y} className="c-track" strokeWidth="2" />

        {/* wall */}
        <rect x={WALL_X - 10} y={TRACK_Y - 92} width="10" height={92} fill="#2A3038" />
        <text x={WALL_X - 10} y={TRACK_Y - 98} fontSize="9" className="c-dim" textAnchor="middle" style={{ fontFamily: "var(--mono)" }}>wall</text>

        {/* spring */}
        <path d={coilPath} fill="none" strokeWidth="1.5" style={{ stroke: "var(--text-secondary)" }} strokeLinejoin="round" />

        {/* mass */}
        <rect x={px} y={TRACK_Y - MASS_H} width={MASS_W} height={MASS_H} rx="2"
          style={{ fill: "var(--surface2)", stroke: "var(--accent)" }} strokeWidth="1.5" />
        <text x={midX} y={TRACK_Y - MASS_H / 2 + 3} fontSize="10" textAnchor="middle"
          className="c-accent" style={{ fontFamily: "var(--mono)" }}>m</text>

        {/* drive force arrow */}
        {running && (
          <g>
            <line x1={midX} y1={TRACK_Y - MASS_H - 14} x2={midX + fScale} y2={TRACK_Y - MASS_H - 14}
              strokeWidth="2" style={{ stroke: "var(--accent)", opacity: 0.85 }} />
            {fScale !== 0 && (
              <path
                d={`M ${midX + fScale} ${TRACK_Y - MASS_H - 14} l ${Math.sign(fScale) * -6} -3.5 l 0 7 Z`}
                fill="var(--accent)"
              />
            )}
            <text x={midX} y={TRACK_Y - MASS_H - 24} fontSize="9" textAnchor="middle"
              className="c-accent" style={{ fontFamily: "var(--mono)" }}>F₀·cos(ωt)</text>
          </g>
        )}

        {/* position readout */}
        <text x={VW - 24} y={TRACK_Y + 20} fontSize="11" textAnchor="end" className="c-accent" style={{ fontFamily: "var(--mono)" }}>
          x = {x.toFixed(3)} m
        </text>
        <text x={VW - 24} y={TRACK_Y + 34} fontSize="11" textAnchor="end" className="c-dim" style={{ fontFamily: "var(--mono)" }}>
          v = {v.toFixed(3)} m/s
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */
const RATIO_MAX = 3;
const PRESETS = [
  { label: "At resonance", value: "res", zeta: 0.05, mult: 1.0 },
  { label: "Off resonance", value: "off", zeta: 0.05, mult: 0.8 },
  { label: "Deadened", value: "dead", zeta: 0.35, mult: 1.0 },
];

function App() {
  const [params, setParams] = useState({ fDrive: 1.0, zeta: 0.05, fNat: 1.0 });
  const [running, setRunning] = useState(true);
  const [showTheory, setShowTheory] = useState(true);
  const [mode, setMode] = useState("explore");
  const [step, setStep] = useState(0);
  const [insight, setInsight] = useState(null);
  const [, setTick] = useState(0);

  const paramsRef = useRef(params);
  paramsRef.current = params;
  const runningRef = useRef(running);
  runningRef.current = running;
  const sim = useRef({ x: 0, v: 0, t: 0, hist: [] });

  // simulation loop — 4 substeps per animation frame
  useEffect(() => {
    let raf;
    const loop = () => {
      if (runningRef.current) {
        const p = paramsRef.current;
        const w0 = 2 * Math.PI * p.fNat;
        const w = 2 * Math.PI * p.fDrive;
        const s = sim.current;
        for (let i = 0; i < SUB; i++) {
          const F = F0 * Math.cos(w * s.t);
          const a = F - 2 * p.zeta * w0 * s.v - w0 * w0 * s.x;
          s.v += a * DT;
          s.x += s.v * DT;
          s.t += DT;
        }
        s.hist.push({ t: s.t, x: s.x });
        if (s.hist.length > HIST_MAX) s.hist.shift();
      }
      setTick((t) => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reset = () => {
    sim.current = { x: 0, v: 0, t: 0, hist: [] };
    setTick((t) => t + 1);
  };

  // lesson reveal: apply patch (drive = mult × f_nat), restart sim, advance
  const onLessonAction = (action) => {
    if (action.patch) {
      setParams((prev) => ({
        ...prev,
        fDrive: +(action.patch.driveMult * prev.fNat).toFixed(2),
        zeta: action.patch.zeta,
      }));
      setInsight(LESSON[step].insight);
      reset();
    }
    setStep(action.to);
  };

  const enterLesson = () => { setMode("lesson"); setStep(0); setInsight(null); };

  const { fDrive, zeta, fNat } = params;
  const ss = steadyState(fDrive, zeta, fNat);
  const ratio = fDrive / fNat;
  const ratioClamped = Math.min(ratio, RATIO_MAX);
  const curve = responseCurve(zeta, fNat, RATIO_MAX);
  const curveAtRatio = curve.find((c) => Math.abs(c.r - ratioClamped) < 0.02) || curve[curve.length - 1];

  // time-series window (last 12 s) + theory overlay
  const hist = sim.current.hist;
  const tNow = sim.current.t;
  const winStart = Math.max(0, tNow - 12);
  const series = [];
  let maxAbs = 0.02;
  for (let i = hist.length - 1; i >= 0; i--) {
    const h = hist[i];
    if (h.t < winStart) break;
    const xt = ss.A * Math.cos(ss.w * h.t - ss.phi);
    series.unshift({ t: +h.t.toFixed(2), live: +h.x.toFixed(4), theory: showTheory ? +xt.toFixed(4) : null });
    maxAbs = Math.max(maxAbs, Math.abs(h.x), Math.abs(xt));
  }
  const yMax = +(maxAbs * 1.25).toFixed(3);

  // plain-language translation of the current state (lesson mode)
  const staticDef = ss.A / ss.amp; // f₀/ω₀²
  const plain = `A slow, steady push bends the spring ${staticDef.toFixed(3)} m. At this drive it swings ${ss.A.toFixed(3)} m — ${ss.amp.toFixed(1)}× farther.`;

  const tooltipStyle = {
    background: "var(--surface2)", border: "1px solid var(--hairline)",
    borderRadius: 6, fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-primary)",
  };
  const axisStyle = { fontSize: 10, fill: "var(--text-secondary)", fontFamily: "var(--mono)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
      <style>{TOKENS}</style>

      <div className="max-w-6xl mx-auto px-5 py-6">
        {/* header */}
        <header className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider c-dim mb-1">
              {mode === "lesson" ? "Guided lesson · a physicist walks you through" : "Interactive physics · driven oscillator"}
            </div>
            <h1 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Resonance lab</h1>
          </div>
          <div className="flex items-center gap-2">
            <Segmented
              options={[
                { label: "Lesson", value: "lesson" },
                { label: "Explore", value: "explore" },
              ]}
              value={mode}
              onChange={(opt) => (opt.value === "lesson" ? enterLesson() : setMode("explore"))}
            />
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
              style={running
                ? { background: "var(--surface2)", color: "var(--text-primary)", border: "1px solid var(--hairline)" }
                : { background: "var(--accent)", color: "var(--bg)" }}
            >
              {running ? "Pause" : "Play"}
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
              style={{ background: "var(--surface2)", color: "var(--text-secondary)", border: "1px solid var(--hairline)" }}
            >
              Reset
            </button>
          </div>
        </header>

        {/* readout tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <ReadoutTile label="Amplification" value={ss.amp.toFixed(1)} unit="× static" />
          <ReadoutTile label="Q factor" value={ss.q.toFixed(1)} unit={`· peak ×${(1 / (2 * zeta)).toFixed(0)}`} />
          <ReadoutTile label="Phase lag" value={`${(ss.phi * 180 / Math.PI).toFixed(0)}`} unit="deg" />
          <ReadoutTile label="Steady amplitude" value={ss.A.toFixed(3)} unit="m" />
        </div>
        {mode === "lesson" && (
          <div className="text-[11px] mb-4" style={{ color: "var(--text-secondary)" }}>
            <span className="c-accent">Physicist's translation:</span> {plain}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* control rail */}
          <div className="rounded-lg border p-4 space-y-4" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
            {mode === "lesson" ? (
              <LessonPanel step={step} insight={insight} onAction={onLessonAction} onFinish={() => setMode("explore")} />
            ) : (
              <div className="text-[11px] uppercase tracking-wider c-dim">Drive &amp; system</div>
            )}
            <div className="text-[11px] uppercase tracking-wider c-dim">Controls</div>
            <Slider label="Driving frequency" value={fDrive} unit="Hz" min={0.2} max={4} step={0.05}
              onChange={(v) => setParams((p) => ({ ...p, fDrive: v }))} />
            <Slider label="Damping ζ" value={zeta} unit="" min={0.01} max={0.5} step={0.01}
              onChange={(v) => setParams((p) => ({ ...p, zeta: v }))} />
            <Slider label="Natural frequency" value={fNat} unit="Hz" min={0.5} max={3} step={0.05}
              onChange={(v) => setParams((p) => ({ ...p, fNat: v }))} />
            <div>
              <div className="text-[11px] uppercase tracking-wider c-dim mb-1.5">Presets</div>
              <Segmented options={PRESETS} value={null} onChange={(opt) =>
                setParams((prev) => ({ ...prev, fDrive: +(prev.fNat * opt.mult).toFixed(2), zeta: opt.zeta }))
              } />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider c-dim mb-1.5">Theory overlay</div>
              <Segmented
                options={[
                  { label: "On", value: true },
                  { label: "Off", value: false },
                ]}
                value={showTheory}
                onChange={(opt) => setShowTheory(opt.value)}
              />
            </div>
            {mode !== "lesson" && (
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Sweep the driving frequency toward the natural frequency and watch the
                amplitude climb — Q = 1/(2ζ) says how many times the static deflection
                it can reach.
              </p>
            )}
          </div>

          {/* spring diagram */}
          <div className="md:col-span-2">
            <SpringDiagram x={sim.current.x} v={sim.current.v} drive={sim.current.t} running={running} w={ss.w} />
          </div>
        </div>

        {/* charts row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* response curve */}
          <div className="md:col-span-2 rounded-lg border p-4" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider c-dim">Response curve</span>
              <span className="text-[11px] c-dim">amplification vs ω/ω₀</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curve} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="r" type="number" domain={[0, RATIO_MAX]} tickCount={7}
                    tick={axisStyle} stroke={C.grid} label={{ value: "ω/ω₀", position: "insideBottom", offset: -2, fontSize: 10, fill: C.dim }} />
                  <YAxis tick={axisStyle} stroke={C.grid} width={30}
                    label={{ value: "amplification", angle: -90, position: "insideLeft", fontSize: 10, fill: C.dim }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}×`, "amplification"]} labelFormatter={(l) => `ω/ω₀ = ${l}`} />
                  <ReferenceArea x1={0.95} x2={1.05} fill={C.band} fillOpacity={0.1}
                    label={{ value: "resonance", position: "insideTop", fontSize: 10, fill: C.band }} />
                  <ReferenceLine x={1} stroke={C.band} strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Line type="monotone" dataKey="q" stroke={C.accent} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <ReferenceDot x={+ratioClamped.toFixed(2)} y={curveAtRatio.q} r={4.5}
                    fill={C.accent} stroke="#0A0C0E" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Chip label="response" value={`${ss.amp.toFixed(1)}×`} color={C.accent} />
              <span className="font-mono text-[11px] tabular-nums c-dim">
                ω/ω₀ = {ratio.toFixed(2)}{ratio > RATIO_MAX ? " (off-scale)" : ""}
              </span>
            </div>
          </div>

          {/* time series */}
          <div className="md:col-span-3 rounded-lg border p-4" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider c-dim">Position over time</span>
              <span className="text-[11px] c-dim">last 12 s · transient converging to steady state</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" type="number" domain={["dataMin", "dataMax"]} tickCount={7}
                    tick={axisStyle} stroke={C.grid} label={{ value: "t (s)", position: "insideBottom", offset: -2, fontSize: 10, fill: C.dim }} />
                  <YAxis domain={[-yMax, yMax]} tick={axisStyle} stroke={C.grid} width={38}
                    label={{ value: "x (m)", angle: -90, position: "insideLeft", fontSize: 10, fill: C.dim }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={0} stroke={C.grid} />
                  {showTheory && (
                    <Line type="monotone" dataKey="theory" stroke={C.theory} strokeWidth={1.2}
                      strokeDasharray="4 3" dot={false} isAnimationActive={false} name="theory" connectNulls />
                  )}
                  <Line type="monotone" dataKey="live" stroke={C.accent} strokeWidth={1.5}
                    dot={false} isAnimationActive={false} name="live" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Chip label="live" value={`${sim.current.x.toFixed(3)} m`} color={C.accent} />
              {showTheory && <Chip label="theory" value={`${(ss.A * Math.cos(ss.w * tNow - ss.phi)).toFixed(3)} m`} color={C.theory} />}
            </div>
          </div>
        </div>

        <footer className="mt-4 text-[11px] c-dim">
          {mode === "lesson"
            ? "The number that matters: Q = 1/(2ζ). Damping 5% → peak ×10. Damping 35% → ×1.4."
            : "Amplification peaks when ω ≈ ω₀ — at this damping the peak is " + ss.q.toFixed(1) + "× the static deflection. Theory overlay is the closed-form steady state A·cos(ωt − φ)."}
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);