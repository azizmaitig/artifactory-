# build-artifact.ps1 — PowerShell wrapper around build-artifact.mjs
#
# Usage:
#   .\build-artifact.ps1 -Entry .\path\to\entry.jsx -Out .\artifact.html [-Title "My Artifact"]
#
# Requires: node + the entry's project deps installed (esbuild, react, react-dom,
#           @tailwindcss/cli) — see build-artifact.mjs header.

param(
    [Parameter(Mandatory = $true)]
    [string]$Entry,

    [Parameter(Mandatory = $true)]
    [string]$Out,

    [string]$Title = ""
)

$ErrorActionPreference = "Stop"

$entryResolved = (Resolve-Path -LiteralPath $Entry).Path
$outResolved = (Resolve-Path -LiteralPath (Split-Path -Parent $Out) -ErrorAction SilentlyContinue).Path
if (-not $outResolved) {
    $outResolved = Split-Path -Parent (Resolve-Path -LiteralPath $Out -ErrorAction Stop).Path
}
$outFull = Join-Path $outResolved (Split-Path -Leaf $Out)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mjs = Join-Path $scriptDir "build-artifact.mjs"

$nodeArgs = @("$mjs", "--entry", "`"$entryResolved`"", "--out", "`"$outFull`"")
if ($Title) { $nodeArgs += @("--title", "`"$Title`"") }

& node $nodeArgs
exit $LASTEXITCODE
