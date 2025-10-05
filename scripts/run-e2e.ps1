# ============================
# InstallSure Demo Pack: Spin-up + E2E with guards
# Save as: run-e2e.ps1  (then: PowerShell -ExecutionPolicy Bypass -File .\scripts\run-e2e.ps1)
# ============================
$ErrorActionPreference = 'Stop'

# ---------- CONFIG: set the URLs/ports your tests expect ----------
# Note: Frontend apps use their configured ports from vite.config.ts
# InstallSure Frontend: 3000, Demo Dashboard: 3001, Backend: 8000
# Avatar, FF4U, RedEye, ZeroStack, Hello all default to 4000 in their configs
# To avoid conflicts, we only include the primary apps for E2E testing
$Services = @(
  @{ name="InstallSure Frontend"; path="applications/installsure/frontend"; url="http://localhost:3000"; startCmd="npm run dev" },
  @{ name="InstallSure API"; path="applications/installsure/backend"; url="http://localhost:8000/api/health"; startCmd="npm run dev" },
  @{ name="Demo Dashboard"; path="applications/demo-dashboard"; url="http://localhost:3001"; startCmd="npm run dev" }
)

# Playwright options
$PW_Args = @(
  "--reporter=line,html",
  "--retries=1",
  "--timeout=60000",
  "--trace=retain-on-failure",
  "--video=retain-on-failure",
  "--output=./test-artifacts"
)

# ---------- Helpers ----------
function Get-PkgMgr {
  if (Test-Path (Join-Path (Get-Location) "pnpm-lock.yaml")) { return "pnpm" }
  if (Test-Path (Join-Path (Get-Location) "yarn.lock"))      { return "yarn" }
  return "npm"
}

function Run-Cmd($cmd, $wd) {
  Write-Host "▶ $cmd  (in $wd)" -ForegroundColor Cyan
  Push-Location $wd
  try { & $env:ComSpec /c $cmd | Write-Host } finally { Pop-Location }
}

function Start-ServiceProc($svc) {
  $name = $svc.name; $path = $svc.path; $cmd = $svc.startCmd
  $fullPath = Join-Path (Get-Location) $path
  if (!(Test-Path $fullPath)) { throw "Path not found for $name: $fullPath" }
  $start = "start `"$name`" powershell -NoExit -Command `"cd `"$fullPath`"; $cmd`""
  Write-Host "🚀 Starting $name..." -ForegroundColor Green
  Invoke-Expression $start | Out-Null
}

function Wait-HttpOk($url, $timeoutSec=120) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
      $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
        Write-Host "✅ Up: $url ($($resp.StatusCode))"
        return
      }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  throw "Timed out waiting for $url"
}

# ---------- Bootstrap toolchain ----------
$pkg = Get-PkgMgr
Write-Host "📦 Detected package manager: $pkg" -ForegroundColor Yellow

# Install dependencies for each service
Write-Host "📦 Installing dependencies for services..." -ForegroundColor Yellow
foreach ($svc in $Services) {
  $fullPath = Join-Path (Get-Location) $svc.path
  if (Test-Path (Join-Path $fullPath "package.json")) {
    Write-Host "  Installing for $($svc.name)..." -ForegroundColor Gray
    Push-Location $fullPath
    if ($pkg -eq "pnpm") {
      if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { npm i -g pnpm | Out-Null }
      pnpm i
    } elseif ($pkg -eq "yarn") {
      yarn install
    } else {
      npm install
    }
    Pop-Location
  }
}

# Ensure Playwright + browsers (install globally if not in a root package.json)
Write-Host "📦 Installing Playwright..." -ForegroundColor Yellow
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Host "❌ npx not found. Please install Node.js first." -ForegroundColor Red
  exit 1
}
npx playwright install --with-deps 2>&1 | Out-Null

# ---------- Start services ----------
foreach ($svc in $Services) { Start-ServiceProc $svc }
Write-Host "⏳ Waiting for services to be reachable..." -ForegroundColor Yellow
foreach ($svc in $Services) { Wait-HttpOk $svc.url }

# ---------- Run tests with artifacts ----------
Write-Host "🧪 Running Playwright E2E..." -ForegroundColor Green
$joined = $PW_Args -join " "
npx playwright test $joined

Write-Host "📖 Opening HTML report..." -ForegroundColor Green
npx playwright show-report
