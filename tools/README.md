# Tools Directory

This directory contains utility scripts for the External Review Repository.

## Available Scripts

### preflight-check.ps1
**Purpose:** Validates system requirements and repository structure before starting development.

**Usage:**
```powershell
# Windows
.\tools\preflight-check.ps1

# macOS/Linux (with PowerShell Core)
pwsh ./tools/preflight-check.ps1
```

**What it checks:**
- System requirements (Node.js, npm, Python, Git, Docker)
- Port availability (3000-3006)
- Application structure
- Essential files
- Package configurations
- Environment setup
- Version compatibility

---

### installsure-structure-repair.ps1
**Purpose:** Creates InstallSure development/demo environment structure with minimal stub files.

**Usage:**
```powershell
# Navigate to your master setup folder (e.g., C:\InstallSure\FullSetup)
cd C:\InstallSure\FullSetup

# Run the structure repair script
powershell -ExecutionPolicy Bypass -File "path\to\tools\installsure-structure-repair.ps1"
```

**What it does:**
1. Creates three pack folders:
   - `InstallSure_AllInOne_Pack/` - Core installer (VS Code + extensions)
   - `InstallSure_Demo_Extended/` - Demo viewer, estimator, and Neon schema
   - `UE5_BIM_Walkthrough_AddOn_v2/` - Unreal Engine build script and config

2. Creates stub files only when missing (non-destructive):
   - Core installer: `Install_All.ps1`
   - Demo viewer: `viewer/index.html`
   - Estimator: `estimator/estimator.py`
   - Neon schema: `neon/schema.sql`
   - UE build script: `Build_Walkthrough.ps1`
   - UE config: `.env.example`

3. Runs the Core installer automatically
4. Provides next steps guidance

**Key Features:**
- ✅ Non-destructive: Never overwrites existing files
- ✅ Cross-platform: Works on Windows, macOS, and Linux
- ✅ Idempotent: Can be run multiple times safely
- ✅ Minimal stubs: Only creates essential files for structure

**Next Steps After Running:**
1. **Demo Viewer**: Open `InstallSure_Demo_Extended/viewer/index.html` in a browser or VS Code Live Server
2. **Estimator**: Run `python estimator.py ../viewer/tags_export.csv > estimate_out.csv`
3. **Unreal Build**: Place IFC/RVT/DWG/PDF files in `UE5_BIM_Walkthrough_AddOn_v2/Input/` and run `Build_Walkthrough.ps1`

---

## Requirements

### PowerShell
All scripts require PowerShell:
- **Windows:** PowerShell 5.1+ (built-in) or PowerShell Core 7+
- **macOS/Linux:** PowerShell Core 7+ ([Install Guide](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell))

### Permissions
Some scripts may require elevated permissions on Windows. If you encounter execution policy errors, run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## Troubleshooting

### Execution Policy Error
**Error:** `cannot be loaded because running scripts is disabled`

**Solution:**
```powershell
# Option 1: Run with bypass flag
powershell -ExecutionPolicy Bypass -File script.ps1

# Option 2: Set execution policy for current user
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Cross-Platform Issues
The scripts are designed to work cross-platform, but some Windows-specific features (like `Unblock-File` and `Set-ExecutionPolicy`) are skipped on Linux/macOS.

### Script Not Found
Ensure you're running the script from the repository root or using the full path:
```powershell
# From repository root
.\tools\preflight-check.ps1

# Or use full path
powershell -File "C:\path\to\External-Review-Repository\tools\preflight-check.ps1"
```

---

## Contributing

When adding new scripts to this directory:
1. Use PowerShell for cross-platform compatibility
2. Include proper error handling
3. Add colored output for better UX
4. Document the script in this README
5. Test on Windows, macOS, and Linux if possible
