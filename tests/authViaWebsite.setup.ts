import { test as setup } from '@playwright/test';

const authFile = '.auth/userViaWebsite.json'

setup('authentication via website',async ({page}) => {
    // this test helps us to not login every time in the begin of every test
    await page.goto('https://conduit.bondaracademy.com/');

    // login via website
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: 'Email'}).fill('app@test.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('123')
    await page.getByRole('button').click()

    // if this endpoint is successful, it means our website loaded successfully
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    await page.context().storageState({path: authFile})

    // now we should change some config in the playwright.config.ts file
    // then delete the login part from every test
})
