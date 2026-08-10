# 21 — Creative-brief prompt layer

Type: grilling
Status: open
Blocked by:

## Question

What does the pipe from a raw user prompt to the gate-1 artifact brief look like? Gate 1 currently produces the brief inline (visual-translator Step-0 style); the pedagogy lock (ticket 17) added Hook/Audience fields. The fog item originally: "the user prompt → artifact brief layer — gate 1's output shape; token block already lives in this layer per ADR-001".

Forks to grill:

- Does the brief deserve a canonical prompt template (fields + examples) reused across sessions — or stay as the skill text?
- Where does the pedagogy spine's hook/audience work happen: before or during the gate-1 HITL exchange?
- Should briefs be archived per artifact (they currently live only in the artifact record)?

Resolution: a defined creative-brief layer (template + placement), recorded in SKILL.md gate 1.