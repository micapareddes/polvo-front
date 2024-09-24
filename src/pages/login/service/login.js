import { API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { redirectToUserDashboard } from '/src/functions/redirectToUserDashboard.js'

export async function reqLogin(userData) {
    const { accessToken } = await makeRequest({ 
        url: API_ENDPOINTS.LOGIN, 
        method: 'POST', 
        data: userData 
    })

    localStorage.setItem('accessToken', accessToken)
    
    const { userType } = await makeRequest({ 
        url: API_ENDPOINTS.GET_USER_TYPE, 
        method: 'GET', 
        token: localStorage.getItem('accessToken'), 
    })
    redirectToUserDashboard(userType)
}