# 16 - agent-loop loop mechanics extraction (fork-1 evidence)

**Status**: complete (user redirect mid-grill on ticket 16: "inspire from my loops project")
**Date**: 2026-08-10
**Source**: `10-Projects/11-Active/agent-loop` (Bun+TS loop orchestrator, v8; 557 tests) — extracted via `explore` subagent, verified against source.
**Purpose**: ground ticket 16's experiment/completion loop in the user's own battle-tested loop machinery, replacing/augmenting ARIS's 2/4-round doctrine (13b §"Iteration/completion doctrine").

## Source mechanics (exact, with paths)

### Core FSM + verdicts — `src/state-machine.ts`

```ts
init:   { RUN: 'run', ABORT: 'done' },
run:    { VERIFY: 'verify', ABORT: 'done' },
verify: { COMPLETE: 'done', LOOP: 'init', FAILED: 'done', ABORT: 'done' },
```

Six verdict events (`RUN/VERIFY/COMPLETE/LOOP/FAILED/ABORT`); **only `verify` may emit `LOOP`** — the single explicit repeat edge back to `init`. `done` is terminal. A `LOOP` transition clears `phaseResults` so cross-iteration memory cannot accumulate (`src/transition.ts`).

### Round cap — `src/config.ts` + `loop.ts`

`DEFAULT_CONFIG.maxIterations = 3`, **hard clamp 20** (`Math.min(override ?? base, 20)`) enforced in both the config merge and the CLI. Daemon variant forces `maxIterations: Infinity` + `decideEvent: () => 'LOOP'` — never self-terminates (only SIGINT/SIGTERM). **The perpetual variant is NOT applicable to a research gate**, which must self-terminate.

### Pass/cap/exit rule — `src/loop-runner.ts` `resolveHardcoded()`

```ts
allPassed ? (iteration < maxIterations - 1 ? 'LOOP' : 'COMPLETE') : 'FAILED'
```

LOOP while passing AND under cap; COMPLETE at cap; FAILED on any fail; ABORT on crash/signal; exit code 0/1. **Polarity is built for repeated builds — a research loop inverts it: LOOP on mismatch (refine), COMPLETE on first reproduction.**

### Stale detection = typed-log streaks, NOT round numbers — `plans/l3-should-evolve.ps1`

Pure-PowerShell, zero-LLM combo trigger. Prints WAKE only when BOTH hold:

- (a) PATTERN — one of three streak types (K=3 default):
  - `>= K consecutive event:rejected` for the **same spec_N** (same failing target)
  - `>= K consecutive L1 event:idle` (loop pacing, nothing built)
  - `>= K consecutive STALLED specs` (a spec with `rejected`/`failed` but no `built` since)
- (b) MIN-RUNS (N=5): `>= N` runs since the last evolved-proposal marker.

`$patternMet = ($maxReject -ge $K) -or ($maxIdle -ge $K) -or ($maxStalled -ge $K)`; IDLE is a clean no-op exit 0 ("no proposal is a clean no-op, never a failure"). WAKE writes a flag file + resets the min-runs counter.

### Escalation ladder (repeated at every level)

- "Max 3 fix attempts per item; escalate after" — `constitution.md`, `AGENTS.md`, `l2_executor/agent.py`
- "Max 3 review rounds per task; after that, escalate to human" — `l2_reviewer/agent.py`
- L3 evolve = proposal + patch, human applies; `verify-proposal.ps1` fails loud deterministically (missing/empty/malformed/out-of-scope/`git apply --check` reject). Never auto-merge.
- Cooldown flag (~7d) after a proposal; trigger IDLEs while pending — prevents re-escalating while a change is under review (`l3-cooldown-helper.ps1`).
- LLM advisory only: "LLM verdicts are advisory only; exit-code is authoritative" (CONTEXT.md / ADR-0012 R4); feedback controller (v9) classifies transient vs terminal, deterministic policy decides heal vs terminal — "The LLM never unilaterally halts or retries".

### Evidence substrate — `loop-run-log.md` + completion signal

Append-only typed event log: `{ts, loop:L1, spec_N:N, event:drafted|idle|failed}` / `{ts, loop:L2, spec_N:N, event:built|rejected, detail}` / `{ts, loop:L3, event:evolved-proposal}` — the machine-computable basis for all stale/progress verdicts. Completion signal (ADR-0022): all tasks have a non-null status (done OR failed); failed don't block the signal but are reported. Build failure → one corrected re-decompose attempt → failed → move on. Advisory score < 0.5 → one re-exec → done-with-warning, no second retry.

### Doctrine: DONE vs DRIVING

- "passed, failed (retries exhausted), aborted are explicit outcomes, not 'done'" (`docs/agentic-driven-loop.md`)
- Deterministic primary gate: "a shell command (build/tests) is the hard pass/fail, not an LLM opinion"; `evaluate` is secondary to `verify`
- "A two-loop topology where both loops do domain work does not compound; it only repeats" (ADR-0019) — the cheap deterministic trigger before expensive work is how repetition is gated

## Adoptable mechanics (for ticket 16)

1. **Flat FSM, single LOOP edge** — search → verify → decide; LOOP is the only repeat edge; distinct terminal verdicts; traceable repetition.
2. **Hard-clamped round cap** — default 3, hard clamp 20 pattern: cap enforced at config/entry, not inside the FSM.
3. **Inverted exit rule** — LOOP on mismatch, COMPLETE on first reproduction, deploy a stale-threshold verdict for the exhausted case.
4. **Stale = typed-log streak on the same target (K=3)** — consecutive mismatch rounds on one leg with no new evidence + no error reduction = structural change trigger. Not "N stale *rounds*" — a same-target streak.
5. **Min-evidence gate before escalation** — escalate only when pattern AND a minimum run count since last escalation (anti-busywork).
6. **Cheap deterministic pre-check (WAKE/IDLE)** — before spending a round, check whether re-search/refine could differ (unexplored T1/T2 on the failing leg); if not, skip to escalate. IDLE is clean, never a failure.
7. **Cooldown after structural change** — no second structural change while the first is pending human review.
8. **Human gate = fail-loud artifact, never auto-apply** — the loop proposes (corrected model + evidence + assumption tags); the gate-3 validate HITL decides.
9. **Transient/terminal classification, deterministic policy decides** — LLM/confidence advisory only; the measured-value comparison is the only acquit authority.
10. **Max-3-then-escalate ladder**.
11. **Append-only typed round log** (`{leg, event, evidence, delta}`) — staleness machine-computable.
12. **Completion = all items final; failures reported not blocking**.
13. **Every round must produce a non-empty evidence artifact** (produces-gate analog).

## Not applicable / adapt with care

1. **Perpetual daemon** (maxIterations: Infinity) — a research gate must self-terminate.
2. **LOOP-while-passing polarity** — inverted for research (LOOP on mismatch).
3. **healCommand auto-healing** — research analog is refine-the-model, which IS the loop body, not a recovery seam.
4. **Two-axis APPROVE/REJECT + worktree isolation** — only if verification changes code; analog = independent cross-check / second source.
5. **No auto-re-trigger of failed items (ADR-0022)** — the system deliberately rejected auto-retry; retry is handed to the evolve pass. A research loop may want the opposite for *refinement*, but it's a designed choice, not a default.
6. **Budget/concurrency/kill-switch** — operational guardrails; borrow only for unattended runs.
7. **"Acquit" vocabulary** — absent in the repo; the proven pair is APPROVE/REJECT and built/rejected + R4 (LLM advisory, exit-code authoritative). The acquit concept is introduced by this ticket; attach it to the deterministic measured-value match + human gate.

## Feed-forward to fork 1

Tile 13's pilot (research/13c) is iteration #1 of this loop: one pass → mismatch found (10× air bug) → refinement candidates (cap/omission assumptions) → tagged. Under the agent-loop shape it maps to: round 1 mismatch (typed log), legs verified vs tagged, no stale streak → REPRODUCED-on-the-legs + EXHAUSTED-on-assumptions → escalate-tagged, HITL at validate. The K=3/N-gate/WAKE-IDLE machinery adds anti-busywork discipline the pilot didn't need but a genuinely-wrong-model brief would.