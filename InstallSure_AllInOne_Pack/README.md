# InstallSure All-In-One Pack

VS Code extensions installer for InstallSure development environment.

## 🚀 Quick Start

```powershell
.\Install_All.ps1
```

This will install all essential VS Code extensions for InstallSure development.

## 📦 Included Extensions

### Core Development
- **Python** - Python language support
- **Pylance** - Fast Python language server
- **TypeScript** - Enhanced TypeScript support

### Frontend Development
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatter
- **Tailwind CSS** - Tailwind CSS IntelliSense

### Web Development
- **Live Server** - Live preview for HTML pages (required for demo viewer)
- **Auto Rename Tag** - Auto rename HTML/XML tags
- **CSS Peek** - Peek CSS definitions from HTML

### Database & API
- **SQLTools** - Database management
- **PostgreSQL** - PostgreSQL support for Neon
- **REST Client** - HTTP request testing

### Git & Version Control
- **GitLens** - Enhanced Git capabilities
- **Git Graph** - Repository visualizer

### Productivity
- **Code Spell Checker** - Spelling checker
- **TODO Highlight** - Highlight TODO comments
- **Error Lens** - Inline error highlighting

### Docker & DevOps (Optional)
- **Docker** - Docker support
- **Remote Containers** - Dev containers support

## 📋 Prerequisites

- VS Code installed and in PATH
- Windows, macOS, or Linux

## 🔧 Usage

### Standard Installation
```powershell
.\Install_All.ps1
```

### Check What Will Be Installed
The script will:
1. Check if VS Code is installed
2. List all extensions to be installed
3. Skip already installed extensions
4. Install new extensions
5. Report installation summary

## 📊 Installation Summary

After running, you'll see:
- ✅ **Newly installed** - Extensions just installed
- ⏭️ **Already installed** - Extensions that were skipped
- ❌ **Failed** - Extensions that couldn't be installed

## 🆘 Troubleshooting

### VS Code not found
```powershell
# Make sure VS Code is in PATH
# Or install from: https://code.visualstudio.com/
```

### Extension installation fails
- Try installing manually from VS Code Extensions marketplace
- Check internet connection
- Restart VS Code

### Permission errors
- Run PowerShell as Administrator if needed
- Check VS Code installation permissions

## 💡 Post-Installation

1. **Restart VS Code** to activate all extensions
2. **Configure settings** for your workflow
3. **Open InstallSure project** to use the extensions

## 🔗 Related Components

- **Nexus_Setup.ps1** - Master setup script
- **InstallSure_Demo_Extended** - Demo viewer and estimator
- **UE5_BIM_Walkthrough_AddOn_v2** - UE5 walkthrough builder

## 📚 Extension Documentation

For detailed information about each extension, visit:
- [VS Code Extension Marketplace](https://marketplace.visualstudio.com/vscode)

## ⚙️ Customization

To add or remove extensions, edit `Install_All.ps1` and modify the `$extensions` array:

```powershell
$extensions = @(
    @{Id="publisher.extension-name"; Name="Extension Name"; Description="What it does"}
)
```
