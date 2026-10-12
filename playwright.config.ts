import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retries are helpful for the flaky element challenge!
  // No workers cap: every challenge section is self-contained client-side DOM state with
  // no shared backend, and each test gets its own isolated browser context, so there's no
  // cross-test contention to guard against. Measured 1.1min (workers:1) vs 18s (workers:4)
  // on identical results — let Playwright auto-scale to the machine/CI runner instead of
  // hardcoding a worker count that'd be wrong on a different core count.
  reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL: 'http://localhost:5180',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5180',
    reuseExistingServer: !process.env.CI,
    timeout: 10 * 1000,
  },
});
