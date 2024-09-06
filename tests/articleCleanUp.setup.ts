import {test as setup, expect} from '@playwright/test'

setup('delete article',async ({page, request}) => {
    // for the login and the headers it uses from user.auth
    // delete the article via api and check if the response is successful
    const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    expect(deleteArticleRequest.status()).toEqual(204)
})