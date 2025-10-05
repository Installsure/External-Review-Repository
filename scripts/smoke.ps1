#!/usr/bin/env pwsh
# InstallSure Smoke Test Script - Windows PowerShell
# Runs the complete application stack and validates functionality

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors for output
$ColorPass = "Green"
$ColorFail = "Red"
$ColorInfo = "Cyan"
$ColorWarn = "Yellow"

Write-Host "================================================================" -ForegroundColor $ColorInfo
Write-Host "  InstallSure Smoke Test Suite" -ForegroundColor $ColorInfo
Write-Host "================================================================" -ForegroundColor $ColorInfo
Write-Host ""

$script:TestsPassed = 0
$script:TestsFailed = 0
$script:BackendPid = $null
$script:FrontendPid = $null

function Write-Step {
    param([string]$Message)
    Write-Host "▶ $Message" -ForegroundColor $ColorInfo
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $ColorPass
    $script:TestsPassed++
}

function Write-Failure {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $ColorFail
    $script:TestsFailed++
}

function Cleanup {
    Write-Step "Cleaning up..."
    if ($script:BackendPid) {
        Stop-Process -Id $script:BackendPid -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped backend (PID: $script:BackendPid)"
    }
    if ($script:FrontendPid) {
        Stop-Process -Id $script:FrontendPid -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped frontend (PID: $script:FrontendPid)"
    }
}

# Register cleanup on exit
trap { Cleanup; exit 1 }

try {
    # Step 1: Install backend dependencies
    Write-Step "Installing backend dependencies..."
    Push-Location applications/installsure/backend
    if (-not (Test-Path "node_modules")) {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Backend npm install failed" }
    }
    Write-Success "Backend dependencies ready"
    Pop-Location

    # Step 2: Install frontend dependencies
    Write-Step "Installing frontend dependencies..."
    Push-Location applications/installsure/frontend
    if (-not (Test-Path "node_modules")) {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Frontend npm install failed" }
    }
    Write-Success "Frontend dependencies ready"
    Pop-Location

    # Step 3: Start backend
    Write-Step "Starting backend on port 8099..."
    Push-Location applications/installsure/backend
    $BackendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $script:BackendPid = $BackendProcess.Id
    Pop-Location
    Write-Host "  Backend started (PID: $script:BackendPid)"

    # Step 4: Start frontend
    Write-Step "Starting frontend on port 3000..."
    Push-Location applications/installsure/frontend
    $FrontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $script:FrontendPid = $FrontendProcess.Id
    Pop-Location
    Write-Host "  Frontend started (PID: $script:FrontendPid)"

    # Step 5: Wait for services to be ready
    Write-Step "Waiting for services to be ready..."
    
    $MaxAttempts = 60
    $BackendReady = $false
    $FrontendReady = $false

    for ($i = 1; $i -le $MaxAttempts; $i++) {
        Start-Sleep -Seconds 1
        
        if (-not $BackendReady) {
            try {
                $response = Invoke-WebRequest -Uri "http://127.0.0.1:8099/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $BackendReady = $true
                    Write-Host "  Backend ready after $i seconds"
                }
            } catch {}
        }
        
        if (-not $FrontendReady) {
            try {
                $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $FrontendReady = $true
                    Write-Host "  Frontend ready after $i seconds"
                }
            } catch {}
        }

        if ($BackendReady -and $FrontendReady) {
            break
        }
    }

    if (-not $BackendReady) {
        throw "Backend failed to start within $MaxAttempts seconds"
    }
    if (-not $FrontendReady) {
        throw "Frontend failed to start within $MaxAttempts seconds"
    }

    Write-Success "All services are ready"

    # Step 6: Install Playwright
    Write-Step "Installing Playwright browsers..."
    Push-Location tests
    if (-not (Test-Path "node_modules")) {
        npm install --silent
        if ($LASTEXITCODE -ne 0) { throw "Test dependencies install failed" }
    }
    npx playwright install --with-deps chromium 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Playwright browsers installed"
    } else {
        Write-Failure "Playwright installation failed"
    }
    Pop-Location

    # Step 7: Run Playwright tests
    Write-Step "Running Playwright E2E tests..."
    Push-Location tests
    npx playwright test
    $PlaywrightExitCode = $LASTEXITCODE
    Pop-Location
    
    if ($PlaywrightExitCode -eq 0) {
        Write-Success "Playwright tests passed"
    } else {
        Write-Failure "Playwright tests failed (exit code: $PlaywrightExitCode)"
    }

    # Step 8: Run backend unit tests (if they exist)
    Write-Step "Running backend unit tests..."
    Push-Location applications/installsure/backend
    npm run test 2>&1 | Out-Null
    $BackendTestExitCode = $LASTEXITCODE
    Pop-Location
    
    if ($BackendTestExitCode -eq 0) {
        Write-Success "Backend tests passed"
    } else {
        Write-Failure "Backend tests failed (exit code: $BackendTestExitCode)"
    }

    # Summary
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor $ColorInfo
    Write-Host "  Test Summary" -ForegroundColor $ColorInfo
    Write-Host "================================================================" -ForegroundColor $ColorInfo
    Write-Host "  Passed: $script:TestsPassed" -ForegroundColor $ColorPass
    Write-Host "  Failed: $script:TestsFailed" -ForegroundColor $ColorFail
    Write-Host ""

    if ($script:TestsFailed -eq 0) {
        Write-Host "  ✓ ALL TESTS PASSED" -ForegroundColor $ColorPass
        $ExitCode = 0
    } else {
        Write-Host "  ✗ SOME TESTS FAILED" -ForegroundColor $ColorFail
        $ExitCode = 1
    }

} catch {
    Write-Host ""
    Write-Failure "Fatal error: $_"
    $ExitCode = 1
} finally {
    Cleanup
    Write-Host ""
    exit $ExitCode
}
