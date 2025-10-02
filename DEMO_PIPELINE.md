# InstallSure Estimating Demo Pipeline

This document provides quick instructions for running the InstallSure Estimating Core demo pipeline.

## 🚀 Quick Start

### Linux/macOS

```bash
# Run the complete demo pipeline
./scripts/demo-pipeline.sh

# Stop servers when done
./scripts/cleanup-demo.sh
```

### Windows (PowerShell)

```powershell
# Run the complete demo pipeline
.\scripts\demo-pipeline.ps1

# Skip credential prompts if already configured
.\scripts\demo-pipeline.ps1 -SkipCredentials

# Stop servers when done
.\scripts\cleanup-demo.ps1
```

## 📋 What Gets Tested

The pipeline automatically:

1. **Sets up backend and frontend** - Installs dependencies and starts servers
2. **Creates sample documents** - Blueprint and takeoff data
3. **Tests API endpoints**:
   - `POST /api/models/translate` - Model translation
   - `POST /api/takeoff/sync` - Takeoff synchronization
   - `GET /api/takeoff/items` - Takeoff items retrieval
   - `GET /api/estimate/lines` - Enriched cost estimates
4. **Runs Playwright E2E tests** (if configured)
5. **Performs security scans** (Bandit, CodeQL)
6. **Checks code quality** (ESLint)

## 🌐 Access Points

After the pipeline starts:

- **Frontend Viewer**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health

## 📚 Full Documentation

For complete documentation, see [samples/README.md](samples/README.md)

## 🔑 APS Credentials

The first time you run the pipeline, you'll be prompted for:

- `APS_CLIENT_ID` - Autodesk Platform Services client ID
- `APS_CLIENT_SECRET` - APS client secret
- `ACC_ACCOUNT_ID` - ACC account ID
- `ACC_PROJECT_ID` - ACC project ID

Get these from [Autodesk Platform Services](https://aps.autodesk.com)

## 🛠️ Manual Testing

To manually test the API endpoints:

```bash
# Health check
curl http://localhost:8080/api/health

# Model translation
curl -X POST http://localhost:8080/api/models/translate \
  -d @samples/sample_blueprint.json \
  -H "Content-Type: application/json"

# Takeoff sync
curl -X POST http://localhost:8080/api/takeoff/sync

# Takeoff items
curl http://localhost:8080/api/takeoff/items

# Estimate lines
curl http://localhost:8080/api/estimate/lines
```

## 📖 Additional Resources

- [Full Setup Guide](documentation/SETUP_GUIDE.md)
- [API Documentation](documentation/API_DOCUMENTATION.md)
- [Troubleshooting Guide](documentation/TROUBLESHOOTING.md)
