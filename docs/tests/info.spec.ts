import { test, expect } from "@playwright/test";

test.describe("Info Pages", () => {
  test("info index should load successfully", async ({ page }) => {
    const response = await page.goto("/info/");
    expect(response?.status()).toBe(200);
  });

  test("personal info page should load successfully", async ({ page }) => {
    const response = await page.goto("/info/personal_info/");
    expect(response?.status()).toBe(200);
  });

  test("work experience page should load successfully", async ({ page }) => {
    const response = await page.goto("/info/work/software_engineer/");
    expect(response?.status()).toBe(200);
  });
});
