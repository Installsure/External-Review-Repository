import { test, expect } from "@playwright/test";

test("homepage renders and has key text", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/InstallSure|Vite|React/i);
  await expect(page.locator("h1")).toContainText(/Final App Review/i);
  await expect(page.locator("text=E2E tests")).toBeVisible();
});
