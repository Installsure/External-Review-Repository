# InstallSure Estimating Demo Pipeline

This directory contains scripts and sample data for running a comprehensive demo and review of the InstallSure Estimating Core.

## 🚀 Quick Start

### Prerequisites

- Node.js v20+ (v22.19.0 recommended)
- npm v8+
- Optional: Python 3.10+ (for Bandit security scanning)
- Optional: CodeQL CLI (for code analysis)

### Running the Demo Pipeline

#### Linux/macOS

```bash
# Run the complete demo pipeline
./scripts/demo-pipeline.sh

# Stop servers when done
./scripts/cleanup-demo.sh
```

#### Windows (PowerShell)

```powershell
# Run the complete demo pipeline
.\scripts\demo-pipeline.ps1

# Skip credential prompts if already configured
.\scripts\demo-pipeline.ps1 -SkipCredentials

# Stop servers when done
.\scripts\cleanup-demo.ps1
```

## 📋 What the Pipeline Does

The demo pipeline performs the following steps:

1. **Backend Setup**
   - Copies `.env.example` to `.env` if needed
   - Prompts for APS/Forge credentials
   - Installs dependencies
   - Starts the backend server on port 8080

2. **Frontend Setup**
   - Copies `.env.example` to `.env` if needed
   - Installs dependencies
   - Starts the frontend viewer on port 5173

3. **Sample Documents**
   - Creates sample blueprint JSON (`samples/sample_blueprint.json`)
   - Creates sample takeoff JSON (`samples/sample_takeoff.json`)

4. **API Workflow Testing**
   - Tests model translation endpoint (`POST /api/models/translate`)
   - Tests takeoff sync endpoint (`POST /api/takeoff/sync`)
   - Tests takeoff items endpoint (`GET /api/takeoff/items`)
   - Tests estimate lines endpoint (`GET /api/estimate/lines`)

5. **Playwright E2E Tests**
   - Runs end-to-end tests for API endpoints
   - Runs frontend integration tests

6. **Security Scans**
   - Bandit scan (Python security issues)
   - CodeQL analysis (JavaScript/TypeScript security)

7. **Code Quality**
   - ESLint on backend
   - ESLint on frontend

8. **Status Report**
   - Displays URLs for viewer and API
   - Shows how to stop servers
   - Shows log file locations

## 🔧 Configuration

### APS/Forge Credentials

The pipeline will prompt for the following credentials:

- `APS_CLIENT_ID` - Your Autodesk Platform Services client ID
- `APS_CLIENT_SECRET` - Your APS client secret
- `ACC_ACCOUNT_ID` - Your Autodesk Construction Cloud account ID
- `ACC_PROJECT_ID` - Your ACC project ID

You can obtain these from [Autodesk Platform Services](https://aps.autodesk.com).

### Environment Variables

The demo uses the following ports:

- **Backend API**: 8080 (configurable via `PORT` in `.env`)
- **Frontend Viewer**: 5173 (Vite default)

To change the backend port, edit `applications/installsure/backend/.env`:

```env
PORT=8080
```

## 📁 Sample Documents

### sample_blueprint.json

Contains blueprint metadata:

```json
{
  "blueprint": "Sample House A",
  "urn": "urn:sample:demo",
  "sheets": ["planA.pdf"],
  "meta": {
    "sqft": 1200,
    "floors": 2
  }
}
```

### sample_takeoff.json

Contains takeoff items:

```json
[
  {
    "package": "Walls",
    "type": "Drywall",
    "qty": 200
  },
  {
    "package": "Framing",
    "type": "2x4 Lumber",
    "qty": 500
  }
]
```

## 🧪 Running Tests Separately

### Playwright Tests

```bash
cd tests
npm install
npx playwright test --reporter=list
```

### Backend Unit Tests

```bash
cd applications/installsure/backend
npm test
```

### Frontend Unit Tests

```bash
cd applications/installsure/frontend
npm test
```

## 🔒 Security Scanning

### Bandit (Python)

Install Bandit:

```bash
pip install bandit
```

Run manually:

```bash
bandit -r applications/installsure/backend/src
```

### CodeQL

Download CodeQL CLI from [GitHub](https://github.com/github/codeql-cli-binaries).

Run manually:

```bash
codeql database create codeql-db --language=javascript --source-root=applications/installsure/backend
codeql database analyze codeql-db --format=sarif-latest --output=results.sarif
```

## 📊 Technology Stack

### Paid Tools (Optional)

- ChatGPT (Nexus)
- Cursor AI
- VSCode with GitHub Copilot (MCP)

### Free Tools

- Playwright - E2E testing
- CodeQL - Security analysis
- Bandit - Python security scanner
- Sourcegraph Cody (free tier)
- GitHub Actions (free tier)

## 🛠️ API Endpoints

### Model Translation

```bash
POST /api/models/translate
Content-Type: application/json

{
  "blueprint": "Sample House A",
  "urn": "urn:sample:demo",
  "sheets": ["planA.pdf"],
  "meta": {"sqft": 1200, "floors": 2}
}
```

### Takeoff Sync

```bash
POST /api/takeoff/sync
```

### Takeoff Items

```bash
GET /api/takeoff/items
```

### Estimate Lines

```bash
GET /api/estimate/lines
```

## 📝 Logs

### Linux/macOS

- Backend log: `/tmp/backend.log`
- Frontend log: `/tmp/frontend.log`

View logs in real-time:

```bash
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

### Windows (PowerShell)

View job output:

```powershell
# Get job IDs from the pipeline output, then:
Receive-Job -Id <BackendJobId> -Keep
Receive-Job -Id <FrontendJobId> -Keep
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 8080 or 5173 are already in use:

1. Stop the existing process
2. Or change the port in `.env` files
3. Re-run the pipeline

### Servers Won't Start

Check the logs:

```bash
# Linux/macOS
cat /tmp/backend.log
cat /tmp/frontend.log

# Or check if dependencies are installed
cd applications/installsure/backend
npm install
```

### API Tests Failing

Ensure servers are running:

```bash
curl http://localhost:8080/api/health
curl http://localhost:5173
```

## 📚 Documentation

- [Setup Guide](../documentation/SETUP_GUIDE.md)
- [API Documentation](../documentation/API_DOCUMENTATION.md)
- [Troubleshooting Guide](../documentation/TROUBLESHOOTING.md)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
