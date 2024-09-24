import { makeRequest } from '/src/functions/makeRequest.js'
import { API_ENDPOINTS } from '/src/utils/routes.js'

export async function getDisciplinas() {
    try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await makeRequest({ 
            url: API_ENDPOINTS.GET_DISCIPLINAS, 
            method:'GET', 
            token: accessToken
        })
        return response
    } catch (error) {
        console.log(error)
        alert('Algo deu errado, tente novamente mais tarde...')
    }
}