# ============================
# InstallSure Demo Pack: Spin-up + E2E with guards
# Save as: run-e2e.ps1  (then: PowerShell -ExecutionPolicy Bypass -File .\run-e2e.ps1)
# ============================
$ErrorActionPreference = 'Stop'

# ---------- CONFIG: set the URLs/ports your tests expect ----------
$Services = @(
  @{ name="Demo Dashboard"; path="applications/demo-dashboard"; url="http://localhost:3001"; startCmd="npm run dev" },
  @{ name="InstallSure Frontend"; path="applications/installsure/frontend"; url="http://localhost:3000"; startCmd="npm run dev" },
  @{ name="InstallSure Backend"; path="applications/installsure/backend"; url="http://localhost:8000/api/health"; startCmd="npm run dev" },
  @{ name="Avatar"; path="applications/avatar"; url="http://localhost:3006"; startCmd="npm run dev" },
  @{ name="FF4U"; path="applications/ff4u"; url="http://localhost:3002"; startCmd="npm run dev" },
  @{ name="RedEye"; path="applications/redeye"; url="http://localhost:3003"; startCmd="npm run dev" },
  @{ name="ZeroStack"; path="applications/zerostack"; url="http://localhost:3004"; startCmd="npm run dev" },
  @{ name="Hello"; path="applications/hello"; url="http://localhost:3005"; startCmd="npm run dev" }
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

# Install dependencies for each application
Write-Host "📦 Installing dependencies for all applications..." -ForegroundColor Yellow
foreach ($svc in $Services) {
  $fullPath = Join-Path (Get-Location) $svc.path
  if (Test-Path $fullPath) {
    if (Test-Path (Join-Path $fullPath "package.json")) {
      Write-Host "  Installing dependencies for $($svc.name)..." -ForegroundColor Cyan
      Push-Location $fullPath
      try {
        if ($pkg -eq "pnpm") {
          if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { npm i -g pnpm | Out-Null }
          pnpm i | Out-Null
        } elseif ($pkg -eq "yarn") {
          yarn install | Out-Null
        } else {
          npm install | Out-Null
        }
      } finally { Pop-Location }
    }
  }
}

# Ensure Playwright + browsers (check for playwright in any application)
$playwrightFound = $false
foreach ($svc in $Services) {
  $fullPath = Join-Path (Get-Location) $svc.path
  $pkgJsonPath = Join-Path $fullPath "package.json"
  if (Test-Path $pkgJsonPath) {
    $pkgContent = Get-Content $pkgJsonPath -Raw | ConvertFrom-Json
    if ($pkgContent.devDependencies -and $pkgContent.devDependencies.'@playwright/test') {
      Write-Host "🎭 Installing Playwright browsers for $($svc.name)..." -ForegroundColor Yellow
      Push-Location $fullPath
      try {
        npx playwright install --with-deps | Out-Null
        $playwrightFound = $true
      } finally { Pop-Location }
    }
  }
}

if (-not $playwrightFound) {
  Write-Host "⚠️  Playwright not found in any application dependencies." -ForegroundColor Yellow
  Write-Host "   Tests may not be available. Consider adding @playwright/test to one of the applications." -ForegroundColor Yellow
}

# ---------- Start services ----------
foreach ($svc in $Services) { Start-ServiceProc $svc }
Write-Host "⏳ Waiting for services to be reachable..." -ForegroundColor Yellow
foreach ($svc in $Services) { Wait-HttpOk $svc.url }

# ---------- Run tests with artifacts ----------
if ($playwrightFound) {
  Write-Host "🧪 Running Playwright E2E..." -ForegroundColor Green
  $joined = $PW_Args -join " "
  
  # Find the directory with Playwright tests
  $testDir = $null
  foreach ($svc in $Services) {
    $fullPath = Join-Path (Get-Location) $svc.path
    $pkgJsonPath = Join-Path $fullPath "package.json"
    if (Test-Path $pkgJsonPath) {
      $pkgContent = Get-Content $pkgJsonPath -Raw | ConvertFrom-Json
      if ($pkgContent.devDependencies -and $pkgContent.devDependencies.'@playwright/test') {
        $testDir = $fullPath
        break
      }
    }
  }
  
  if ($testDir) {
    Push-Location $testDir
    try {
      npx playwright test $joined
      Write-Host "📖 Opening HTML report..." -ForegroundColor Green
      npx playwright show-report
    } catch {
      Write-Host "⚠️  Tests failed or were skipped. Check the output above for details." -ForegroundColor Yellow
    } finally { Pop-Location }
  } else {
    Write-Host "⚠️  No Playwright test directory found. Skipping tests." -ForegroundColor Yellow
  }
} else {
  Write-Host "⚠️  Playwright not configured. Skipping E2E tests." -ForegroundColor Yellow
  Write-Host "   All services are running. You can manually test them at their URLs." -ForegroundColor Cyan
}
