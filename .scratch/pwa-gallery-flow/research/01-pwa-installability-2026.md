# PWA Installability Requirements 2026 ÔÇö Android Chrome & iOS Safari

> Research ticket #2 (wayfinder map #1: *Phone-ready installable artifacts ÔÇö PWA gallery*).
> All facts accessed **2026-08-11**; sources cited inline. Version-sensitive claims flagged **[VS]**.
> Scope: Add-to-Home-Screen installability only (no app-store packaging, no push/offline deep-dive).

## 1. TL;DR ÔÇö what the envelope must ship

- One artifact = one self-contained directory under a GitHub Pages subpath. Each directory needs: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, and `apple-touch-icon.png` (180├ù180). A single **absolute-path-free** HTML entry point.
- **Service worker is NO LONGER an installability requirement in any browser** (Chrome removed it; Safari/Firefox never had it) [1][2][3]. It is still required for offline + iOS Web Push [4][5].
- Android gets a real install prompt + WebAPK; **iOS has no install prompt at all** ÔÇö the only path is the user manually tapping Share ÔåÆ Add to Home Screen [6][7].
- iOS supports far fewer manifest fields than Chrome: no `display_override`, no `background_color`, **no auto-generated splash from manifest** (the "2021+ auto-splash" claim is wrong ÔÇö iOS still needs static `apple-touch-startup-image` files) [8][9][10].
- GitHub Pages **cannot send custom headers** ÔåÆ a service worker's scope cannot be broadened beyond its own directory (`Service-Worker-Allowed` is unavailable). Keep `sw.js` inside each artifact dir; never request scope `/` [11][12][13].

## 2. Shared baseline (both platforms)

| Requirement | Status | Source |
|---|---|---|
| HTTPS (or `localhost`/`127.0.0.1` for dev) | Mandatory. Secure-context is stricter than HTTPS; `file://` not installable | [1][14] |
| Web app manifest linked from every page | Mandatory (Chromium installability); referenced via `<link rel="manifest">` | [1] |
| Manifest: `name` or `short_name` | Mandatory (Chromium) | [1][2] |
| Manifest: `icons` incl. 192px **and** 512px | Mandatory (Chromium); both sizes power the Android splash | [1][2][15] |
| Manifest: `start_url` | Mandatory (Chromium) | [1][2] |
| Manifest: `display` Ôêê {`fullscreen`,`standalone`,`minimal-ui`,`window-controls-overlay`} and/or `display_override` | Mandatory (Chromium); `standalone` is the phone-relevant value | [1][2][16] |
| Manifest: `prefer_related_applications` absent or `false` | Mandatory (Chromium) ÔÇö otherwise user is pushed to the Play Store | [1][2][17] |
| Manifest: `id` | Not mandatory, but **strongly recommended** ÔÇö stable identity for installs (Chrome) and Focus-sync (iOS 16.4+) | [6][18][19] |
| `theme_color`, `background_color` | Recommended (splash/status bar); **iOS ignores `background_color`** | [8][10][20] |
| maskable icon (`purpose: "maskable"`) | Recommended for Android (masked launcher icons); **iOS ignores maskable/monochrome** and prefers `any` | [8][21][22] |
| Service worker | **Not required for installability.** Needed for offline + push | [1][3][4] |

**Reference minimal manifest** (per-artifact, relative paths only ÔÇö GitHub Pages subpath-safe) [1][2][23]:

```json
{
  "id": "./",
  "name": "Artifact Name",
  "short_name": "Artifact",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#101418",
  "theme_color": "#101418",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Note: `id`, `start_url`, `scope` must use **relative** (`./`) or full `/repo-name/` paths. A bare `"/"` points at `user.github.io/` (the account root), not the gallery subpath ÔÇö the classic GitHub Pages PWA breakage [23].

## 3. Service workers & scope (GitHub Pages subpath reality)

- Default SW scope = the directory the script lives in; `navigator.serviceWorker.register("sw.js", {scope})` **fails** if `scope` is broader than the worker's directory, unless the server sends the `Service-Worker-Allowed` header [11][14].
- GitHub Pages is static and **cannot set `Service-Worker-Allowed`** [12][13]. Consequence for `/artifacts/<name>/` gallery:
  - `sw.js` inside each artifact dir ÔåÆ scope `/artifacts/<name>/` ÔÇö exactly right for per-artifact offline.
  - A gallery-wide SW at `/sw.js` ÔåÆ scope `/` ÔÇö covers everything but must be served from the repo root (works for the gallery index, not per-artifact since artifacts are separate "apps" with their own manifest).
  - Requesting `scope: "/"` from `/artifacts/<name>/sw.js` **will not register** without the header [12].
- Use relative URLs (`./`) in `caches.addAll(...)` ÔÇö absolute `/` URLs resolve against the account root on GH Pages [13][24].
- On iOS, a SW is required for Web Push + badging (installed web apps only) [5][25].

## 4. Android / Chrome

**Install prompt conditions (Chrome stable, current)** [2]:
1. Not already installed.
2. Engagement heuristics: ÔëÑ1 tap/click on the page (ever, even a previous load) **and** ÔëÑ30 s total viewing time.
3. HTTPS.
4. Manifest with the required members (┬º2), icons 192+512.
5. No `prefer_related_applications: true`.
6. **No service-worker check** (removed for install-from-menu in Chrome 108 mobile / 112 desktop; prompt-path check being removed since ÔÇö the "no SW required" state is current) [3].

**WebAPK behavior** [15][26]:
- Chrome mints a real APK (WebAPK) on install ÔåÆ appears in the app launcher/app settings, registers intent filters for all URLs in `scope`.
- Storage is **shared with the Chrome profile** (cookies/cache cleared together with Chrome data) ÔÇö unlike iOS, which isolates web-app storage [15][27].
- Notifications are **not** auto-granted at install; must request at runtime [15].
- Manifest changes (name, short_name, icons, background_color, display, orientation, scope, shortcuts, start_url, theme_color, share_target) trigger WebAPK regeneration ÔÇö checked ~daily on launch. Do not put user-specific data in the manifest [26].
- WebAPK is not Play-Store-listable; the Play Store path is Trusted Web Activity (TWA) [15].
- "Add to Home Screen" (manual, no prompt) also produces a WebAPK when criteria are met; Chrome additionally runs an **ML-triggered install dialog** (Chrome segmentation) that can offer install even for non-criteria pages [27][28].
- Richer install UI (screenshots + description) shown on Android prompt when `screenshots`/`description` provided [1].

**Android gotchas [VS]**:
- WebAPK minting is **Chrome-exclusive** on Android (except Samsung's own minting server); Google has faced EU/UK/Japan regulatory action to open it up ÔÇö resolution status is in flux as of 2024ÔÇô2026 [29][30].
- Samsung Internet's minting server emits WebAPKs with outdated `targetSdkVersion`, so **Android 14+ blocks Samsung-Internet PWA installs** with a "Blocked dangerous app" warning (Chrome unaffected) ÔÇö reported 2026-04 [31].
- Google Play Protect may start scanning PWA/WebAPK installs (code flags spotted 2025-07; speculative, unannounced) [32].

## 5. iOS / Safari

**No install prompt. Ever.** The only install path is manual: Share ÔåÆ **Add to Home Screen** (Safari and, since iOS 16.4, other browsers opting in; iOS 17 adds it to Safari View Controller) [6][7][33]. `beforeinstallprompt`/`appinstalled` do **not exist** on iOS [1][8]. The gallery must show its own "Add to Home Screen" instructions on iOS.

**Manifest support on iOS (WebKit)** [8]:

| Field | iOS support | Since |
|---|---|---|
| `name`, `short_name`, `start_url`, `scope`, `display` | Ô£à | 11.3 |
| `theme_color` | Ô£à | 15.0 |
| `icons` | Ô£à (PNG, square; `apple-touch-icon` overrides) | 15.4 |
| `id` | Ô£à (used for Focus-settings sync) | 16.4 |
| `background_color`, `orientation`, `dir`, `lang`, `shortcuts`, `related_applications`, `prefer_related_applications`, `display_override` | ÔØî | ÔÇö |

- `display: standalone` Ô£à (opens as web app); `fullscreen` falls back to standalone; `minimal-ui` falls back to browser [8][9].
- A page **without** `display: standalone|fullscreen` (and without legacy meta) is saved as a plain Home Screen **bookmark** that opens in the default browser (16.4+) ÔÇö not an app [6][7].
- **Icons**: provide `apple-touch-icon` 180├ù180 `<link>`; it wins over manifest `icons`. Transparent icons get black backgrounds. `purpose: maskable` icons are ignored by WebKit [8][21][22].
- **Splash screens**: iOS does **not** auto-generate a splash from the manifest (the auto-splash claim is false) [9][10]. Default = screenshot of the last launch [34]. For a branded splash, ship static `apple-touch-startup-image` `<link>`s (one per device size/orientation, `media` queries) [9][10]. `apple-touch-startup-image` only works when web-app capable (legacy meta or manifest standalone) [8].
- **Standalone viewport / safe-area**: handle `viewport-fit=cover` + `env(safe-area-inset-*)` for notch/Dynamic Island; no URL bar in standalone [9].
- **iOS 16.4+ additions [VS]**: Web Push + Badging for **installed** web apps only (permission requires direct user interaction) [5][6][25]; manifest `id` [6]; monogram icon fallback when no icon provided [6]; web-app storage is **separate** from Safari (cookies/storage isolated) [7].
- Legacy meta still honored for older iOS: `apple-mobile-web-app-capable` (= standalone, optional since iOS 11.3 when manifest used), `apple-mobile-web-app-title`, `apple-mobile-web-app-status-bar-style` [8][34].

**iOS gotchas [VS]**: no install prompt (manual only); `background_color` ignored ÔåÆ no manifest-driven splash; push only for installed apps; multi-instance "apps" share nothing (each Add to Home Screen is independent).

## 6. Envelope implications for the gallery (decision input for grilling #4)

1. Per-artifact dirs `<gallery>/artifacts/<name>/` each carry their own manifest + `sw.js` + icon set ÔÇö scope stays naturally constrained, GH Pages header limitation is a non-issue.
2. Absolute paths are banned in build output (`start_url`, `scope`, `id`, SW cache lists, asset URLs all relative `./`) so the same artifact works at any subpath.
3. Icons: 192 + 512 (Chrome criteria), maskable 512 (Android launcher), `apple-touch-icon.png` 180 (iOS). Transparent PNGs ÔåÆ black fill on iOS; ship opaque.
4. iOS needs its own "how to install" affordance (no `beforeinstallprompt`); Android can use a real install button via `beforeinstallprompt` (still Chromium-only, not standardized) [1][35].
5. Splash: Android is free (auto from manifest/icons); iOS requires generated `apple-touch-startup-image` assets or accept the last-screenshot default [9][10][34].

## 7. Version-sensitive watchlist (what could shift after this doc)

- **[VS] Chrome install-criteria simplification**: Chrome experiments to drop/loosen manifest-field requirements began 2023; W3C is standardizing `beforeinstallprompt` (Gecko/WebKit positions pending as of 2026-03) ÔÇö criteria may change [3][35][36].
- **[VS] New install affordances**: `<install>` HTML element (Chrome/Edge 148+, origin trial through 153) and Web Install API (`navigator.install()`, origin trial) ÔÇö not yet stable [18].
- **[VS] WebAPK minting openness**: EU/UK/Japan regulatory proceedings may force Google to open WebAPK minting to third-party browsers [29][30].
- **[VS] Play Protect PWA scanning**: speculative 2025 code flags [32].
- **[VS] iOS**: installability behavior stable since 16.4 (no prompt; manual only). Watch WWDC26 for any Home Screen web-app changes.

## Sources

1. MDN ÔÇö *Making PWAs installable* (modified 2025-11-30) ÔÇö https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
2. web.dev ÔÇö *What does it take to be installable?* (updated 2024-09-19) ÔÇö https://web.dev/articles/install-criteria
3. Chrome for Developers ÔÇö *Revisiting Chrome's installability criteria* (2023-12-05) ÔÇö https://developer.chrome.com/blog/update-install-criteria
4. mdn/content issue #34124 ÔÇö *Service Workers are no longer a requirement for PWA installation* (2024-06-13) ÔÇö https://github.com/mdn/content/issues/34124
5. WebKit ÔÇö *Web Push for Web Apps on iOS and iPadOS* (2023-02-16) ÔÇö https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
6. WebKit ÔÇö *WebKit Features in Safari 16.4* (2023-03-27) ÔÇö https://webkit.org/blog/13966/webkit-features-in-safari-16-4/
7. Apple ÔÇö *What's new in web apps* (WWDC23 session 10120, 2023) ÔÇö https://developer.apple.com/videos/play/wwdc2023/10120/
8. firt.dev ÔÇö *iOS PWA Compatibility* (last update 2023-06-06) ÔÇö https://firt.dev/notes/pwa-ios/
9. web.dev ÔÇö *Learn PWA: Enhancements* (splash screens, 2024-09-20) ÔÇö https://web.dev/learn/pwa/enhancements
10. GoogleChromeLabs/pwa-wp issue #1203 ÔÇö *Document splash screen generation for iOS?* (2024-11-19) ÔÇö https://github.com/GoogleChromeLabs/pwa-wp/issues/1203
11. MDN ÔÇö *Service-Worker-Allowed header* (modified 2025-11-21) ÔÇö https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Service-Worker-Allowed
12. MDN ÔÇö *Using Service Workers* (modified 2026-05-29) ÔÇö https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
13. Stack Overflow ÔÇö *PWA on Github pages* (2020) ÔÇö https://stackoverflow.com/questions/46228604/pwa-on-github-pages
14. MDN ÔÇö *Service Worker API* (secure context / localhost) ÔÇö https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
15. web.dev ÔÇö *WebAPKs on Android* (canonical, last updated 2017-05-21) ÔÇö https://web.dev/articles/webapks
16. Chrome for Developers ÔÇö *Preparing for the display modes of tomorrow* (display_override) ÔÇö https://developer.chrome.com/docs/capabilities/display-override
17. Chrome for Developers ÔÇö *App install banners* ÔÇö https://developer.chrome.com/blog/app-install-banners-native
18. Chrome for Developers ÔÇö *Install web apps with the new HTML install element* (origin trial 148ÔÇô153) ÔÇö https://developer.chrome.com/blog/install-element-ot
19. firt.dev ÔÇö *iOS 15.4 beta: PWA improvements* (2022) ÔÇö https://firt.dev/ios-15.4b/
20. MDN ÔÇö *background_color* ÔÇö https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/background_color
21. WebKit ÔÇö *New WebKit Features in Safari 15.4* (2022-03-14) ÔÇö https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
22. MDN ÔÇö *Web app manifest: icons* (modified 2025-06-23) ÔÇö https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
23. Stack Overflow ÔÇö *Service worker installs via localhost, but fails when deployed to GitHub Pages* ÔÇö https://stackoverflow.com/questions/49347585/
24. Stack Overflow ÔÇö *Cache index.html on service worker install when serving from subpath* (2021) ÔÇö https://stackoverflow.com/questions/66198019/
25. WebKit ÔÇö *Badging for Home Screen Web Apps* (2023-04-25) ÔÇö https://webkit.org/blog/14112/badging-for-home-screen-web-apps/
26. web.dev ÔÇö *How Chrome handles updates to the web app manifest* ÔÇö https://web.dev/articles/manifest-updates
27. Chrome for Developers ÔÇö *How Chrome helps users install the apps they value* (ML install prompts) ÔÇö https://developer.chrome.com/blog/how_chrome_helps_users_install_the_apps_they_value
28. Chrome for Developers ÔÇö *Richer install UI available for desktop* (2022) ÔÇö https://developer.chrome.com/blog/richer-install-ui-desktop
29. Open Web Advocacy ÔÇö *Google must share the ability to install Web Apps in Android* (2024-09-19) ÔÇö https://open-web-advocacy.org/blog/google-must-share-the-ability-to-install-web-apps-in-android/
30. Chromium ÔÇö *Open WebAPK minting server for third-party browsers* ÔÇö https://issues.chromium.org/40195497
31. Samsung Internet support issue #123 ÔÇö *Samsung Internet PWA install blocked on Android 14+* (2026-04-10) ÔÇö https://github.com/samsunginternet/support/issues/123
32. Android Authority ÔÇö *Google Play Protect may scan PWAs/WebAPKs* (2025-07-08) ÔÇö https://www.androidauthority.com/google-play-protect-pwa-webapk-scanning-apk-teardown-3574977/
33. MDN ÔÇö *Installing and uninstalling web apps* (browser support, iOS 16.4+) ÔÇö https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing
34. Apple ÔÇö *Configuring Web Applications* (Safari Web Content Guide, archived 2016-12) ÔÇö https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
35. W3C ÔÇö *Web Install meeting minutes* (2026-02-11) ÔÇö https://lists.w3.org/Archives/Public/public-webapps/2026JanMar/0012.html
36. mozilla/standards-positions issue #1371 ÔÇö *beforeinstallprompt standardization* (2026-03-10) ÔÇö https://github.com/mozilla/standards-positions/issues/1371

*Generated for azizmaitig/secondBrain wayfinder ticket #2; feeds envelope grilling (issue #4).*
