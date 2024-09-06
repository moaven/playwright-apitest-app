import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a test title"
        responseBody.articles[0].description = "This is a description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForTimeout(1000)
})

test('has the specific text', async ({ page }) => {
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a description')
});



