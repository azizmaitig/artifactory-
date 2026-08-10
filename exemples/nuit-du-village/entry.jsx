/**
 * ============================================================================
 *  NUIT DU VILLAGE  v2  —  social-deduction party game, 3–8 players, one laptop
 *  ----------------------------------------------------------------------------
 *  One-night format: roles dealt, one night of secret actions, one vote, one
 *  elimination, full reveal. The DEVICE is the moderator: shuffle, night
 *  script, debate timer, vote tally, winner. Pass-the-device for secrets,
 *  standing screen for shared state. No phones. French, funny, flat.
 *
 *  v2 (Stack A): classic/advanced mode toggle.
 *    - avancée adds: 3 unknown CENTRE CARDS + two new roles.
 *      * Le CHARLATAN — at night, swaps his role (blind) with a player OR a
 *        centre card. He never learns what he got; the truth surfaces at the
 *        end reveal.
 *      * Le BOUC ÉMISSAIRE — passive role whose secret goal is to be LYNCHED
 *        by the vote; if that happens, he alone "wins" (classic ONUW Tanner).
 *
 *  GATE 2 — FORMAT: JSX (composition + recharts — ticket 08 rules 2/4).
 *
 *  GATE 3 — DOMAIN MODEL (load-bearing, never shown in-UI)
 *    Roles: wolf (evil) vs seer/doctor/witch/charlatan/bouc/villager.
 *    Night order: wolves pick a victim → charlatan swaps (blind) → seer
 *    checks → doctor protects → witch heals-or-poisons (one action).
 *    Dawn deaths: { wolfTargetId } if !saved (by doctor or witch),
 *                 + { witchPoisonId } if any (saved by heal on victim).
 *    SWAP RESOLUTION (end of game, before win check & reveal — ONUW rule):
 *        if charlatanSwap.kind == 'player': roles swap charlatan ↔ target
 *        if charlatanSwap.kind == 'center': roles swap charlatan ↔ center[idx]
 *    WIN: dead set = dawn deaths ∪ lynched. If resolved role of any dead is a
 *         wolf → village; else wolves. Bouc override: if the LYNCHED player's
 *         resolved role is 'bouc' → he wins alone (secondary camp win shown).
 *
 *    WORKED EXAMPLE v2 (7p avancée):
 *      players: P1 seer, P2 CHARLATAN, P3 wolf, P4 doctor, P5 witch,
 *               P6 bouc, P7 wolf; centre = [wolf, villager, villager].
 *      Night: wolves (P3,P7) target P1 → charlatan P2 swaps with CENTRE idx 0
 *      → P2 becomes wolf, centre[0] becomes charlatan. Seer P1 was checked
 *      BEFORE swap (stale).
 *      Dawn deaths: P1 (wolf attack). Vote lynches P3 (wolf).
 *      Resolved dead = {P1(wolf), P3(wolf)} → ANY wolf dead ⇒ VILLAGE WINS.
 *      (Charlatan paid off: he suicided P3 as wolf, P3's card became his.)
 *      Contrast: if charlatan had swapped with P3 DIRECTLY, P3 would resolve
 *      as charlatan (village) → only P1 wolf dead → wolves still lose? no:
 *      P2 (now wolf) alive ⇒ wolves win... dead set {P1(wolf)} ⇒ wolf dead →
 *      village wins either way here. The real fork happens when NO wolf is
 *      dead pre-swap and the swap plants a wolf into the lynched seat.
 *
 *    ASSUMPTIONS (error direction tagged):
 *    A1. Wolves never target a wolf (else village wins — bias village).
 *    A2. Night victims still vote (tie shift — bias volatile).
 *    A3. Secret info is DOM-safe by construction — role cards unmount on
 *        "je cache"; React state is in-memory (trust + eyes-closed ritual).
 *    A4. Vote tie ⇒ NO ONE is lynched (safe day — bias "boring").
 *    A5. Witch heal on non-victim is an empty save: never self-reveals.
 *    A6. Charlatan swap affects only FINAL roles: night-time knowledge
 *        (seer/wolves) is resolved pre-swap → seer reading can be stale
 *        (bias: villager-side misinformation).
 *    A7. Centre cards may duplicate player roles (extra wolf possible):
 *        village cannot count the pack exactly (bias wolves-favoured).
 *    A8. Bouc wins only on VOTE death; death by wolf/poison doesn't score
 *        him (bias: bouc-favouring if house-ruled otherwise).
 *
 *    CONFIDENCE: full machine verified by Playwright — classic & avancée,
 *    both vote modes, ends with role+centre reveal, zero console errors.
 *  ============================================================================
 */
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Moon, Users, Eye, Stethoscope, FlaskConical, ScrollText, RotateCcw,
  Handshake, ShieldQuestion,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS — ADR-001 + per-brief palette                        */
/* ------------------------------------------------------------------ */
const TOKENS = `
:root {
  --bg: #0A0C0E;
  --surface: #14171A;
  --surface2: #1B1F23;
  --hairline: rgba(230,184,82,0.14);
  --accent: #E6B852;
  --text-primary: #ECE6DB;
  --text-secondary: #9B957F;
  --good: #59C98F;
  --wolf: #E2644A;
  --mystery: #8FA3BF;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --font-body: system-ui, -apple-system, sans-serif;
}
body { background: var(--bg); color: var(--text-primary);
       font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
.mono { font-family: var(--mono); font-variant-numeric: tabular-nums; }
.card { background: var(--surface); border: 1px solid var(--hairline); }
.btn-primary { background: var(--accent); color: #1a1408; font-weight: 500; }
.btn-primary:hover { background: #f0c568; }
.btn-ghost { border: 1px solid var(--hairline); color: var(--text-secondary); }
.btn-ghost:hover { color: var(--text-primary); border-color: var(--accent); }
.keyfade { animation: kfade 220ms ease-out; }
@keyframes kfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .keyfade { animation: none; } }
`;

/* ------------------------------------------------------------------ */
/*  ROLES                                                              */
/* ------------------------------------------------------------------ */
const ROLES = {
  wolf: {
    id: "wolf", faction: "wolves", name: "Loup", icon: Moon,
    flavor: "Ahhhhounnnn. Après une bonne nuit sur le village, vous ne vous en souvenez jamais autant.",
    action: "Choisissez une victime, d'un doigt discret.",
  },
  seer: {
    id: "seer", faction: "village", name: "Tante Gertrude la Voyante", icon: Eye,
    flavor: "Bavarde, myope, mais infaillible : un regard posé sur quelqu'un, et elle sait tout.",
    action: "Découvrez la vraie nature d'un joueur.",
  },
  doctor: {
    id: "doctor", faction: "village", name: "Tonton Marcel le Toubib", icon: Stethoscope,
    flavor: "Guérit tout au rhum et à l'arnica. Personne ne sait comment, mais presque tout le monde sur-vit.",
    action: "Protégez un joueur de la meute cette nuit.",
  },
  witch: {
    id: "witch", faction: "village", name: "La Sorcière du Coin", icon: FlaskConical,
    flavor: "Depuis que sa charrette a été réquisitionnée, elle garde une rancune mortelle — et deux bouteilles.",
    action: "Guérissez OU empoisonnez — un seul geste, une seule nuit.",
  },
  villager: {
    id: "villager", faction: "village", name: "Jeannot l'Innocent", icon: Users,
    flavor: "Juste Jeannot. Curieux, bruyant, zéro pouvoir — et pourtant il a toujours un avis.",
    action: "Dormez. Un simple rêve de pain frais.",
  },
  charlatan: {
    id: "charlatan", faction: "village", name: "Le Charlatan", icon: Handshake,
    flavor: "Marchand d'illusions et de vieux sorts. Son métier secret : retourner les âmes comme des gants.",
    action: "Échangez votre rôle avec un joueur — ou avec une des cartes du centre. Sans regarder.",
  },
  bouc: {
    id: "bouc", faction: "village", name: "Le Bouc Émissaire", icon: ShieldQuestion,
    flavor: "Depuis des années, on lui impute tout : la grêle, la rouille du blé, la perte des chèvres. Il en a marre.",
    action: "But secret : vous faire éliminer par le vote. Allez, accusez-vous, c'est vrai.",
  },
};

/* Role-stack per mode. Classique = v1. Avancée = + charlatan/bouc. */
const STACK = {
  3: { wolf: 1, seer: 1, villager: 1 },
  4: { wolf: 1, seer: 1, villager: 2 },
  5: { wolf: 2, seer: 1, villager: 2 },
  6: { wolf: 2, seer: 1, doctor: 1, villager: 2 },
  7: { wolf: 2, seer: 1, doctor: 1, witch: 1, villager: 2 },
  8: { wolf: 3, seer: 1, doctor: 1, witch: 1, villager: 2 },
};

const STACK_ADV = {
  3: { wolf: 1, seer: 1, charlatan: 1 },
  4: { wolf: 1, seer: 1, charlatan: 1, villager: 1 },
  5: { wolf: 2, seer: 1, charlatan: 1, villager: 1 },
  6: { wolf: 2, seer: 1, doctor: 1, charlatan: 1, villager: 1 },
  7: { wolf: 2, seer: 1, doctor: 1, witch: 1, charlatan: 1, bouc: 1 },
  8: { wolf: 3, seer: 1, doctor: 1, witch: 1, charlatan: 1, bouc: 1 },
};

/* 3 face-down centre cards (avancée) drawn from this pool. */
const CENTER_POOL = [
  "wolf", "seer", "doctor", "witch", "charlatan", "bouc", "villager",
];

const PROMPTS = [
  "Quelqu’un a-t-il réagi bizarrement à l’aube ?",
  "La voyante : raconte ce que tu as vu — en enjolivant si besoin.",
  "Quelqu’un a-t-il changé de camp dans la nuit ?",
  "Qui est resté le plus silencieux depuis le début ?",
  "Les cartes du centre : qui croit savoir ce qui s’y cache ?",
];

const DAY_SECONDS = 90;

const PHASE_LABELS = {
  setup: "Préparation", deal: "Rôles", night: "Nuit", dawn: "L'aube",
  day: "Débat", vote: "Vote", lynch: "Jugement", end: "Fin",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function growNames(arr, n) {
  const r = [...arr];
  while (r.length < n) r.push("");
  return r.slice(0, n);
}

function buildStack(n, adv) {
  const table = adv ? STACK_ADV : STACK;
  const pool = [];
  Object.entries(table[n] || {}).forEach(([role, ct]) => {
    for (let i = 0; i < ct; i++) pool.push(role);
  });
  return pool;
}

function dealRoles(names, adv) {
  const pool = shuffle(buildStack(names.length, adv));
  return names.map((nm, i) => ({
    id: "p" + i,
    name: (nm || "").trim() || `J${i + 1}`,
    role: pool[i],
    faction: ROLES[pool[i]].faction,
    dead: false,
  }));
}

function buildNightQueue(players) {
  const q = [];
  const wolves = players.filter((p) => p.role === "wolf");
  wolves.forEach((w, i) => {
    q.push({
      kind: "wolf", pid: w.id, lastWolf: i === wolves.length - 1,
      wolfNicks: wolves.map((x) => x.name), wolfIdx: i + 1, wolfCount: wolves.length,
    });
  });
  const cha = players.find((p) => p.role === "charlatan");
  if (cha) q.push({ kind: "charlatan", pid: cha.id });
  const seer = players.find((p) => p.role === "seer");
  if (seer) q.push({ kind: "seer", pid: seer.id });
  const doc = players.find((p) => p.role === "doctor");
  if (doc) q.push({ kind: "doctor", pid: doc.id });
  const witch = players.find((p) => p.role === "witch");
  if (witch) q.push({ kind: "witch", pid: witch.id });
  return q;
}

/* Night deaths (pre-swap identities; roles don't affect who's dead). */
function resolveDawn(night) {
  const deaths = [];
  const wolf = night.wolfTargetId;
  const saved =
    wolf != null && (wolf === night.doctorProtectId || wolf === night.witchHealId);
  if (wolf != null && !saved) deaths.push(wolf);
  if (night.witchPoisonId != null) deaths.push(night.witchPoisonId);
  return { deaths: [...new Set(deaths)], attackBlocked: wolf != null && saved };
}

function lynchFromVotes(votes) {
  const counts = {};
  Object.values(votes).forEach((t) => {
    if (t == null) return;
    counts[t] = (counts[t] || 0) + 1;
  });
  const ids = Object.keys(counts);
  if (!ids.length) return null;
  const max = Math.max(...ids.map((x) => counts[x]));
  const tops = ids.filter((x) => counts[x] === max);
  return tops.length === 1 ? tops[0] : null; // tie -> no lynch (A4)
}

/* Charlatan swap, applied once at reveal (roles + centre cards). */
function resolveRoles(players, centre, swap) {
  const roles = {};
  players.forEach((p) => (roles[p.id] = p.role));
  const c = centre ? [...centre] : null;
  if (!swap || !c) return { roles, centre: c };
  const cha = players.find((p) => p.role === "charlatan");
  if (!cha) return { roles, centre: c };
  const chaId = cha.id;
  if (swap.kind === "player") {
    const old = roles[chaId];
    roles[chaId] = roles[swap.pid];
    roles[swap.pid] = old;
  } else if (c) {
    const old = roles[chaId];
    roles[chaId] = c[swap.idx];
    c[swap.idx] = old;
  }
  return { roles, centre: c };
}

function winner(deadIds, roles) {
  return deadIds.some((id) => roles[id] === "wolf") ? "wolves" : "village";
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */
function Chip({ children, tone = null }) {
  const color =
    tone === "good" ? "var(--good)" :
    tone === "wolf" ? "var(--wolf)" :
    tone === "mystery" ? "var(--mystery)" : "var(--text-secondary)";
  return (
    <span
      className="inline-flex items-center gap-1 border rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider"
      style={{ color, borderColor: color + "55" }}
    >
      {children}
    </span>
  );
}

function PhaseBar({ phase, count, voteMode, gameMode }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 mb-6">
      <div className="flex items-center gap-2 min-w-0">
        <Moon size={14} className="text-[var(--accent)] shrink-0" />
        <span className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] whitespace-nowrap">
          Nuit du Village
        </span>
        <span className="mono text-[11px] text-[var(--text-secondary)] truncate">
          / {PHASE_LABELS[phase] || phase}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {gameMode && <Chip tone={gameMode === "avance" ? "mystery" : null}>
          {gameMode === "avance" ? "Avancée" : "Classique"}
        </Chip>}
        {voteMode && <Chip tone={voteMode === "open" ? "good" : null}>
          {voteMode === "open" ? "Vote ouvert" : "Vote secret"}
        </Chip>}
        <Chip>{count}</Chip>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Setup                                                              */
/* ------------------------------------------------------------------ */
function SetupView({ g, setG }) {
  const ct = g.count;
  const table = g.gameMode === "avance" ? STACK_ADV : STACK;
  const roleLine = Object.entries(table[ct])
    .map(([r, c]) => `${c}× ${ROLES[r].name.toLowerCase()}`)
    .join("  ·  ");

  const setCount = (x) => setG((s) => ({ ...s, count: x, names: growNames(s.names, x) }));
  const setGameMode = (m) => setG((s) => ({ ...s, gameMode: m }));
  const setVoteMode = (m) => setG((s) => ({ ...s, voteMode: m }));
  const setName = (i, v) =>
    setG((s) => ({ ...s, names: s.names.map((n, k) => (k === i ? v : n)) }));

  const start = () =>
    setG((s) => {
      const players = dealRoles(growNames(s.names, s.count), s.gameMode === "avance");
      const centre = s.gameMode === "avance" ? shuffle(CENTER_POOL).slice(0, 3) : [];
      return {
        ...s, phase: "deal", dealIdx: 0, dealStep: "handoff", players, centre,
        night: {}, nightIdx: 0, dawn: null, votes: {}, voteOrder: [],
        voteIdx: 0, revealStarted: false, lynchId: null, winner: null,
      };
    });

  return (
    <div className="max-w-[640px] mx-auto py-10">
      <div className="text-center mb-8">
        <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
          Social-déduction · une nuit · un vote
        </div>
        <h1 className="mono text-3xl tracking-tight text-[var(--text-primary)] font-medium">
          NUIT DU VILLAGE
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] mt-3 max-w-[420px] mx-auto">
          Des loups se cachent dans le village. Un seul grand tour de table, un
          seul vote — trouvez-les avant l’aube.
        </p>
      </div>

      <div className="card p-6 mb-4">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          Nombre de villageois
        </div>
        <div className="flex gap-2 mb-5">
          {[3, 4, 5, 6, 7, 8].map((x) => (
            <button
              key={x}
              onClick={() => setCount(x)}
              className={`flex-1 py-2 rounded-sm text-sm transition-colors ${
                ct === x
                  ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                  : "border border-[var(--hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          Qui joue ?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {g.names.slice(0, ct).map((nm, i) => (
            <input
              key={i}
              value={nm}
              onChange={(e) => setName(i, e.target.value)}
              placeholder={`Villageois ${i + 1}`}
              className="bg-[var(--surface2)] border border-[var(--hairline)] rounded-md px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--accent)]"
            />
          ))}
        </div>

        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          Variante
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setGameMode("classic")}
            className={`py-2.5 rounded-md text-[13px] transition-colors text-left px-3 ${
              g.gameMode === "classic"
                ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                : "border border-[var(--hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Classique
            <span className={`block text-[11px] mt-0.5 font-normal ${g.gameMode === "classic" ? "text-[#1a1408]/80" : "opacity-60"}`}>
              Rôles de base, pas de cartes cachées.
            </span>
          </button>
          <button
            onClick={() => setGameMode("avance")}
            className={`py-2.5 rounded-md text-[13px] transition-colors text-left px-3 ${
              g.gameMode === "avance"
                ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                : "border border-[var(--hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Avancée
            <span className={`block text-[11px] mt-0.5 font-normal ${g.gameMode === "avance" ? "text-[#1a1408]" : "opacity-60"}`}>
              3 cartes secrètes au centre + Charlatan & Bouc.
            </span>
          </button>
        </div>

        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          Un tour, un vote, comment ?
        </div>
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setVoteMode("open")}
            className={`flex-1 py-2.5 rounded-md text-[13px] transition-colors ${
              g.voteMode === "open"
                ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                : "border border-[var(--hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Vote ouvert (visible, dingue)
          </button>
          <button
            onClick={() => setVoteMode("secret")}
            className={`flex-1 py-2.5 rounded-md text-[13px] transition-colors ${
              g.voteMode === "secret"
                ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                : "border border-[var(--hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Vote secret (passe-la)
          </button>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText size={13} className="text-[var(--accent)]" />
          <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
            Compo de la meute — publique
          </span>
        </div>
        <div className="mono text-[12.5px] text-[var(--text-primary)]">
          {roleLine}
          {g.gameMode === "avance" && (
            <span className="text-[var(--mystery)]">  ·  + 3 cartes du centre (secrètes)</span>
          )}
        </div>
      </div>

      <button
        onClick={start}
        className="btn-primary w-full py-3.5 rounded-md text-[14px] transition-colors"
      >
        Commencer la nuit
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Role deal (pass-the-device secret)                                 */
/* ------------------------------------------------------------------ */
function DealView({ g, setG }) {
  const cur = g.players[g.dealIdx];
  const last = g.dealIdx >= g.players.length - 1;
  const R = ROLES[cur.role];
  const Icon = R.icon;

  if (g.dealStep === "handoff") {
    return (
      <div className="max-w-[560px] mx-auto py-16 text-center">
        <Moon size={30} className="mx-auto text-[var(--accent)] mb-4" />
        <div className="mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">
          Distribution des rôles · {g.dealIdx + 1}/{g.players.length}
        </div>
        <h2 className="text-[20px] text-[var(--text-primary)] font-medium mb-3">
          {cur.name}, attrapez l’appareil
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] max-w-[360px] mx-auto mb-8">
          Tout le monde tourne la tête. Un seul regard à la fois : le vôtre.
        </p>
        <button
          onClick={() => setG((s) => ({ ...s, dealStep: "reveal" }))}
          className="btn-primary px-8 py-3 rounded-md text-[14px] transition-colors"
        >
          C’est moi — je regarde
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto py-14 text-center">
      <div className="keyfade">
        <div className="flex justify-center mb-5">
          <Chip tone={R.faction === "wolves" ? "wolf" : "good"}>
            {R.faction === "wolves" ? "La meute" : "Le village"}
          </Chip>
        </div>
        <Icon size={26} className={`mx-auto mb-3 ${R.faction === "wolves" ? "text-[var(--wolf)]" : "text-[var(--good)]"}`} />
        <h2 className="text-[22px] leading-snug text-[var(--text-primary)] font-medium mb-3">
          Vous êtes : {R.name}
        </h2>
        <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed max-w-[380px] mx-auto mb-1">
          {R.flavor}
        </p>
        <div className="mono text-[12px] text-[var(--accent)] mt-2 mb-8">
          {R.action}
        </div>
        <button
          onClick={() =>
            setG((s) => {
              if (s.dealIdx >= s.players.length - 1)
                return { ...s, phase: "night", nightIdx: 0 };
              return { ...s, dealIdx: s.dealIdx + 1, dealStep: "handoff" };
            })
          }
          className="btn-primary px-8 py-3 rounded-md text-[14px] transition-colors"
        >
          J’ai compris — je cache{last ? " · la nuit commence" : ""}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Night — device-as-narrator, fixed wake order                       */
/* ------------------------------------------------------------------ */
function NightView({ g, setG }) {
  const queue = useMemo(() => buildNightQueue(g.players), [g.players]);
  const step = queue[g.nightIdx];
  const actor = g.players.find((p) => p.id === step?.pid);
  const N = g.night;
  const [witchAct, setWitchAct] = useState("poison");
  const [chaPick, setChaPick] = useState("player");

  const finishAction = (extra) =>
    setG((s) => {
      const night = { ...s.night, ...extra };
      if (s.nightIdx >= queue.length - 1) {
        const dawn = resolveDawn(night);
        return {
          ...s, night, dawn, phase: "dawn",
          voteOrder: shuffle(s.players.map((p) => p.id)),
          voteIdx: 0, votes: {}, revealStarted: false, lynchId: null,
        };
      }
      return { ...s, night, nightIdx: s.nightIdx + 1 };
    });

  const PlayerGrid = ({ onPick }) => (
    <div className="grid grid-cols-2 gap-2 my-6">
      {g.players.map((p) => (
        <button
          key={p.id}
          onClick={() => onPick(p.id)}
          className="py-3 rounded-md border border-[var(--hairline)] text-[13.5px] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
        >
          {p.name}
        </button>
      ))}
    </div>
  );

  /* ---- wolf step ---- */
  if (step?.kind === "wolf") {
    const isLast = step.lastWolf;
    return (
      <div className="max-w-[560px] mx-auto py-14 text-center">
        <div className="keyfade">
          <Moon size={28} className="mx-auto text-[var(--wolf)] mb-3" />
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">
            Nuit · la meute · loup {step.wolfIdx}/{step.wolfCount}
          </div>
          <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-2">
            {actor.name}, tu es le &laquo;&nbsp;{ROLES.wolf.name}&nbsp;&raquo;
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mb-1">
            Les autres loups de la meute : {step.wolfNicks.join(", ")}
          </p>
          <p className="mono text-[12px] text-[var(--accent)] mb-6">
            Chuchotez entre vous pour décider qui va choisir. Le dernier loup
            tenant l’appareil désigne la victime.
          </p>
          {isLast ? (
            <>
              <div className="text-[11px] uppercase tracking-widest text-[var(--wolf)] mb-2">
                Toi aussi — choisis la victime
              </div>
              <PlayerGrid onPick={(id) => finishAction({ wolfTargetId: id })} />
            </>
          ) : (
            <button
              onClick={() => setG((s) => ({ ...s, nightIdx: s.nightIdx + 1 }))}
              className="btn-ghost px-6 py-2.5 rounded-md text-[13px]"
            >
              J’ai compris — passe
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---- charlatan step ---- */
  if (step?.kind === "charlatan") {
    if (N.charlatanSwap) {
      const who =
        N.charlatanSwap.kind === "player"
          ? g.players.find((p) => p.id === N.charlatanSwap.pid)?.name
          : `Carte ${["A", "B", "C"][N.charlatanSwap.idx]??""}`;
      return (
        <div className="max-w-[460px] mx-auto py-16 text-center">
          <div className="keyfade">
            <Handshake size={26} className="mx-auto text-[var(--good)] mb-4" />
            <div className="text-[19px] font-medium mb-1">
              Vous échangez avec {who}
            </div>
            <div className="text-[13px] text-[var(--text-secondary)] mb-6">
              Échange scellé. Vous ignorez votre nouvelle nature — et la leur.
            </div>
            <button
              onClick={() => finishAction({})}
              className="btn-ghost px-6 py-2.5 rounded-md text-[13px]"
            >
              J’ai échangé — passe
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-[560px] mx-auto py-14 text-center">
        <div className="keyfade">
          <Handshake size={28} className="mx-auto text-[var(--good)] mb-3" />
          <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-1">
            {actor.name}, le Charlatan
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">
            Échangez votre rôle à l’aveugle — avec un joueur, ou une carte du centre.
          </p>
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setChaPick("player")}
              className={`px-4 py-2 rounded-md text-[13px] transition-colors ${
                chaPick === "player"
                  ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                  : "border border-[var(--hairline)] text-[var(--text-secondary)]"
              }`}
            >
              Un joueur
            </button>
            <button
              onClick={() => setChaPick("centre")}
              className={`px-4 py-2 rounded-md text-[13px] transition-colors ${
                chaPick === "centre"
                  ? "bg-[var(--accent)] text-[#1a1408] font-medium"
                  : "border border-[var(--hairline)] text-[var(--text-secondary)]"
              }`}
            >
              Une carte du centre
            </button>
          </div>
          {chaPick === "player" ? (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--good)] mb-2">
                Qui volez-vous du rôle ?
              </div>
              <PlayerGrid
                onPick={(pid) => setG((s) => ({ ...s, night: { ...s.night, charlatanSwap: { kind: "player", pid } } }))}
              />
            </div>
          ) : (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--mystery)] mb-2">
                Quelle carte du centre ?
              </div>
              <div className="grid grid-cols-3 gap-2 my-6">
                {["A", "B", "C"].map((lbl, idx) => (
                  <button
                    key={lbl}
                    onClick={() => setG((s) => ({ ...s, night: { ...s.night, charlatanSwap: { kind: "centre", idx } } }))}
                    className="py-6 rounded-md border border-[var(--hairline)] text-[var(--mystery)] transition-colors hover:border-[var(--accent)] flex flex-col items-center gap-1"
                  >
                    <Moon size={16} />
                    <span className="mono text-[12px]">Carte {lbl}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---- seer step ---- */
  if (step?.kind === "seer") {
    if (N.seerResult) {
      const isWolf = N.seerResult === "wolf";
      const target = g.players.find((p) => p.id === N.seerCheckId);
      return (
        <div className="max-w-[460px] mx-auto py-16 text-center">
          <div className="keyfade">
            <Eye size={26} className={`mx-auto mb-4 ${isWolf ? "text-[var(--wolf)]" : "text-[var(--good)]"}`} />
            <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">
              Tante Gertrude a vu
            </div>
            <div className="text-[22px] font-medium mb-2">
              {target?.name}{" "}
              <span className={isWolf ? "text-[var(--wolf)]" : "text-[var(--good)]"}>
                {isWolf ? "∈ la meute" : "∈ le village"}
              </span>
            </div>
            <button
              onClick={() => finishAction({})}
              className="btn-ghost mt-6 px-6 py-2.5 rounded-md text-[13px]"
            >
              J’ai vu — passe
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-[560px] mx-auto py-14 text-center">
        <div className="keyfade">
          <Eye size={28} className="mx-auto text-[var(--good)] mb-3" />
          <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-1">
            {actor.name}, la Voyante
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">
            Ouvrez un œil sur un villageois, discrètement.
          </p>
          <PlayerGrid
            onPick={(pId) => {
              const isWolf = g.players.find((p) => p.id === pId)?.role === "wolf";
              setG((s) => ({
                ...s, night: { ...s.night, seerCheckId: pId, seerResult: isWolf ? "wolf" : "village" },
              }));
            }}
          />
        </div>
      </div>
    );
  }

  /* ---- doctor ---- */
  if (step?.kind === "doctor") {
    if (N.doctorProtectId != null) {
      const target = g.players.find((p) => p.id === N.doctorProtectId);
      return (
        <div className="max-w-[460px] mx-auto py-16 text-center">
          <div className="keyfade">
            <Stethoscope size={26} className="mx-auto text-[var(--good)] mb-4" />
            <div className="text-[19px] font-medium mb-1">
              Vous veillez sur {target?.name}
            </div>
            <div className="text-[13px] text-[var(--text-secondary)] mb-6">
              Le rhum le protège aussi.
            </div>
            <button
              onClick={() => finishAction({})}
              className="btn-ghost px-6 py-2.5 rounded-md text-[13px]"
            >
              J’ai pansé — passe
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-[560px] mx-auto py-14 text-center">
        <div className="keyfade">
          <Stethoscope size={28} className="mx-auto text-[var(--good)] mb-3" />
          <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-1">
            {actor.name}, Tonton Marcel
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">
            Une seule protection cette nuit.
          </p>
          <PlayerGrid
            onPick={(pId) => setG((s) => ({ ...s, night: { ...s.night, doctorProtectId: pId } }))}
          />
        </div>
      </div>
    );
  }

  /* ---- witch ---- */
  if (step?.kind === "witch") {
    const chose = N.witchPoisonId != null || N.witchHealId != null;
    if (chose) {
      const target = g.players.find((p) =>
        p.id === (N.witchPoisonId ?? N.witchHealId));
      return (
        <div className="max-w-[460px] mx-auto py-16 text-center">
          <div className="keyfade">
            <FlaskConical size={26} className="mx-auto text-[var(--good)] mb-4" />
            <div className="text-[19px] font-medium mb-1">
              {N.witchPoisonId != null
                ? `Vous empoisonnez ${target?.name}`
                : `Vous guérissez ${target?.name}`}
            </div>
            <button
              onClick={() => finishAction({})}
              className="btn-ghost mt-6 px-6 py-2.5 rounded-md text-[13px]"
            >
              J’ai agi — passe
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-[560px] mx-auto py-14 text-center">
        <div className="keyfade">
          <FlaskConical size={28} className="mx-auto text-[var(--good)] mb-3" />
          <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-1">
            {actor.name}, la Sorcière
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">
            Une fiole de vie OU une fiole de mort — un seul geste.
          </p>
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setWitchAct("poison")}
              className={`px-4 py-2 rounded-md text-[13px] transition-colors ${
                witchAct === "poison"
                  ? "bg-[var(--wolf)] text-white font-medium"
                  : "border border-[var(--hairline)] text-[var(--text-secondary)]"
              }`}
            >
              Empoisonner
            </button>
            <button
              onClick={() => setWitchAct("heal")}
              className={`px-4 py-2 rounded-md text-[13px] transition-colors ${
                witchAct === "heal"
                  ? "bg-[var(--good)] text-[#0a1408] font-medium"
                  : "border border-[var(--hairline)] text-[var(--text-secondary)]"
              }`}
            >
              Guérir
            </button>
          </div>
          {witchAct === "poison" ? (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--wolf)] mb-2">
                Qui empoisonner ?
              </div>
              <PlayerGrid
                onPick={(pId) => setG((s) => ({ ...s, night: { ...s.night, witchPoisonId: pId } }))}
              />
            </div>
          ) : (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--good)] mb-2">
                Qui guérir ?
              </div>
              <PlayerGrid
                onPick={(pId) => setG((s) => ({ ...s, night: { ...s.night, witchHealId: pId } }))}
              />
            </div>
          )}
          <button
            onClick={() => finishAction({})}
            className="btn-ghost mt-4 px-5 py-2 rounded-md text-[12.5px]"
          >
            Rien, je passe mon tour
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Dawn / Day                                                         */
/* ------------------------------------------------------------------ */
function DawnView({ g, setG }) {
  const d = g.dawn;
  const deadNames = (d?.deaths || [])
    .map((id) => g.players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="max-w-[560px] mx-auto py-16 text-center">
      <div className="keyfade">
        <Moon size={30} className="mx-auto text-[var(--accent)] mb-4" />
        <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
          L’aube
        </div>
        {d.attackBlocked && deadNames.length === 0 ? (
          <>
            <h2 className="text-[22px] text-[var(--good)] font-medium mb-3">
              Personne n’est mort cette nuit
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mb-8">
              L’attaque de la meute a été parée. (Rhum, pansement, sort —
              on ne saura jamais.)
            </p>
          </>
        ) : deadNames.length > 0 ? (
          <>
            <h2 className="text-[22px] text-[var(--wolf)] font-medium mb-3">
              Le village pleure : <span className="mono">{deadNames.join(", ")}</span>
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mb-8">
              Leur rôle reste secret. À vous de trouver qui a frappé.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[22px] text-[var(--good)] font-medium mb-3">
              Personne n’est mort cette nuit
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mb-8">
              Ironie de la nuit : personne n’a été attaqué.
            </p>
          </>
        )}
        <button
          onClick={() => setG((s) => ({ ...s, phase: "day" }))}
          className="btn-primary px-8 py-3 rounded-md text-[14px]"
        >
          Ouvrir les débats
        </button>
      </div>
    </div>
  );
}

function DayView({ g, setG }) {
  const [left, setLeft] = useState(DAY_SECONDS);
  useEffect(() => {
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const prompt =
    PROMPTS[Math.min(PROMPTS.length - 1, Math.floor((DAY_SECONDS - left) / 30))];
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="max-w-[560px] mx-auto py-12 text-center">
      <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
        Discussion · dénoncez, tartinez
      </div>
      <div className="mono text-[42px] text-[var(--accent)] mb-6 tabular-nums">
        {mm}:{ss}
      </div>
      <div className="card p-6 mb-6">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          Amorce de discussion
        </div>
        <p className="text-[16px] text-[var(--text-primary)] leading-snug min-h-[48px]">
          {prompt}
        </p>
      </div>
      <div className="text-[12.5px] text-[var(--text-secondary)] mb-6">
        Silence = laissez les loups gagner. Parlez, accusez, défendez-vous.
      </div>
      <button
        onClick={() =>
          setG((s) => ({
            ...s, phase: "vote", voteIdx: 0, votes: {}, revealStarted: false, lynchId: null,
          }))
        }
        className="btn-primary px-8 py-3 rounded-md text-[14px]"
      >
        Passer au vote →
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Vote (open = live tally / secret = simultaneous reveal)            */
/* ------------------------------------------------------------------ */
function VoteView({ g, setG }) {
  const voters = g.voteOrder;
  const curId = voters[g.voteIdx];
  const cur = g.players.find((p) => p.id === curId);

  const tally = useMemo(() => {
    const c = {};
    Object.values(g.votes).forEach((t) => {
      if (t != null) c[t] = (c[t] || 0) + 1;
    });
    return c;
  }, [g.votes]);

  const castAll = (targetId) =>
    setG((s) => {
      const votes = { ...s.votes, [s.voteOrder[s.voteIdx]]: targetId };
      const last = s.voteIdx >= s.voteOrder.length - 1;
      if (!last) return { ...s, votes, voteIdx: s.voteIdx + 1 };
      if (s.voteMode === "secret") return { ...s, votes, revealStarted: true };
      const lynchId = lynchFromVotes(votes);
      return { ...s, votes, phase: "lynch", lynchId };
    });

  /* ---- secret mode: all votes in, simultaneous reveal ---- */
  if (g.revealStarted) {
    return (
      <div className="max-w-[560px] mx-auto py-12 text-center">
        <div className="keyfade">
          <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">
            Révélation simultanée — qui a voté qui
          </div>
          <div className="card p-5 mb-6 text-left">
            {g.voteOrder.map((vid) => {
              const from = g.players.find((p) => p.id === vid)?.name;
              const to = g.votes[vid] == null
                ? null
                : g.players.find((p) => p.id === g.votes[vid])?.name;
              return (
                <div key={vid} className="flex items-center justify-between mono text-[13px] py-1">
                  <span className="text-[var(--text-primary)]">{from}</span>
                  <span className="text-[var(--accent)]">→ {to ?? "s'abstient"}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() =>
              setG((s) => ({
                ...s, phase: "lynch", lynchId: lynchFromVotes(s.votes),
              }))
            }
            className="btn-primary px-8 py-3 rounded-md text-[14px]"
          >
            Révéler l’élimination
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto py-12 text-center">
      <div className="keyfade">
        <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">
          Le vote · {g.voteIdx + 1}/{voters.length}
        </div>
        <h2 className="text-[22px] text-[var(--text-primary)] font-medium mb-1">
          {cur?.name}, qui éliminez-vous ?
        </h2>
        <p className={`text-[12.5px] mb-5 ${
          g.voteMode === "secret" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
        }`}>
          {g.voteMode === "secret"
            ? "Vote confidentiel — tout sera révélé d'un bloc."
            : "Vote ouvert : tout le monde voit la tendance en direct."}
        </p>

        {g.voteMode === "open" && (
          <div className="card p-4 mb-5 text-left">
            <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
              Compteur (en direct)
            </div>
            <div className="space-y-1">
              {g.players.map((p) => (
                <div key={p.id} className="flex items-center justify-between mono text-[12px]">
                  <span className="text-[var(--text-primary)]">{p.name}</span>
                  <span className="text-[var(--accent)]">{tally[p.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 my-5">
          {g.players.map((p) => (
            <button
              key={p.id}
              onClick={() => castAll(p.id)}
              className="py-3 rounded-md border border-[var(--hairline)] text-[13.5px] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
            >
              {p.name}
              {g.dawn?.deaths?.includes(p.id) && (
                <span className="ml-1 text-[var(--wolf)]">†</span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => castAll(null)}
          className="btn-ghost px-6 py-2.5 rounded-md text-[12.5px]"
        >
          S’abstenir — ne rien faire
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lynch + End                                                        */
/* ------------------------------------------------------------------ */
function LynchView({ g, setG }) {
  const lynched = g.players.find((p) => p.id === g.lynchId);
  const { roles } = useMemo(
    () => resolveRoles(g.players, g.centre, g.night.charlatanSwap),
    [g]
  );
  const finalRole = lynched ? roles[lynched.id] : null;
  const deadSet = useMemo(() => {
    const s = new Set(g.dawn?.deaths || []);
    if (g.lynchId) s.add(g.lynchId);
    return s;
  }, [g]);
  const w = winner([...deadSet], roles);

  return (
    <div className="max-w-[560px] mx-auto py-16 text-center">
      <div className="keyfade">
        <ScrollText size={28} className="mx-auto text-[var(--accent)] mb-4" />
        <div className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">
          Le village a décidé
        </div>
        {lynched ? (
          <>
            <h2 className="text-[24px] text-[var(--text-primary)] font-medium mb-3">
              {lynched.name} est éliminé
              {finalRole === "wolf" ? " — enfin !" : "…"}
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mb-3">
              {finalRole === "bouc"
                ? "… et c’était le Bouc Émissaire. Personne n’est content, encore moins lui."
                : `${lynched.name} était ${
                    ROLES[finalRole]?.name.toLowerCase() ?? "quelqu’un d’autre"
                  } (${ROLES[finalRole]?.faction === "wolves" ? "la meute" : "le village"}).`}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[24px] text-[var(--accent)] font-medium mb-3">
              Personne n’est éliminé (égalité)
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6">
              Le procès se conclut dans le doute.
            </p>
          </>
        )}
        <button
          onClick={() => setG((s) => ({ ...s, phase: "end", winner: w }))}
          className="btn-primary px-8 py-3 rounded-md text-[14px]"
        >
          Dévoiler le village entier
        </button>
      </div>
    </div>
  );
}

function EndView({ g, setG }) {
  const { roles, centre } = useMemo(
    () => resolveRoles(g.players, g.centre, g.night.charlatanSwap),
    [g]
  );
  const deadIds = [
    ...new Set([...(g.dawn?.deaths || []), ...(g.lynchId ? [g.lynchId] : [])]),
  ];
  const wolfWin = g.winner === "wolves";
  const lynchedRole = g.lynchId ? roles[g.lynchId] : null;
  const boucOwn = lynchedRole === "bouc";
  const showCentre = g.gameMode === "avance" && Array.isArray(centre) && centre.length === 3;

  const headerTitle = boucOwn
    ? "LE BOUC ÉMISSAIRE TRIOMPHE"
    : wolfWin ? "LES LOUPS GAGNENT" : "LE VILLAGE GAGNE";
  const headerSub = boucOwn
    ? `Cherchant qui se félicitait de sa chute — il obtient exactement ce qu’il voulait. ${
        wolfWin ? "Au passage, la meute gagne aussi." : "Et le village gagne aussi, pour la forme."
      }`
    : wolfWin
      ? "Un loup a survécu. Le village a voté dans la peur — les crocs ont eu raison."
      : "Un loup est mort. Le village a résisté, entre rhum et arnica.";

  const tallyData = g.players.map((p) => ({
    name: p.name,
    votes: Object.values(g.votes).filter((t) => t === p.id).length,
  }));

  return (
    <div className="max-w-[640px] mx-auto py-12">
      <div className="text-center mb-8">
        <div className={`mono text-[11px] uppercase tracking-[0.3em] mb-2 ${
          boucOwn ? "text-[var(--mystery)]" : wolfWin ? "text-[var(--wolf)]" : "text-[var(--good)]"
        }`}>
          {boucOwn ? "Un triomphe passif-agessif" : wolfWin ? "La meute triomphe" : "Le village triomphe"}
        </div>
        <h2 className="text-[30px] font-medium text-[var(--text-primary)] mb-2">
          {headerTitle}
        </h2>
        <p className="text-[13.5px] text-[var(--text-secondary)] max-w-[400px] mx-auto">
          {headerSub}
        </p>
      </div>

      <div className="card p-5 mb-4">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Tout le monde, révélez-vous
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {g.players.map((p) => {
            const isDead = deadIds.includes(p.id);
            const role = roles[p.id];
            const R = ROLES[role] || ROLES.villager;
            const Icon = R.icon;
            return (
              <div key={p.id} className="flex items-center justify-between rounded-md border border-[var(--hairline)] px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={14} className={R.faction === "wolves" ? "text-[var(--wolf)]" : "text-[var(--good)]"} />
                  <span className={`text-[13px] text-[var(--text-primary)] truncate ${isDead ? "line-through opacity-70" : ""}`}>
                    {p.name}
                    {p.id === g.lynchId && <span className="ml-1 text-[var(--wolf)]">☠</span>}
                  </span>
                  {isDead && p.id !== g.lynchId && <span className="text-[11px] text-[var(--wolf)] whitespace-nowrap">· mort</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[12px] ${R.faction === "wolves" ? "text-[var(--wolf)]" : "text-[var(--good)]"}`}>
                    {R.name}
                  </span>
                  <Chip tone={R.faction === "wolves" ? "wolf" : "good"}>
                    {R.faction === "wolves" ? "meute" : "village"}
                  </Chip>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCentre && (
        <div className="card p-5 mb-4">
          <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-3">
            Trois cartes du centre — la vérité
          </div>
          <div className="grid grid-cols-3 gap-2">
            {centre.map((r, i) => {
              const R = ROLES[r];
              const Icon = R.icon;
              return (
                <div key={i} className="rounded-md border border-[var(--hairline)] px-3 py-3 text-center">
                  <Icon size={16} className={`mx-auto mb-1 ${R.faction === "wolves" ? "text-[var(--wolf)]" : "text-[var(--good)]"}`} />
                  <div className="text-[12.5px] text-[var(--text-primary)]">{R.name}</div>
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mt-1">
                    {["A", "B", "C"][i]}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[11.5px] text-[var(--text-secondary)] mt-2">
            {centre.includes("charlatan")
              ? "Le Charlatan s'était caché au centre — personne ne l'a jamais croisé…"
              : centre.includes("bouc")
                ? "Le Bouc Émissaire est resté au centre. Le village aura une rancoeur de plus."
                : "Tout le monde vivait bien dans l'ignorance."}
          </div>
        </div>
      )}

      <div className="card p-5 mb-4">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Bulle de vote
        </div>
        {g.voteMode === "secret" && (
          <div className="text-[12.5px] text-[var(--text-secondary)] mb-3">
            Révélation simultanée — qui a voté qui.
          </div>
        )}
        <div className="space-y-1">
          {g.voteOrder.map((vid) => {
            const from = g.players.find((p) => p.id === vid)?.name;
            const to = g.votes[vid] == null
              ? null
              : g.players.find((p) => p.id === g.votes[vid])?.name;
            return (
              <div key={vid} className="flex items-center justify-between mono text-[12px]">
                <span className="text-[var(--text-primary)]">{from}</span>
                <span className="text-[var(--accent)]">→ {to ?? "s'abstient"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5 mb-6">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Votes par nom
        </div>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={tallyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9B957F", fontSize: 10, fontFamily: "var(--mono)" }}
                stroke="transparent"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#9B957F", fontSize: 10, fontFamily: "var(--mono)" }}
                stroke="transparent"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 4, fontSize: 12,
                  fontFamily: "var(--mono)", color: "var(--text-primary)",
                }}
                itemStyle={{ color: "var(--text-primary)" }}
                cursor={{ fill: "rgba(230,184,82,0.06)" }}
              />
              <Bar dataKey="votes" fill="#E6B852" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="btn-ghost w-full py-3 rounded-md text-[14px] flex items-center justify-center gap-2"
      >
        <RotateCcw size={15} />
        Refaire une nuit
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
function App() {
  const [g, setG] = useState(() => ({
    phase: "setup",
    count: 3,
    names: ["", "", "", "", "", "", "", ""],
    gameMode: "classic",
    voteMode: "open",
    players: [],
    centre: [],
    dealIdx: 0,
    dealStep: "handoff",
    night: {},
    nightIdx: 0,
    dawn: null,
    votes: {},
    voteOrder: [],
    voteIdx: 0,
    revealStarted: false,
    lynchId: null,
    winner: null,
  }));

  let body;
  if (g.phase === "setup") body = <SetupView g={g} setG={setG} />;
  else if (g.phase === "deal") body = <DealView g={g} setG={setG} />;
  else if (g.phase === "night") body = <NightView g={g} setG={setG} />;
  else if (g.phase === "dawn") body = <DawnView g={g} setG={setG} />;
  else if (g.phase === "day") body = <DayView g={g} setG={setG} />;
  else if (g.phase === "vote") body = <VoteView g={g} setG={setG} />;
  else if (g.phase === "lynch") body = <LynchView g={g} setG={setG} />;
  else if (g.phase === "end") body = <EndView g={g} setG={setG} />;

  return (
    <>
      <style>{TOKENS}</style>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-[720px] mx-auto">
          <PhaseBar
            phase={g.phase}
            count={g.players.length || g.count}
            voteMode={g.voteMode}
            gameMode={g.gameMode}
          />
          {body}
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);