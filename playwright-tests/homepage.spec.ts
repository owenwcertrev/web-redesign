import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Expert Content Verification')

    // Check navigation is present
    await expect(page.locator('nav')).toBeVisible()

    // Check footer is present
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/')

    // Click on pricing link
    await page.click('text=Pricing')

    // Should be on pricing page
    await expect(page).toHaveURL('/pricing')
    await expect(page.locator('h1')).toContainText('Pricing')
  })

  test('should navigate to E-E-A-T Meter', async ({ page }) => {
    await page.goto('/')

    // Look for E-E-A-T Meter link
    const eeAtLink = page.locator('a[href="/eeat-meter"]').first()
    await eeAtLink.click()

    // Should be on E-E-A-T Meter page
    await expect(page).toHaveURL('/eeat-meter')
    await expect(page.locator('h1')).toContainText('Credibility Score')
  })

  test('should have responsive navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu should exist
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })
})
