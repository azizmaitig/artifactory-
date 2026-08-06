# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One effort per directory: `.scratch/<effort-slug>/`
- The wayfinder map is `.scratch/<effort-slug>/map.md`
- Child tickets are one file per ticket at `.scratch/<effort-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- Ticket state is recorded as `Status:` (`open` / `claimed` / `resolved`); ticket type as `Type:` (`research` / `prototype` / `grilling` / `task`); dependencies as `Blocked by: NN, NN`
- Comments and conversation history append to the bottom of the file under a `## Comments` heading
- Research assets live at `.scratch/<effort-slug>/research/<NN>-<slug>.md` and are linked from the ticket, not pasted in

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<effort-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type; a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.

## Current effort

- `artifact-builder-flow` — the artifact-builder wayfinder map (see `.scratch/artifact-builder-flow/map.md` for destination and decisions).
