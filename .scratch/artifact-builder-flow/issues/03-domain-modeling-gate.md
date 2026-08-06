# 03 - Domain-modeling gate

Type: grilling
Status: resolved
Blocked by: 01

## Question

What is the mandatory pre-build step that guarantees domain/physics correctness? The festival sim's quality came from research → explain → validate before coding (Kurze–Anderson, inverse-square, air absorption, med-confidence caveats). Does the leaked prompt data mandate a research-first pattern? Shape of the gate: what checks, what outputs (worked example, assumptions list, confidence notes)?

## Answer

Resolved via grilling (2026-08-06).

**Mandate source:** the leaked prompts do NOT mandate research-first — ticket 01's mined rules contain no such directive. The discipline came from the festival session itself. The gate is our design.

**Scope — triggered, not universal:** the gate fires only when the artifact brief contains a domain model (equations, physical laws, formulas, algorithms with correctness risk). Physics-heavy sims trigger it; pure-presentation artifacts (stat tiles, plain dashboards) skip it. When triggered, it is a hard gate: no build until passed.

**Checks (in order):** 1) Research — source the authoritative model (standard/paper/textbook), never an LLM guess (e.g. ISO 9613 for outdoor acoustics); 2) Explain — state the model in the brief with named variables, units, boundary conditions; 3) Validate — prove the formula computes what the sim claims.

**Outputs — all three mandatory when the gate fires:**
- **Worked example** (load-bearing): hand-compute a concrete case to a known reference value (published example or measured data); the sim must reproduce it. Without a target number, "the formula is right" is unverifiable.
- **Assumptions list**: what's simplified/ignored (point source, no wind, far-field only), each tagged with expected error direction.
- **Confidence notes**: per-claim confidence (high/med/low) with caveats.

**Output destination:** domain note lives in the brief (review happens pre-build) + short code comments in the JSX next to key formulas (cite worked example + assumption tags). NOT rendered in the artifact UI — violates 01's "text in response, visual ONLY in artifact" rule. Code comments guard against silent drift on future edits; ticket 05's verification gate cross-checks the running artifact against the brief's worked example.

<!-- resolved by Sisyphus via grilling -->
