# 06 — Prototype: PWA envelope on traffic-flow-sim, install on phone

Type: prototype
Status: open
Blocked by: 04, 03

## Question

Prototype the envelope on traffic-flow-sim: manifest + icons + service worker + responsive pass, deployed to the gallery, installed on a real phone. What breaks, what is missing?

Do:

- Build the envelope per the architecture grilling (04), using the icon recipe from research (02)
- Deploy to the gallery (03), verify install works over HTTPS
- HITL: user installs on their phone and reacts — install prompt, standalone launch, offline behavior, layout on their device
- Report what the prototype proves and what the envelope spec must change

Resolution: envelope validated on a real install, spec deltas recorded; unblocks 08 (verification gate).