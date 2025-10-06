# Start All Applications Script - Enhanced
# External Review Repository
# Last Updated: 2025-10-06
# Production Hardening - Phase 1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting All Applications (Production Mode)..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Run preflight checks first
Write-Host "🔍 Running preflight checks..." -ForegroundColor Yellow
try {
    & ".\tools\preflight-check.ps1"
    Write-Host "   ✅ Preflight checks passed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Preflight checks failed. Please address issues before starting." -ForegroundColor Red
    exit 1
}

# Check and start Redis if available
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "`n🔄 Starting Redis (Docker)..." -ForegroundColor Yellow
    try {
        $existingContainer = docker ps -a --filter "name=redis-installsure" --format "{{.Names}}" 2>$null
        if ($existingContainer -eq "redis-installsure") {
            docker start redis-installsure | Out-Null
            Write-Host "   ✅ Redis container restarted" -ForegroundColor Green
        } else {
            docker run -d --name redis-installsure -p 6379:6379 redis:7-alpine | Out-Null
            Write-Host "   ✅ Redis started on port 6379" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️  Redis setup skipped (Docker not available)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Docker not found - Redis will not be available" -ForegroundColor Yellow
}

# Enhanced function to start applications with error handling
function Start-App {
    param(
        [string]$AppName,
        [string]$AppPath,
        [int]$Port,
        [string]$Description,
        [bool]$Critical = $false
    )
    
    Write-Host "`n🔄 Starting $AppName..." -ForegroundColor Yellow
    Write-Host "   Port: $Port" -ForegroundColor Gray
    Write-Host "   Description: $Description" -ForegroundColor Gray
    
    # Check if directory exists
    if (-not (Test-Path $AppPath)) {
        Write-Host "   ❌ Application directory not found: $AppPath" -ForegroundColor Red
        if ($Critical) { exit 1 }
        return
    }
    
    # Check if port is already in use
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "   ⚠️  Port $Port is already in use. Skipping $AppName." -ForegroundColor Yellow
        return
    }
    
    # Check if package.json exists
    if (-not (Test-Path "$AppPath\package.json")) {
        Write-Host "   ❌ package.json not found in $AppPath" -ForegroundColor Red
        if ($Critical) { exit 1 }
        return
    }
    
    # Start the application with enhanced error handling
    try {
        $startLocation = Get-Location
        Set-Location $AppPath
        
        # Install dependencies if node_modules doesn't exist
        if (-not (Test-Path "node_modules")) {
            Write-Host "   📦 Installing dependencies..." -ForegroundColor Blue
            npm install --silent
        }
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting $AppName on port $Port...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
        Set-Location $startLocation
        Write-Host "   ✅ $AppName started successfully" -ForegroundColor Green
        Start-Sleep -Seconds 2  # Give process time to start
    }
    catch {
        Set-Location $startLocation
        Write-Host "   ❌ Failed to start $AppName: $($_.Exception.Message)" -ForegroundColor Red
        if ($Critical) { exit 1 }
    }
}

# Start core applications (Critical Path)
Write-Host "`n🎯 Starting Core Applications..." -ForegroundColor Cyan

# InstallSure Backend (Critical - Must start first)
Start-App -AppName "InstallSure Backend" -AppPath "applications\installsure\backend" -Port 8000 -Description "API Server" -Critical $true

# InstallSure Frontend (Critical - Main Application)  
Start-App -AppName "InstallSure Frontend" -AppPath "applications\installsure\frontend" -Port 3000 -Description "Construction Management Platform" -Critical $true

# Demo Dashboard (Important for demonstration)
Start-App -AppName "Demo Dashboard" -AppPath "applications\demo-dashboard" -Port 3001 -Description "Central Control Panel" -Critical $false

# Optional applications (Development/Demo purposes)
Write-Host "`n📱 Starting Optional Applications..." -ForegroundColor Cyan

Start-App -AppName "FF4U" -AppPath "applications\ff4u" -Port 3002 -Description "Adult Entertainment Platform"
Start-App -AppName "RedEye" -AppPath "applications\redeye" -Port 3003 -Description "Project Management System"
Start-App -AppName "ZeroStack" -AppPath "applications\zerostack" -Port 3004 -Description "Infrastructure Management"
Start-App -AppName "Hello" -AppPath "applications\hello" -Port 3005 -Description "Digital Business Cards"
Start-App -AppName "Avatar" -AppPath "applications\avatar" -Port 3006 -Description "AI Avatar Platform"

# Wait for core applications to start
Write-Host "`n⏳ Waiting for core applications to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Enhanced health check with retry logic
Write-Host "`n🔍 Performing Health Checks..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$coreApps = @(
    @{Name="InstallSure Backend"; Port=8000; URL="http://localhost:8000/api/health"; Critical=$true},
    @{Name="InstallSure Frontend"; Port=3000; URL="http://localhost:3000"; Critical=$true},
    @{Name="Demo Dashboard"; Port=3001; URL="http://localhost:3001"; Critical=$false}
)

$optionalApps = @(
    @{Name="FF4U"; Port=3002; URL="http://localhost:3002"; Critical=$false},
    @{Name="RedEye"; Port=3003; URL="http://localhost:3003"; Critical=$false},
    @{Name="ZeroStack"; Port=3004; URL="http://localhost:3004"; Critical=$false},
    @{Name="Hello"; Port=3005; URL="http://localhost:3005"; Critical=$false},
    @{Name="Avatar"; Port=3006; URL="http://localhost:3006"; Critical=$false}
)

function Test-AppHealth {
    param($app, $maxRetries = 3)
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $app.URL -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $($app.Name) - Healthy on port $($app.Port)" -ForegroundColor Green
                return $true
            }
        }
        catch {
            if ($i -eq $maxRetries) {
                $status = if ($app.Critical) { "❌ CRITICAL" } else { "⚠️  WARNING" }
                $color = if ($app.Critical) { "Red" } else { "Yellow" }
                Write-Host "$status $($app.Name) - Not responding on port $($app.Port)" -ForegroundColor $color
                return $false
            }
            Start-Sleep -Seconds 5
        }
    }
    return $false
}

# Test core applications
$criticalHealthy = $true
foreach ($app in $coreApps) {
    $healthy = Test-AppHealth -app $app
    if (-not $healthy -and $app.Critical) {
        $criticalHealthy = $false
    }
}

# Test optional applications
foreach ($app in $optionalApps) {
    Test-AppHealth -app $app | Out-Null
}

# Final status
Write-Host "`n🎉 Startup Summary" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

if ($criticalHealthy) {
    Write-Host "✅ SYSTEM READY - All critical applications are running" -ForegroundColor Green
} else {
    Write-Host "❌ SYSTEM DEGRADED - Some critical applications failed to start" -ForegroundColor Red
}

Write-Host "`n🌐 Application URLs:" -ForegroundColor Yellow
Write-Host "   • InstallSure:     http://localhost:3000" -ForegroundColor White
Write-Host "   • Demo Dashboard:  http://localhost:3001" -ForegroundColor White
Write-Host "   • Backend API:     http://localhost:8000" -ForegroundColor White
Write-Host "`n💡 Management Commands:" -ForegroundColor Cyan
Write-Host "   • Stop All:   .\scripts\stop-all.ps1" -ForegroundColor Gray
Write-Host "   • Test All:   .\scripts\test-all.ps1" -ForegroundColor Gray
Write-Host "   • Preflight:  .\tools\preflight-check.ps1" -ForegroundColor Gray
