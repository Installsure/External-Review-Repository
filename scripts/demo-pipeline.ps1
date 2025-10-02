# === FINAL APP REVIEW PIPELINE ===
# This script sets up and validates the InstallSure Estimating Core with sample docs.
# It integrates APS Takeoff, SQLite, Viewer, Playwright, and security scans.
# Paid stack: ChatGPT (Nexus), Cursor, VSCode + Copilot (MCP)
# Free stack: Playwright, CodeQL/Bandit, Sourcegraph Cody (free), GitHub Actions free tier

param(
    [switch]$SkipCredentials
)

$ErrorActionPreference = "Continue"

# Helper function to update or insert environment variables
function UpsertEnv {
    param(
        [string]$Key,
        [string]$Value,
        [string]$EnvFile = ".env"
    )
    
    if (Test-Path $EnvFile) {
        $content = Get-Content $EnvFile -Raw
        if ($content -match "(?m)^$Key=.*$") {
            # Update existing key
            $content = $content -replace "(?m)^$Key=.*$", "$Key=$Value"
            Set-Content -Path $EnvFile -Value $content -NoNewline
        } else {
            # Add new key
            Add-Content -Path $EnvFile -Value "`n$Key=$Value"
        }
    } else {
        # Create new file with key
        Set-Content -Path $EnvFile -Value "$Key=$Value"
    }
}

Write-Host "=== InstallSure Estimating Demo Review Pipeline ===" -ForegroundColor Blue
Write-Host ""

# Get the repository root directory
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "✓ Repository root: $RepoRoot" -ForegroundColor Green

# 1) Backend setup
Write-Host "`n[1/8] Setting up backend..." -ForegroundColor Blue
Set-Location applications\installsure\backend

if (-not (Test-Path .env)) {
    if (Test-Path env.example) {
        Copy-Item env.example .env
        Write-Host "✓ Created .env from env.example" -ForegroundColor Green
    } else {
        Write-Host "✗ env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Prompt for APS credentials if not set
if (-not $SkipCredentials) {
    Write-Host "Configure APS credentials (press Enter to skip if already configured):" -ForegroundColor Yellow
    $ApsClientId = Read-Host "APS_CLIENT_ID (or press Enter to skip)"
    if ($ApsClientId) {
        UpsertEnv -Key "APS_CLIENT_ID" -Value $ApsClientId
        UpsertEnv -Key "FORGE_CLIENT_ID" -Value $ApsClientId
    }

    $ApsClientSecret = Read-Host "APS_CLIENT_SECRET (or press Enter to skip)"
    if ($ApsClientSecret) {
        UpsertEnv -Key "APS_CLIENT_SECRET" -Value $ApsClientSecret
        UpsertEnv -Key "FORGE_CLIENT_SECRET" -Value $ApsClientSecret
    }

    $AccAccountId = Read-Host "ACC_ACCOUNT_ID (or press Enter to skip)"
    if ($AccAccountId) {
        UpsertEnv -Key "ACC_ACCOUNT_ID" -Value $AccAccountId
    }

    $AccProjectId = Read-Host "ACC_PROJECT_ID (or press Enter to skip)"
    if ($AccProjectId) {
        UpsertEnv -Key "ACC_PROJECT_ID" -Value $AccProjectId
    }
}

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Yellow
$BackendJob = Start-Job -ScriptBlock { 
    Set-Location $using:RepoRoot\applications\installsure\backend
    npm run dev
}
Start-Sleep -Seconds 2
Write-Host "✓ Backend started (Job ID: $($BackendJob.Id))" -ForegroundColor Green

Set-Location $RepoRoot

# 2) Frontend setup
Write-Host "`n[2/8] Setting up frontend..." -ForegroundColor Blue
Set-Location applications\installsure\frontend

if (-not (Test-Path .env)) {
    if (Test-Path env.example) {
        Copy-Item env.example .env
        Write-Host "✓ Created frontend .env from env.example" -ForegroundColor Green
    }
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Start frontend in background
Write-Host "Starting frontend server..." -ForegroundColor Yellow
$FrontendJob = Start-Job -ScriptBlock { 
    Set-Location $using:RepoRoot\applications\installsure\frontend
    npm run dev
}
Start-Sleep -Seconds 2
Write-Host "✓ Frontend started (Job ID: $($FrontendJob.Id))" -ForegroundColor Green

Set-Location $RepoRoot

# Wait for servers to start
Write-Host "`nWaiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3) Verify sample docs
Write-Host "`n[3/8] Verifying sample documents..." -ForegroundColor Blue
if (-not (Test-Path samples)) {
    New-Item -ItemType Directory -Path samples | Out-Null
}

if (-not (Test-Path samples\sample_blueprint.json)) {
    @"
{ "blueprint": "Sample House A", "urn": "urn:sample:demo", "sheets": ["planA.pdf"], "meta": {"sqft":1200,"floors":2} }
"@ | Set-Content samples\sample_blueprint.json
}

if (-not (Test-Path samples\sample_takeoff.json)) {
    @"
[{"package":"Walls","type":"Drywall","qty":200},{"package":"Framing","type":"2x4 Lumber","qty":500}]
"@ | Set-Content samples\sample_takeoff.json
}

Write-Host "✓ Sample documents created/verified" -ForegroundColor Green

# 4) Run through workflows
Write-Host "`n[4/8] Testing API workflows..." -ForegroundColor Blue

# Helper function for API calls
function Invoke-ApiTest {
    param(
        [string]$Description,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    Write-Host "`n$Description" -ForegroundColor Yellow
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        if ($Body) {
            $params.ContentType = "application/json"
            $params.Body = $Body
        }
        $response = Invoke-WebRequest @params
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Translate + view
$blueprintJson = Get-Content samples\sample_blueprint.json -Raw
Invoke-ApiTest -Description "Testing model translation endpoint..." `
    -Url "http://localhost:8080/api/models/translate" `
    -Method "POST" `
    -Body $blueprintJson

# Sync takeoff
Invoke-ApiTest -Description "Testing takeoff sync endpoint..." `
    -Url "http://localhost:8080/api/takeoff/sync" `
    -Method "POST"

# Check items
Invoke-ApiTest -Description "Testing takeoff items endpoint..." `
    -Url "http://localhost:8080/api/takeoff/items"

# Optional: enriched assemblies
Invoke-ApiTest -Description "Testing estimate lines endpoint..." `
    -Url "http://localhost:8080/api/estimate/lines"

Write-Host "`n✓ API workflow tests completed" -ForegroundColor Green

# 5) Testing with Playwright
Write-Host "`n[5/8] Running Playwright tests..." -ForegroundColor Blue
Set-Location $RepoRoot

if ((Test-Path tests) -and (Test-Path tests\package.json)) {
    Set-Location tests
    if (-not (Test-Path node_modules)) {
        npm install
    }
    npx playwright test --reporter=list
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Playwright tests failed or not configured" -ForegroundColor Yellow
    }
    Set-Location $RepoRoot
} else {
    Write-Host "⚠ Playwright tests directory not found, skipping..." -ForegroundColor Yellow
}

# 6) Security + quality scans
Write-Host "`n[6/8] Running security scans..." -ForegroundColor Blue

# Check if bandit is available (Python security scanner)
if (Get-Command bandit -ErrorAction SilentlyContinue) {
    Write-Host "Running Bandit security scan on backend..." -ForegroundColor Yellow
    bandit -r applications\installsure\backend\src
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Bandit scan completed with warnings" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Bandit not installed, skipping Python security scan" -ForegroundColor Yellow
    Write-Host "  Install with: pip install bandit" -ForegroundColor Yellow
}

# Check if CodeQL CLI is available
if (Get-Command codeql -ErrorAction SilentlyContinue) {
    Write-Host "`nRunning CodeQL analysis..." -ForegroundColor Yellow
    codeql database create codeql-db --language=javascript --source-root=applications\installsure\backend
    if ($LASTEXITCODE -eq 0) {
        codeql database analyze codeql-db --format=sarif-latest --output=results.sarif
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ CodeQL analysis failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ CodeQL CLI not installed, skipping CodeQL analysis" -ForegroundColor Yellow
    Write-Host "  Install from: https://github.com/github/codeql-cli-binaries" -ForegroundColor Yellow
}

# 7) ESLint check
Write-Host "`n[7/8] Running code quality checks..." -ForegroundColor Blue
Set-Location applications\installsure\backend
Write-Host "Running ESLint on backend..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ ESLint found issues" -ForegroundColor Yellow
}
Set-Location $RepoRoot

Set-Location applications\installsure\frontend
Write-Host "Running ESLint on frontend..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ ESLint found issues" -ForegroundColor Yellow
}
Set-Location $RepoRoot

# 8) Report status
Write-Host "`n[8/8] Generating status report..." -ForegroundColor Blue
Write-Host "=== InstallSure Estimating Demo Review Completed ===" -ForegroundColor Green
Write-Host "Viewer: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Green
Write-Host "Sample docs processed: samples\sample_blueprint.json + sample_takeoff.json" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Job ID: $($BackendJob.Id)" -ForegroundColor Yellow
Write-Host "Frontend Job ID: $($FrontendJob.Id)" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Blue
Write-Host "  Stop-Job -Id $($BackendJob.Id); Stop-Job -Id $($FrontendJob.Id)" -ForegroundColor White
Write-Host "  Remove-Job -Id $($BackendJob.Id); Remove-Job -Id $($FrontendJob.Id)" -ForegroundColor White
Write-Host ""
Write-Host "To view job output:" -ForegroundColor Blue
Write-Host "  Receive-Job -Id $($BackendJob.Id) -Keep" -ForegroundColor White
Write-Host "  Receive-Job -Id $($FrontendJob.Id) -Keep" -ForegroundColor White
Write-Host ""
Write-Host "✓ Pipeline complete!" -ForegroundColor Green

# Save job IDs for cleanup
@{
    BackendJobId = $BackendJob.Id
    FrontendJobId = $FrontendJob.Id
} | ConvertTo-Json | Set-Content "$env:TEMP\installsure-jobs.json"
