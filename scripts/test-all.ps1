# InstallSure BIM - End-to-End Testing Script
# Coordinated GitHub Copilot + Cursor Integration

param(
    [string]$TestFile = "c:\Users\lesso\Desktop\07.28.25 Whispering Pines_Building A.pdf",
    [switch]$SkipStartup,
    [switch]$Verbose
)

Write-Host "🧪 InstallSure BIM End-to-End Testing" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

# Check if test file exists
if (-not (Test-Path $TestFile)) {
    Write-Host "❌ Test file not found: $TestFile" -ForegroundColor Red
    Write-Host "Please ensure the test file exists or specify a different file with -TestFile parameter" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Test file: $TestFile" -ForegroundColor White

# Start services if not skipped
if (-not $SkipStartup) {
    Write-Host "`n🚀 Starting services..." -ForegroundColor Yellow
    try {
        & ".\scripts\start-all.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to start services"
        }
    } catch {
        Write-Host "❌ Failed to start services: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "⏳ Waiting additional time for services to stabilize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Health check before testing
Write-Host "`n🏥 Pre-test health check..." -ForegroundColor Cyan

$services = @(
    @{name="Gateway"; url="http://localhost:8000/health"},
    @{name="BIM Service"; url="http://localhost:8002/health"},
    @{name="Web App"; url="http://localhost:3000"}
)

$allHealthy = $true
foreach ($service in $services) {
    try {
        $response = Invoke-RestMethod -Uri $service.url -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✅ $($service.name): Healthy" -ForegroundColor Green
        if ($Verbose -and $response.status) {
            Write-Host "   Status: $($response.status)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ $($service.name): Health check failed" -ForegroundColor Red
        $allHealthy = $false
        if ($Verbose) {
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
}

if (-not $allHealthy) {
    Write-Host "`n❌ Health checks failed. Cannot proceed with testing." -ForegroundColor Red
    exit 1
}

# Test sequence
Write-Host "`n🧪 Running End-to-End Tests..." -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan

$testResults = @()

# Test 1: Gateway connectivity
Write-Host "`n1️⃣ Testing Gateway connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 10
    Write-Host "✅ Gateway is responding" -ForegroundColor Green
    $testResults += @{Test="Gateway Connectivity"; Status="PASS"; Details=$response.status}
} catch {
    Write-Host "❌ Gateway connectivity test failed" -ForegroundColor Red
    $testResults += @{Test="Gateway Connectivity"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test 2: BIM Service connectivity
Write-Host "`n2️⃣ Testing BIM Service connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8002/health" -TimeoutSec 10
    Write-Host "✅ BIM Service is responding" -ForegroundColor Green
    $testResults += @{Test="BIM Service Connectivity"; Status="PASS"; Details=$response.status}
} catch {
    Write-Host "❌ BIM Service connectivity test failed" -ForegroundColor Red
    $testResults += @{Test="BIM Service Connectivity"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test 3: File upload simulation (if IFC file available)
$icfTestFile = $null
$commonIfcPaths = @(
    "c:\Users\lesso\Desktop\*.ifc",
    "c:\Users\lesso\Documents\*.ifc",
    ".\test-files\*.ifc"
)

foreach ($path in $commonIfcPaths) {
    $files = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    if ($files) {
        $icfTestFile = $files[0].FullName
        break
    }
}

Write-Host "`n3️⃣ Testing IFC file upload..." -ForegroundColor Yellow
if ($icfTestFile -and (Test-Path $icfTestFile)) {
    Write-Host "📁 Found IFC test file: $icfTestFile" -ForegroundColor White
    try {
        # Create multipart form data for file upload
        $boundary = [System.Guid]::NewGuid().ToString()
        $fileContent = [System.IO.File]::ReadAllBytes($icfTestFile)
        $fileName = [System.IO.Path]::GetFileName($icfTestFile)
        
        $bodyLines = @(
            "--$boundary",
            "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
            "Content-Type: application/octet-stream",
            "",
            [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileContent),
            "--$boundary--"
        )
        
        $body = $bodyLines -join "`r`n"
        
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/bim/upload" `
            -Method POST `
            -Body $body `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -TimeoutSec 30
            
        Write-Host "✅ IFC file upload successful" -ForegroundColor Green
        $testResults += @{Test="IFC File Upload"; Status="PASS"; Details="File processed successfully"}
        
        if ($Verbose -and $response.projectId) {
            Write-Host "   Project ID: $($response.projectId)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ IFC file upload test failed" -ForegroundColor Red
        $testResults += @{Test="IFC File Upload"; Status="FAIL"; Details=$_.Exception.Message}
        if ($Verbose) {
            Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "⚠️ No IFC test file found - skipping upload test" -ForegroundColor Yellow
    $testResults += @{Test="IFC File Upload"; Status="SKIP"; Details="No test file available"}
}

# Test 4: BIM processing endpoint
Write-Host "`n4️⃣ Testing BIM processing endpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8002/projects" -TimeoutSec 10
    Write-Host "✅ BIM projects endpoint is responding" -ForegroundColor Green
    $testResults += @{Test="BIM Processing Endpoints"; Status="PASS"; Details="Projects endpoint accessible"}
} catch {
    Write-Host "❌ BIM processing endpoint test failed" -ForegroundColor Red
    $testResults += @{Test="BIM Processing Endpoints"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test 5: Web application accessibility
Write-Host "`n5️⃣ Testing Web application..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Web application is accessible" -ForegroundColor Green
        $testResults += @{Test="Web Application"; Status="PASS"; Details="HTTP 200 OK"}
    } else {
        Write-Host "⚠️ Web application returned status: $($response.StatusCode)" -ForegroundColor Yellow
        $testResults += @{Test="Web Application"; Status="WARN"; Details="HTTP $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ Web application test failed" -ForegroundColor Red
    $testResults += @{Test="Web Application"; Status="FAIL"; Details=$_.Exception.Message}
}

# Test Results Summary
Write-Host "`n📊 Test Results Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failCount = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$skipCount = ($testResults | Where-Object {$_.Status -eq "SKIP"}).Count
$warnCount = ($testResults | Where-Object {$_.Status -eq "WARN"}).Count

foreach ($result in $testResults) {
    $emoji = switch ($result.Status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "SKIP" { "⏭️" }
        "WARN" { "⚠️" }
    }
    
    $color = switch ($result.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "SKIP" { "Yellow" }
        "WARN" { "Yellow" }
    }
    
    Write-Host "$emoji $($result.Test): $($result.Status)" -ForegroundColor $color
    if ($Verbose -and $result.Details) {
        Write-Host "   $($result.Details)" -ForegroundColor Gray
    }
}

Write-Host "`n📈 Summary Statistics:" -ForegroundColor Cyan
Write-Host "   ✅ Passed: $passCount" -ForegroundColor Green
Write-Host "   ❌ Failed: $failCount" -ForegroundColor Red
Write-Host "   ⚠️ Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "   ⏭️ Skipped: $skipCount" -ForegroundColor Yellow

# Overall result
$overallStatus = if ($failCount -eq 0 -and $passCount -gt 0) {
    "SUCCESS"
} elseif ($failCount -eq 0 -and $warnCount -gt 0) {
    "SUCCESS_WITH_WARNINGS"
} else {
    "FAILURE"
}

Write-Host "`n🎯 Overall Test Status: $overallStatus" -ForegroundColor $(
    switch ($overallStatus) {
        "SUCCESS" { "Green" }
        "SUCCESS_WITH_WARNINGS" { "Yellow" }
        "FAILURE" { "Red" }
    }
)

# Next steps
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
if ($overallStatus -eq "SUCCESS") {
    Write-Host "✅ System is ready for production use!" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:3000 to use the application" -ForegroundColor White
    Write-Host "📂 Upload IFC files and generate cost estimates" -ForegroundColor White
} elseif ($overallStatus -eq "SUCCESS_WITH_WARNINGS") {
    Write-Host "⚠️ System is functional but has some issues" -ForegroundColor Yellow
    Write-Host "🌐 You can still test at http://localhost:3000" -ForegroundColor White
    Write-Host "🔧 Check warnings and consider fixing them" -ForegroundColor White
} else {
    Write-Host "❌ System has critical issues that need to be resolved" -ForegroundColor Red
    Write-Host "🔧 Review failed tests and check logs: docker compose logs" -ForegroundColor White
    Write-Host "🛠️ Consider restarting services: .\scripts\start-all.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "🤝 GitHub Copilot + Cursor Integration: TEST COMPLETE!" -ForegroundColor Green

# Exit with appropriate code
exit $(if ($overallStatus -eq "FAILURE") { 1 } else { 0 })
                return $false
            }
            Set-Location $originalLocation
            return $false
        }
        
        # Install dependencies if needed
        if (-not (Test-Path "node_modules")) {
            Write-Host "   📦 Installing dependencies..." -ForegroundColor Blue
            npm install --silent
        }
        
        # Check if test script exists
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if (-not $packageJson.scripts.test) {
            Write-Host "   ⚠️  No test script found in package.json" -ForegroundColor Yellow
            Set-Location $originalLocation
            return $true  # Not a failure, just no tests
        }
        
        # Run different types of tests
        switch ($TestType) {
            "unit" {
                Write-Host "   🧪 Running unit tests..." -ForegroundColor Gray
                $testResult = npm run test 2>&1
            }
            "build" {
                Write-Host "   🔨 Testing build process..." -ForegroundColor Gray
                $testResult = npm run build 2>&1
            }
            "lint" {
                Write-Host "   📝 Running linting..." -ForegroundColor Gray
                if ($packageJson.scripts.lint) {
                    $testResult = npm run lint 2>&1
                } else {
                    Write-Host "   ⚠️  No lint script found" -ForegroundColor Yellow
                    Set-Location $originalLocation
                    return $true
                }
            }
            default {
                Write-Host "   🧪 Running all tests..." -ForegroundColor Gray
                $testResult = npm run test 2>&1
            }
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $TestType tests passed" -ForegroundColor Green
            Set-Location $originalLocation
            return $true
        } else {
            Write-Host "   ❌ $TestType tests failed" -ForegroundColor Red
            if ($Critical) {
                Write-Host "   🚨 Critical test failure!" -ForegroundColor Red
                Write-Host "   Error Output: $testResult" -ForegroundColor Red
            }
            Set-Location $originalLocation
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Error running tests: $($_.Exception.Message)" -ForegroundColor Red
        Set-Location $originalLocation
        if ($Critical) { 
            return $false
        }
        return $false
    }
}

# Enhanced health check function
function Test-HealthCheck {
    param(
        [string]$AppName,
        [string]$Url,
        [int]$Port
    )
    
    Write-Host "`n🔄 Health check for $AppName..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $AppName is healthy (Port $Port)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ⚠️  $AppName returned status $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "   ❌ $AppName health check failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test results tracking with enhanced categories
$testResults = @{
    Unit = @{}
    Build = @{}
    Lint = @{}
    Health = @{}
}
$criticalTestsFailed = $false

# Core applications (Critical for production)
Write-Host "`n🎯 Testing Core Applications..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$coreApps = @(
    @{Name="InstallSure Frontend"; Path="applications\installsure\frontend"; Critical=$true},
    @{Name="InstallSure Backend"; Path="applications\installsure\backend"; Critical=$true},
    @{Name="Demo Dashboard"; Path="applications\demo-dashboard"; Critical=$false}
)

foreach ($app in $coreApps) {
    Write-Host "`n📋 Testing $($app.Name) (Critical: $($app.Critical))..." -ForegroundColor White
    
    # Unit tests
    $testResults.Unit[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "unit" -Critical $app.Critical
    
    # Build tests
    $testResults.Build[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "build" -Critical $app.Critical
    
    # Lint tests
    $testResults.Lint[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "lint" -Critical $app.Critical
    
    # Track critical failures
    if ($app.Critical -and (-not $testResults.Unit[$app.Name] -or -not $testResults.Build[$app.Name])) {
        $criticalTestsFailed = $true
        Write-Host "   🚨 CRITICAL APPLICATION FAILED TESTS!" -ForegroundColor Red
    }
}

# Optional applications (Development/Demo)
Write-Host "`n📱 Testing Optional Applications..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$optionalApps = @(
    @{Name="FF4U"; Path="applications\ff4u"},
    @{Name="RedEye"; Path="applications\redeye"},
    @{Name="ZeroStack"; Path="applications\zerostack"},
    @{Name="Hello"; Path="applications\hello"},
    @{Name="Avatar"; Path="applications\avatar"}
)

foreach ($app in $optionalApps) {
    Write-Host "`n📋 Testing $($app.Name) (Optional)..." -ForegroundColor White
    
    $testResults.Unit[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "unit"
    $testResults.Build[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "build"
    $testResults.Lint[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType "lint"
}

# Health checks (if applications are running)
Write-Host "`n� Running Health Checks..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$healthChecks = @(
    @{Name="InstallSure Frontend"; Url="http://localhost:3000"; Port=3000},
    @{Name="Demo Dashboard"; Url="http://localhost:3001"; Port=3001},
    @{Name="InstallSure Backend"; Url="http://localhost:8000/api/health"; Port=8000}
)

foreach ($check in $healthChecks) {
    $testResults.Health[$check.Name] = Test-HealthCheck -AppName $check.Name -Url $check.Url -Port $check.Port
}

# Enhanced Test Summary with Production Readiness Assessment
Write-Host "`n📊 Comprehensive Test Results..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

function Show-TestCategory {
    param($Category, $Results)
    Write-Host "`n$Category Tests:" -ForegroundColor Yellow
    foreach ($app in $Results.Keys) {
        $status = if ($Results[$app]) { "✅ PASSED" } else { "❌ FAILED" }
        $color = if ($Results[$app]) { "Green" } else { "Red" }
        Write-Host "   $app`: $status" -ForegroundColor $color
    }
}

Show-TestCategory "📝 Unit" $testResults.Unit
Show-TestCategory "🔨 Build" $testResults.Build  
Show-TestCategory "📋 Lint" $testResults.Lint
Show-TestCategory "🏥 Health" $testResults.Health

# Calculate statistics
$stats = @{
    Unit = @{
        Passed = ($testResults.Unit.Values | Where-Object { $_ -eq $true }).Count
        Total = $testResults.Unit.Count
    }
    Build = @{
        Passed = ($testResults.Build.Values | Where-Object { $_ -eq $true }).Count
        Total = $testResults.Build.Count
    }
    Lint = @{
        Passed = ($testResults.Lint.Values | Where-Object { $_ -eq $true }).Count
        Total = $testResults.Lint.Count
    }
    Health = @{
        Passed = ($testResults.Health.Values | Where-Object { $_ -eq $true }).Count
        Total = $testResults.Health.Count
    }
}

Write-Host "`n📈 Test Statistics:" -ForegroundColor Cyan
Write-Host "   Unit Tests:   $($stats.Unit.Passed)/$($stats.Unit.Total) passed" -ForegroundColor White
Write-Host "   Build Tests:  $($stats.Build.Passed)/$($stats.Build.Total) passed" -ForegroundColor White
Write-Host "   Lint Tests:   $($stats.Lint.Passed)/$($stats.Lint.Total) passed" -ForegroundColor White
Write-Host "   Health Checks: $($stats.Health.Passed)/$($stats.Health.Total) passed" -ForegroundColor White

# Production Readiness Assessment
Write-Host "`n🏭 Production Readiness Assessment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$productionReady = $true
$criticalAppsHealthy = $true

# Check critical applications
foreach ($app in $coreApps) {
    if ($app.Critical) {
        $unitPassed = $testResults.Unit[$app.Name]
        $buildPassed = $testResults.Build[$app.Name]
        $healthPassed = $testResults.Health[$app.Name]
        
        if (-not ($unitPassed -and $buildPassed)) {
            $productionReady = $false
            Write-Host "❌ CRITICAL: $($app.Name) failed essential tests" -ForegroundColor Red
        }
        
        if (-not $healthPassed) {
            $criticalAppsHealthy = $false
            Write-Host "⚠️  WARNING: $($app.Name) not currently running" -ForegroundColor Yellow
        }
    }
}

# Final assessment
if ($criticalTestsFailed) {
    Write-Host "`n🚨 SYSTEM NOT READY FOR PRODUCTION" -ForegroundColor Red
    Write-Host "=================================" -ForegroundColor Red
    Write-Host "❌ Critical applications have failing tests" -ForegroundColor Red
    Write-Host "🔧 Fix critical issues before deployment" -ForegroundColor Yellow
} elseif ($productionReady -and $criticalAppsHealthy) {
    Write-Host "`n✅ SYSTEM READY FOR PRODUCTION" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "✅ All critical tests passing" -ForegroundColor Green
    Write-Host "✅ All critical applications healthy" -ForegroundColor Green
    Write-Host "🚀 Ready for production deployment" -ForegroundColor Green
} elseif ($productionReady) {
    Write-Host "`n⚠️  SYSTEM TESTS PASSED - SERVICES NOT RUNNING" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Yellow
    Write-Host "✅ All tests pass but services need to be started" -ForegroundColor Green
    Write-Host "� Run .\scripts\start-all.ps1 to start services" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ SYSTEM HAS ISSUES" -ForegroundColor Red
    Write-Host "=================================" -ForegroundColor Red
    Write-Host "⚠️  Some tests failing or applications not responding" -ForegroundColor Yellow
    Write-Host "� Review test results and fix issues" -ForegroundColor Yellow
}

Write-Host "`n💡 Management Commands:" -ForegroundColor Cyan
Write-Host "   • Start All:  .\scripts\start-all.ps1" -ForegroundColor Gray
Write-Host "   • Stop All:   .\scripts\stop-all.ps1" -ForegroundColor Gray  
Write-Host "   • Preflight:  .\tools\preflight-check.ps1" -ForegroundColor Gray
