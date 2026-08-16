# 01 — Zero-context reader check

Status: open
Type: grilling
Blocked by:

## Question

The Claude doc defines an artifact as "un contenu complexe qui se suffit à lui-même sans nécessiter de contexte de conversation supplémentaire" — content that stands alone without conversation context. mirror-model piloted this as "handoff-ready for zero-context reader". Should the pipeline enforce a **formal zero-context-reader check** in gate 1 (brief) / gate 6 (verify), and what does it assert — e.g. opening the built artifact with no prior context must explain what it is, why it matters, and how to interact within the first screen?

Decide: adopt as a formal gate check / keep as an informal best practice / reject (the pedagogy spine already covers comprehension).