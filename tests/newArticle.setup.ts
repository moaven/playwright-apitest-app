import {test as setup, expect} from '@playwright/test'

setup('create new article',async ({request}) => {
    // for the login and the headers it uses from user.auth
    // create a new article via api
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {"tagList": [], "title": "Likes test article", "description": "This is a test description", "body": "this is a test body"}
        },
    })   
    expect(articleResponse.status()).toEqual(201)

    // save the slug into the slug id env
    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId
})