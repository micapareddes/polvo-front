import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { API_ENDPOINTS } from '/frontend/src/utils/routes.js'

export async function getProfessorDisciplinas() {
    try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await makeRequest({ 
            url: API_ENDPOINTS.GET_DISCIPLINAS_PROFESSOR, 
            method:'GET', 
            token: accessToken
        })
        return response
    } catch (error) {
        console.log(error)
        alert('Algo deu errado, tente novamente mais tarde...')
    }
}