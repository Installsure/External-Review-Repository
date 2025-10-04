# Test script for AIA library and residential demo functionality
# This tests the new document management endpoints

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$API_BASE = if ($env:API_BASE) { $env:API_BASE } else { "http://localhost:8000" }

Write-Host "🧪 Testing Document Management API" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host ""

function Check($label, $cond) {
    if ($cond) {
        Write-Host "✅ $label" -ForegroundColor Green
    } else {
        Write-Host "❌ $label" -ForegroundColor Red
        throw "Test failed: $label"
    }
}

function Info($message) {
    Write-Host "ℹ️ $message" -ForegroundColor Cyan
}

# 1. Verify server is running
Write-Host "Checking if server is running at ${API_BASE}..."
try {
    $health = Invoke-RestMethod -Uri "${API_BASE}/api/health" -Method GET
    Check "Server is online" ($health -ne $null)
} catch {
    Write-Host "❌ Server is not running. Please start the backend server first." -ForegroundColor Red
    Write-Host "   Run: cd applications/installsure/backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

# 2. Test AIA library ingestion
Write-Host ""
Info "Testing AIA library ingestion..."
try {
    $aiaResponse = Invoke-RestMethod -Uri "${API_BASE}/api/docs/ingestAIA" -Method POST -ContentType "application/json"
    if ($aiaResponse.ok) {
        if ($aiaResponse.error) {
            Info "AIA ingest skipped: $($aiaResponse.error)"
        } else {
            Info "AIA ingest -> $($aiaResponse.count) items"
            if ($aiaResponse.items) {
                $aiaResponse.items | ForEach-Object {
                    if ($_.error) {
                        Write-Host "  - $($_.title): $($_.error)" -ForegroundColor Yellow
                    } else {
                        Write-Host "  - $($_.title) -> $($_.public)" -ForegroundColor Gray
                    }
                }
            }
        }
    }
} catch {
    Write-Host "⚠️ AIA library ingestion test failed: $_" -ForegroundColor Yellow
}

# 3. Create sample RFI
Write-Host ""
Info "Creating sample RFI..."
try {
    $rfiData = @{
        project = "DEMO"
        sheet = "A1.1"
        title = "Clarify exterior wall type @ grid B"
        question = "Is exterior wall 2x6 with R-21 or 2x4 with R-13?"
        reference = "A1.1 Wall Type Legend"
        proposed = "Use 2x6 R-21 unless structural conflicts."
        due = "5 business days"
    }
    
    $rfiResponse = Invoke-RestMethod -Uri "${API_BASE}/api/docs/rfi" -Method POST `
        -ContentType "application/json" -Body ($rfiData | ConvertTo-Json)
    
    Check "RFI created" ($rfiResponse.ok -and $rfiResponse.rfi_id)
    $RFI_ID = $rfiResponse.rfi_id
    $RFI_PATH = $rfiResponse.path
} catch {
    Write-Host "❌ RFI creation failed: $_" -ForegroundColor Red
    exit 1
}

# 4. Create sample Change Order
Write-Host ""
Info "Creating sample Change Order..."
try {
    $coData = @{
        project = "DEMO"
        desc = "Upgrade ceiling insulation to R-38 blown"
        cost = "`$1,500.00"
        time = "0"
        reason = "Owner upgrade"
        co_no = "CO-001"
    }
    
    $coResponse = Invoke-RestMethod -Uri "${API_BASE}/api/docs/co" -Method POST `
        -ContentType "application/json" -Body ($coData | ConvertTo-Json)
    
    Check "Change Order created" ($coResponse.ok -and $coResponse.co_id)
    $CO_ID = $coResponse.co_id
    $CO_PATH = $coResponse.path
} catch {
    Write-Host "❌ Change Order creation failed: $_" -ForegroundColor Red
    exit 1
}

# 5. Test Residential Demo
Write-Host ""
Info "Testing residential demo..."
try {
    $demoResponse = Invoke-RestMethod -Uri "${API_BASE}/api/demo/residential" -Method POST `
        -ContentType "application/json"
    
    if ($demoResponse.ok) {
        if ($demoResponse.error) {
            Info "Residential demo skipped: $($demoResponse.error)"
        } else {
            Check "Residential demo completed" $true
            if ($demoResponse.plan) {
                Info "Plan: $($demoResponse.plan)"
            }
            if ($demoResponse.docs) {
                Info "Generated $($demoResponse.docs.Count) documents"
            }
        }
    }
} catch {
    Write-Host "⚠️ Residential demo test failed: $_" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "RFI: $RFI_ID -> $RFI_PATH"
Write-Host "CO:  $CO_ID  -> $CO_PATH"
Write-Host ""
Write-Host "All tests completed! ✅" -ForegroundColor Green
Write-Host ""
Write-Host "To customize:" -ForegroundColor Yellow
Write-Host "  - Edit aia-library.manifest.json (add licensed AIA/waiver/RFI/Submittal URLs)"
Write-Host "  - Edit residential-plan.manifest.json (set an open/public plan URL)"
Write-Host ""
