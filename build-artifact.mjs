#!/usr/bin/env node
/**
 * build-artifact.mjs — reusable artifact pipeline: JSX (+deps) → single self-contained HTML.
 *
 * Pipeline (validated against festival-noise-sim.html build, see research/01 + ticket 06):
 *   1. esbuild bundles the entry JSX (React JSX compiled at build time — NOT in-browser Babel)
 *   2. Tailwind CLI compiles the artifact's classes to CSS (v4: input.css with @source)
 *   3. bundle.js + tailwind.css are inlined into one self-contained HTML shell
 *   4. Structural verification before exit (non-trivial size, root div, inline script/style)
 *
 * Usage:
 *   node build-artifact.mjs --entry <entry.jsx> --out <out.html> [--title <title>]
 *
 * Env: requires esbuild, react, react-dom + the artifact's deps installed in the entry's
 *      project (node_modules resolvable from the entry file), and @tailwindcss/cli available
 *      via npx in that project.
 *
 * Lesson from the festival session (NODE_ENV define fix): the production define MUST be set
 * in this script, not passed via CLI quoting (`--define:process.env.NODE_ENV='"production"'`
 * breaks under PowerShell quoting). React 19 uses the automatic JSX runtime; esbuild handles
 * it natively — no Babel, no runtime imports.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const entry = arg("--entry");
const out = arg("--out");
const title = arg("--title") || basename(out, ".html");

if (!entry || !out) {
  console.error("usage: node build-artifact.mjs --entry <entry.jsx> --out <out.html> [--title <title>]");
  process.exit(1);
}

const entryPath = resolve(entry);
const outPath = resolve(out);
const projectDir = dirname(entryPath);

if (!existsSync(entryPath)) {
  console.error(`error: entry not found: ${entryPath}`);
  process.exit(1);
}

// esbuild (and the artifact's other deps) live in the ENTRY's project, not here —
// resolve from there so the script works against any project with deps installed.
const projectRequire = createRequire(join(projectDir, "package.json"));
const { build } = projectRequire("esbuild");

const work = mkdtempSync(join(tmpdir(), "artifact-build-"));
try {
  // 1. Bundle JSX → JS. NODE_ENV define here (script-side), never CLI quoting.
  await build({
    entryPoints: [entryPath],
    bundle: true,
    minify: true,
    outfile: join(work, "bundle.js"),
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });

  // 2. Tailwind v4: input.css declares the source scan root, then compile to CSS.
  //    Invoke the CLI's real JS entry with the current node (npx is a .cmd shim —
  //    execFileSync cannot run it on Windows). input.css MUST live in the project:
  //    `@import "tailwindcss"` resolves relative to the input file's location.
  const inputCss = join(projectDir, ".artifact-build-input.css");
  writeFileSync(inputCss, `@import "tailwindcss";\n@source "${entryPath}";\n`);
  const tailwindCli = join(projectDir, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs");
  execFileSync(process.execPath, [tailwindCli, "-i", inputCss, "-o", join(work, "tailwind.css"), "--minify"], {
    cwd: projectDir,
    stdio: ["ignore", "ignore", "inherit"],
  });
  rmSync(inputCss, { force: true });

  // 3. Assemble self-contained HTML (inline CSS + JS, no external requests).
  const css = readFileSync(join(work, "tailwind.css"), "utf8");
  const js = readFileSync(join(work, "bundle.js"), "utf8");
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
  writeFileSync(outPath, html, "utf8");

  // 4. Verify structure: size, root mount point, inline bundle present.
  const size = Buffer.byteLength(html, "utf8");
  const failures = [];
  if (size < 1024) failures.push(`output too small (${size} bytes)`);
  if (!html.includes('<div id="root">')) failures.push("missing #root mount div");
  if (!html.includes("<script>")) failures.push("missing inline <script>");
  if (!html.includes("<style>")) failures.push("missing inline <style>");
  if (failures.length) {
    console.error("verification failed:");
    for (const f of failures) console.error(`  - ${f}`);
    rmSync(outPath, { force: true });
    process.exit(1);
  }

  console.log(`ok: ${outPath} (${size} bytes, ${title})`);
} catch (err) {
  console.error("build failed:", err.message);
  process.exit(1);
} finally {
  rmSync(work, { recursive: true, force: true });
}
