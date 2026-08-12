<#
.SYNOPSIS
  Publish a built artifact folder to the artifact gallery (azizmaitig/artifact-gallery, gh-pages branch).

.DESCRIPTION
  Copies a build folder (must contain index.html) into artifacts/<Name>/ on the gallery's
  gh-pages branch and pushes. Uses a shallow work clone under $Work; idempotent.
  The result is reachable at https://azizmaitig.github.io/artifact-gallery/artifacts/<Name>/

  Auth: git uses the gh credential helper (run `gh auth setup-git` once).

.EXAMPLE
  ./publish-artifact.ps1 -Name traffic-flow-sim -SourceDir ".\build\traffic-flow-sim"
#>
param(
  [Parameter(Mandatory = $true)][string]$Name,
  [Parameter(Mandatory = $true)][string]$SourceDir,
  [string]$Remote = "https://github.com/azizmaitig/artifact-gallery.git",
  [string]$Branch = "gh-pages",
  [string]$Work = (Join-Path $env:TEMP "artifact-gallery-publish")
)

# PowerShell 5.1 + $ErrorActionPreference='Stop' turns ANY native-command stderr
# line into a terminating 'NativeCommandError' (git writes progress to stderr).
# Keep EAP at Continue and check $LASTEXITCODE explicitly; pipe git output
# through 2>&1 | Out-Null so nothing leaks to the console.
$ErrorActionPreference = "Continue"

if (-not (Test-Path -LiteralPath (Join-Path $SourceDir "index.html"))) {
  throw "SourceDir must contain index.html (the built artifact). Got: $SourceDir"
}
if ($Name -match "[^a-z0-9-]") {
  throw "Name must be lowercase alphanumeric + dashes (slug). Got: $Name"
}

# 1. ensure the work clone exists on the publish branch
if (-not (Test-Path -LiteralPath (Join-Path $Work ".git"))) {
  git clone --depth 1 --branch $Branch $Remote $Work 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "clone failed: $Remote" }
} else {
  Push-Location $Work
  try {
    git fetch origin $Branch 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "fetch failed" }
    git reset --hard "origin/$Branch" 2>&1 | Out-Null
  } finally {
    Pop-Location
  }
}

# 2. replace artifacts/<Name>/ with the new build
# PS 5.1 Join-Path takes exactly two positional args (no -AdditionalChildPath)
$dest = Join-Path (Join-Path $Work "artifacts") $Name
if (Test-Path -LiteralPath $dest) { Remove-Item -LiteralPath $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item -Path (Join-Path $SourceDir "*") -Destination $dest -Recurse -Force

# 3. commit + push
Push-Location $Work
try {
  git add -A "artifacts/$Name" 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "git add failed" }
  git commit -m "publish $Name ($(Get-Date -Format 'yyyyMMdd-HHmm'))" 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "commit failed" }
  git push origin $Branch 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "push failed" }
} finally {
  Pop-Location
}

Write-Output "Published: https://azizmaitig.github.io/artifact-gallery/artifacts/$Name/"