# NexusLocalAI Bootstrap Script
# This script sets up and starts the NexusLocalAI environment

param(
    [switch]$SkipOllama,
    [switch]$SkipModels,
    [switch]$SkipDocker
)

# Set script root to parent directory of scripts folder
$root = "$PSScriptRoot\.."
$ErrorActionPreference = "Stop"

Write-Host "🚀 NexusLocalAI Bootstrap Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Root directory: $root" -ForegroundColor Gray

# Create necessary directories
Write-Host "`n📁 Creating directories..." -ForegroundColor Yellow
$dirs = @(
    "$root\memory\snapshots",
    "$root\logs",
    "$root\qdrant_storage"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Exists: $dir" -ForegroundColor Gray
    }
}

# Check for Python
Write-Host "`n🐍 Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Install Python dependencies
Write-Host "`n📦 Installing Python dependencies..." -ForegroundColor Yellow
$requirements = @(
    "fastapi",
    "uvicorn",
    "httpx",
    "pyyaml",
    "websockets",
    "pydantic"
)

foreach ($package in $requirements) {
    Write-Host "  Installing $package..." -ForegroundColor Gray
    pip install $package --quiet 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $package installed" -ForegroundColor Green
    }
}

# Check/Install Ollama
if (-not $SkipOllama) {
    Write-Host "`n🤖 Checking Ollama installation..." -ForegroundColor Yellow
    try {
        $ollamaVersion = ollama --version 2>&1
        Write-Host "  ✓ Ollama found: $ollamaVersion" -ForegroundColor Green
    } catch {
        Write-Host "  ℹ Ollama not found. Installing..." -ForegroundColor Yellow
        
        # Download and install Ollama for Windows
        $ollamaInstaller = "$env:TEMP\OllamaSetup.exe"
        Write-Host "  Downloading Ollama installer..." -ForegroundColor Gray
        Invoke-WebRequest -Uri "https://ollama.com/download/OllamaSetup.exe" -OutFile $ollamaInstaller
        
        Write-Host "  Running Ollama installer..." -ForegroundColor Gray
        Start-Process -FilePath $ollamaInstaller -Wait
        
        Write-Host "  ✓ Ollama installed" -ForegroundColor Green
        Remove-Item $ollamaInstaller -ErrorAction SilentlyContinue
    }
    
    # Start Ollama service
    Write-Host "  Starting Ollama service..." -ForegroundColor Gray
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Ollama service started" -ForegroundColor Green
}

# Pull AI models
if (-not $SkipModels) {
    Write-Host "`n🔽 Pulling AI models..." -ForegroundColor Yellow
    
    $models = @("qwen2.5-coder", "deepseek-coder", "qwen2.5")
    
    foreach ($model in $models) {
        Write-Host "  Pulling $model..." -ForegroundColor Gray
        ollama pull $model 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ $model ready" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Failed to pull $model (continuing anyway)" -ForegroundColor Yellow
        }
    }
}

# Start Docker services (if Docker is available)
if (-not $SkipDocker) {
    Write-Host "`n🐳 Checking Docker..." -ForegroundColor Yellow
    try {
        docker --version | Out-Null
        Write-Host "  ✓ Docker found" -ForegroundColor Green
        
        Write-Host "  Starting Qdrant..." -ForegroundColor Gray
        Set-Location $root
        docker-compose up -d qdrant 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Qdrant started on http://localhost:6333" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ℹ Docker not available (optional)" -ForegroundColor Gray
    }
}

# Start NexusLocalAI services
Write-Host "`n🌟 Starting NexusLocalAI services..." -ForegroundColor Yellow

# Start Router
Write-Host "  Starting Router..." -ForegroundColor Gray
$routerProcess = Start-Process python -ArgumentList "$root\router\main.py" -PassThru -WindowStyle Hidden
Write-Host "  ✓ Router started (PID: $($routerProcess.Id)) on http://localhost:8099" -ForegroundColor Green

# Start Memory Snapshot service
Write-Host "  Starting Memory service..." -ForegroundColor Gray
$memoryProcess = Start-Process python -ArgumentList "$root\memory\snapshot.py" -PassThru -WindowStyle Hidden
Write-Host "  ✓ Memory service started (PID: $($memoryProcess.Id))" -ForegroundColor Green

# Start Avatar Bridge
Write-Host "  Starting Avatar Bridge..." -ForegroundColor Gray
$avatarProcess = Start-Process python -ArgumentList "$root\avatar\bridge.py" -PassThru -WindowStyle Hidden
Write-Host "  ✓ Avatar Bridge started (PID: $($avatarProcess.Id)) on ws://localhost:8765" -ForegroundColor Green

# Summary
Write-Host "`n✨ NexusLocalAI is ready!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Router API:    http://localhost:8099" -ForegroundColor White
Write-Host "Avatar WS:     ws://localhost:8765" -ForegroundColor White
Write-Host "Qdrant:        http://localhost:6333" -ForegroundColor White
Write-Host "Memory Dir:    $root\memory\snapshots" -ForegroundColor White
Write-Host "`nProcess IDs:" -ForegroundColor Gray
Write-Host "  Router: $($routerProcess.Id)" -ForegroundColor Gray
Write-Host "  Memory: $($memoryProcess.Id)" -ForegroundColor Gray
Write-Host "  Avatar: $($avatarProcess.Id)" -ForegroundColor Gray
Write-Host "`nRun smoke-tests.ps1 to verify everything is working!" -ForegroundColor Yellow
