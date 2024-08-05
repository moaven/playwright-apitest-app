import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({page}) => {
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })
    await page.goto('https://conduit.bondaracademy.com/')
})

test('has expected tags ', async ({ page }) => {
    await expect(page.locator('.sidebar')).toHaveText('Popular Tags Automation  Playwright Loading tags... No tags are here... yet. ');
  });

test('has title', async ({ page }) => {
  await expect(page.locator('.logo-font')).toHaveText('conduit');
});
