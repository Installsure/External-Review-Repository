import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.CI ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'echo "Assuming servers are already running"',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 5000,
  },
});
