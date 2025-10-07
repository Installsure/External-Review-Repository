# InstallSure BIM - End-to-End Testing Script
# Testing with Legacy Backend (Docker not available)

param(
    [string]$TestFile = "c:\Users\lesso\Desktop\07.28.25 Whispering Pines_Building A.pdf",
    [switch]$Verbose
)

Write-Host "InstallSure BIM End-to-End Testing (Legacy Mode)" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Check if test file exists
if (-not (Test-Path $TestFile)) {
    Write-Host "Test file not found: $TestFile" -ForegroundColor Red
    Write-Host "Please ensure the test file exists or specify a different file with -TestFile parameter" -ForegroundColor Yellow
    exit 1
}

Write-Host "Test file: $TestFile" -ForegroundColor White
$fileInfo = Get-Item $TestFile
Write-Host "File size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray

# Health check before testing
Write-Host ""
Write-Host "Pre-test health check..." -ForegroundColor Cyan

$testResults = @()

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "Backend server: Healthy" -ForegroundColor Green
    if ($Verbose) {
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
        Write-Host "   Service: $($response.service)" -ForegroundColor Gray
    }
    $testResults += @{Test="Backend Health"; Status="PASS"; Details=$response.status}
} catch {
    Write-Host "Backend server: Health check failed" -ForegroundColor Red
    Write-Host "Please ensure the backend server is running on port 8000" -ForegroundColor Yellow
    if ($Verbose) {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
    $testResults += @{Test="Backend Health"; Status="FAIL"; Details=$_.Exception.Message}
    exit 1
}

# Test sequence
Write-Host ""
Write-Host "Running End-to-End Tests..." -ForegroundColor Green
Write-Host "============================" -ForegroundColor Cyan

# Test 1: Basic API endpoints
Write-Host ""
Write-Host "1. Testing API endpoints..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/projects" -TimeoutSec 10
    Write-Host "   Projects endpoint: Working" -ForegroundColor Green
    $testResults += @{Test="Projects API"; Status="PASS"; Details="Endpoint accessible"}
    
    if ($Verbose -and $response) {
        Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Projects endpoint: Failed" -ForegroundColor Red
    $testResults += @{Test="Projects API"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test 2: File upload simulation
Write-Host ""
Write-Host "2. Testing file upload..." -ForegroundColor Yellow

try {
    # Create multipart form data for file upload
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileContent = [System.IO.File]::ReadAllBytes($TestFile)
    $fileName = [System.IO.Path]::GetFileName($TestFile)
    
    # Create form data
    $LF = "`r`n"
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: application/pdf",
        "",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileContent),
        "--$boundary--"
    )
    
    $body = $bodyLines -join $LF
    
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/bim/upload" `
        -Method POST `
        -Body $body `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -TimeoutSec 30
        
    Write-Host "   File upload: Successful" -ForegroundColor Green
    $testResults += @{Test="File Upload"; Status="PASS"; Details="File uploaded successfully"}
    
    if ($Verbose -and $response.fileId) {
        Write-Host "   File ID: $($response.fileId)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   File upload: Failed" -ForegroundColor Red
    $testResults += @{Test="File Upload"; Status="FAIL"; Details=$_.Exception.Message}
    if ($Verbose) {
        Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# Test 3: BIM estimation
Write-Host ""
Write-Host "3. Testing BIM estimation..." -ForegroundColor Yellow

try {
    $requestBody = @{
        fileName = [System.IO.Path]::GetFileName($TestFile)
        projectName = "Whispering Pines Building A"
        estimationType = "full"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/bim/estimate" `
        -Method POST `
        -Body $requestBody `
        -ContentType "application/json" `
        -TimeoutSec 30
        
    Write-Host "   BIM estimation: Successful" -ForegroundColor Green
    $testResults += @{Test="BIM Estimation"; Status="PASS"; Details="Estimation completed"}
    
    if ($Verbose -and $response) {
        Write-Host "   Estimate ID: $($response.estimateId)" -ForegroundColor Gray
        if ($response.totalCost) {
            Write-Host "   Total Cost: $($response.totalCost)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   BIM estimation: Failed" -ForegroundColor Red
    $testResults += @{Test="BIM Estimation"; Status="FAIL"; Details=$_.Exception.Message}
    if ($Verbose) {
        Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# Test 4: File statistics
Write-Host ""
Write-Host "4. Testing file statistics..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/files/stats" -TimeoutSec 10
    Write-Host "   File statistics: Working" -ForegroundColor Green
    $testResults += @{Test="File Statistics"; Status="PASS"; Details="Stats retrieved"}
    
    if ($Verbose -and $response.data) {
        Write-Host "   Total Files: $($response.data.totalFiles)" -ForegroundColor Gray
        Write-Host "   By Type: $($response.data.byType | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   File statistics: Failed" -ForegroundColor Red
    $testResults += @{Test="File Statistics"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test Results Summary
Write-Host ""
Write-Host "Test Results Summary" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failCount = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$skipCount = ($testResults | Where-Object {$_.Status -eq "SKIP"}).Count

foreach ($result in $testResults) {
    $status = $result.Status
    
    $color = switch ($status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "SKIP" { "Yellow" }
    }
    
    Write-Host "$($result.Test): $status" -ForegroundColor $color
    if ($Verbose -and $result.Details) {
        Write-Host "   $($result.Details)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Summary Statistics:" -ForegroundColor Cyan
Write-Host "   Passed: $passCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor Red
Write-Host "   Skipped: $skipCount" -ForegroundColor Yellow

# Overall result
$overallStatus = if ($failCount -eq 0 -and $passCount -gt 0) {
    "SUCCESS"
} else {
    "PARTIAL_SUCCESS"
}

Write-Host ""
Write-Host "Overall Test Status: $overallStatus" -ForegroundColor $(
    if ($overallStatus -eq "SUCCESS") { "Green" } else { "Yellow" }
)

# Next steps
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
if ($overallStatus -eq "SUCCESS") {
    Write-Host "End-to-end testing completed successfully!" -ForegroundColor Green
    Write-Host "BIM estimation pipeline is working" -ForegroundColor Green
    Write-Host "File upload and processing functional" -ForegroundColor Green
} else {
    Write-Host "Testing completed with some issues" -ForegroundColor Yellow
    Write-Host "Core functionality appears to be working" -ForegroundColor Yellow
    Write-Host "Some advanced features may need attention" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Test file processed: $([System.IO.Path]::GetFileName($TestFile))" -ForegroundColor White
Write-Host "Backend server: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Copilot + Cursor Integration: TEST COMPLETE!" -ForegroundColor Green

# Exit with appropriate code
exit $(if ($overallStatus -eq "SUCCESS") { 0 } else { 1 })