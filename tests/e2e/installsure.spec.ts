import { test, expect } from "@playwright/test";

test("InstallSure A→Z demo", async ({ page }) => {
  await page.goto("http://localhost:3000/demo");
  
  // Upload plan
  await page.setInputFiles('input[type="file"][name="plan"]', "tests/assets/sample_plan.pdf");
  await page.getByRole("button", { name: "Open Plan" }).click();
  
  // Drop a pin
  const viewer = page.locator("#plan-viewer");
  await viewer.click({ position: { x: 200, y: 200 }});
  
  // Attach photo + text
  await page.setInputFiles('input[type="file"][name="photo"]', "tests/assets/sample_img.jpg");
  await page.getByPlaceholder("Add note").fill("Crack observed at grid A3.");
  
  // Open IFC + run QTO
  await page.getByRole("button", { name: "Open 3D" }).click();
  await page.getByRole("combobox", { name: "Assembly" }).selectOption("paint_wall");
  await page.getByRole("spinbutton", { name: "length" }).fill("12");
  await page.getByRole("spinbutton", { name: "height" }).fill("3");
  await page.getByRole("button", { name: "Run QTO" }).click();
  await expect(page.getByTestId("qto-output")).toContainText("cost");
});
