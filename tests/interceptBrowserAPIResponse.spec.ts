import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    
    await page.goto('https://conduit.bondaracademy.com/');

    // login via website
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: 'Email'}).fill('app@test.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('123')
    await page.getByRole('button').click()
})

test('create article via website and delete it via api',async ({page, request}) => {
    // create a new article via website
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()

    // save the slug parameter of this create article endpoint into slugId 
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug

    // check if created the article correctly
    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

    // get access token from login endpoint
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "app@test.com", "password": "123"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    // delete the article via api and check if the response is successful
    const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })
    expect(deleteArticleRequest.status()).toEqual(204)
})