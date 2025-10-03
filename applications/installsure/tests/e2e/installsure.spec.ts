import { test, expect } from "@playwright/test";
import path from "path";

test("InstallSure A→Z demo", async ({ page }) => {
  await page.goto("http://localhost:3000/demo");
  
  // Wait for page to load
  await expect(page.locator("h2:has-text('InstallSure Demo')")).toBeVisible();
  
  // upload plan
  const planPath = path.resolve(__dirname, "../assets/sample_plan.pdf");
  await page.setInputFiles('input[type="file"][name="plan"]', planPath);
  
  // Wait a bit for upload to process
  await page.waitForTimeout(500);
  
  await page.getByRole("button", { name: "Open Plan" }).click();
  
  // drop a pin
  const viewer = page.locator("#plan-viewer");
  await expect(viewer).toBeVisible();
  await viewer.click({ position: { x: 200, y: 200 }});
  
  // Wait for pin to be created
  await page.waitForTimeout(500);
  
  // attach photo + text
  const photoPath = path.resolve(__dirname, "../assets/sample_img.jpg");
  await page.setInputFiles('input[type="file"][name="photo"]', photoPath);
  
  await page.getByPlaceholder("Add note").fill("Crack observed at grid A3.");
  
  // Blur to trigger save
  await page.getByPlaceholder("Add note").blur();
  
  // open IFC + run QTO
  await page.getByRole("button", { name: "Open 3D" }).click();
  
  // Wait for 3D view to load
  await page.waitForTimeout(500);
  
  await page.locator('select[name="Assembly"]').selectOption("paint_wall");
  
  await page.locator('input[name="length"]').fill("12");
  await page.locator('input[name="height"]').fill("3");
  
  await page.getByRole("button", { name: "Run QTO" }).click();
  
  // Check for QTO output
  await expect(page.getByTestId("qto-output")).toBeVisible();
  await expect(page.getByTestId("qto-output")).toContainText("cost");
  await expect(page.getByTestId("qto-output")).toContainText("Quantity");
});
