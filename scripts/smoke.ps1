#!/usr/bin/env pwsh
# InstallSure Smoke Test Script for Windows
# Runs backend, frontend, and all tests

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "InstallSure Smoke Test Suite" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$BackendDir = Join-Path $RepoRoot "applications\installsure\backend"
$FrontendDir = Join-Path $RepoRoot "applications\installsure\frontend"
$TestsDir = Join-Path $RepoRoot "tests"

$BackendPid = $null
$FrontendPid = $null
$ExitCode = 0

function Cleanup {
    Write-Host "`n🧹 Cleaning up..." -ForegroundColor Yellow
    
    if ($BackendPid) {
        Write-Host "   Stopping backend (PID: $BackendPid)" -ForegroundColor Gray
        Stop-Process -Id $BackendPid -Force -ErrorAction SilentlyContinue
    }
    
    if ($FrontendPid) {
        Write-Host "   Stopping frontend (PID: $FrontendPid)" -ForegroundColor Gray
        Stop-Process -Id $FrontendPid -Force -ErrorAction SilentlyContinue
    }
    
    # Kill any remaining node processes on our ports
    Get-NetTCPConnection -LocalPort 8099 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Register cleanup on exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup } | Out-Null

try {
    # Step 1: Install backend dependencies
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location $BackendDir
    if (Test-Path "package.json") {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Backend npm install failed" }
    }
    Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green

    # Step 2: Install frontend dependencies
    Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location $FrontendDir
    if (Test-Path "package.json") {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Frontend npm install failed" }
    }
    Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green

    # Step 3: Install test dependencies
    Write-Host "`n📦 Installing test dependencies..." -ForegroundColor Cyan
    Set-Location $TestsDir
    if (Test-Path "package.json") {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Test npm install failed" }
    }
    Write-Host "   ✅ Test dependencies installed" -ForegroundColor Green

    # Step 4: Start backend
    Write-Host "`n🚀 Starting backend on http://127.0.0.1:8099..." -ForegroundColor Cyan
    Set-Location $BackendDir
    $BackendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $BackendPid = $BackendProcess.Id
    Write-Host "   Backend PID: $BackendPid" -ForegroundColor Gray

    # Step 5: Start frontend
    Write-Host "`n🚀 Starting frontend on http://127.0.0.1:3000..." -ForegroundColor Cyan
    Set-Location $FrontendDir
    $FrontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $FrontendPid = $FrontendProcess.Id
    Write-Host "   Frontend PID: $FrontendPid" -ForegroundColor Gray

    # Step 6: Wait for services to be ready
    Write-Host "`n⏳ Waiting for services to start..." -ForegroundColor Cyan
    $MaxWait = 60
    $Waited = 0
    
    while ($Waited -lt $MaxWait) {
        try {
            $HealthCheck = Invoke-WebRequest -Uri "http://127.0.0.1:8099/health" -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
            if ($HealthCheck.StatusCode -eq 200) {
                Write-Host "   ✅ Backend is ready" -ForegroundColor Green
                break
            }
        } catch {
            Start-Sleep -Seconds 2
            $Waited += 2
            Write-Host "   Waiting for backend... ($Waited/$MaxWait seconds)" -ForegroundColor Gray
        }
    }
    
    if ($Waited -ge $MaxWait) {
        throw "Backend did not start within $MaxWait seconds"
    }

    $Waited = 0
    while ($Waited -lt $MaxWait) {
        try {
            $FrontendCheck = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
            if ($FrontendCheck.StatusCode -eq 200) {
                Write-Host "   ✅ Frontend is ready" -ForegroundColor Green
                break
            }
        } catch {
            Start-Sleep -Seconds 2
            $Waited += 2
            Write-Host "   Waiting for frontend... ($Waited/$MaxWait seconds)" -ForegroundColor Gray
        }
    }
    
    if ($Waited -ge $MaxWait) {
        throw "Frontend did not start within $MaxWait seconds"
    }

    # Step 7: Run backend tests
    Write-Host "`n🧪 Running backend tests..." -ForegroundColor Cyan
    Set-Location $BackendDir
    npm run test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Backend tests failed" -ForegroundColor Red
        $ExitCode = 1
    } else {
        Write-Host "   ✅ Backend tests passed" -ForegroundColor Green
    }

    # Step 8: Install Playwright browsers
    Write-Host "`n🎭 Installing Playwright browsers..." -ForegroundColor Cyan
    Set-Location $TestsDir
    npx playwright install --with-deps chromium
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ⚠️  Playwright install had warnings (continuing)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Playwright browsers installed" -ForegroundColor Green
    }

    # Step 9: Run E2E tests
    Write-Host "`n🧪 Running E2E tests..." -ForegroundColor Cyan
    Set-Location $TestsDir
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ E2E tests failed" -ForegroundColor Red
        $ExitCode = 1
    } else {
        Write-Host "   ✅ E2E tests passed" -ForegroundColor Green
    }

    # Summary
    Write-Host "`n=================================" -ForegroundColor Cyan
    Write-Host "Summary" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    if ($ExitCode -eq 0) {
        Write-Host "✅ All tests passed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend: http://127.0.0.1:8099" -ForegroundColor Gray
        Write-Host "Frontend: http://127.0.0.1:3000" -ForegroundColor Gray
    } else {
        Write-Host "❌ Some tests failed" -ForegroundColor Red
    }
    Write-Host ""

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    $ExitCode = 1
} finally {
    Cleanup
    Set-Location $RepoRoot
}

exit $ExitCode
