# E2E Tests for Hello App

## Overview
This directory contains end-to-end (E2E) tests for the Hello application using Playwright.

## Test Files
- `basic.spec.ts` - Basic user flow tests including:
  - Homepage loading
  - Page navigation
  - Onboarding flow
  - UI responsiveness
  - Console error checking

## Running E2E Tests

### Prerequisites
Playwright browsers must be installed:
```bash
npx playwright install chromium
```

### Run Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/basic.spec.ts
```

## Configuration
E2E tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:4000`
- Browser: Chromium
- Test directory: `./e2e`
- Auto-start dev server
- Trace on first retry

## Test Coverage
The E2E tests cover:
1. ✅ Application loads without errors
2. ✅ Page title and URL validation
3. ✅ Navigation between tabs
4. ✅ Onboarding flow for new users
5. ✅ Console error monitoring
6. ✅ Responsive design (mobile, tablet, desktop)

## Alternative Testing
If Playwright browsers cannot be installed, use integration tests instead:
```bash
npm run test
```

Integration tests validate:
- API endpoints
- Server responses
- HTML structure
- Basic functionality

See `test/integration.test.ts` for details.
