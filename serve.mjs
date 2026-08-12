// serve.mjs — canonical preview server for artifact sessions (ticket 20, 2026-08-12).
// Replaces the per-session throwaway servers (orbit-sim :8321, six-degrees :8765, etc.).
//
// Usage: node serve.mjs [--dir <path>] [--port <n>]
//   --dir  directory to serve (default: cwd) — the artifact/s build dir
//   --port port (default 8770)
//
// Notes:
// - Binds 127.0.0.1 only (localhost preview; never LAN-exposed).
// - No-store headers: verified HTML must never ride the browser HTTP cache.
// - localhost is a secure context → PWA envelope service workers register and
//   can be exercised locally before publishing (localhost install prompt works).
// - Stop: Ctrl+C (foreground) or kill the printed PID (--serve from the build).
//
// When a bare directory is requested, index.html is served (so the enveloped
// artifact and the gallery-index prototype preview exactly as published).

import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { join, normalize, extname, resolve } from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const ROOT = resolve(arg("dir", "."));
const PORT = Number(arg("port", "8770"));
const HOST = "127.0.0.1";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".css": "text/css",
  ".webmanifest": "application/manifest+json",
};

createServer((req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    if (!p.startsWith("/")) p = "/" + p;
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(normalize(ROOT))) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    const body = readFileSync(file);
    res.writeHead(200, {
      "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(PORT, HOST, () => {
  console.log(`[serve] http://${HOST}:${PORT}/  (dir: ${ROOT})`);
});

process.on("SIGTERM", () => process.exit(0));