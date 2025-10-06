# 🚀 InstallSure Quick Start Guide

This guide provides quick setup instructions for getting InstallSure up and running.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20+ (v22.19.0 recommended)
- **npm** v8+ (v10.9.3 recommended)
- **Git** v2.47+
- **zip** utility (for creating archives)

---

## 🔧 Quick Setup Options

### Option 1: Automated Setup Script (Recommended)

For Unix/Linux/macOS users, use the automated setup script:

```bash
# Navigate to the repository
cd External-Review-Repository

# Run the setup script
./scripts/setup-installsure.sh
```

The script will:
- ✅ Check for required dependencies (Node.js, npm)
- ✅ Install InstallSure frontend dependencies
- ✅ Install InstallSure backend dependencies
- ✅ Optionally create a zip archive

### Option 2: Manual Setup

If you prefer to set up manually or are on Windows:

```bash
# Clone the repository (if not already cloned)
git clone <your-repo-url> External-Review-Repository

# Navigate to the repository
cd External-Review-Repository

# Install InstallSure frontend dependencies
cd applications/installsure/frontend
npm install

# Install InstallSure backend dependencies
cd ../backend
npm install
```

### Option 3: Clone Only InstallSure

If you only need the InstallSure application:

```bash
# Clone the repository
git clone <your-repo-url> InstallSure

# Change directory into the project
cd InstallSure

# Navigate to InstallSure application
cd applications/installsure

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## 📦 Creating a Zip Archive

To create a distributable archive of InstallSure:

### Using the Setup Script

```bash
# Run the setup script and select 'yes' when prompted
./scripts/setup-installsure.sh
```

### Manual Archive Creation

```bash
# From the repository root
zip -r InstallSure.zip applications/installsure \
    -x "*/node_modules/*" \
    -x "*/.env.local" \
    -x "*/dist/*" \
    -x "*/.git/*" \
    -x "*/coverage/*" \
    -x "*/.DS_Store"

# Now you have a zip file ready for distribution or deployment
```

**Note**: The zip excludes:
- `node_modules` (dependencies should be reinstalled on the target system)
- `.env.local` (contains local environment variables)
- `dist` (build artifacts that should be regenerated)
- `.git` (version control history)
- `coverage` (test coverage reports)

---

## 🚀 Starting InstallSure

### Start Frontend

```bash
cd applications/installsure/frontend
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### Start Backend

```bash
cd applications/installsure/backend
npm run dev
```

The backend API will be available at: **http://localhost:8000**

### Start Both (Using PowerShell on Windows)

```powershell
.\scripts\start-all.ps1
```

---

## 🧪 Running Tests

### Frontend Tests

```bash
cd applications/installsure/frontend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
```

### Backend Tests

```bash
cd applications/installsure/backend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
```

---

## 🔍 Verification

To verify your installation:

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v20 or higher
   ```

2. **Check npm version:**
   ```bash
   npm --version   # Should be v8 or higher
   ```

3. **Verify dependencies are installed:**
   ```bash
   ls applications/installsure/frontend/node_modules
   ls applications/installsure/backend/node_modules
   ```

4. **Test the application:**
   - Start both frontend and backend
   - Open http://localhost:3000 in your browser
   - Verify the InstallSure dashboard loads

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find the process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Failures

```bash
# Check for TypeScript errors
npm run type-check

# Rebuild the project
npm run build
```

---

## 📚 Additional Resources

- **[Setup Guide](../documentation/SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[API Documentation](../documentation/API_DOCUMENTATION.md)** - API reference
- **[Troubleshooting Guide](../documentation/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Main README](../README.md)** - Repository overview

---

## 💡 Tips

- **Use the automated script** for the fastest setup experience
- **Create environment files** from `.env.example` before running
- **Install all dependencies** before building or running
- **Check the logs** if you encounter any issues
- **Use the preflight check** script to verify your system: `.\tools\preflight-check.ps1`

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the [Troubleshooting Guide](../documentation/TROUBLESHOOTING.md)
2. Review the application logs
3. Open a GitHub issue with details about your problem

---

**Last Updated:** 2025-10-06  
**Status:** ✅ Ready for use
