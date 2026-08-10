# Artifact Workspace — `exemples/`

Canonical home for every new artifact built via `/artifact` (artifact-builder skill).

**One subfolder per artifact.** Each subfolder contains: `entry.jsx` (source) +
`package.json` (deps) + the built self-contained `<name>.html` + `ARTIFACT-RECORD.md`.

**Pipeline:** run from the artifact's subfolder:
```
node "D:\projects\obsidian\second brain\artifact-builder\build-artifact.mjs" --entry entry.jsx --out <name>.html --title "<Name>"
```

**Rules**
- Never create artifacts in `10-Projects/11-Active/` — this is the workspace.
- Verify the BUILT html in Playwright before shipping (renders, console-clean, controls).
- Record every artifact in the table below + `ARTIFACT-RECORD.md` in its folder.

## Artifacts

| Name | Date | Format | Notes |
|------|------|--------|-------|
| orbit-sim | 2026-08-07 | HTML | Orbital mechanics sandbox (two-body, GM=1, symplectic Euler). Worked example: r=4/v=0.5 → T=16π≈50.27 verified. Dark deep-space + cyan, flat. PASS: render, console-clean, 3-config interaction smoke, screenshot. Files: orbit-sim.html + orbit-sim-verify.png |
| nuit-du-village | 2026-08-07 | JSX | One-night social-deduction party game, 3–8 players on one laptop (Loup-Garou lineage). Device = moderator; pass-the-device secrets; open OR secret vote. Moon-gold on midnight, flat. **v2 (Stack A)**: classique/avancée toggle — 3 centre cards + Charlatan (blind role swap w/ player or centre) + Bouc Émissaire (wins if lynched). Worked example (7p): witch poisons a wolf → village wins. PASS: 3 full-game Playwright walks (3p classic/open, 3p avancée/secret, 7p avancée/open), 0 console errors, centre + chart render, tie→no-lynch observed. Files: nuit-du-village.html + ARTIFACT-RECORD.md |
