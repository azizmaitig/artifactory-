# 06 - Package the build pipeline

Type: task
Status: open
Blocked by:

## Question

Turn the working esbuild + Tailwind CLI → single self-contained HTML pipeline (used to build festival-noise-sim.html) into a reusable vault script (build-artifact.mjs + build-artifact.ps1 wrapper): inputs = entry.jsx + deps, outputs = one verified HTML. Include the NODE_ENV define fix (build.mjs, not CLI quoting) and the lessons from the Babel detour (automatic-runtime imports; use esbuild, not in-browser Babel).
