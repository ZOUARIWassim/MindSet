import { test, expect } from "@playwright/test";

test("insights page shows generated insights and supports dismissal", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@mindset.local");
  await page.getByLabel("Password").fill("mindset-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });

  await page.getByRole("link", { name: "Insights" }).click();
  await expect(page).toHaveURL(/\/insights$/);

  await page.getByRole("button", { name: "Check for new insights" }).click();
  await expect(page.getByText(/works better at some times|has been slipping|minimum version/).first()).toBeVisible({
    timeout: 10000,
  });

  const firstCard = page.getByTestId("insight-card").first();
  const insightId = await firstCard.getAttribute("data-insight-id");
  await firstCard.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.locator(`[data-insight-id="${insightId}"]`)).toHaveCount(0);
});

test("a fresh user sees the days-until-insights gate instead of empty insights", async ({ page }) => {
  const email = `e2e-insights-${Date.now()}@mindset.local`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Fresh User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/onboarding$/, { timeout: 10000 });

  await page.getByText("Grounded").click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish setup" }).click();
  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });

  await page.goto("/insights");
  await expect(page.getByText("No insights yet")).toBeVisible();
  await expect(page.getByText("Still gathering data")).toBeVisible();
  await expect(page.getByText(/more days? of check-ins/).first()).toBeVisible();
});
