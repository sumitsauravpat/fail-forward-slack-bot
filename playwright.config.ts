import { defineConfig } from "@playwright/test";

// Purpose — throwaway config proving FailForwardReporter actually works when Playwright loads it the real way, from a config file
export default defineConfig({
  testDir: "./demo-tests",
  reporter: [
    ["list"],
    [
      "./src/reporter.ts",
      { endpoint: "http://localhost:3000/runs", project: "demo-project" },
    ],
  ],
});
