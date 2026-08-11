# Artifact Workspace — `exemples/`

Canonical home for every new artifact built via `/artifact` (artifact-builder skill).

**One subfolder per artifact.** Each subfolder contains: `entry.jsx` (source) +
`package.json` (deps) + the built self-contained `<name>.html` + `ARTIFACT-RECORD.md`.

**Pipeline:** run from the artifact's subfolder:
```
node "D:\projects\obsidian\second brain\10-Projects\11-Active\artifactory\build-artifact.mjs" --entry entry.jsx --out <name>.html --title "<Name>"
```

**Rules**
- Never create artifacts outside `10-Projects/11-Active/artifactory/exemples/` — this is the workspace.
- Verify the BUILT html in Playwright before shipping (renders, console-clean, controls).
- Record every artifact in the table below + `ARTIFACT-RECORD.md` in its folder.

## Artifacts

| Name | Date | Format | Notes |
|------|------|--------|-------|
| orbit-sim | 2026-08-07 | HTML | Orbital mechanics sandbox (two-body, GM=1, symplectic Euler). Worked example: r=4/v=0.5 → T=16π≈50.27 verified. Dark deep-space + cyan, flat. PASS: render, console-clean, 3-config interaction smoke, screenshot. Files: orbit-sim.html + orbit-sim-verify.png |
| nuit-du-village | 2026-08-07 | JSX | One-night social-deduction party game, 3–8 players on one laptop (Loup-Garou lineage). Device = moderator; pass-the-device secrets; open OR secret vote. Moon-gold on midnight, flat. **v2 (Stack A)**: classique/avancée toggle — 3 centre cards + Charlatan (blind role swap w/ player or centre) + Bouc Émissaire (wins if lynched). Worked example (7p): witch poisons a wolf → village wins. PASS: 3 full-game Playwright walks (3p classic/open, 3p avancée/secret, 7p avancée/open), 0 console errors, centre + chart render, tie→no-lynch observed. Files: nuit-du-village.html + ARTIFACT-RECORD.md |
| resonance-lab | 2026-08-10 | JSX | Driven damped oscillator — why amplitude explodes at resonance (Q = 1/(2ζ)). **v2: Lesson/Explore modes** — guided 4-step walkthrough (Tacoma hook → ring frequency → resonance reveal 10.0× → damping reveal 1.4×) with predict-then-observe + plain-language readouts; sandbox keeps sliders, presets, theory overlay. Teal/purple/amber on lab-dark, flat. Worked example: ω₀=6.283, ζ=0.05 → Q=10.0, A=0.253 m, φ=90° — verified in-browser tile-exact. PASS: v1 (all controls smoke, 0 console errors) + v2 (full walkthrough, reveals assert 10.0×/1.4×, 0 errors), screenshots + computed-style audit. Files: resonance-lab.html + ARTIFACT-RECORD.md + verify pngs |
| six-degrees | 2026-08-10 | JSX | Six-degrees explainer — branching + clustering → Earth-reach-depth live. Worked example: B=100, C=0.6 → f=40, cumulative through 6 ≈ 4.2B (52% of Earth), full-Earth crossing at degree 7 (numerical correction applied: 40^6 = 4.1e9 < 8.05e9). Paper-editorial (oxblood/ink on #F6F2E9), 7-step categorical degree ramp, fold-back hairlines signature. PASS: render, console-clean (favicon 404 only), 6-control interaction smoke (f=20→8 hops, f=100→5 hops, Village→2, Earth→7, animation ticks 0..6 + halo, math aside toggle), screenshot. Files: six-degrees.html + ARTIFACT-RECORD.md + six-degrees-verify.png |
