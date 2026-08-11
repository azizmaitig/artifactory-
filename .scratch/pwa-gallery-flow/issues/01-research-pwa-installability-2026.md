# 01 — Research: Android/iOS PWA installability 2026

Type: research
Status: resolved
Blocked by:

## Question

What are the current (2026) installability requirements and gotchas for add-to-home-screen PWAs on Android Chrome and iOS Safari? Minimal manifest fields, service worker minimum, iOS quirks, HTTPS/subpath scope constraints for a GitHub Pages gallery (`/artifacts/<name>/`).

## Answer

Research completed (AFK subagent, 2026-08-11). Full detail: [research/01-pwa-installability-2026.md](research/01-pwa-installability-2026.md).

- **Service worker is NOT an installability requirement in any browser.** Chrome removed the SW-with-fetch-handler check (M108 mobile / M112 desktop, 2023); Safari/Firefox never required one. A SW is still needed for offline and iOS Web Push — but it no longer gates install.
- **Chromium manifest minimum**: `name`/`short_name`, icons 192+512, `start_url`, `display` (fullscreen/standalone/minimal-ui/window-controls-overlay or `display_override`), `prefer_related_applications` false/absent; engagement heuristic (≥1 click, ≥30s); HTTPS (localhost/127.0.0.1 exempt). Android install = `beforeinstallprompt` → WebAPK (real APK in launcher; storage shared with Chrome profile; ~daily manifest-driven WebAPK regeneration; minting is Chrome-exclusive — regulatory pressure to open it up).
- **iOS**: no install prompt ever — the only path is manual Share → Add to Home Screen. Manifests supported since 11.3 (icons 15.4+, theme_color 15.0+, `id` 16.4+); iOS **ignores** `display_override`, `background_color`, maskable icons, shortcuts, and does **NOT** auto-generate a splash from the manifest (the "2021+ auto-splash" claim is false — static `apple-touch-startup-image` files still required; default = screenshot of last launch). Web Push + badging only for installed PWAs since 16.4. iOS 17+: separate cookies/storage.
- **GitHub Pages subpath constraint**: Pages cannot send `Service-Worker-Allowed` headers → a SW's scope can never exceed its own directory. Each artifact at `/artifacts/<name>/` must host its own `sw.js` inside that directory and use relative `./` paths everywhere (`start_url`, `scope`, `id`, cache lists) — a bare `/` resolves to the account root, not the gallery.
- **Version-sensitive watchlist** (feed 04/08): Chrome install-criteria simplification experiments, `<install>` element + Web Install API `navigator.install()` origin trials (Chrome 148+), W3C beforeinstallprompt standardization (Gecko/WebKit positions pending, 2026), Play Protect PWA/WebAPK scanning (speculative 2025 teardown), Samsung-Internet WebAPK Android-14 install block.

## Comments

- 2026-08-11: charted in wayfinder. Resolved by research subagent; deliverable extracted from vault branch (research/pwa-installability-2026) into this flow's research/01.