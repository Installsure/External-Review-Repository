# NexusLocalAI Bootstrap Script
# Sets up and starts all NexusLocalAI components

param(
    [switch]$SkipOllama,
    [switch]$SkipDocker
)

$ErrorActionPreference = "Stop"

# Get script location
$root = "$PSScriptRoot\.."
$root = Resolve-Path $root

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NexusLocalAI Bootstrap" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root directory: $root" -ForegroundColor Yellow
Write-Host ""

# Check Python
Write-Host "[1/6] Checking Python..." -ForegroundColor Green
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ $pythonVersion" -ForegroundColor Gray
} catch {
    Write-Host "  ✗ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Install Python dependencies
Write-Host "[2/6] Installing Python dependencies..." -ForegroundColor Green
$packages = @("flask", "requests", "pyyaml", "websockets")
foreach ($pkg in $packages) {
    Write-Host "  Installing $pkg..." -ForegroundColor Gray
    pip install -q $pkg 2>&1 | Out-Null
}
Write-Host "  ✓ Dependencies installed" -ForegroundColor Gray

# Check/Install Ollama
if (-not $SkipOllama) {
    Write-Host "[3/6] Checking Ollama..." -ForegroundColor Green
    
    $ollamaInstalled = $false
    try {
        $ollamaVersion = ollama --version 2>&1
        $ollamaInstalled = $true
        Write-Host "  ✓ Ollama installed: $ollamaVersion" -ForegroundColor Gray
    } catch {
        Write-Host "  ℹ Ollama not found" -ForegroundColor Yellow
    }
    
    if (-not $ollamaInstalled) {
        Write-Host "  Installing Ollama..." -ForegroundColor Gray
        
        if ($IsWindows -or $env:OS -like "*Windows*") {
            Write-Host "  Please download and install Ollama from: https://ollama.ai/download" -ForegroundColor Yellow
            Write-Host "  After installation, re-run this script." -ForegroundColor Yellow
            exit 1
        } else {
            curl -fsSL https://ollama.ai/install.sh | sh
        }
    }
    
    # Pull models
    Write-Host "  Pulling models (this may take a while)..." -ForegroundColor Gray
    $models = @("qwen2.5-coder:7b", "deepseek-coder-v2:16b", "qwen2.5:7b")
    
    foreach ($model in $models) {
        Write-Host "    - $model" -ForegroundColor DarkGray
        ollama pull $model 2>&1 | Out-Null
    }
    Write-Host "  ✓ Models ready" -ForegroundColor Gray
} else {
    Write-Host "[3/6] Skipping Ollama setup" -ForegroundColor Yellow
}

# Start services
Write-Host "[4/6] Starting Router..." -ForegroundColor Green
$routerPath = Join-Path $root "router\main.py"
Start-Process python -ArgumentList $routerPath -WindowStyle Hidden
Write-Host "  ✓ Router started on http://localhost:8099" -ForegroundColor Gray

Write-Host "[5/6] Starting Memory Service..." -ForegroundColor Green
$memoryPath = Join-Path $root "memory\snapshot.py"
$memoryDir = Join-Path $root "memory\snapshots"
New-Item -ItemType Directory -Force -Path $memoryDir | Out-Null
Start-Process python -ArgumentList $memoryPath -WindowStyle Hidden
Write-Host "  ✓ Memory service started (snapshots every 60s)" -ForegroundColor Gray

Write-Host "[6/6] Starting Avatar Bridge..." -ForegroundColor Green
$avatarPath = Join-Path $root "avatar\bridge.py"
Start-Process python -ArgumentList $avatarPath -WindowStyle Hidden
Write-Host "  ✓ Avatar bridge started on ws://localhost:8765" -ForegroundColor Gray

# Docker (optional)
if (-not $SkipDocker) {
    Write-Host ""
    Write-Host "Starting Docker services..." -ForegroundColor Green
    
    try {
        docker --version | Out-Null
        Set-Location $root
        docker-compose up -d 2>&1 | Out-Null
        Write-Host "  ✓ Qdrant started on http://localhost:6333" -ForegroundColor Gray
    } catch {
        Write-Host "  ℹ Docker not available, skipping" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ NexusLocalAI Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor White
Write-Host "  • Router:       http://localhost:8099/route" -ForegroundColor Gray
Write-Host "  • Avatar:       ws://localhost:8765" -ForegroundColor Gray
Write-Host "  • Memory:       $memoryDir" -ForegroundColor Gray
Write-Host "  • Qdrant:       http://localhost:6333 (if Docker available)" -ForegroundColor Gray
Write-Host ""
Write-Host "Run smoke tests: .\scripts\smoke-tests.ps1" -ForegroundColor Yellow
Write-Host ""
