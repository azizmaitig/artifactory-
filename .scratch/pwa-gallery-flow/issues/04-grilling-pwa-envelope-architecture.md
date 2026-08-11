# 04 — Grilling: PWA envelope architecture (SW scope, manifest, offline strategy)

Type: grilling
Status: open
Blocked by: 01

## Question

PWA envelope architecture: what shape does the install envelope take for gallery-hosted artifacts?

Forks to grill:

- Service worker: one gallery-level SW vs per-artifact SW in its subdirectory (scope implications on `/artifacts/<name>/` — 01 says per-artifact is forced by Pages, confirm the edge cases)
- Manifest: per-artifact manifest generated from artifact name + palette (theme_color = accent), start_url/scope for subpaths
- Offline strategy: runtime-cache CDN deps (cache-first, versioned) vs bundle deps locally (kills Tailwind/Babel CDN warnings too)
- Platform parity bar: Android install-first, iOS as compatible (meta tags, icons) vs full iOS parity
- Cache-busting on artifact rebuild (versioned SW or query strings)

Resolution: locked envelope spec feeding 06 (prototype) and 07 (pipeline integration).