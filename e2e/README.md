# E2E Tests

This directory contains end-to-end tests for the External Review Repository applications.

## Running Tests

### Using the E2E Script (Recommended)

The easiest way to run E2E tests is using the `run-e2e.ps1` script, which automatically starts all services and runs the tests:

```powershell
.\scripts\run-e2e.ps1
```

### Manual Test Execution

If services are already running, you can run tests directly:

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/smoke.spec.ts

# Run in UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug
```

## Test Structure

- `smoke.spec.ts` - Basic smoke tests verifying all services are running and responding correctly

## Writing Tests

When adding new tests, follow this structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Perform actions and assertions
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

## Service URLs

The tests expect the following services to be running:

- **InstallSure Frontend**: http://localhost:3000
- **InstallSure Backend**: http://localhost:8000
- **Demo Dashboard**: http://localhost:3001

## Configuration

Test configuration is defined in `playwright.config.ts` at the repository root.

## Documentation

For more information, see the [E2E Testing Guide](../documentation/E2E_TESTING_GUIDE.md).
