// build-artifact.mjs — artifact-builder pipeline (ticket 06, recreated in-vault 2026-08-06)
// Bundles entry.jsx -> minified JS (esbuild, NODE_ENV define in-script), compiles
// Tailwind classes -> CSS (Tailwind v4 CLI), inlines both into one self-contained HTML
// shell, then structurally verifies: size >= 1KB, #root present, inline <script>,
// inline <style>. Exit 0 = structurally verified.
//
// Usage: node build-artifact.mjs --entry <entry.jsx> --out <out.html> [--title "<Title>"]
//
// Env: node + esbuild + react + react-dom + recharts + @tailwindcss/cli installed
// in the entry's project dir.

import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const entry = resolve(arg("entry", "entry.jsx"));
const out = resolve(arg("out", "artifact.html"));
const title = arg("title", "Interactive Artifact");

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
