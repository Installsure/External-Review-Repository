# Stop All Applications Script
# External Review Repository
# Last Updated: 2025-09-29

Write-Host "🛑 Stopping All Applications..." -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Cyan

# Function to stop processes on specific ports
function Stop-App {
    param(
        [string]$AppName,
        [int]$Port
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
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Process stopped" -ForegroundColor Green
            }
        } else {
            Write-Host "   ℹ️  No processes found on port $Port" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "   ❌ Error stopping $AppName: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Stop all applications
Write-Host "`n📱 Stopping Applications..." -ForegroundColor Cyan

# Stop applications by port
$ports = @(3000, 3001, 3002, 3003, 3004, 3005, 3006)
$appNames = @("InstallSure", "Demo Dashboard", "FF4U", "RedEye", "ZeroStack", "Hello", "Avatar")

for ($i = 0; $i -lt $ports.Count; $i++) {
    Stop-App -AppName $appNames[$i] -Port $ports[$i]
}

# Additional cleanup - stop any remaining Node.js processes
Write-Host "`n🧹 Cleaning up remaining Node.js processes..." -ForegroundColor Yellow

try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($process in $nodeProcesses) {
            Write-Host "   🎯 Found Node.js process: PID $($process.Id)" -ForegroundColor Gray
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            Write-Host "   ✅ Node.js process stopped" -ForegroundColor Green
        }
    } else {
        Write-Host "   ℹ️  No Node.js processes found" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ Error cleaning up Node.js processes: $($_.Exception.Message)" -ForegroundColor Red
}

# Wait a moment for processes to fully stop
Start-Sleep -Seconds 2

# Verify all ports are free
Write-Host "`n🔍 Verifying all ports are free..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$allPortsFree = $true
foreach ($port in $ports) {
    $portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "❌ Port $port is still in use" -ForegroundColor Red
        $allPortsFree = $false
    } else {
        Write-Host "✅ Port $port is free" -ForegroundColor Green
    }
}

if ($allPortsFree) {
    Write-Host "`n🎉 All applications stopped successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "✅ All ports are now free" -ForegroundColor Green
    Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
    Write-Host "`n💡 You can now start applications again with 'start-all.ps1'" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Some applications may still be running" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "❌ Some ports are still in use" -ForegroundColor Red
    Write-Host "💡 You may need to manually stop remaining processes" -ForegroundColor Yellow
    Write-Host "💡 Or restart your computer to free all ports" -ForegroundColor Yellow
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "   • InstallSure (port 3000)" -ForegroundColor White
Write-Host "   • Demo Dashboard (port 3001)" -ForegroundColor White
Write-Host "   • FF4U (port 3002)" -ForegroundColor White
Write-Host "   • RedEye (port 3003)" -ForegroundColor White
Write-Host "   • ZeroStack (port 3004)" -ForegroundColor White
Write-Host "   • Hello (port 3005)" -ForegroundColor White
Write-Host "   • Avatar (port 3006)" -ForegroundColor White
