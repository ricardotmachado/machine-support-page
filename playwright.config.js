import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    browserName: 'chromium',
    // Mobile Chrome — Pixel 7 dimensions
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
  projects: [
    { name: 'Mobile Chrome' },
  ],
})
