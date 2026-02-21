import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for integration-testing the static export.
 *
 * Before running tests the site must be built:
 *   npm run test:e2e:full   # generates certs → builds → tests
 *   npm run test:e2e        # if out/ already exists
 *
 * In CI the deploy workflow builds first, then runs `npm run test:e2e`.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Fail fast on CI if a test is accidentally left as test.only
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Single worker keeps a static-file server from being hammered
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:3999',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Serve the pre-built static export.  `reuseExistingServer` lets you keep
  // the server running between local test runs for faster iteration.
  webServer: {
    command: 'npx serve out --listen 3999 --no-clipboard',
    url: 'http://localhost:3999',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
})
