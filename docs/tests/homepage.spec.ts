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

  test("should have Open Graph meta tags", async ({ page }) => {
    await page.goto("/");

    // Check og:title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);

    // Check og:image
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    const ogImageContent = await ogImage.getAttribute("content");
    expect(ogImageContent).toContain("/me.png");
  });

  test("should have JSON-LD structured data", async ({ page }) => {
    await page.goto("/");

    // Check for Person schema
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify content of first JSON-LD (Person)
    const personSchema = await jsonLdScripts.first().textContent();
    expect(personSchema).toContain("Person");
    expect(personSchema).toContain("Supakone Kongprapan");

    // Verify content includes WebSite schema
    const allSchemas = await jsonLdScripts.allTextContents();
    const hasWebSiteSchema = allSchemas.some((schema) =>
      schema.includes("WebSite"),
    );
    expect(hasWebSiteSchema).toBe(true);
  });

  test("should have Umami analytics tracking script", async ({ page }) => {
    await page.goto("/");

    // Check for Umami script
    const umamiScript = page.locator(
      'script[src="https://cloud.umami.is/script.js"]',
    );
    await expect(umamiScript).toHaveCount(1);

    // Verify it has the correct data-website-id attribute
    const websiteId = await umamiScript.getAttribute("data-website-id");
    expect(websiteId).toBe("acd0c0ad-3b39-46f7-bcb6-29976993aaac");

    // Verify it has defer attribute
    const hasDefer = await umamiScript.getAttribute("defer");
    expect(hasDefer).not.toBeNull();
  });
});
