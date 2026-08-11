# 03 — Task: gallery repo + GitHub Pages setup

Type: task
Status: resolved
Blocked by:

## Question

Set up the gallery: where do artifacts get published so phones reach them over HTTPS? Choose repo, enable GitHub Pages, define URL layout `/artifacts/<name>/`, standing publish workflow, verify HTTPS + subpath routing.

## Answer

Done (AFK, 2026-08-12). Verified live.

- **Repo**: **azizmaitig/artifact-gallery** (new public repo — secondBrain vault unsuitable as Pages host; PFE not ours to squat). Pages source: `gh-pages` branch @ root.
- **URL scheme**: `https://azizmaitig.github.io/artifact-gallery/` with each artifact at `/artifacts/<name>/`. Root index is a placeholder (artifact list) — its design is a separate ticket (09).
- **Standing publish workflow**: `publish-artifact.ps1` in the gallery repo's `main` — maintains a shallow work-clone of `gh-pages`, replaces `artifacts/<Name>/` from a build folder containing `index.html`, commits, pushes. Command: `./publish-artifact.ps1 -Name <slug> -SourceDir <build-folder>`. One-time prerequisite: `gh auth setup-git`.
- **Verified 2026-08-12** (all HTTP 200 over HTTPS): `/` · `/test.html` · `/artifacts/test/index.html` · `/artifacts/traffic-flow-sim/index.html` — the latter a live end-to-end publish of the traffic-flow-sim artifact through the script.
- **Gotchas recorded for later tickets**: (1) PowerShell 5.1 `Join-Path` takes exactly 2 positional args (no `-AdditionalChildPath` — nested `Join-Path` required); (2) with `$ErrorActionPreference='Stop'`, native git stderr (progress lines) becomes a terminating NativeCommandError — use `EAP=Continue` + explicit `$LASTEXITCODE` checks + `2>&1` piping; (3) GitHub Pages sends no `Service-Worker-Allowed` header → per-artifact SW scope must live inside `/artifacts/<name>/` (feeds 04); (4) Pages HTTPS is automatic.

## Comments

- 2026-08-12: originally charted + resolved in the wrong tracker (GitHub issues on secondBrain #6); migrated here per the artifactory local-markdown flow. Infra itself is real and kept.