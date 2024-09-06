import {test, expect} from '@playwright/test'

test('Like counter increase',async ({page}) => {
  // go to the home page and like the first article
  await page.goto('https://conduit.bondaracademy.com/')
  await page.getByText('Global Feed').click()
  const firstLikeButton = page.locator('app-article-preview').first().locator('button')
  
  // check if the article is not liked
  await expect(firstLikeButton).toContainText('0')
  
  // like the article
  await firstLikeButton.click()

  // check if the article is liked
  await expect(firstLikeButton).toContainText('1')
})
