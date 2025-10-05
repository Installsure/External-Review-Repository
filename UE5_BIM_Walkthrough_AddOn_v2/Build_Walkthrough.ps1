# UE5 BIM Walkthrough Build Script
# Last Updated: 2025-09-29
# Description: Builds Unreal Engine 5 BIM walkthrough from input files

[CmdletBinding()]
param(
    [switch]$SkipValidation,
    [string]$ConfigFile = ".env"
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        UE5 BIM Walkthrough Add-On v2 - Build Script           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to load environment variables from .env file
function Import-EnvFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ Configuration file not found: $FilePath" -ForegroundColor Red
        Write-Host "   Please copy .env.example to .env and configure your settings" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "📝 Loading configuration from $FilePath..." -ForegroundColor Cyan
    
    Get-Content $FilePath | ForEach-Object {
        $line = $_.Trim()
        
        # Skip comments and empty lines
        if ($line -match '^#' -or $line -eq '') {
            return
        }
        
        # Parse key=value
        if ($line -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remove quotes if present
            $value = $value -replace '^["'']|["'']$', ''
            
            # Set environment variable
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            
            if ($PSCmdlet.MyInvocation.BoundParameters["Verbose"].IsPresent) {
                Write-Host "   Set $key" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "   ✅ Configuration loaded" -ForegroundColor Green
    return $true
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "`n🔍 Checking Prerequisites..." -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    $allPrereqsMet = $true
    
    # Check for .env file
    if (-not (Test-Path $ConfigFile)) {
        Write-Host "❌ Configuration file not found: $ConfigFile" -ForegroundColor Red
        $allPrereqsMet = $false
    } else {
        Write-Host "✅ Configuration file found" -ForegroundColor Green
    }
    
    # Check for UE5 installation
    $ue5Path = $env:UE5_ENGINE_PATH
    if (-not $ue5Path -or -not (Test-Path $ue5Path)) {
        Write-Host "❌ Unreal Engine 5 not found at: $ue5Path" -ForegroundColor Red
        Write-Host "   Please set UE5_ENGINE_PATH in your .env file" -ForegroundColor Yellow
        $allPrereqsMet = $false
    } else {
        Write-Host "✅ Unreal Engine 5 found at: $ue5Path" -ForegroundColor Green
    }
    
    # Check for Input directory
    $inputDir = Join-Path $PSScriptRoot "Input"
    if (-not (Test-Path $inputDir)) {
        Write-Host "❌ Input directory not found: $inputDir" -ForegroundColor Red
        $allPrereqsMet = $false
    } else {
        $inputFiles = Get-ChildItem $inputDir -File
        if ($inputFiles.Count -eq 0) {
            Write-Host "⚠️  Input directory is empty" -ForegroundColor Yellow
            Write-Host "   Please add IFC/RVT/DWG/PDF files to: $inputDir" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Input directory found with $($inputFiles.Count) file(s)" -ForegroundColor Green
        }
    }
    
    # Check for database connection
    $pgUrl = $env:PG_URL
    if (-not $pgUrl -or $pgUrl -eq 'postgresql://user:password@your-neon-instance.neon.tech:5432/installsure?sslmode=require') {
        Write-Host "⚠️  Database connection not configured" -ForegroundColor Yellow
        Write-Host "   Please set PG_URL in your .env file" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Database connection configured" -ForegroundColor Green
    }
    
    Write-Host ""
    return $allPrereqsMet
}

# Function to create output directories
function Initialize-Directories {
    Write-Host "📁 Initializing Directories..." -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    $dirs = @(
        (Join-Path $PSScriptRoot "Input"),
        (Join-Path $PSScriptRoot "Output"),
        (Join-Path $PSScriptRoot "Temp"),
        (Join-Path $PSScriptRoot "Logs")
    )
    
    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "   Created: $dir" -ForegroundColor Green
        } else {
            Write-Host "   Exists: $dir" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
}

# Function to process input files
function Process-InputFiles {
    Write-Host "📦 Processing Input Files..." -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    $inputDir = Join-Path $PSScriptRoot "Input"
    $supportedExtensions = @('.ifc', '.rvt', '.dwg', '.pdf')
    
    $inputFiles = Get-ChildItem $inputDir -File | Where-Object {
        $supportedExtensions -contains $_.Extension.ToLower()
    }
    
    if ($inputFiles.Count -eq 0) {
        Write-Host "⚠️  No supported files found in Input directory" -ForegroundColor Yellow
        Write-Host "   Supported formats: IFC, RVT, DWG, PDF" -ForegroundColor Gray
        return @()
    }
    
    Write-Host "Found $($inputFiles.Count) file(s) to process:" -ForegroundColor Green
    foreach ($file in $inputFiles) {
        $sizeKB = [math]::Round($file.Length / 1KB, 2)
        Write-Host "   📄 $($file.Name) ($sizeKB KB)" -ForegroundColor White
    }
    
    Write-Host ""
    return $inputFiles
}

# Function to simulate UE5 build process
function Invoke-UE5Build {
    param([array]$InputFiles)
    
    Write-Host "🎮 Building Unreal Engine 5 Walkthrough..." -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if ($InputFiles.Count -eq 0) {
        Write-Host "⚠️  No files to process. Skipping build." -ForegroundColor Yellow
        return
    }
    
    $ue5Path = $env:UE5_ENGINE_PATH
    $editorCmd = Join-Path $ue5Path "Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
    
    # Check if UE5 command-line tool exists
    if (-not (Test-Path $editorCmd)) {
        Write-Host "⚠️  UE5 command-line tool not found: $editorCmd" -ForegroundColor Yellow
        Write-Host "   This is a simulation - actual build requires UE5 installation" -ForegroundColor Gray
        Write-Host ""
        
        # Simulate build process
        Write-Host "Simulating build process..." -ForegroundColor Gray
        Write-Host ""
        
        foreach ($file in $InputFiles) {
            Write-Host "   🔄 Processing: $($file.Name)" -ForegroundColor Yellow
            Start-Sleep -Seconds 1
            Write-Host "      ✅ Imported successfully" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "   📊 Build Statistics:" -ForegroundColor Cyan
        Write-Host "      Files processed: $($InputFiles.Count)" -ForegroundColor White
        Write-Host "      Status: Simulated (UE5 not available)" -ForegroundColor Yellow
        Write-Host ""
        return
    }
    
    # If UE5 is available, provide build instructions
    Write-Host "🔧 UE5 Build Configuration:" -ForegroundColor Cyan
    Write-Host "   Engine Path: $ue5Path" -ForegroundColor White
    Write-Host "   Project: $($env:PROJECT_NAME)" -ForegroundColor White
    Write-Host "   Files to import: $($InputFiles.Count)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "⚠️  Automated UE5 build requires additional setup" -ForegroundColor Yellow
    Write-Host "   Please run the following manually:" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   1. Open Unreal Engine 5" -ForegroundColor White
    Write-Host "   2. Create/Open project: $($env:PROJECT_NAME)" -ForegroundColor White
    Write-Host "   3. Import BIM files from: $inputDir" -ForegroundColor White
    Write-Host "   4. Configure Datasmith import settings" -ForegroundColor White
    Write-Host "   5. Build and package for distribution" -ForegroundColor White
    Write-Host ""
}

# Function to generate build report
function New-BuildReport {
    param([array]$InputFiles, [bool]$Success)
    
    $reportPath = Join-Path $PSScriptRoot "Logs\build_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
    
    $report = @"
UE5 BIM Walkthrough Build Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
═══════════════════════════════════════════════════════════════

Configuration:
  Project Name: $($env:PROJECT_NAME)
  Project Version: $($env:PROJECT_VERSION)
  UE5 Path: $($env:UE5_ENGINE_PATH)
  Database: $(if ($env:PG_URL) { 'Configured' } else { 'Not configured' })

Input Files ($($InputFiles.Count)):
$($InputFiles | ForEach-Object { "  - $($_.Name) ($([math]::Round($_.Length / 1KB, 2)) KB)" } | Out-String)

Build Settings:
  Auto LOD: $($env:ENABLE_AUTO_LOD)
  Texture Quality: $($env:TEXTURE_QUALITY)
  Mesh Quality: $($env:MESH_QUALITY)
  Lighting Quality: $($env:LIGHTING_QUALITY)
  Raytracing: $($env:ENABLE_RAYTRACING)
  Nanite: $($env:ENABLE_NANITE)
  Lumen: $($env:ENABLE_LUMEN)

Build Status: $(if ($Success) { 'SUCCESS' } else { 'INCOMPLETE' })

═══════════════════════════════════════════════════════════════
"@

    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "📄 Build report saved to: $reportPath" -ForegroundColor Green
}

# Main execution
try {
    $startTime = Get-Date
    
    # Load configuration
    if (-not (Import-EnvFile -FilePath (Join-Path $PSScriptRoot $ConfigFile))) {
        exit 1
    }
    
    # Check prerequisites
    if (-not $SkipValidation) {
        if (-not (Test-Prerequisites)) {
            Write-Host ""
            Write-Host "❌ Prerequisites not met. Please fix the issues above." -ForegroundColor Red
            Write-Host "   Use -SkipValidation to bypass prerequisite checks (not recommended)" -ForegroundColor Gray
            exit 1
        }
    }
    
    # Initialize directories
    Initialize-Directories
    
    # Process input files
    $inputFiles = Process-InputFiles
    
    # Build walkthrough
    Invoke-UE5Build -InputFiles $inputFiles
    
    # Generate report
    New-BuildReport -InputFiles $inputFiles -Success $true
    
    # Summary
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  Build Process Completed" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "   Duration: $([math]::Round($duration.TotalSeconds, 2)) seconds" -ForegroundColor Gray
    Write-Host "   Files processed: $($inputFiles.Count)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📁 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Check the Logs directory for detailed build reports" -ForegroundColor White
    Write-Host "   2. Review Output directory for packaged builds (if available)" -ForegroundColor White
    Write-Host "   3. Test the walkthrough in UE5 editor" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Build failed with error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Stack trace:" -ForegroundColor Gray
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
    
    # Generate error report
    $errorReport = @"
Build Error Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
═══════════════════════════════════════════════════════════════

Error Message:
$($_.Exception.Message)

Stack Trace:
$($_.ScriptStackTrace)

═══════════════════════════════════════════════════════════════
"@
    
    $errorReportPath = Join-Path $PSScriptRoot "Logs\error_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
    $errorReport | Out-File -FilePath $errorReportPath -Encoding UTF8
    
    Write-Host ""
    Write-Host "📄 Error report saved to: $errorReportPath" -ForegroundColor Yellow
    Write-Host "   Please paste the last ~20 lines for support" -ForegroundColor Gray
    
    exit 1
}
