// build-artifact.mjs — artifact-builder pipeline (ticket 06, recreated in-vault 2026-08-06)
// Bundles entry.jsx -> minified JS (esbuild, NODE_ENV define in-script), compiles
// Tailwind classes -> CSS (Tailwind v4 CLI), inlines both into one self-contained HTML
// shell, then structurally verifies: size >= 1KB, #root present, inline <script>,
// inline <style>. Exit 0 = structurally verified.
//
// PWA envelope (pwa-gallery ticket 07, ON by default): when --accent is given, the
// final phase runs generate-icons.mjs + envelope.mjs on the artifact dir, producing
// index.html + manifest.json + sw.js + icons next to the built HTML. Pass --no-envelope
// to build without an envelope (corpus legacy/rebuilds).
//
// Usage: node build-artifact.mjs --entry <entry.jsx> --out <out.html> --title "<Title>" --accent <hex> [--short <ShortName>] [--no-envelope]
//
// Env: node + esbuild + react + react-dom + recharts + @tailwindcss/cli installed
// in the entry's project dir; sharp (+ the two envelope scripts at artifactory root)
// when enveloping.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function basenameWithoutExt(p) {
  const b = basename(p);
  const i = b.lastIndexOf(".");
  return i > 0 ? b.slice(0, i) : b;
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const entry = resolve(arg("entry", "entry.jsx"));
const out = resolve(arg("out", "artifact.html"));
const title = arg("title", "Interactive Artifact");
const accent = arg("accent", "");
const short = arg("short", "");
const noEnvelope = process.argv.includes("--no-envelope");

if (!noEnvelope && !accent) {
  console.error("[build-artifact] --accent <hex> is required unless --no-envelope (pwa-gallery ticket 07: new artifacts ship enveloped by default)");
  process.exit(1);
}

const projectDir = dirname(entry);
const workDir = join(projectDir, ".artifact-build");

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", cwd: projectDir, ...opts });
}

console.log(`[build-artifact] entry=${entry}\n[build-artifact] out=${out}`);

mkdirSync(workDir, { recursive: true });

// ---- 1. Tailwind v4 -> CSS ----
// input.css declares the Tailwind import; the v4 CLI scans the project for classes.
const inputCss = join(workDir, "input.css");
writeFileSync(inputCss, '@import "tailwindcss";\n', "utf8");

// @tailwindcss/cli is invoked as a local binary; fall back to npx if missing.
let twBin = join(projectDir, "node_modules", ".bin", "tailwindcss");
if (!process.platform.startsWith("win")) twBin = twBin.replace(/\.cmd$/, "");
const cssOut = join(workDir, "tailwind.css");

try {
  run(`"${twBin}" -i "${inputCss}" -o "${cssOut}" --minify`);
} catch {
  run(`npx --no-install @tailwindcss/cli -i "${inputCss}" -o "${cssOut}" --minify`);
}

// ---- 2. esbuild JSX -> JS (minified, NODE_ENV=production define in-script) ----
const jsOut = join(workDir, "app.js");
run(
  `npx esbuild "${entry}" --bundle --minify --format=iife --define:process.env.NODE_ENV='"production"' --outfile="${jsOut}"`
);

// ---- 3. Assemble single HTML shell ----
const css = readFileSync(cssOut, "utf8");
const js = readFileSync(jsOut, "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`;

writeFileSync(out, html, "utf8");
rmSync(workDir, { recursive: true, force: true });

// ---- 3.5 PWA envelope (ticket 07): icons + manifest + sw.js + patched index.html ----
if (!noEnvelope) {
  const scriptsDir = __dirname;
  const artDir = dirname(out);
  const slug = basenameWithoutExt(out);
  console.log(`[build-artifact] envelope phase (accent=${accent}, slug=${slug})`);
  run(`node "${join(scriptsDir, "generate-icons.mjs")}" "${title}" "${accent}" "${artDir}"`);
  const envArgs = [
    `--dir "${artDir}"`,
    `--name ${slug}`,
    `--accent "${accent}"`,
    `--title "${title}"`,
  ];
  if (short) envArgs.push(`--short "${short}"`);
  run(`node "${join(scriptsDir, "envelope.mjs")}" ${envArgs.join(" ")}`);
}

// ---- 4. Structural verification ----
const size = Buffer.byteLength(html, "utf8");
const hasRoot = html.includes('id="root"');
const hasInlineScript = /<script>[\s\S]*<\/script>/.test(html);
const hasInlineStyle = /<style>[\s\S]*<\/style>/.test(html);

const checks = [
  ["size >= 1KB", size >= 1024],
  ["#root present", hasRoot],
  ["inline <script>", hasInlineScript],
  ["inline <style>", hasInlineStyle],
];

if (!noEnvelope) {
  const envOk = ["index.html", "manifest.json", "sw.js", "icon-192.png", "icon-512.png", "icon-512-maskable.png", "apple-touch-icon.png"]
    .every((f) => existsSync(join(dirname(out), f)));
  checks.push(["envelope files present", envOk]);
}

let ok = true;
for (const [name, pass] of checks) {
  console.log(`[build-artifact] check ${name}: ${pass ? "PASS" : "FAIL"}`);
  if (!pass) ok = false;
}

console.log(`[build-artifact] written ${out} (${size} bytes)`);
if (!ok) {
  console.error("[build-artifact] STRUCTURAL VERIFICATION FAILED");
  process.exit(1);
}
console.log("[build-artifact] structurally verified — exit 0");
