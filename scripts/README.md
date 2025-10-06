# Scripts Directory

This directory contains automation scripts for the External Review Repository.

## Available Scripts

### Shell Scripts (Unix/Linux/macOS)

#### `setup-installsure.sh`
**Purpose:** Quick setup and installation script for InstallSure application.

**Features:**
- ✅ Checks for required dependencies (Node.js, npm)
- ✅ Installs InstallSure frontend dependencies
- ✅ Installs InstallSure backend dependencies
- ✅ Optionally creates a distributable zip archive
- ✅ Provides clear progress feedback with colored output

**Usage:**
```bash
./scripts/setup-installsure.sh
```

**Requirements:**
- Node.js v20+
- npm v8+
- zip utility (optional, for archive creation)

---

### PowerShell Scripts (Windows)

#### `start-all.ps1`
**Purpose:** Start all applications in the repository.

**Features:**
- Starts all 7 applications (InstallSure, Demo Dashboard, FF4U, RedEye, ZeroStack, Hello, Avatar)
- Opens each application in a separate PowerShell window
- Checks port availability before starting
- Provides status feedback for each application

**Usage:**
```powershell
.\scripts\start-all.ps1
```

#### `stop-all.ps1`
**Purpose:** Stop all running applications.

**Features:**
- Identifies and stops all application processes
- Cleans up resources
- Provides confirmation of stopped applications

**Usage:**
```powershell
.\scripts\stop-all.ps1
```

#### `test-all.ps1`
**Purpose:** Run all tests for all applications.

**Features:**
- Executes unit tests for each application
- Executes E2E tests for each application
- Provides comprehensive test results
- Generates test coverage reports

**Usage:**
```powershell
.\scripts\test-all.ps1
```

---

## Script Naming Convention

- **`.sh`** - Shell scripts for Unix/Linux/macOS
- **`.ps1`** - PowerShell scripts for Windows

---

## Creating New Scripts

When creating new scripts, please follow these guidelines:

1. **Use clear, descriptive names** (e.g., `setup-<component>.sh`)
2. **Include proper headers** with purpose, date, and author
3. **Add error handling** and validation
4. **Provide user feedback** with clear messages
5. **Make scripts executable** (for `.sh` files): `chmod +x script-name.sh`
6. **Document the script** in this README

---

## Related Documentation

- [Quick Start Guide](../documentation/QUICKSTART.md) - Fast setup instructions
- [Setup Guide](../documentation/SETUP_GUIDE.md) - Comprehensive setup guide
- [Main README](../README.md) - Repository overview

---

**Last Updated:** 2025-10-06
