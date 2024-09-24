import { API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { redirectToUserDashboard } from '/src/functions/redirectToUserDashboard.js'

export async function checkAndRedirectUser() {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        const { userType } = await makeRequest({ 
            url: API_ENDPOINTS.GET_USER_TYPE, 
            method: 'GET', 
            token: localStorage.getItem('accessToken'), 
        })
        redirectToUserDashboard(userType)
    }
}