# NexusLocalAI Smoke Tests
# This script runs basic smoke tests to verify the installation

param(
    [switch]$Verbose
)

$root = "$PSScriptRoot\.."
$ErrorActionPreference = "Continue"

Write-Host "🧪 NexusLocalAI Smoke Tests" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET"
    )
    
    Write-Host "`nTesting: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 5
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method POST -UseBasicParsing -TimeoutSec 5 -Body "{}"
        }
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            if ($Verbose) {
                Write-Host "  Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
            }
            return $true
        } else {
            Write-Host "  ✗ FAIL - Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ✗ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-WebSocket {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host "`nTesting: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    # Basic WebSocket connectivity test using .NET
    try {
        $ws = New-Object System.Net.WebSockets.ClientWebSocket
        $cts = New-Object System.Threading.CancellationTokenSource
        $cts.CancelAfter(5000)  # 5 second timeout
        
        $uri = [System.Uri]::new($Url)
        $task = $ws.ConnectAsync($uri, $cts.Token)
        $task.Wait()
        
        if ($ws.State -eq 'Open') {
            Write-Host "  ✓ PASS - WebSocket connection established" -ForegroundColor Green
            $ws.Dispose()
            return $true
        } else {
            Write-Host "  ✗ FAIL - WebSocket state: $($ws.State)" -ForegroundColor Red
            $ws.Dispose()
            return $false
        }
    } catch {
        Write-Host "  ✗ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-FileExists {
    param(
        [string]$Name,
        [string]$Path
    )
    
    Write-Host "`nTesting: $Name" -ForegroundColor Yellow
    Write-Host "  Path: $Path" -ForegroundColor Gray
    
    if (Test-Path $Path) {
        Write-Host "  ✓ PASS - File exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ FAIL - File not found" -ForegroundColor Red
        return $false
    }
}

# Run tests
Write-Host "`n📋 Running endpoint tests..." -ForegroundColor Cyan

# Test Router
if (Test-Endpoint "Router Health" "http://localhost:8099/health") {
    $testsPassed++
} else {
    $testsFailed++
}

if (Test-Endpoint "Router Root" "http://localhost:8099/") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Qdrant (optional)
Write-Host "`n📋 Testing optional services..." -ForegroundColor Cyan
if (Test-Endpoint "Qdrant Health" "http://localhost:6333/") {
    $testsPassed++
} else {
    Write-Host "  ℹ Qdrant not running (optional)" -ForegroundColor Gray
}

# Test WebSocket Avatar Bridge
if (Test-WebSocket "Avatar Bridge WebSocket" "ws://localhost:8765") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test file structure
Write-Host "`n📋 Testing file structure..." -ForegroundColor Cyan

if (Test-FileExists "Configuration" "$root\.env") {
    $testsPassed++
} else {
    $testsFailed++
}

if (Test-FileExists "Guardrails Config" "$root\guardrails\config.yaml") {
    $testsPassed++
} else {
    $testsFailed++
}

if (Test-FileExists "Memory Directory" "$root\memory\snapshots") {
    $testsPassed++
} else {
    $testsFailed++
}

# Check for memory snapshots
$snapshots = Get-ChildItem "$root\memory\snapshots\*.json" -ErrorAction SilentlyContinue
if ($snapshots.Count -gt 0) {
    Write-Host "`nTesting: Memory Snapshots" -ForegroundColor Yellow
    Write-Host "  ✓ PASS - Found $($snapshots.Count) snapshot(s)" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "`nTesting: Memory Snapshots" -ForegroundColor Yellow
    Write-Host "  ℹ No snapshots yet (service may need more time)" -ForegroundColor Gray
}

# Summary
Write-Host "`n============================" -ForegroundColor Cyan
Write-Host "Test Results:" -ForegroundColor Cyan
Write-Host "  Passed: $testsPassed" -ForegroundColor Green
Write-Host "  Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -eq 0) {
    Write-Host "`n✨ All critical tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠ Some tests failed. Check the output above." -ForegroundColor Yellow
    exit 1
}
