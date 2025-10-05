# Nexus Setup Script
# External Review Repository - Master Setup
# Last Updated: 2025-09-29
# Description: One-command setup for InstallSure complete ecosystem

[CmdletBinding()]
param(
    [switch]$SkipVSCode,
    [switch]$SkipDemo,
    [switch]$SkipUE5
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   NEXUS SETUP - INSTALLSURE                    ║" -ForegroundColor Cyan
Write-Host "║                  Complete Ecosystem Setup                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to display section header
function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "  $Title" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Section "Checking Prerequisites"
    
    $allPrereqsMet = $true
    
    # Check Python
    Write-Host "📦 Checking Python..." -ForegroundColor Cyan
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $pythonVersion = python --version 2>&1
        Write-Host "   ✅ $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Python not found. Please install Python 3.10+" -ForegroundColor Red
        $allPrereqsMet = $false
    }
    
    # Check Node.js
    Write-Host "📦 Checking Node.js..." -ForegroundColor Cyan
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        Write-Host "   ✅ Node.js $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Node.js not found (optional for demo viewer)" -ForegroundColor Yellow
    }
    
    # Check VS Code (optional)
    Write-Host "📦 Checking VS Code..." -ForegroundColor Cyan
    if (Get-Command code -ErrorAction SilentlyContinue) {
        Write-Host "   ✅ VS Code installed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  VS Code not found (optional)" -ForegroundColor Yellow
    }
    
    return $allPrereqsMet
}

# Main setup flow
try {
    $startTime = Get-Date
    
    Write-Host "🚀 Starting Nexus Setup..." -ForegroundColor Green
    Write-Host "   Installation Path: $PSScriptRoot" -ForegroundColor Gray
    Write-Host ""
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        Write-Host ""
        Write-Host "❌ Prerequisites not met. Please install required software." -ForegroundColor Red
        exit 1
    }
    
    # Step 1: VS Code Extensions Pack
    if (-not $SkipVSCode) {
        Write-Section "Step 1: InstallSure VS Code Extensions"
        
        $installAllPath = Join-Path $PSScriptRoot "InstallSure_AllInOne_Pack\Install_All.ps1"
        
        if (Test-Path $installAllPath) {
            Write-Host "📦 Installing VS Code extensions..." -ForegroundColor Cyan
            try {
                & $installAllPath
                Write-Host "   ✅ VS Code extensions installed successfully" -ForegroundColor Green
            } catch {
                Write-Host "   ⚠️  VS Code extensions installation skipped or failed" -ForegroundColor Yellow
                Write-Host "   Error: $_" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ⚠️  Install_All.ps1 not found. Skipping VS Code setup." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️  Skipping VS Code extensions (--SkipVSCode specified)" -ForegroundColor Gray
    }
    
    # Step 2: Demo/Estimator/Neon Setup
    if (-not $SkipDemo) {
        Write-Section "Step 2: Demo & Estimator Setup"
        
        $demoPath = Join-Path $PSScriptRoot "InstallSure_Demo_Extended"
        
        if (Test-Path $demoPath) {
            Write-Host "📊 Setting up Demo components..." -ForegroundColor Cyan
            
            # Check viewer
            $viewerPath = Join-Path $demoPath "viewer\index.html"
            if (Test-Path $viewerPath) {
                Write-Host "   ✅ Viewer found: $viewerPath" -ForegroundColor Green
                Write-Host "      Open with VS Code Live Server to view" -ForegroundColor Gray
            } else {
                Write-Host "   ⚠️  Viewer not found" -ForegroundColor Yellow
            }
            
            # Check estimator
            $estimatorPath = Join-Path $demoPath "estimator\estimator.py"
            if (Test-Path $estimatorPath) {
                Write-Host "   ✅ Estimator found: $estimatorPath" -ForegroundColor Green
                Write-Host "      Run: cd InstallSure_Demo_Extended\estimator" -ForegroundColor Gray
                Write-Host "           python estimator.py ..\viewer\tags_export.csv > estimate_out.csv" -ForegroundColor Gray
            } else {
                Write-Host "   ⚠️  Estimator not found" -ForegroundColor Yellow
            }
            
            # Check Neon schema
            $schemaPath = Join-Path $demoPath "neon\schema.sql"
            if (Test-Path $schemaPath) {
                Write-Host "   ✅ Neon schema found: $schemaPath" -ForegroundColor Green
                Write-Host "      Apply schema in Neon console or psql" -ForegroundColor Gray
            } else {
                Write-Host "   ⚠️  Neon schema not found" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ⚠️  InstallSure_Demo_Extended not found. Skipping demo setup." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️  Skipping Demo setup (--SkipDemo specified)" -ForegroundColor Gray
    }
    
    # Step 3: UE5 BIM Walkthrough Setup
    if (-not $SkipUE5) {
        Write-Section "Step 3: UE5 BIM Walkthrough Setup"
        
        $ue5Path = Join-Path $PSScriptRoot "UE5_BIM_Walkthrough_AddOn_v2"
        
        if (Test-Path $ue5Path) {
            Write-Host "🎮 Setting up UE5 BIM Walkthrough..." -ForegroundColor Cyan
            
            # Check .env.example
            $envExamplePath = Join-Path $ue5Path ".env.example"
            $envPath = Join-Path $ue5Path ".env"
            
            if (Test-Path $envExamplePath) {
                if (-not (Test-Path $envPath)) {
                    Write-Host "   📝 Creating .env file from template..." -ForegroundColor Cyan
                    Copy-Item $envExamplePath $envPath -Force
                    Write-Host "   ✅ .env file created" -ForegroundColor Green
                    Write-Host "      Edit .env and set your PG_URL connection string" -ForegroundColor Gray
                } else {
                    Write-Host "   ✅ .env file already exists" -ForegroundColor Green
                }
            } else {
                Write-Host "   ⚠️  .env.example not found" -ForegroundColor Yellow
            }
            
            # Check Input directory
            $inputPath = Join-Path $ue5Path "Input"
            if (Test-Path $inputPath) {
                Write-Host "   ✅ Input directory ready" -ForegroundColor Green
                Write-Host "      Drop IFC/RVT/DWG/PDF files here" -ForegroundColor Gray
            } else {
                Write-Host "   📁 Creating Input directory..." -ForegroundColor Cyan
                New-Item -ItemType Directory -Path $inputPath -Force | Out-Null
                Write-Host "   ✅ Input directory created" -ForegroundColor Green
            }
            
            # Check Build script
            $buildPath = Join-Path $ue5Path "Build_Walkthrough.ps1"
            if (Test-Path $buildPath) {
                Write-Host "   ✅ Build script found: $buildPath" -ForegroundColor Green
                Write-Host "      Run: .\UE5_BIM_Walkthrough_AddOn_v2\Build_Walkthrough.ps1 -Verbose" -ForegroundColor Gray
            } else {
                Write-Host "   ⚠️  Build_Walkthrough.ps1 not found" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ⚠️  UE5_BIM_Walkthrough_AddOn_v2 not found. Skipping UE5 setup." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️  Skipping UE5 setup (--SkipUE5 specified)" -ForegroundColor Gray
    }
    
    # Summary
    Write-Section "Setup Complete"
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host "✅ Nexus Setup completed successfully!" -ForegroundColor Green
    Write-Host "   Duration: $($duration.TotalSeconds) seconds" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📚 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Open viewer: .\InstallSure_Demo_Extended\viewer\index.html (use VS Code Live Server)" -ForegroundColor White
    Write-Host "   2. Export tags from viewer and run estimator:" -ForegroundColor White
    Write-Host "      cd .\InstallSure_Demo_Extended\estimator" -ForegroundColor Gray
    Write-Host "      python estimator.py ..\viewer\tags_export.csv > estimate_out.csv" -ForegroundColor Gray
    Write-Host "   3. Apply DB schema in Neon console:" -ForegroundColor White
    Write-Host "      .\InstallSure_Demo_Extended\neon\schema.sql" -ForegroundColor Gray
    Write-Host "   4. Configure UE5 walkthrough:" -ForegroundColor White
    Write-Host "      Edit .\UE5_BIM_Walkthrough_AddOn_v2\.env with your PG_URL" -ForegroundColor Gray
    Write-Host "      Drop files into .\UE5_BIM_Walkthrough_AddOn_v2\Input\" -ForegroundColor Gray
    Write-Host "      Run .\UE5_BIM_Walkthrough_AddOn_v2\Build_Walkthrough.ps1 -Verbose" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 For issues, paste the last ~20 lines of error output for support." -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Setup failed with error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Stack trace:" -ForegroundColor Gray
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
    exit 1
}
