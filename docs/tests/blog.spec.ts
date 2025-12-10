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

test.describe("Blog Post - Share Buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/what-is-mermaid-chart/");
  });

  test("should display share buttons section", async ({ page }) => {
    const shareButtons = page.locator('[data-testid="share-buttons"]');
    await expect(shareButtons).toBeVisible();
  });

  test("should have Share label", async ({ page }) => {
    const shareLabel = page.locator(".share-label");
    await expect(shareLabel).toBeVisible();
    await expect(shareLabel).toHaveText("Share:");
  });

  test("should have Twitter/X share button with correct link", async ({
    page,
  }) => {
    const twitterButton = page.locator('[data-testid="share-twitter"]');
    await expect(twitterButton).toBeVisible();
    await expect(twitterButton).toHaveAttribute(
      "aria-label",
      "Share on Twitter/X",
    );
    const href = await twitterButton.getAttribute("href");
    expect(href).toContain("twitter.com/intent/tweet");
    expect(href).toContain("What%20is%20Mermaid%20Chart");
  });

  test("should have LinkedIn share button with correct link", async ({
    page,
  }) => {
    const linkedinButton = page.locator('[data-testid="share-linkedin"]');
    await expect(linkedinButton).toBeVisible();
    await expect(linkedinButton).toHaveAttribute(
      "aria-label",
      "Share on LinkedIn",
    );
    const href = await linkedinButton.getAttribute("href");
    expect(href).toContain("linkedin.com/sharing/share-offsite");
  });

  test("should have Facebook share button with correct link", async ({
    page,
  }) => {
    const facebookButton = page.locator('[data-testid="share-facebook"]');
    await expect(facebookButton).toBeVisible();
    await expect(facebookButton).toHaveAttribute(
      "aria-label",
      "Share on Facebook",
    );
    const href = await facebookButton.getAttribute("href");
    expect(href).toContain("facebook.com/sharer/sharer.php");
  });

  test("all share buttons should open in new tab", async ({ page }) => {
    const shareButtons = page.locator(".share-button");
    const count = await shareButtons.count();

    for (let i = 0; i < count; i++) {
      await expect(shareButtons.nth(i)).toHaveAttribute("target", "_blank");
      await expect(shareButtons.nth(i)).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
    }
  });
});

test.describe("Blog Post - Related Posts", () => {
  test("related posts section should not appear when no related posts exist", async ({
    page,
  }) => {
    // Currently there's only one published blog post, so no related posts should appear
    await page.goto("/blog/what-is-mermaid-chart/");
    const relatedPosts = page.locator('[data-testid="related-posts"]');
    await expect(relatedPosts).not.toBeVisible();
  });
});
