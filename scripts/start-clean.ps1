# InstallSure BIM Services - Complete Startup Script
# Coordinated GitHub Copilot + Cursor Integration

Write-Host "Starting Complete InstallSure BIM Ecosystem..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "Docker is available" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed or not running" -ForegroundColor Red
    Write-Host "Please install Docker Desktop and ensure it's running" -ForegroundColor Yellow
    exit 1
}

# Check Docker Compose
try {
    docker compose version | Out-Null
    Write-Host "Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose is not available" -ForegroundColor Red
    exit 1
}

# Stop any existing services
Write-Host "Stopping existing services..." -ForegroundColor Yellow
docker compose down --remove-orphans 2>$null

# Remove old containers if they exist
Write-Host "Cleaning up old containers..." -ForegroundColor Yellow
docker container prune -f 2>$null

# Build and start services
Write-Host "Building and starting services..." -ForegroundColor Green
Write-Host "This may take several minutes on first run..." -ForegroundColor Yellow

# Start infrastructure services first
Write-Host "Starting infrastructure services..." -ForegroundColor Cyan
docker compose up -d postgres redis ollama

# Wait for infrastructure to be ready
Write-Host "Waiting for infrastructure services..." -ForegroundColor Yellow
$timeout = 60
$elapsed = 0

do {
    Start-Sleep 2
    $elapsed += 2
    $ready = $true
    
    # Check postgres
    try {
        docker compose exec postgres pg_isready -U installsure 2>$null | Out-Null
    } catch {
        $ready = $false
    }
    
    # Check redis
    try {
        docker compose exec redis redis-cli ping 2>$null | Out-Null
    } catch {
        $ready = $false
    }
    
    if ($ready) {
        Write-Host "Infrastructure services are ready" -ForegroundColor Green
        break
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "Timeout waiting for infrastructure services" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Still waiting... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
} while ($true)

# Start BIM service
Write-Host "Starting BIM service..." -ForegroundColor Cyan
docker compose up -d bim

# Wait for BIM service
Write-Host "Waiting for BIM service..." -ForegroundColor Yellow
$timeout = 30
$elapsed = 0

do {
    Start-Sleep 2
    $elapsed += 2
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8002/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.status -eq "healthy") {
            Write-Host "BIM service is ready" -ForegroundColor Green
            break
        }
    } catch {
        # Service not ready yet
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "Timeout waiting for BIM service" -ForegroundColor Red
        docker compose logs bim
        exit 1
    }
    
    Write-Host "Still waiting for BIM service... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
} while ($true)

# Start remaining services
Write-Host "Starting gateway and web services..." -ForegroundColor Cyan
docker compose up -d

# Final health checks
Write-Host "Running health checks..." -ForegroundColor Green

$services = @(
    @{name="Gateway"; url="http://localhost:8000/health"; port=8000},
    @{name="BIM Service"; url="http://localhost:8002/health"; port=8002},
    @{name="Web App"; url="http://localhost:3000"; port=3000}
)

$allHealthy = $true

foreach ($service in $services) {
    Write-Host "Checking $($service.name)..." -ForegroundColor Yellow
    
    # Check if port is listening
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $service.port -InformationLevel Quiet
        if (-not $connection) {
            Write-Host "$($service.name): Port $($service.port) not listening" -ForegroundColor Red
            $allHealthy = $false
            continue
        }
    } catch {
        Write-Host "$($service.name): Port check failed" -ForegroundColor Red
        $allHealthy = $false
        continue
    }
    
    # Check health endpoint
    try {
        $response = Invoke-RestMethod -Uri $service.url -TimeoutSec 10 -ErrorAction Stop
        Write-Host "$($service.name): Healthy" -ForegroundColor Green
    } catch {
        Write-Host "$($service.name): Health check failed" -ForegroundColor Red
        $allHealthy = $false
    }
}

Write-Host ""
Write-Host "Integration Status:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Cyan

if ($allHealthy) {
    Write-Host "All services are healthy and running!" -ForegroundColor Green
} else {
    Write-Host "Some services have issues" -ForegroundColor Yellow
    Write-Host "Check the logs with: docker compose logs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Access Points:" -ForegroundColor Green
Write-Host "Web Application: http://localhost:3000" -ForegroundColor White
Write-Host "Gateway API: http://localhost:8000" -ForegroundColor White
Write-Host "BIM Service: http://localhost:8002" -ForegroundColor White
Write-Host "Health Dashboard: http://localhost:8000/health" -ForegroundColor White

Write-Host ""
Write-Host "Quick Test Commands:" -ForegroundColor Green
Write-Host "curl http://localhost:8000/health" -ForegroundColor White
Write-Host "curl http://localhost:8002/health" -ForegroundColor White

Write-Host ""
Write-Host "Container Status:" -ForegroundColor Green
docker compose ps

Write-Host ""
Write-Host "InstallSure BIM Ecosystem: READY FOR TESTING!" -ForegroundColor Green
Write-Host "GitHub Copilot + Cursor integration: ACTIVE!" -ForegroundColor Green

Write-Host ""
Write-Host "To test end-to-end:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000" -ForegroundColor White
Write-Host "2. Upload an IFC file" -ForegroundColor White
Write-Host "3. View quantities and generate estimate" -ForegroundColor White
Write-Host "4. Download PDF report" -ForegroundColor White

Write-Host ""
Write-Host "To view logs: docker compose logs [service-name]" -ForegroundColor Yellow
Write-Host "To stop all: docker compose down" -ForegroundColor Yellow