import { test, expect } from "@playwright/test";

test("browsing from identity to habit detail shows history and allows editing", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@mindset.local");
  await page.getByLabel("Password").fill("mindset-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });

  await page.getByRole("link", { name: "Athlete" }).click();
  await expect(page.getByRole("heading", { name: /trains consistently/ })).toBeVisible();

  await page.getByRole("link", { name: /Morning Run/ }).click();
  await expect(page).toHaveURL(/\/habits\/.+/);
  await expect(page.getByRole("heading", { name: "Morning Run" })).toBeVisible();
  await expect(page.getByText("By day of week")).toBeVisible();
  await expect(page.getByText("By time of day")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  const behaviorInput = page.getByPlaceholder("Behavior");
  await behaviorInput.fill("Run outdoors, rain or shine");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Run outdoors, rain or shine")).toBeVisible();
});
