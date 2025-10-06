# Test All Applications Script - Enhanced
# External Review Repository
# Last Updated: 2025-10-06
# Production Hardening - Phase 1

$ErrorActionPreference = "Continue"

Write-Host "🧪 Running All Tests (Production Mode)..." -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Cyan

# Run preflight checks first
Write-Host "🔍 Running preflight checks..." -ForegroundColor Yellow
try {
    & ".\tools\preflight-check.ps1"
    Write-Host "   ✅ Preflight checks passed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Preflight checks failed. Some tests may not run properly." -ForegroundColor Red
    Write-Host "   ⚠️  Continuing with tests anyway..." -ForegroundColor Yellow
}

# Enhanced function to run tests with better reporting
function Test-App {
    param(
        [string]$AppName,
        [string]$AppPath,
        [string]$TestType,
        [bool]$Critical = $false
    )
    
    Write-Host "`n🔄 Testing $AppName ($TestType)..." -ForegroundColor Yellow
    Write-Host "   Path: $AppPath" -ForegroundColor Gray
    
    if (-not (Test-Path $AppPath)) {
        Write-Host "   ❌ Application path not found: $AppPath" -ForegroundColor Red
        if ($Critical) { 
            Write-Host "   🚨 Critical application test failed!" -ForegroundColor Red
            return $false
        }
        return $false
    }
    
    $originalLocation = Get-Location
    try {
        Set-Location $AppPath
        
        # Check if package.json exists
        if (-not (Test-Path "package.json")) {
            Write-Host "   ❌ package.json not found" -ForegroundColor Red
            if ($Critical) { 
                Set-Location $originalLocation
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
