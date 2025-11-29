import { test, expect } from "@playwright/test";

test.describe("Blog Pages", () => {
  test("blog index should load successfully", async ({ page }) => {
    const response = await page.goto("/blog/");
    expect(response?.status()).toBe(200);
  });

  test("blog should have RSS feed", async ({ page }) => {
    const response = await page.goto("/blog/rss.xml");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("xml");
  });
});
