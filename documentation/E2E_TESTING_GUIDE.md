# E2E Testing Guide

This document describes the End-to-End (E2E) testing infrastructure for all applications in the External Review Repository.

## Overview

All applications in this repository are configured with comprehensive E2E tests using Playwright. The tests run automatically on every push and pull request via GitHub Actions.

## Applications with E2E Tests

- **InstallSure** (Port 3000) - Production Ready
- **Demo Dashboard** (Port 3001) - Demo Ready
- **FF4U** (Port 3002) - Development Ready
- **RedEye** (Port 3003) - Development Ready
- **ZeroStack** (Port 3004) - Development Ready
- **Hello** (Port 3005) - Development Ready
- **Avatar** (Port 3006) - Development Ready

## Running E2E Tests Locally

### Prerequisites

- Node.js v20+
- npm v8+
- All application dependencies installed

### Running Tests for a Single Application

```bash
# Navigate to the application directory
cd applications/<app-name>

# Install dependencies (if not already installed)
npm install

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### Example: Running Demo Dashboard E2E Tests

```bash
cd applications/demo-dashboard
npm install
npx playwright install chromium
npm run test:e2e
```

### Running All E2E Tests

Use the PowerShell script to run all tests across all applications:

```powershell
.\scripts\test-all.ps1
```

## E2E Test Structure

Each application has:

1. **Playwright Configuration** (`playwright.config.ts`)
   - Configured with the application's specific port
   - Automatic server startup before tests
   - HTML and JSON reporting
   - Screenshot and trace capture on failure

2. **E2E Test Files** (`e2e/*.spec.ts`)
   - Basic smoke tests (page load, navigation)
   - Responsive design tests
   - Console error detection
   - Accessibility checks

3. **Package.json Scripts**
   - `test:e2e` - Run tests in headless mode
   - `test:e2e:ui` - Run tests with interactive UI
   - `test:e2e:headed` - Run tests with browser visible

## GitHub Actions Workflow

The repository includes a comprehensive GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) that:

- Runs on every push to main/master/develop branches
- Runs on every pull request
- Can be manually triggered via workflow_dispatch
- Tests all 7 applications in parallel
- Uploads test results and reports as artifacts
- Provides a summary of all test results

### Workflow Jobs

Each application has a dedicated job:
- `e2e-installsure` - InstallSure E2E tests
- `e2e-demo-dashboard` - Demo Dashboard E2E tests
- `e2e-ff4u` - FF4U E2E tests
- `e2e-redeye` - RedEye E2E tests
- `e2e-zerostack` - ZeroStack E2E tests
- `e2e-hello` - Hello E2E tests
- `e2e-avatar` - Avatar E2E tests
- `e2e-summary` - Aggregates results from all jobs

### Viewing Test Results

After a workflow run:
1. Go to the Actions tab in GitHub
2. Click on the workflow run
3. View the summary for overall results
4. Download artifacts for detailed reports:
   - `<app-name>-e2e-results` - HTML reports and screenshots

## Test Coverage

Each application's E2E tests include:

### Basic Functionality Tests
- ✅ Home page loads successfully
- ✅ Main content is displayed
- ✅ Navigation elements are present

### Responsive Design Tests
- ✅ Desktop view (1920x1080)
- ✅ Mobile view (375x667)

### Quality Tests
- ✅ No critical console errors
- ✅ Basic accessibility checks (headings present)

### InstallSure Specific Tests
- ✅ Login page navigation
- ✅ Authentication flow elements

## Configuration Details

### Playwright Configuration

Each application's `playwright.config.ts` includes:

```typescript
{
  testDir: './e2e',              // Test files location
  fullyParallel: true,           // Run tests in parallel
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Worker processes
  reporter: ['html', 'list', 'json'], // Multiple reporters
  use: {
    baseURL: 'http://localhost:<port>', // App-specific port
    trace: 'on-first-retry',   // Capture trace on retry
    screenshot: 'only-on-failure', // Screenshot on failure
  },
  webServer: {
    command: 'npm run dev',     // Start dev server
    url: 'http://localhost:<port>', // Wait for server
    reuseExistingServer: !process.env.CI, // Reuse in local dev
    timeout: 120 * 1000,        // 2 minute startup timeout
  }
}
```

### Port Assignments

- InstallSure: 3000
- Demo Dashboard: 3001
- FF4U: 3002
- RedEye: 3003
- ZeroStack: 3004
- Hello: 3005
- Avatar: 3006

## Debugging Failed Tests

### Local Debugging

1. **Run with UI Mode**
   ```bash
   npm run test:e2e:ui
   ```
   This opens an interactive UI where you can:
   - See test execution in real-time
   - Inspect DOM at any point
   - Time-travel through test steps

2. **Run in Headed Mode**
   ```bash
   npm run test:e2e:headed
   ```
   This shows the browser while tests run.

3. **View Test Reports**
   ```bash
   npx playwright show-report
   ```
   Opens the HTML report with screenshots and traces.

### CI Debugging

1. Download the test artifacts from GitHub Actions
2. Extract the `playwright-report` folder
3. Open `index.html` in a browser
4. Review screenshots and traces

## Adding New Tests

To add new E2E tests to an application:

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Follow the existing test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/some-path');
    await page.waitForLoadState('networkidle');
    
    // Your test assertions here
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

3. Run the tests locally to verify
4. Commit and push - tests will run automatically in CI

## Best Practices

1. **Keep tests independent** - Each test should work on its own
2. **Use data-testid attributes** - For stable selectors in the application code
3. **Wait for stable state** - Use `waitForLoadState('networkidle')` before assertions
4. **Clean up after tests** - Reset state or use test isolation
5. **Use meaningful test names** - Describe what the test validates
6. **Keep tests fast** - Focus on critical user paths
7. **Handle flaky tests** - Use appropriate wait strategies and retries

## Troubleshooting

### Tests Timeout
- Increase the timeout in `playwright.config.ts`
- Check if the application starts correctly
- Verify the port is not already in use

### Browser Not Installed
```bash
npx playwright install chromium
```

### Port Already in Use
- Stop any running instances of the application
- Use a different port in the configuration
- On Windows: `.\scripts\stop-all.ps1`

### Tests Pass Locally But Fail in CI
- Check for timing issues (use proper waits)
- Verify environment-specific configuration
- Review CI logs and artifacts for details

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Repository Troubleshooting Guide](./TROUBLESHOOTING.md)

## Support

For issues with E2E tests:
1. Check this guide and the Playwright documentation
2. Review the troubleshooting guide
3. Check GitHub Actions logs and artifacts
4. Open an issue with:
   - Test name and application
   - Error message
   - Screenshots/traces if available
   - Steps to reproduce
