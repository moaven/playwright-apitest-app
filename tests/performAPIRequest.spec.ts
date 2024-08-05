import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({page}) => {
    
    await page.goto('https://conduit.bondaracademy.com/');

    // login via website
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: 'Email'}).fill('app@test.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('123')
    await page.getByRole('button').click()
})

test('has the specific texts', async ({ page }) => {
    // add a new article via website and check if it is added correctly
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"
        responseBody.articles[0].description = "This is a MOCK test description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
});

test('delete articles', async ({ page, request }) => {
    // login to the website via api and save the access token into a variable
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "app@test.com", "password": "123"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    // add a new article to the website via api
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {"tagList": [], "title": "This is a test title", "description": "This is a test description", "body": "this is a test body"}
        },
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })   
    expect(articleResponse.status()).toEqual(201) 

    // delete the new article via website
    await page.getByText('Global Feed').click()
    await page.getByText('This is a test title').click()
    await page.getByRole('button', {name: 'Delete Article'}).first().click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title')


});
