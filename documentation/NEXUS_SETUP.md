# Nexus Setup - Complete InstallSure Ecosystem

## Overview

The Nexus Setup provides a streamlined, one-command installation for the complete InstallSure BIM ecosystem, including:

1. **VS Code Development Environment** - All essential extensions
2. **BIM Viewer & Cost Estimator** - Web-based quantity takeoff and estimation
3. **Database Schema** - PostgreSQL/Neon schema for data persistence
4. **UE5 Walkthrough Builder** - Unreal Engine 5 BIM visualization

## Quick Start

### One-Command Setup
```powershell
.\Nexus_Setup.ps1
```

This single command sets up the entire ecosystem.

### Selective Setup
```powershell
# Skip specific components
.\Nexus_Setup.ps1 -SkipVSCode    # Skip VS Code extensions
.\Nexus_Setup.ps1 -SkipDemo      # Skip demo/estimator setup
.\Nexus_Setup.ps1 -SkipUE5       # Skip UE5 setup
```

## Components

### 1. InstallSure All-In-One Pack

**Location:** `InstallSure_AllInOne_Pack/`

**Purpose:** Install essential VS Code extensions for development

**Usage:**
```powershell
.\InstallSure_AllInOne_Pack\Install_All.ps1
```

**Includes:**
- Python development tools
- TypeScript/JavaScript tools
- Live Server (for demo viewer)
- Database tools (PostgreSQL)
- Git enhancements
- Code quality tools

### 2. InstallSure Demo Extended

**Location:** `InstallSure_Demo_Extended/`

**Components:**
- **Viewer** (`viewer/index.html`) - Interactive BIM quantity takeoff
- **Estimator** (`estimator/estimator.py`) - Cost calculation engine
- **Neon Schema** (`neon/schema.sql`) - PostgreSQL database schema

**Workflow:**

1. **View & Export:**
   ```powershell
   # Open viewer/index.html in browser (use Live Server)
   # Click "Export to CSV" to create tags_export.csv
   ```

2. **Calculate Costs:**
   ```powershell
   cd InstallSure_Demo_Extended\estimator
   python estimator.py ..\viewer\tags_export.csv > estimate_out.csv
   ```

3. **Setup Database:**
   ```powershell
   # In Neon console or psql
   psql $PG_URL < InstallSure_Demo_Extended\neon\schema.sql
   ```

### 3. UE5 BIM Walkthrough Add-On v2

**Location:** `UE5_BIM_Walkthrough_AddOn_v2/`

**Purpose:** Build immersive 3D walkthroughs from BIM files

**Setup:**

1. **Configure:**
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   # Set PG_URL and UE5_ENGINE_PATH
   ```

2. **Add Files:**
   ```powershell
   # Drop IFC/RVT/DWG/PDF files into Input/ directory
   ```

3. **Build:**
   ```powershell
   .\Build_Walkthrough.ps1
   ```

**Supported Formats:**
- IFC - Industry Foundation Classes
- RVT - Revit
- DWG - AutoCAD
- PDF - Plans/drawings

## Complete Workflow Example

### Scenario: New BIM Project Estimation

1. **Initial Setup (First Time Only):**
   ```powershell
   .\Nexus_Setup.ps1
   ```

2. **Open BIM Viewer:**
   - Open `InstallSure_Demo_Extended\viewer\index.html` in VS Code
   - Click "Open with Live Server"
   - Review quantities and measurements

3. **Export Takeoff Data:**
   - Click "Export to CSV" button in viewer
   - File saved as `tags_export.csv`

4. **Generate Cost Estimate:**
   ```powershell
   cd InstallSure_Demo_Extended\estimator
   python estimator.py ..\viewer\tags_export.csv > estimate_out.csv
   ```

5. **Review Estimates:**
   ```powershell
   notepad estimate_out.csv
   # or
   Import-Csv estimate_out.csv | Format-Table
   ```

6. **Store in Database:**
   ```powershell
   # Connect to Neon
   psql $env:PG_URL
   
   # Import data (manual or automated)
   ```

7. **Create 3D Walkthrough (Optional):**
   ```powershell
   cd ..\UE5_BIM_Walkthrough_AddOn_v2
   # Copy BIM files to Input/
   .\Build_Walkthrough.ps1
   ```

## Prerequisites

### Required
- **Python 3.10+** - For cost estimator
- **PowerShell 5.1+** - For setup scripts
- **Web Browser** - For BIM viewer

### Optional
- **VS Code** - For development environment
- **Unreal Engine 5.3+** - For 3D walkthroughs
- **PostgreSQL/Neon** - For database storage

## Configuration

### Environment Variables

**UE5 Walkthrough (.env):**
```env
PG_URL=postgresql://user:pass@host.neon.tech:5432/db?sslmode=require
UE5_ENGINE_PATH=C:/Program Files/Epic Games/UE_5.3
PROJECT_NAME=InstallSure_BIM_Walkthrough
```

### Cost Database Customization

Edit `InstallSure_Demo_Extended/estimator/estimator.py`:

```python
COST_DATABASE = {
    'Pipe': {
        'Copper': {'material': 8.50, 'labor': 12.00, 'unit': 'LF'},
        # Add your custom costs here
    }
}
```

## Troubleshooting

### Nexus Setup Issues

**Problem:** Prerequisites not met
```powershell
# Install missing software
winget install Python.Python.3.12
winget install Microsoft.VisualStudioCode
```

**Problem:** Scripts won't run
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Estimator Issues

**Problem:** Python not found
```powershell
python --version  # Verify Python is installed
# Add Python to PATH if needed
```

**Problem:** Invalid CSV format
```
# Ensure CSV has required headers:
Tag,Category,Type,Quantity,Unit,Material,Notes
```

### UE5 Build Issues

**Problem:** UE5 not found
```powershell
# Update .env file with correct path
UE5_ENGINE_PATH=C:/Program Files/Epic Games/UE_5.3
```

**Problem:** No files processed
```powershell
# Add IFC/RVT/DWG/PDF files to Input/ directory
```

## Directory Structure

```
External-Review-Repository/
├── Nexus_Setup.ps1                          # Master setup script
├── InstallSure_AllInOne_Pack/
│   ├── Install_All.ps1                      # VS Code extensions installer
│   └── README.md
├── InstallSure_Demo_Extended/
│   ├── viewer/
│   │   └── index.html                       # BIM quantity viewer
│   ├── estimator/
│   │   └── estimator.py                     # Cost calculation engine
│   ├── neon/
│   │   └── schema.sql                       # PostgreSQL schema
│   └── README.md
└── UE5_BIM_Walkthrough_AddOn_v2/
    ├── .env.example                         # Configuration template
    ├── Build_Walkthrough.ps1                # Build script
    ├── Input/                               # Drop BIM files here
    ├── Output/                              # Generated builds (gitignored)
    ├── Temp/                                # Temporary files (gitignored)
    ├── Logs/                                # Build logs (gitignored)
    └── README.md
```

## Integration with Main Repository

The Nexus Setup complements the existing repository structure:

- **Existing Apps** (`applications/`) - Web applications continue to work
- **Existing Scripts** (`scripts/`, `tools/`) - Preflight and startup scripts unchanged
- **New Components** - BIM workflow components added alongside

Both can be used independently or together.

## Support

For issues with:
- **Setup Scripts** - Check script output for errors
- **Estimator** - Verify CSV format and Python version
- **UE5 Build** - Check build logs in `Logs/` directory
- **Database** - Verify connection string and PostgreSQL version

## Next Steps

After setup:
1. ✅ Explore the demo viewer
2. ✅ Try the cost estimator with sample data
3. ✅ Review database schema
4. ✅ Configure UE5 (if needed)
5. ✅ Process your own BIM files

## Version History

- **v2.0** (2025-09-29) - Initial Nexus Setup release
  - One-command installation
  - Integrated BIM workflow
  - UE5 walkthrough support
  - PostgreSQL/Neon schema

## License

Part of the External Review Repository.
