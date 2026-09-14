import { test, expect } from "@playwright/test";

test("root redirects to login and renders the sign-in form", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
