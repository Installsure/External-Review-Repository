# InstallSure All-In-One Pack - VS Code Extensions Installer
# Last Updated: 2025-09-29
# Description: Installs essential VS Code extensions for InstallSure development

[CmdletBinding()]
param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         InstallSure All-In-One Pack - VS Code Setup           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if VS Code is installed
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Host "❌ VS Code is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install VS Code from: https://code.visualstudio.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ VS Code found" -ForegroundColor Green
$vscodeVersion = code --version | Select-Object -First 1
Write-Host "   Version: $vscodeVersion" -ForegroundColor Gray
Write-Host ""

# Essential extensions for InstallSure development
$extensions = @(
    # Core Development
    @{Id="ms-python.python"; Name="Python"; Description="Python language support"},
    @{Id="ms-python.vscode-pylance"; Name="Pylance"; Description="Python language server"},
    @{Id="ms-vscode.vscode-typescript-next"; Name="TypeScript"; Description="TypeScript support"},
    
    # Frontend Development
    @{Id="dbaeumer.vscode-eslint"; Name="ESLint"; Description="JavaScript/TypeScript linting"},
    @{Id="esbenp.prettier-vscode"; Name="Prettier"; Description="Code formatter"},
    @{Id="bradlc.vscode-tailwindcss"; Name="Tailwind CSS"; Description="Tailwind CSS IntelliSense"},
    
    # Web Development
    @{Id="ritwickdey.LiveServer"; Name="Live Server"; Description="Live preview for web pages"},
    @{Id="formulahendry.auto-rename-tag"; Name="Auto Rename Tag"; Description="Auto rename HTML/XML tags"},
    @{Id="pranaygp.vscode-css-peek"; Name="CSS Peek"; Description="Peek CSS definitions"},
    
    # Database & API
    @{Id="mtxr.sqltools"; Name="SQLTools"; Description="Database management"},
    @{Id="ckolkman.vscode-postgres"; Name="PostgreSQL"; Description="PostgreSQL support"},
    @{Id="humao.rest-client"; Name="REST Client"; Description="HTTP request testing"},
    
    # Git & Version Control
    @{Id="eamodio.gitlens"; Name="GitLens"; Description="Enhanced Git capabilities"},
    @{Id="mhutchie.git-graph"; Name="Git Graph"; Description="Git repository visualizer"},
    
    # Productivity
    @{Id="streetsidesoftware.code-spell-checker"; Name="Code Spell Checker"; Description="Spelling checker"},
    @{Id="wayou.vscode-todo-highlight"; Name="TODO Highlight"; Description="Highlight TODOs"},
    @{Id="usernamehw.errorlens"; Name="Error Lens"; Description="Inline error highlighting"},
    
    # Docker & DevOps (optional)
    @{Id="ms-azuretools.vscode-docker"; Name="Docker"; Description="Docker support"},
    @{Id="ms-vscode-remote.remote-containers"; Name="Remote Containers"; Description="Dev containers support"}
)

Write-Host "📦 Installing VS Code extensions..." -ForegroundColor Cyan
Write-Host "   Total extensions to install: $($extensions.Count)" -ForegroundColor Gray
Write-Host ""

$successCount = 0
$skipCount = 0
$failCount = 0

foreach ($ext in $extensions) {
    Write-Host "📌 $($ext.Name) ($($ext.Id))" -ForegroundColor Yellow
    Write-Host "   Description: $($ext.Description)" -ForegroundColor Gray
    
    try {
        # Check if already installed
        $installed = code --list-extensions | Where-Object { $_ -eq $ext.Id }
        
        if ($installed) {
            Write-Host "   ⏭️  Already installed, skipping" -ForegroundColor Gray
            $skipCount++
        } else {
            # Install extension
            $output = code --install-extension $ext.Id --force 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✅ Installed successfully" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "   ❌ Installation failed" -ForegroundColor Red
                if ($Verbose) {
                    Write-Host "   Output: $output" -ForegroundColor Gray
                }
                $failCount++
            }
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Installation Summary" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Newly installed: $successCount" -ForegroundColor Green
Write-Host "⏭️  Already installed: $skipCount" -ForegroundColor Gray
Write-Host "❌ Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host "📊 Total: $($extensions.Count)" -ForegroundColor Cyan
Write-Host ""

if ($failCount -gt 0) {
    Write-Host "⚠️  Some extensions failed to install. This may not affect functionality." -ForegroundColor Yellow
    Write-Host "   Try installing them manually from the VS Code Extensions marketplace." -ForegroundColor Gray
} else {
    Write-Host "🎉 All extensions processed successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 Recommended next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart VS Code to activate all extensions" -ForegroundColor White
Write-Host "   2. Configure your workspace settings" -ForegroundColor White
Write-Host "   3. Open the InstallSure project folder" -ForegroundColor White
Write-Host ""
