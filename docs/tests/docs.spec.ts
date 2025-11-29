import { test, expect } from "@playwright/test";

test.describe("Documentation Pages", () => {
  test("docs index should load successfully", async ({ page }) => {
    const response = await page.goto("/docs/");
    expect(response?.status()).toBe(200);
  });

  test("implementation page should load successfully", async ({ page }) => {
    const response = await page.goto("/docs/implementation/");
    expect(response?.status()).toBe(200);
  });

  test("roadmap page should load successfully", async ({ page }) => {
    const response = await page.goto("/docs/roadmap/");
    expect(response?.status()).toBe(200);
  });

  test("docs page should have main content", async ({ page }) => {
    await page.goto("/docs/");
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});
