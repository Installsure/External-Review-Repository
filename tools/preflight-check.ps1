$ErrorActionPreference = "Stop"

$minNode = [Version]"20.0.0"
$nodeVer = (node -v 2>$null) -replace 'v', ''
if (-not $nodeVer) { throw "Node.js not found. Install Node >= $minNode" }
$nodeVer = [Version]$nodeVer

if ($nodeVer -lt $minNode) { throw "Node.js $nodeVer < $minNode" }

$ports = @(3000,3001,8000)
foreach ($p in $ports) {
  $inUse = (Get-NetTCPConnection -State Listen -LocalPort $p -ErrorAction SilentlyContinue)
  if ($inUse) { throw "Port $p already in use. Stop running services and retry." }
}
Write-Host "Preflight OK."

    if (Test-Path $FilePath) {
        Write-Host "   ✅ $Description exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "   ❌ $Description not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to check if a directory exists
function Test-Directory {
    param([string]$DirPath, [string]$Description)
    
    Write-Host "`n🔄 Checking $Description..." -ForegroundColor Yellow
    
    if (Test-Path $DirPath) {
        Write-Host "   ✅ $Description exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "   ❌ $Description not found: $DirPath" -ForegroundColor Red
        return $false
    }
}

# Check system requirements
Write-Host "`n🖥️  System Requirements Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check Node.js
if (-not (Test-Command "node" "Node.js")) {
    $allChecksPassed = $false
}

# Check npm
if (-not (Test-Command "npm" "npm")) {
    $allChecksPassed = $false
}

# Check Python (for InstallSure backend)
if (-not (Test-Command "python" "Python")) {
    Write-Host "   ⚠️  Python not found - InstallSure backend may not work" -ForegroundColor Yellow
}

# Check Git
if (-not (Test-Command "git" "Git")) {
    Write-Host "   ⚠️  Git not found - version control features may not work" -ForegroundColor Yellow
}

# Check Docker (optional)
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    Write-Host "`n🔄 Checking Docker..." -ForegroundColor Yellow
    Write-Host "   ✅ Docker is installed" -ForegroundColor Green
    $dockerVersion = & docker --version 2>&1
    Write-Host "   Version: $dockerVersion" -ForegroundColor Gray
} else {
    Write-Host "`n🔄 Checking Docker..." -ForegroundColor Yellow
    Write-Host "   ⚠️  Docker not found - containerization features will not be available" -ForegroundColor Yellow
}

# Check port availability
Write-Host "`n🌐 Port Availability Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$ports = @(
    @{Port=3000; Description="InstallSure"},
    @{Port=3001; Description="Demo Dashboard"},
    @{Port=3002; Description="FF4U"},
    @{Port=3003; Description="RedEye"},
    @{Port=3004; Description="ZeroStack"},
    @{Port=3005; Description="Hello"},
    @{Port=3006; Description="Avatar"}
)

foreach ($portInfo in $ports) {
    if (-not (Test-Port -Port $portInfo.Port -Description $portInfo.Description)) {
        $allChecksPassed = $false
    }
}

# Check application directories
Write-Host "`n📁 Application Structure Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$appDirs = @(
    @{Path="applications\installsure"; Description="InstallSure Application"},
    @{Path="applications\demo-dashboard"; Description="Demo Dashboard Application"},
    @{Path="applications\ff4u"; Description="FF4U Application"},
    @{Path="applications\redeye"; Description="RedEye Application"},
    @{Path="applications\zerostack"; Description="ZeroStack Application"},
    @{Path="applications\hello"; Description="Hello Application"},
    @{Path="applications\avatar"; Description="Avatar Application"}
)

foreach ($appDir in $appDirs) {
    if (-not (Test-Directory -DirPath $appDir.Path -Description $appDir.Description)) {
        $allChecksPassed = $false
    }
}

# Check essential files
Write-Host "`n📄 Essential Files Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$essentialFiles = @(
    @{Path="README.md"; Description="Main README"},
    @{Path="documentation\SETUP_GUIDE.md"; Description="Setup Guide"},
    @{Path="documentation\API_DOCUMENTATION.md"; Description="API Documentation"},
    @{Path="documentation\TROUBLESHOOTING.md"; Description="Troubleshooting Guide"},
    @{Path="scripts\start-all.ps1"; Description="Start All Script"},
    @{Path="scripts\stop-all.ps1"; Description="Stop All Script"},
    @{Path="scripts\test-all.ps1"; Description="Test All Script"},
    @{Path=".env.sample"; Description="Environment Sample"}
)

foreach ($file in $essentialFiles) {
    if (-not (Test-File -FilePath $file.Path -Description $file.Description)) {
        $allChecksPassed = $false
    }
}

# Check package.json files
Write-Host "`n📦 Package Configuration Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

foreach ($appDir in $appDirs) {
    $packageJsonPath = Join-Path $appDir.Path "package.json"
    if (-not (Test-File -FilePath $packageJsonPath -Description "$($appDir.Description) package.json")) {
        $allChecksPassed = $false
    }
}

# Check environment configuration
Write-Host "`n🔧 Environment Configuration Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if (Test-File -FilePath ".env" -Description "Environment Configuration") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env file not found - using .env.sample" -ForegroundColor Yellow
    if (Test-File -FilePath ".env.sample" -Description "Environment Sample") {
        Write-Host "   💡 Copy .env.sample to .env and configure your settings" -ForegroundColor Cyan
    }
}

# Check Node.js version compatibility
Write-Host "`n🔍 Node.js Version Compatibility Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVersion = & node --version
    $nodeVersionNumber = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    
    if ($nodeVersionNumber -ge 20) {
        Write-Host "   ✅ Node.js version $nodeVersion is compatible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Node.js version $nodeVersion is too old" -ForegroundColor Red
        Write-Host "   Please upgrade to Node.js v20 or higher" -ForegroundColor Red
        $allChecksPassed = $false
    }
}

# Check npm version
Write-Host "`n🔍 npm Version Check..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if (Get-Command "npm" -ErrorAction SilentlyContinue) {
    $npmVersion = & npm --version
    $npmVersionNumber = [int]($npmVersion -split '\.')[0]
    
    if ($npmVersionNumber -ge 8) {
        Write-Host "   ✅ npm version $npmVersion is compatible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ npm version $npmVersion is too old" -ForegroundColor Red
        Write-Host "   Please upgrade to npm v8 or higher" -ForegroundColor Red
        $allChecksPassed = $false
    }
}

# Final results
Write-Host "`n📊 Preflight Check Results..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if ($allChecksPassed) {
    Write-Host "`n🎉 All preflight checks passed!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "✅ System requirements met" -ForegroundColor Green
    Write-Host "✅ All ports are available" -ForegroundColor Green
    Write-Host "✅ Application structure is correct" -ForegroundColor Green
    Write-Host "✅ Essential files are present" -ForegroundColor Green
    Write-Host "✅ Ready to start development!" -ForegroundColor Green
    
    Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Run 'scripts\start-all.ps1' to start all applications" -ForegroundColor White
    Write-Host "   2. Run 'scripts\test-all.ps1' to run all tests" -ForegroundColor White
    Write-Host "   3. Check 'documentation\SETUP_GUIDE.md' for detailed setup" -ForegroundColor White
} else {
    Write-Host "`n❌ Some preflight checks failed!" -ForegroundColor Red
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "❌ Please fix the issues above before proceeding" -ForegroundColor Red
    Write-Host "💡 Check 'documentation\TROUBLESHOOTING.md' for help" -ForegroundColor Yellow
    Write-Host "💡 Run this script again after fixing issues" -ForegroundColor Yellow
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "   • System Requirements: $(if ($allChecksPassed) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor White
Write-Host "   • Port Availability: $(if ($allChecksPassed) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor White
Write-Host "   • Application Structure: $(if ($allChecksPassed) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor White
Write-Host "   • Essential Files: $(if ($allChecksPassed) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor White
Write-Host "   • Version Compatibility: $(if ($allChecksPassed) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor White

Write-Host "`n🔍 Preflight check completed!" -ForegroundColor Blue
