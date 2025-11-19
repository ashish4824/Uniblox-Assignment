// No comments per project rules
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30 * 1000,
  reporter: [['list'], ['html', { outputFolder: 'automation/report' }]],
  use: {
    baseURL: process.env.TEST_URL || undefined,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  outputDir: 'automation/artifacts'
})