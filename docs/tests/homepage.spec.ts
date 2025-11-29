import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("should have correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/supakone\.me/i);
  });

  test("should have header navigation", async ({ page }) => {
    await page.goto("/");
    // Check that header is present (Starlight uses header element)
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });
});
