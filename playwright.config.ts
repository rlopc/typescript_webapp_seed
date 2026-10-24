import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';
// Set to test an app that is already running (e.g. the Docker image) instead of
// starting the local preview server.
const externalBaseURL = process.env.E2E_BASE_URL;
const previewPort = 4173;
const previewURL = `http://localhost:${String(previewPort)}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  // A stray `test.only` must not silently skip the rest of the suite in CI.
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseURL ?? previewURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  // Test the production build (`pnpm build` first), not the dev server: it is
  // what users get.
  ...(externalBaseURL === undefined && {
    webServer: {
      command: `pnpm preview --port ${String(previewPort)} --strictPort`,
      url: previewURL,
      reuseExistingServer: !isCI,
    },
  }),
});
