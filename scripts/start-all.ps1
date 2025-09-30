# Start All Applications Script
# External Review Repository
# Last Updated: 2025-09-29

Write-Host "🚀 Starting All Applications..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v20+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Function to start an application
function Start-App {
    param(
        [string]$AppName,
        [string]$AppPath,
        [int]$Port,
        [string]$Description
    )
    
    Write-Host "`n🔄 Starting $AppName..." -ForegroundColor Yellow
    Write-Host "   Port: $Port" -ForegroundColor Gray
    Write-Host "   Description: $Description" -ForegroundColor Gray
    
    # Check if port is already in use
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "   ⚠️  Port $Port is already in use. Skipping $AppName." -ForegroundColor Yellow
        return
    }
    
    # Start the application
    try {
        Set-Location $AppPath
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting $AppName on port $Port...' -ForegroundColor Green; npm run dev"
        Write-Host "   ✅ $AppName started successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "   ❌ Failed to start $AppName: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Start all applications
Write-Host "`n📱 Starting Applications..." -ForegroundColor Cyan

# InstallSure (Production Ready)
Start-App -AppName "InstallSure" -AppPath "applications\installsure" -Port 3000 -Description "Construction Management Platform"

# Demo Dashboard (Demo Ready)
Start-App -AppName "Demo Dashboard" -AppPath "applications\demo-dashboard" -Port 3001 -Description "Central Control Panel"

# FF4U (Development Ready)
Start-App -AppName "FF4U" -AppPath "applications\ff4u" -Port 3002 -Description "Adult Entertainment Platform"

# RedEye (Development Ready)
Start-App -AppName "RedEye" -AppPath "applications\redeye" -Port 3003 -Description "Project Management System"

# ZeroStack (Development Ready)
Start-App -AppName "ZeroStack" -AppPath "applications\zerostack" -Port 3004 -Description "Infrastructure Management"

# Hello (Development Ready)
Start-App -AppName "Hello" -AppPath "applications\hello" -Port 3005 -Description "Digital Business Cards"

# Avatar (Development Ready)
Start-App -AppName "Avatar" -AppPath "applications\avatar" -Port 3006 -Description "AI Avatar Platform"

# Wait for applications to start
Write-Host "`n⏳ Waiting for applications to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check application status
Write-Host "`n🔍 Checking Application Status..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$apps = @(
    @{Name="InstallSure"; Port=3000; URL="http://localhost:3000"},
    @{Name="Demo Dashboard"; Port=3001; URL="http://localhost:3001"},
    @{Name="FF4U"; Port=3002; URL="http://localhost:3002"},
    @{Name="RedEye"; Port=3003; URL="http://localhost:3003"},
    @{Name="ZeroStack"; Port=3004; URL="http://localhost:3004"},
    @{Name="Hello"; Port=3005; URL="http://localhost:3005"},
    @{Name="Avatar"; Port=3006; URL="http://localhost:3006"}
)

foreach ($app in $apps) {
    try {
        $response = Invoke-WebRequest -Uri $app.URL -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($app.Name) - Running on port $($app.Port)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ $($app.Name) - Not responding on port $($app.Port)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Application startup complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📱 Applications are running in separate PowerShell windows." -ForegroundColor Yellow
Write-Host "🌐 You can access them at:" -ForegroundColor Yellow
Write-Host "   • InstallSure: http://localhost:3000" -ForegroundColor White
Write-Host "   • Demo Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host "   • FF4U: http://localhost:3002" -ForegroundColor White
Write-Host "   • RedEye: http://localhost:3003" -ForegroundColor White
Write-Host "   • ZeroStack: http://localhost:3004" -ForegroundColor White
Write-Host "   • Hello: http://localhost:3005" -ForegroundColor White
Write-Host "   • Avatar: http://localhost:3006" -ForegroundColor White
Write-Host "`n💡 To stop all applications, close the PowerShell windows or run 'stop-all.ps1'" -ForegroundColor Cyan
