import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'

export async function verifyUserAccess(tipo) {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
        const { userType } = await makeRequest({ 
            url: API_ENDPOINTS.GET_USER_TYPE, 
            method: 'GET', 
            token: localStorage.getItem('accessToken'), 
        })

        if (userType !== tipo) {
            navigateTo(ROUTES.ERROR404)
        }

        return
    }
    navigateTo(ROUTES.LOGIN)
}