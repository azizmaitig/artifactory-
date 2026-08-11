# 08 — Grilling: installability verification gate (gate 6 extension)

Type: grilling
Status: open
Blocked by: 06

## Question

Verification gate: how does gate 6 (Playwright verify) prove installability before an artifact ships?

Forks to grill:

- Assertions: manifest link resolves + required fields valid, icons exist at required sizes, SW registers and controls scope, page reachable over HTTPS in the gallery
- Tooling: Lighthouse PWA category vs playwright-based checks vs both; where in the gate order (before or after build)
- Mobile-specific checks: viewport render at 375×667, tap targets, no horizontal overflow
- Baseline artifact once enveloped (06)

Resolution: gate-6 extension locked into the artifact-builder SKILL.md.