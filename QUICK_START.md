# 🚀 Nexus Setup - Quick Reference Guide

## One-Command Installation

```powershell
.\Nexus_Setup.ps1
```

## Component-Specific Commands

### VS Code Extensions
```powershell
.\InstallSure_AllInOne_Pack\Install_All.ps1
```

### BIM Viewer
```powershell
# Open in browser with Live Server
code InstallSure_Demo_Extended\viewer\index.html
# Right-click → Open with Live Server
```

### Cost Estimator
```powershell
cd InstallSure_Demo_Extended\estimator

# CSV output
python estimator.py ..\viewer\tags_export.csv > estimate_out.csv

# JSON output
python estimator.py ..\viewer\tags_export.csv --format json > estimate_out.json
```

### Database Setup
```powershell
# PostgreSQL/Neon
psql $env:PG_URL < InstallSure_Demo_Extended\neon\schema.sql
```

### UE5 Walkthrough
```powershell
cd UE5_BIM_Walkthrough_AddOn_v2

# Configure
Copy-Item .env.example .env
notepad .env  # Set PG_URL

# Add BIM files to Input/

# Build
.\Build_Walkthrough.ps1
```

## Selective Setup

```powershell
# Skip VS Code
.\Nexus_Setup.ps1 -SkipVSCode

# Skip Demo/Estimator
.\Nexus_Setup.ps1 -SkipDemo

# Skip UE5
.\Nexus_Setup.ps1 -SkipUE5

# Skip multiple
.\Nexus_Setup.ps1 -SkipVSCode -SkipUE5
```

## Common Workflows

### Quick Estimate
1. Open viewer → Export CSV
2. Run estimator → Get costs
3. Review CSV output

### Full BIM Pipeline
1. Run Nexus Setup
2. Open viewer → Export data
3. Run estimator → Calculate costs
4. Setup database → Store results
5. Build UE5 walkthrough → Visualize

## File Locations

| Component | Location |
|-----------|----------|
| Master Setup | `Nexus_Setup.ps1` |
| VS Code Extensions | `InstallSure_AllInOne_Pack/` |
| BIM Viewer | `InstallSure_Demo_Extended/viewer/index.html` |
| Cost Estimator | `InstallSure_Demo_Extended/estimator/estimator.py` |
| Database Schema | `InstallSure_Demo_Extended/neon/schema.sql` |
| UE5 Walkthrough | `UE5_BIM_Walkthrough_AddOn_v2/` |

## Input/Output

### Viewer
- **Input:** None (uses demo data)
- **Output:** `tags_export.csv`, `takeoff_data.json`

### Estimator
- **Input:** CSV file with columns: Tag, Category, Type, Quantity, Unit, Material, Notes
- **Output:** CSV or JSON with cost calculations

### UE5 Walkthrough
- **Input:** IFC, RVT, DWG, PDF files in `Input/` directory
- **Output:** Built walkthrough in `Output/` directory

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Script won't run | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Python not found | `winget install Python.Python.3.12` |
| VS Code not found | `winget install Microsoft.VisualStudioCode` |
| UE5 not found | Update `UE5_ENGINE_PATH` in `.env` |
| Database error | Verify `PG_URL` connection string |

## Prerequisites

✅ Python 3.10+  
✅ PowerShell 5.1+  
⚠️ VS Code (optional)  
⚠️ UE5 5.3+ (optional)  
⚠️ PostgreSQL/Neon (optional)

## Support

📚 Full documentation: [NEXUS_SETUP.md](documentation/NEXUS_SETUP.md)  
🔧 For errors: Paste last ~20 lines of output
