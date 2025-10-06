$ErrorActionPreference = "Stop"
npm --prefix applications/installsure/backend test
npm --prefix applications/installsure/frontend test
npm --prefix applications/demo-dashboard/frontend test

        
        # Run tests
        Write-Host "   🏃 Running tests..." -ForegroundColor Gray
        $testResult = npm run test 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Tests passed" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ Tests failed" -ForegroundColor Red
            Write-Host "   Error: $testResult" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Error running tests: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to run E2E tests
function Test-E2E {
    param(
        [string]$AppName,
        [string]$AppPath
    )
    
    Write-Host "`n🔄 Running E2E tests for $AppName..." -ForegroundColor Yellow
    
    if (-not (Test-Path $AppPath)) {
        Write-Host "   ❌ Application path not found: $AppPath" -ForegroundColor Red
        return $false
    }
    
    try {
        Set-Location $AppPath
        
        # Check if Playwright is installed
        if (-not (Test-Path "node_modules/.bin/playwright")) {
            Write-Host "   ⚠️  Playwright not installed. Installing..." -ForegroundColor Yellow
            npm install -D @playwright/test
            npx playwright install
        }
        
        # Check if E2E test script exists
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if (-not $packageJson.scripts."test:e2e") {
            Write-Host "   ⚠️  No E2E test script found" -ForegroundColor Yellow
            return $false
        }
        
        # Run E2E tests
        Write-Host "   🏃 Running E2E tests..." -ForegroundColor Gray
        $e2eResult = npm run test:e2e 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ E2E tests passed" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ E2E tests failed" -ForegroundColor Red
            Write-Host "   Error: $e2eResult" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Error running E2E tests: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test results tracking
$testResults = @{}
$e2eResults = @{}

# Run unit tests for all applications
Write-Host "`n📱 Running Unit Tests..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$apps = @(
    @{Name="InstallSure"; Path="applications\installsure"; Type="Production Ready"},
    @{Name="Demo Dashboard"; Path="applications\demo-dashboard"; Type="Demo Ready"},
    @{Name="FF4U"; Path="applications\ff4u"; Type="Development Ready"},
    @{Name="RedEye"; Path="applications\redeye"; Type="Development Ready"},
    @{Name="ZeroStack"; Path="applications\zerostack"; Type="Development Ready"},
    @{Name="Hello"; Path="applications\hello"; Type="Development Ready"},
    @{Name="Avatar"; Path="applications\avatar"; Type="Development Ready"}
)

foreach ($app in $apps) {
    $testResults[$app.Name] = Test-App -AppName $app.Name -AppPath $app.Path -TestType $app.Type
}

# Run E2E tests for all applications
Write-Host "`n🌐 Running E2E Tests..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

foreach ($app in $apps) {
    $e2eResults[$app.Name] = Test-E2E -AppName $app.Name -AppPath $app.Path
}

# Test summary
Write-Host "`n📊 Test Results Summary..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n📱 Unit Tests:" -ForegroundColor Yellow
foreach ($app in $apps) {
    $status = if ($testResults[$app.Name]) { "✅ PASSED" } else { "❌ FAILED" }
    $color = if ($testResults[$app.Name]) { "Green" } else { "Red" }
    Write-Host "   $($app.Name): $status" -ForegroundColor $color
}

Write-Host "`n🌐 E2E Tests:" -ForegroundColor Yellow
foreach ($app in $apps) {
    $status = if ($e2eResults[$app.Name]) { "✅ PASSED" } else { "❌ FAILED" }
    $color = if ($e2eResults[$app.Name]) { "Green" } else { "Red" }
    Write-Host "   $($app.Name): $status" -ForegroundColor $color
}

# Overall results
$unitTestsPassed = ($testResults.Values | Where-Object { $_ -eq $true }).Count
$unitTestsTotal = $testResults.Count
$e2eTestsPassed = ($e2eResults.Values | Where-Object { $_ -eq $true }).Count
$e2eTestsTotal = $e2eResults.Count

Write-Host "`n📈 Overall Results:" -ForegroundColor Cyan
Write-Host "   Unit Tests: $unitTestsPassed/$unitTestsTotal passed" -ForegroundColor White
Write-Host "   E2E Tests: $e2eTestsPassed/$e2eTestsTotal passed" -ForegroundColor White

if ($unitTestsPassed -eq $unitTestsTotal -and $e2eTestsPassed -eq $e2eTestsTotal) {
    Write-Host "`n🎉 All tests passed successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "✅ All applications are working correctly" -ForegroundColor Green
    Write-Host "✅ All tests are passing" -ForegroundColor Green
    Write-Host "✅ Ready for development and production use" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "❌ Some applications have failing tests" -ForegroundColor Red
    Write-Host "💡 Check the error messages above for details" -ForegroundColor Yellow
    Write-Host "💡 Fix the failing tests before proceeding" -ForegroundColor Yellow
}

Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "   • Review failing tests and fix issues" -ForegroundColor White
Write-Host "   • Run individual app tests for detailed debugging" -ForegroundColor White
Write-Host "   • Check application logs for more information" -ForegroundColor White
Write-Host "   • Refer to troubleshooting guide if needed" -ForegroundColor White
