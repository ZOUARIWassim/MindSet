import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  // Several specs share the seeded demo account and mutate its data
  // (habit entries, edited habits, generated insights) - run serially so
  // they don't race each other.
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    cwd: "..",
  },
});
