import { test, expect } from "@playwright/test";

test.describe("Resume Page", () => {
  test("should load successfully", async ({ page }) => {
    const response = await page.goto("/resume");
    expect(response?.status()).toBe(200);
  });

  test("should have correct title", async ({ page }) => {
    await page.goto("/resume");
    await expect(page).toHaveTitle(/Resume/i);
  });

  test("should be a standalone page without Starlight layout", async ({
    page,
  }) => {
    await page.goto("/resume");
    // The resume page should NOT have Starlight's layout elements
    const starlightLayout = page.locator(".sl-layout, [data-pagefind-body]");
    await expect(starlightLayout).toHaveCount(0);
    // Should NOT have Starlight's sidebar
    const starlightSidebar = page.locator("nav.sidebar, .right-sidebar");
    await expect(starlightSidebar).toHaveCount(0);
  });

  test("should display resume owner name", async ({ page }) => {
    await page.goto("/resume");
    const name = page.locator("h1");
    await expect(name).toContainText("Supakone Kongprapan");
  });

  test("should display job title", async ({ page }) => {
    await page.goto("/resume");
    const title = page.locator("h2");
    await expect(title).toContainText("Software Engineer");
  });

  test("should display contact information", async ({ page }) => {
    await page.goto("/resume");
    const contactInfo = page.locator(".contact-info");
    await expect(contactInfo).toBeVisible();
    await expect(contactInfo).toContainText("supakone.kongprapan@gmail.com");
  });

  test("should display Experience section", async ({ page }) => {
    await page.goto("/resume");
    const experienceSection = page.locator("text=Experience").first();
    await expect(experienceSection).toBeVisible();
    // Check for company names
    await expect(page.locator("text=AthenaAI")).toBeVisible();
    await expect(page.locator("text=Dime! by Kiatnakin Phatra")).toBeVisible();
  });

  test("should display Projects section", async ({ page }) => {
    await page.goto("/resume");
    const projectsSection = page.locator("text=Projects").first();
    await expect(projectsSection).toBeVisible();
    await expect(
      page.locator("text=Depositee Management Service"),
    ).toBeVisible();
    await expect(page.locator("text=The Petpal")).toBeVisible();
  });

  test("should display Education section", async ({ page }) => {
    await page.goto("/resume");
    const educationSection = page.locator("text=Education").first();
    await expect(educationSection).toBeVisible();
    await expect(page.locator("text=Chulalongkorn University")).toBeVisible();
  });

  test("should display Skills section", async ({ page }) => {
    await page.goto("/resume");
    const skillsSection = page.locator("text=Skills").first();
    await expect(skillsSection).toBeVisible();
    // Check for skill categories
    await expect(page.locator("text=Languages")).toBeVisible();
    await expect(page.locator("text=Technologies")).toBeVisible();
    await expect(page.locator("text=Frameworks")).toBeVisible();
  });

  test("should have Print/Save as PDF button", async ({ page }) => {
    await page.goto("/resume");
    const printButton = page.locator("button.download-btn");
    await expect(printButton).toBeVisible();
    await expect(printButton).toContainText("Print / Save as PDF");
  });
});
