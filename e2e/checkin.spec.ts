import { test, expect } from "@playwright/test";

test("logging a habit entry persists across a reload", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@mindset.local");
  await page.getByLabel("Password").fill("mindset-demo");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });

  const firstCard = page.locator("li").first();
  const completeButton = firstCard.getByRole("button", { name: "Complete" });
  await completeButton.click();
  await expect(completeButton).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  const reloadedButton = page.locator("li").first().getByRole("button", { name: "Complete" });
  await expect(reloadedButton).toHaveAttribute("aria-pressed", "true");
});

test("saving the check-in sliders persists across a reload", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@mindset.local");
  await page.getByLabel("Password").fill("mindset-demo");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/today$/, { timeout: 10000 });

  await page.getByLabel("Note (optional)").fill("Feeling steady today.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Check-in saved.")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Note (optional)")).toHaveValue("Feeling steady today.");
});
