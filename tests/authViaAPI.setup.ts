import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentication via api',async ({request}) => {
    // this test helps us to not login every time in the begin of every test
    
    // login via api and save the access token into a variable
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "app@test.com", "password": "123"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    // write the accessToken to the user.json file
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    // assign accessToken to use it in the delete or other request so it doesn't need to get the access token every time
    process.env['ACCESS_TOKEN'] = accessToken



    // now we should change some config in the playwright.config.ts file
    // then delete the login part from every test
})
