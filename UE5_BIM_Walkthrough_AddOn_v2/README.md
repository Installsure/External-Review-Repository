# UE5 BIM Walkthrough Add-On v2

Unreal Engine 5 BIM Walkthrough builder for InstallSure construction visualization.

## 🚀 Quick Start

1. **Configure Environment**
   ```powershell
   Copy-Item .env.example .env -Force
   notepad .env
   ```
   Set your `PG_URL` connection string in the `.env` file.

2. **Add BIM Files**
   Drop IFC/RVT/DWG/PDF files into the `Input/` directory.

3. **Build Walkthrough**
   ```powershell
   .\Build_Walkthrough.ps1 -Verbose
   ```

## 📋 Prerequisites

- **Unreal Engine 5.3+** installed
- **PostgreSQL Database** (Neon or other provider)
- **PowerShell 5.1+** (Windows)
- **BIM Files** in supported formats

## 🔧 Configuration

Edit `.env` file to configure:

- `PG_URL` - PostgreSQL connection string (required)
- `UE5_ENGINE_PATH` - Path to UE5 installation
- Quality settings (texture, mesh, lighting)
- Performance options
- Export settings

## 📁 Directory Structure

```
UE5_BIM_Walkthrough_AddOn_v2/
├── Input/          # Drop BIM files here (IFC, RVT, DWG, PDF)
├── Output/         # Generated walkthrough builds
├── Temp/           # Temporary processing files
├── Logs/           # Build logs and reports
├── .env.example    # Configuration template
├── .env            # Your configuration (create from .env.example)
└── Build_Walkthrough.ps1  # Build script
```

## 🎮 Supported File Formats

- **IFC** - Industry Foundation Classes
- **RVT** - Autodesk Revit
- **DWG** - AutoCAD Drawing
- **PDF** - Portable Document Format

## ⚙️ Build Options

```powershell
# Standard build with verbose output
.\Build_Walkthrough.ps1 -Verbose

# Skip validation checks (not recommended)
.\Build_Walkthrough.ps1 -SkipValidation

# Use custom config file
.\Build_Walkthrough.ps1 -ConfigFile ".env.production"
```

## 📊 Build Process

1. **Load Configuration** - Reads settings from `.env`
2. **Validate Prerequisites** - Checks UE5 installation and files
3. **Initialize Directories** - Creates output/temp/log folders
4. **Process Input Files** - Scans and validates BIM files
5. **Build Walkthrough** - Imports and processes in UE5
6. **Generate Report** - Creates detailed build log

## 🔍 Troubleshooting

### Error: "Configuration file not found"
- Copy `.env.example` to `.env` and configure settings

### Error: "Unreal Engine 5 not found"
- Update `UE5_ENGINE_PATH` in `.env` to match your UE5 installation

### Error: "Input directory is empty"
- Add IFC/RVT/DWG/PDF files to the `Input/` directory

### Error: "Database connection not configured"
- Set valid `PG_URL` in `.env` file with Neon or PostgreSQL connection string

## 📝 Notes

- Build logs are saved to `Logs/` directory
- Check build reports for detailed statistics
- Ensure adequate disk space for UE5 processing
- First build may take longer for shader compilation

## 🆘 Support

For issues, paste the last ~20 lines of error output from the build log.

## 📚 Related Documentation

- [InstallSure Demo Viewer](../InstallSure_Demo_Extended/viewer/index.html)
- [Cost Estimator](../InstallSure_Demo_Extended/estimator/estimator.py)
- [Database Schema](../InstallSure_Demo_Extended/neon/schema.sql)
