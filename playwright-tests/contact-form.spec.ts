import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Get in Touch')

    // Check form fields are present
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="company"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')

    // HTML5 validation should prevent submission
    // Check that we're still on the same page
    await expect(page).toHaveURL('/contact')
  })

  test('should fill out contact form', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="company"]', 'Test Company')
    await page.fill('textarea[name="message"]', 'This is a test message')

    // Verify fields are filled
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User')
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com')
  })

  test('should display contact information', async ({ page }) => {
    // Check that contact email is displayed
    await expect(page.getByText('owen@certrev.com')).toBeVisible()
  })
})
