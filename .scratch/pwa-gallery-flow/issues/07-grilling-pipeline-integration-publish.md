# 07 — Grilling: pipeline integration + gallery publish workflow

Type: grilling
Status: resolved
Blocked by: 04, 03

## Question

Pipeline integration: how does envelope generation (manifest JSON, icons, service worker) hook into the artifact build pipeline, and how does publishing to the gallery work?

Forks to grill:

- Where the envelope steps live: `build-artifact.mjs` / `build-artifact.ps1` (repo root) vs a shared envelope script invoked by them vs the SKILL.md gates
- Tokens feeding the manifest: title → name/short_name, accent → theme_color, slug → start_url/scope
- Versioning + cache-busting on rebuild (artifact version in SW/manifest)
- Publish command per artifact (draft from 03's publish-artifact.ps1); failure semantics (build succeeds, publish fails → what ships?)

## Resolution — locked 2026-08-12, implemented

1. **Envelope steps integrate into `build-artifact.mjs`** (single command per artifact; the module scripts stay as the implementation, invoked by the build). `build-artifact.mjs` now accepts `--accent <hex>` (required) + `--short` + `--no-envelope` escape. Final phase: `generate-icons.mjs` (name=title, accent) → `envelope.mjs` (dir = out dir, slug = out basename) → structural check extended with "envelope files present". Verified: TFS rebuilds via the integrated command reproduce the envelope (exit 0, env check PASS).
2. **Envelope default ON** (per 04 "pipeline-forward"): missing `--accent` without `--no-envelope` = loud error, exit 1. Corpus legacy builds use `--no-envelope` until touched. New artifacts ship enveloped by default.
3. **Manifest tokens** (unchanged from 04): title → name/short_name (short ≤12), accent → theme_color/background_color, start_url/scope/id = `"./"` (subpath-relative, 01). Slug is NOT in the manifest (gallery path defines it); slug feeds the SW cache-name prefix only.
4. **Versioning/cache-busting** = 06 deltas: rev hashes the FINAL patched index.html; no `./` in precache; navigation network-first with rev'd-copy offline fallback; cache-name prune in activate.
5. **Publish**: `publish-artifact.ps1` (03's verified script) **vendored into the artifactory repo root** — the whole toolchain (build + icons + envelope + publish) now lives in one place. Publish is an **explicit gate-8 step, never auto-chained into the build** (build success ≠ ship; gate 6 verification sits between). Failure semantics: idempotent per artifact (replaces `artifacts/<Name>/`); on failure the remote stays untouched (work-clone commit/push fail before push), the artifact remains local, non-zero exit — nothing partial ships. `gh auth setup-git` is the one-time prereq.
6. **SKILL.md edited** (gate 7 command + envelope notes, gate 8 publish step + phone-install HITL, prerequisites: sharp, references).

## Deliverables

- `build-artifact.mjs` — `--accent/--short/--no-envelope`, envelope phase, extended verification
- `publish-artifact.ps1` — vendored at artifactory root
- SKILL.md — gates 7/8 + prerequisites + references updated
- After this: new artifacts ship enveloped by default

## Comments

- 2026-08-12: grilled forks 1–3 HITL (placement = integrate into build script; default = ON with required --accent; publish = vendored script + explicit step, user: "move everything inside artifactory"). Forks 4/5 folded into 06 deltas already verified by the prototype.