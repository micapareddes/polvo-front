import { Button } from '/src/components/button.js'
import { API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { redirectToUserDashboard } from '/src/functions/redirectToUserDashboard.js'

const header = document.querySelector('header')
const { userType } = await makeRequest({ 
    url: API_ENDPOINTS.GET_USER_TYPE, 
    method: 'GET', 
    token: localStorage.getItem('accessToken'), 
})
    
header.appendChild(
    Button({
        variant: 'primary',
        icon: 'arrow-left',
        size: 'md', 
        title: 'Voltar',
        ariaLabel: 'Botão para voltar ao dashboard',
        onClick: () => redirectToUserDashboard(userType)
    })
)