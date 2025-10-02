/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry"
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]]
};
export default config;
