import { test, expect } from "@playwright/test";

test("signup through onboarding lands on Today with the new habit", async ({ page }) => {
  const email = `e2e-${Date.now()}@mindset.local`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/onboarding$/, { timeout: 10000 });
  await expect(page.getByRole("heading", { name: "Who do you want to become?" })).toBeVisible();

  await page.getByText("Reader").click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Design your first system" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Add your first habits" })).toBeVisible();
  await page.getByRole("button", { name: "Finish setup" }).click();

  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });
  await expect(page.getByText("Read Before Bed")).toBeVisible();
});
