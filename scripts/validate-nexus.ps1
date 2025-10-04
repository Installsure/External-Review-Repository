# Nexus Bootstrap Validation Script
# Tests the bootstrap script structure without executing it

Write-Host "🧪 Validating Nexus Bootstrap Script..." -ForegroundColor Cyan

$errors = @()

# Test 1: Script exists
if (Test-Path "scripts/bootstrap-nexus.ps1") {
    Write-Host "✅ Script file exists" -ForegroundColor Green
} else {
    $errors += "Script file not found"
    Write-Host "❌ Script file not found" -ForegroundColor Red
}

# Test 2: Script is readable
try {
    $script = Get-Content "scripts/bootstrap-nexus.ps1" -Raw
    Write-Host "✅ Script is readable" -ForegroundColor Green
} catch {
    $errors += "Cannot read script file"
    Write-Host "❌ Cannot read script file" -ForegroundColor Red
}

# Test 3: Script contains required sections
$requiredSections = @(
    "OLLAMA INSTALL/START",
    "PROJECT LAYOUT",
    "SYSTEM PROMPT",
    "PYTHON REQUIREMENTS",
    "SAMPLE LIBRARY MANIFEST",
    "FASTAPI SERVER",
    "INSTALL & RUN SERVER",
    "ONE-COMMAND DEMO RUN"
)

foreach ($section in $requiredSections) {
    if ($script -match $section) {
        Write-Host "✅ Contains section: $section" -ForegroundColor Green
    } else {
        $errors += "Missing section: $section"
        Write-Host "❌ Missing section: $section" -ForegroundColor Red
    }
}

# Test 4: Script contains required functions
$requiredFunctions = @(
    "function Have",
    "function Mk",
    "function W"
)

foreach ($func in $requiredFunctions) {
    if ($script -match [regex]::Escape($func)) {
        Write-Host "✅ Contains function: $func" -ForegroundColor Green
    } else {
        $errors += "Missing function: $func"
        Write-Host "❌ Missing function: $func" -ForegroundColor Red
    }
}

# Test 5: Documentation exists
$docFiles = @(
    "documentation/NEXUS_AI_GUIDE.md",
    "documentation/NEXUS_QUICK_REFERENCE.md"
)

foreach ($doc in $docFiles) {
    if (Test-Path $doc) {
        Write-Host "✅ Documentation exists: $doc" -ForegroundColor Green
    } else {
        $errors += "Missing documentation: $doc"
        Write-Host "❌ Missing documentation: $doc" -ForegroundColor Red
    }
}

# Test 6: .gitignore updated
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "nexus/") {
        Write-Host "✅ .gitignore includes nexus/" -ForegroundColor Green
    } else {
        $errors += ".gitignore missing nexus/ entry"
        Write-Host "❌ .gitignore missing nexus/ entry" -ForegroundColor Red
    }
} else {
    $errors += ".gitignore not found"
    Write-Host "❌ .gitignore not found" -ForegroundColor Red
}

# Test 7: README updated
if (Test-Path "README.md") {
    $readme = Get-Content "README.md" -Raw
    if ($readme -match "bootstrap-nexus\.ps1") {
        Write-Host "✅ README mentions bootstrap script" -ForegroundColor Green
    } else {
        $errors += "README missing bootstrap script reference"
        Write-Host "❌ README missing bootstrap script reference" -ForegroundColor Red
    }
    
    if ($readme -match "NEXUS AI SYSTEM") {
        Write-Host "✅ README includes Nexus AI section" -ForegroundColor Green
    } else {
        $errors += "README missing Nexus AI section"
        Write-Host "❌ README missing Nexus AI section" -ForegroundColor Red
    }
} else {
    $errors += "README.md not found"
    Write-Host "❌ README.md not found" -ForegroundColor Red
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "✅ ALL VALIDATIONS PASSED!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ VALIDATION FAILED" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "`nErrors found:" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    exit 1
}
