# 🧪 E2E Testing Guide

## Overview

The `run-e2e.ps1` script provides an automated way to start all required services and run end-to-end tests using Playwright. This script handles the complete E2E testing workflow including:

- **Dependency installation** for all services
- **Playwright browser installation** 
- **Service startup** in separate PowerShell windows
- **Health check verification** for all services
- **E2E test execution** with Playwright
- **Test report generation** and display

## Quick Start

### Running E2E Tests

From the repository root directory:

```powershell
# Windows PowerShell
.\scripts\run-e2e.ps1
```

Or with explicit execution policy:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\run-e2e.ps1
```

## What the Script Does

### 1. Dependency Installation

The script automatically:
- Detects your package manager (npm, yarn, or pnpm)
- Installs dependencies for each service:
  - InstallSure Frontend (applications/installsure/frontend)
  - InstallSure Backend API (applications/installsure/backend)
  - Demo Dashboard (applications/demo-dashboard)
- Installs Playwright browsers and dependencies

### 2. Service Startup

The script starts each service in a separate PowerShell window:
- **InstallSure Frontend** - http://localhost:3000
- **InstallSure Backend API** - http://localhost:8000
- **Demo Dashboard** - http://localhost:3001

Each service runs `npm run dev` in its respective directory.

### 3. Health Check Verification

Before running tests, the script verifies each service is healthy:
- Frontend applications: Checks HTTP 200 response
- Backend API: Checks `/api/health` endpoint

Default timeout: 120 seconds per service

### 4. Test Execution

Once all services are healthy, the script runs Playwright tests with:
- **Reporters**: Line output + HTML report
- **Retries**: 1 retry on failure
- **Timeout**: 60 seconds per test
- **Artifacts**: Traces and videos on failure
- **Output**: `./test-artifacts/` directory

### 5. Report Display

After tests complete, the script automatically opens the HTML report in your browser.

## Services Configuration

The script is configured to start the following services:

| Service | Path | URL | Port |
|---------|------|-----|------|
| InstallSure Frontend | applications/installsure/frontend | http://localhost:3000 | 3000 |
| InstallSure Backend API | applications/installsure/backend | http://localhost:8000/api/health | 8000 |
| Demo Dashboard | applications/demo-dashboard | http://localhost:3001 | 3001 |

## Playwright Configuration

The E2E tests are configured via `playwright.config.ts` at the repository root:

- **Test Directory**: `./e2e`
- **Base URL**: http://localhost:3000
- **Browser**: Chromium (Desktop Chrome)
- **Parallel Execution**: Enabled
- **Artifacts**: Captured on failure

### Test Options

You can customize test execution with Playwright command-line options:

```powershell
# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test e2e/smoke.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug
```

## Writing Tests

Tests are located in the `e2e/` directory. Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    // Your test assertions
  });
});
```

## Troubleshooting

### Services Not Starting

**Problem**: Script fails to start services

**Solutions**:
1. Ensure ports 3000, 3001, and 8000 are not in use
2. Check Node.js and npm are installed
3. Verify all service directories exist
4. Check package.json files have "dev" scripts

### Health Check Timeout

**Problem**: Services don't respond within 120 seconds

**Solutions**:
1. Increase timeout in the script (modify `Wait-HttpOk` timeout parameter)
2. Check service logs in the separate PowerShell windows
3. Verify dependencies are installed correctly
4. Check for port conflicts

### Playwright Installation Issues

**Problem**: Playwright browsers fail to install

**Solutions**:
```powershell
# Manual installation
npm install -D @playwright/test
npx playwright install --with-deps
```

### Test Failures

**Problem**: Tests fail unexpectedly

**Solutions**:
1. Check service logs in separate PowerShell windows
2. View test artifacts in `./test-artifacts/`
3. Run tests with `--debug` flag
4. Ensure all services are fully started before tests run

## Manual Testing Workflow

If you prefer to run services and tests separately:

```powershell
# Terminal 1: Start InstallSure Frontend
cd applications/installsure/frontend
npm run dev

# Terminal 2: Start InstallSure Backend
cd applications/installsure/backend
npm run dev

# Terminal 3: Start Demo Dashboard
cd applications/demo-dashboard
npm run dev

# Terminal 4: Run tests
npx playwright test
```

## Test Artifacts

After running tests, artifacts are stored in:
- `./test-artifacts/playwright-report/` - HTML test report
- `./test-artifacts/` - Screenshots, videos, traces (on failure)

View the report:
```powershell
npx playwright show-report test-artifacts/playwright-report
```

## CI/CD Integration

For automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
steps:
  - name: Install dependencies
    run: npm install
    
  - name: Install Playwright
    run: npx playwright install --with-deps
    
  - name: Start services
    run: |
      # Start services in background
      cd applications/installsure/frontend && npm run dev &
      cd applications/installsure/backend && npm run dev &
      cd applications/demo-dashboard && npm run dev &
    
  - name: Run E2E tests
    run: npx playwright test
    
  - name: Upload artifacts
    uses: actions/upload-artifact@v3
    if: always()
    with:
      name: playwright-report
      path: test-artifacts/
```

## Customizing the Script

### Adding More Services

Edit `scripts/run-e2e.ps1` and add to the `$Services` array:

```powershell
$Services = @(
  # ... existing services ...
  @{ name="New Service"; path="applications/new-service"; url="http://localhost:4000"; startCmd="npm run dev" }
)
```

### Changing Playwright Options

Modify the `$PW_Args` array in the script:

```powershell
$PW_Args = @(
  "--reporter=line,html",
  "--retries=2",           # Increase retries
  "--timeout=90000",       # Increase timeout
  "--headed",              # Run in headed mode
  # ... more options ...
)
```

## Related Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Setup Guide](SETUP_GUIDE.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [API Documentation](API_DOCUMENTATION.md)

---

**Last Updated:** 2025-10-05  
**Status:** ✅ **E2E TESTING READY**
