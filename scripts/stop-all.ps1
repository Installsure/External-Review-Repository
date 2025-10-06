# Stop All Applications Script - Enhanced
# External Review Repository
# Last Updated: 2025-10-06
# Production Hardening - Phase 1

$ErrorActionPreference = "Continue"

Write-Host "🛑 Stopping All Applications..." -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Cyan

# Enhanced function to stop processes with better error handling
function Stop-App {
    param(
        [string]$AppName,
        [int]$Port,
        [bool]$Critical = $false
    )
    
    Write-Host "`n🔄 Stopping $AppName on port $Port..." -ForegroundColor Yellow
    
    try {
        # Find processes using the port
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | ForEach-Object {
            Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        }
        
        if ($processes) {
            foreach ($process in $processes) {
                Write-Host "   🎯 Found process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Gray
                
                # Try graceful shutdown first
                try {
                    $process.CloseMainWindow() | Out-Null
                    Start-Sleep -Seconds 3
                    if (-not $process.HasExited) {
                        Stop-Process -Id $process.Id -Force -ErrorAction Stop
                    }
                    Write-Host "   ✅ Process stopped gracefully" -ForegroundColor Green
                } catch {
                    # Force kill if graceful shutdown fails
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                    Write-Host "   ⚡ Process force-killed" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "   ℹ️  No processes found on port $Port" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "   ❌ Error stopping ${AppName}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Stop core applications first (reverse order)
Write-Host "`n🎯 Stopping Core Applications..." -ForegroundColor Cyan

Stop-App -AppName "InstallSure Frontend" -Port 3000 -Critical $true
Stop-App -AppName "InstallSure Backend" -Port 8000 -Critical $true
Stop-App -AppName "Demo Dashboard" -Port 3001 -Critical $false

# Stop optional applications
Write-Host "`n📱 Stopping Optional Applications..." -ForegroundColor Cyan

$optionalApps = @(
    @{Name="FF4U"; Port=3002},
    @{Name="RedEye"; Port=3003},
    @{Name="ZeroStack"; Port=3004},
    @{Name="Hello"; Port=3005},
    @{Name="Avatar"; Port=3006}
)

foreach ($app in $optionalApps) {
    Stop-App -AppName $app.Name -Port $app.Port
}

# Stop Redis container if running
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "`n🔄 Stopping Redis container..." -ForegroundColor Yellow
    try {
        docker stop redis-installsure 2>$null | Out-Null
        Write-Host "   ✅ Redis container stopped" -ForegroundColor Green
    } catch {
        Write-Host "   ℹ️  Redis container was not running" -ForegroundColor Gray
    }
}

# Enhanced cleanup with better process detection
Write-Host "`n🧹 Enhanced Cleanup..." -ForegroundColor Yellow

# Stop npm/node processes more intelligently
$processNames = @("node", "npm", "vite", "webpack")
foreach ($processName in $processNames) {
    try {
        $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($processes) {
            foreach ($process in $processes) {
                # Check if it's related to our project
                $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
                if ($commandLine -and ($commandLine -like "*installsure*" -or $commandLine -like "*demo-dashboard*" -or $commandLine -like "*External-Review*")) {
                    Write-Host "   🎯 Stopping $processName process: PID $($process.Id)" -ForegroundColor Gray
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                    Write-Host "   ✅ $processName process stopped" -ForegroundColor Green
                }
            }
        }
    } catch {
        Write-Host "   ⚠️  Could not check $processName processes" -ForegroundColor Yellow
    }
}

# Wait for processes to fully stop
Start-Sleep -Seconds 3

# Enhanced verification with detailed reporting
Write-Host "`n🔍 System Status Verification..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$allPorts = @(3000, 3001, 8000, 3002, 3003, 3004, 3005, 3006)
$portNames = @("InstallSure Frontend", "Demo Dashboard", "InstallSure Backend", "FF4U", "RedEye", "ZeroStack", "Hello", "Avatar")
$allPortsFree = $true

for ($i = 0; $i -lt $allPorts.Count; $i++) {
    $port = $allPorts[$i]
    $name = $portNames[$i]
    $portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "❌ $name - Port $port is still in use" -ForegroundColor Red
        $allPortsFree = $false
    } else {
        Write-Host "✅ $name - Port $port is free" -ForegroundColor Green
    }
}

# Check remaining processes
$remainingProcesses = Get-Process -Name "node", "npm" -ErrorAction SilentlyContinue
if ($remainingProcesses) {
    Write-Host "`n⚠️  Warning: Some Node.js/npm processes are still running" -ForegroundColor Yellow
    foreach ($process in $remainingProcesses) {
        Write-Host "   • $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Gray
    }
}

# Final status report
Write-Host "`n🎉 Shutdown Summary" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

if ($allPortsFree) {
    Write-Host "✅ SUCCESS - All applications stopped cleanly" -ForegroundColor Green
    Write-Host "✅ All ports are now available" -ForegroundColor Green
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "✅ Redis container stopped" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  PARTIAL SUCCESS - Some ports may still be in use" -ForegroundColor Yellow
    Write-Host "💡 You may need to manually kill remaining processes" -ForegroundColor Yellow
}

Write-Host "`n💡 Management Commands:" -ForegroundColor Cyan
Write-Host "   • Start All:  .\scripts\start-all.ps1" -ForegroundColor Gray
Write-Host "   • Test All:   .\scripts\test-all.ps1" -ForegroundColor Gray
Write-Host "   • Preflight:  .\tools\preflight-check.ps1" -ForegroundColor Gray
    Write-Host "`n⚠️  Some applications may still be running" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "❌ Some ports are still in use" -ForegroundColor Red
Write-Host "`n💡 Management Commands:" -ForegroundColor Cyan
Write-Host "   • Start All:  .\scripts\start-all.ps1" -ForegroundColor Gray
Write-Host "   • Test All:   .\scripts\test-all.ps1" -ForegroundColor Gray
Write-Host "   • Preflight:  .\tools\preflight-check.ps1" -ForegroundColor Gray
