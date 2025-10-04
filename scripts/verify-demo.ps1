# Quick Demo Verification Script
# Verifies all applications are running and accessible
# External Review Repository

Write-Host "🎬 E2E Demo Verification Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Application endpoints
$apps = @{
    "Demo Dashboard" = "http://localhost:3001"
    "InstallSure" = "http://localhost:3000"
    "FF4U" = "http://localhost:3002"
    "RedEye" = "http://localhost:3003"
    "ZeroStack" = "http://localhost:3004"
    "Hello" = "http://localhost:3005"
    "Avatar" = "http://localhost:3006"
}

Write-Host "🔍 Checking Application Health..." -ForegroundColor Blue
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($appName in $apps.Keys) {
    $url = $apps[$appName]
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ $appName" -ForegroundColor Green -NoNewline
        Write-Host " - Running at $url"
        $successCount++
    }
    catch {
        Write-Host "❌ $appName" -ForegroundColor Red -NoNewline
        Write-Host " - Not responding at $url"
        $failCount++
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 Summary:" -ForegroundColor Blue
Write-Host "   ✅ Success: $successCount/7" -ForegroundColor Green
Write-Host "   ❌ Failed: $failCount/7" -ForegroundColor Red
Write-Host ""

if ($successCount -eq 7) {
    Write-Host "🎉 All applications are running successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 You can now start the demo:" -ForegroundColor Blue
    Write-Host "   1. Open http://localhost:3001 (Demo Dashboard)"
    Write-Host "   2. Follow the E2E_DEMO_GUIDE.md for the full walkthrough"
    Write-Host ""
    Write-Host "📚 Demo Credentials:" -ForegroundColor Yellow
    Write-Host "   Email: demo@[app-name].com (e.g., demo@installsure.com)"
    Write-Host "   Password: demo123"
    Write-Host ""
    exit 0
}
elseif ($successCount -gt 0) {
    Write-Host "⚠️  Some applications are not running." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start all applications, run:"
    Write-Host "   .\scripts\start-all.ps1  (Windows)"
    Write-Host "   ./scripts/start-all.sh   (Linux/macOS)"
    Write-Host ""
    exit 1
}
else {
    Write-Host "❌ No applications are running." -ForegroundColor Red
    Write-Host ""
    Write-Host "To start all applications, run:"
    Write-Host "   .\scripts\start-all.ps1  (Windows)"
    Write-Host "   ./scripts/start-all.sh   (Linux/macOS)"
    Write-Host ""
    Write-Host "Make sure you have installed dependencies first:"
    Write-Host "   cd applications\demo-dashboard; npm install"
    Write-Host "   cd applications\installsure; npm install"
    Write-Host "   # ... repeat for all applications"
    Write-Host ""
    exit 1
}
