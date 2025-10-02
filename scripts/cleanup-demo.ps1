# Cleanup script for InstallSure demo pipeline

Write-Host "Stopping InstallSure demo servers..." -ForegroundColor Yellow

# Stop servers using saved job IDs
$jobFile = "$env:TEMP\installsure-jobs.json"
if (Test-Path $jobFile) {
    try {
        $jobs = Get-Content $jobFile | ConvertFrom-Json
        
        if ($jobs.BackendJobId) {
            $backendJob = Get-Job -Id $jobs.BackendJobId -ErrorAction SilentlyContinue
            if ($backendJob) {
                Stop-Job -Id $jobs.BackendJobId
                Remove-Job -Id $jobs.BackendJobId
                Write-Host "✓ Backend server stopped (Job ID: $($jobs.BackendJobId))" -ForegroundColor Green
            } else {
                Write-Host "⚠ Backend server already stopped" -ForegroundColor Yellow
            }
        }
        
        if ($jobs.FrontendJobId) {
            $frontendJob = Get-Job -Id $jobs.FrontendJobId -ErrorAction SilentlyContinue
            if ($frontendJob) {
                Stop-Job -Id $jobs.FrontendJobId
                Remove-Job -Id $jobs.FrontendJobId
                Write-Host "✓ Frontend server stopped (Job ID: $($jobs.FrontendJobId))" -ForegroundColor Green
            } else {
                Write-Host "⚠ Frontend server already stopped" -ForegroundColor Yellow
            }
        }
        
        Remove-Item $jobFile
        Write-Host "✓ Job file cleaned up" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Error reading job file: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ No saved job information found" -ForegroundColor Yellow
}

Write-Host "✓ Cleanup complete" -ForegroundColor Green
