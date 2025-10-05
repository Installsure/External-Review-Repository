# InstallSure Demo Extended

BIM quantity takeoff viewer, cost estimator, and database schema for construction project management.

## 📋 Overview

This package contains three integrated components:
- **Viewer** - Interactive BIM quantity takeoff visualization
- **Estimator** - Python-based cost estimation engine
- **Neon** - PostgreSQL database schema for data persistence

## 🚀 Quick Start

### 1. Open the Viewer

```powershell
# Using VS Code Live Server (recommended)
code .\viewer\index.html
# Then right-click and select "Open with Live Server"

# Or open directly in browser
start .\viewer\index.html
```

### 2. Export Takeoff Data

1. Click "Export to CSV" in the viewer
2. File will be saved as `tags_export.csv` in the viewer directory

### 3. Run Cost Estimator

```powershell
cd .\estimator
python estimator.py ..\viewer\tags_export.csv > estimate_out.csv
```

View the results in `estimate_out.csv`

### 4. Set Up Database

```powershell
# Open Neon console or connect via psql
psql $PG_URL

# Apply the schema
\i .\neon\schema.sql
```

## 📁 Directory Structure

```
InstallSure_Demo_Extended/
├── viewer/
│   └── index.html          # Interactive BIM takeoff viewer
├── estimator/
│   └── estimator.py        # Cost estimation engine
└── neon/
    └── schema.sql          # PostgreSQL database schema
```

## 🔧 Components

### Viewer

**Features:**
- Interactive quantity takeoff visualization
- Support for Linear, Area, Volume, and Count measurements
- CSV and JSON export capabilities
- Sample project data

**Usage:**
1. Open `index.html` in a browser
2. Review sample quantities
3. Export data for estimation

### Estimator

**Features:**
- Processes CSV takeoff data
- Calculates material and labor costs
- Supports multiple measurement types
- Extensible cost database

**Input Format (CSV):**
```csv
Tag,Category,Type,Quantity,Unit,Material,Notes
T001,Linear,Pipe,125,LF,Copper,"3/4 inch"
```

**Output Format:**
```csv
tag,category,type,quantity,unit,material,notes,material_cost_per_unit,labor_cost_per_unit,total_material_cost,total_labor_cost,total_cost
T001,Linear,Pipe,125,LF,Copper,3/4 inch,8.50,12.00,1062.50,1500.00,2562.50
TOTAL,,,,,,,,1062.50,1500.00,2562.50
```

**Supported Categories:**
- **Linear**: Pipes, cables, framing
- **Area**: Walls, floors, ceilings
- **Volume**: Concrete, excavation
- **Count**: Fixtures, doors, windows

**Command Line Options:**
```powershell
# CSV output (default)
python estimator.py tags_export.csv > estimate_out.csv

# JSON output
python estimator.py tags_export.csv --format json > estimate_out.json
```

### Neon Database

**Features:**
- Complete schema for project management
- Support for BIM models and quantity takeoffs
- Cost database and estimates
- User management and audit logging
- PostgreSQL views for reporting

**Tables:**
- `projects` - Project information
- `bim_models` - BIM file metadata
- `quantity_takeoffs` - Extracted quantities
- `cost_database` - Unit costs
- `cost_estimates` - Calculated estimates
- `users` - User accounts
- `project_members` - Team assignments
- `audit_log` - System audit trail

**Views:**
- `project_summary` - Project overview with totals
- `detailed_estimates` - Complete cost breakdown

## 💾 Database Setup

### Using Neon (Recommended)

1. Create a Neon project at https://neon.tech
2. Get your connection string
3. Apply the schema:

```bash
psql "postgresql://user:pass@host.neon.tech:5432/db?sslmode=require" < neon/schema.sql
```

### Using Local PostgreSQL

```bash
# Create database
createdb installsure

# Apply schema
psql installsure < neon/schema.sql
```

## 📊 Workflow

```
┌─────────────┐
│ BIM Model   │
│ (IFC/RVT)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Viewer    │ ◄─── User reviews quantities
│ (HTML/JS)   │
└──────┬──────┘
       │ Export CSV
       ▼
┌─────────────┐
│  Estimator  │ ◄─── Calculates costs
│  (Python)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Neon DB   │ ◄─── Stores results
│ (PostgreSQL)│
└─────────────┘
```

## 🔍 Cost Database

The estimator includes built-in unit costs for common materials:

**Sample Rates (USD):**
- Copper pipe: $8.50/LF material + $12.00/LF labor
- PVC pipe: $2.25/LF material + $6.50/LF labor
- Drywall: $1.85/SF material + $3.25/SF labor
- Concrete: $125.00/CY material + $45.00/CY labor

**Customization:**
Edit `estimator.py` to update the `COST_DATABASE` dictionary with your regional pricing.

## 📝 Example: Complete Workflow

```powershell
# Step 1: Open viewer and export data
start .\viewer\index.html
# Click "Export to CSV" button

# Step 2: Run estimator
cd .\estimator
python estimator.py ..\viewer\tags_export.csv > estimate_out.csv

# Step 3: Review estimates
notepad estimate_out.csv

# Step 4: Import to database (optional)
# Use the CSV data to populate your Neon database
```

## 🆘 Troubleshooting

### Python not found
```powershell
# Install Python 3.10+
winget install Python.Python.3.12
```

### Estimator errors
```powershell
# Check CSV format - must have headers:
# Tag,Category,Type,Quantity,Unit,Material,Notes

# Verify file path
python estimator.py ..\viewer\tags_export.csv
```

### Database connection issues
```powershell
# Verify connection string format
# postgresql://user:password@host:port/database?sslmode=require

# Test connection
psql $env:PG_URL
```

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Python CSV Module](https://docs.python.org/3/library/csv.html)

## 🔗 Integration

This package integrates with:
- **UE5_BIM_Walkthrough_AddOn_v2** - For 3D visualization
- **InstallSure Application** - Main construction management platform
- **Neon PostgreSQL** - Cloud database hosting
