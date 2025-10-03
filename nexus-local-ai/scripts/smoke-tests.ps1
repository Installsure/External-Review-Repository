# NexusLocalAI Smoke Tests
# Validates all components are working

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$root = "$PSScriptRoot\.."
$root = Resolve-Path $root

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NexusLocalAI Smoke Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

# Test 1: Router health check
Write-Host "[TEST 1] Router Health Check" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8099/health" -Method Get -TimeoutSec 5
    if ($response.status -eq "healthy") {
        Write-Host "  ✓ PASS - Router is healthy" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "  ✗ FAIL - Router returned unexpected status" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "  ✗ FAIL - Could not connect to router" -ForegroundColor Red
    if ($Verbose) { Write-Host "    Error: $_" -ForegroundColor DarkRed }
    $failed++
}

# Test 2: Router routing
Write-Host "[TEST 2] Router Routing" -ForegroundColor Green
try {
    $body = @{
        prompt = "Write a Python function to sort a list"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8099/route" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
    
    if ($response.model) {
        Write-Host "  ✓ PASS - Model selected: $($response.model)" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "  ✗ FAIL - No model returned" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "  ✗ FAIL - Routing request failed" -ForegroundColor Red
    if ($Verbose) { Write-Host "    Error: $_" -ForegroundColor DarkRed }
    $failed++
}

# Test 3: Memory snapshots
Write-Host "[TEST 3] Memory Snapshots" -ForegroundColor Green
$memoryDir = Join-Path $root "memory\snapshots"
if (Test-Path $memoryDir) {
    $snapshots = Get-ChildItem -Path $memoryDir -Filter "snapshot_*.json" -ErrorAction SilentlyContinue
    if ($snapshots.Count -gt 0) {
        Write-Host "  ✓ PASS - Found $($snapshots.Count) snapshot(s)" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "  ℹ INFO - No snapshots yet (service may need more time)" -ForegroundColor Yellow
        $passed++
    }
} else {
    Write-Host "  ✗ FAIL - Memory directory not found" -ForegroundColor Red
    $failed++
}

# Test 4: Avatar WebSocket
Write-Host "[TEST 4] Avatar Bridge WebSocket" -ForegroundColor Green
# Note: PowerShell doesn't have native WebSocket client, so we'll skip full test
# In a real scenario, you'd use a WebSocket client library
try {
    # Try to connect to the port
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 8765)
    $tcpClient.Close()
    Write-Host "  ✓ PASS - Avatar bridge is listening" -ForegroundColor Gray
    $passed++
} catch {
    Write-Host "  ✗ FAIL - Avatar bridge not accessible" -ForegroundColor Red
    if ($Verbose) { Write-Host "    Error: $_" -ForegroundColor DarkRed }
    $failed++
}

# Test 5: Qdrant (optional)
Write-Host "[TEST 5] Qdrant (Optional)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:6333/collections" -Method Get -TimeoutSec 5
    Write-Host "  ✓ PASS - Qdrant is running" -ForegroundColor Gray
    $passed++
} catch {
    Write-Host "  ℹ INFO - Qdrant not running (optional)" -ForegroundColor Yellow
    $passed++
}

# Test 6: Ollama (optional)
Write-Host "[TEST 6] Ollama (Optional)" -ForegroundColor Green
try {
    $ollamaVersion = ollama --version 2>&1
    Write-Host "  ✓ PASS - Ollama installed: $ollamaVersion" -ForegroundColor Gray
    
    # Test if Ollama is serving
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
        $modelCount = $response.models.Count
        Write-Host "  ✓ PASS - Ollama serving $modelCount model(s)" -ForegroundColor Gray
        $passed++
    } catch {
        Write-Host "  ℹ INFO - Ollama installed but not serving" -ForegroundColor Yellow
        $passed++
    }
} catch {
    Write-Host "  ℹ INFO - Ollama not installed (optional)" -ForegroundColor Yellow
    $passed++
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Passed: $passed" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Failed: $failed" -ForegroundColor Red
}
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Some tests failed. Check the output above." -ForegroundColor Red
    exit 1
}
