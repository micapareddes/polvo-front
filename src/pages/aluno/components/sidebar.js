import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { Sidebar } from '/src/components/sidebar.js'

const disciplinas = await makeRequest({
    url: API_ENDPOINTS.GET_DISCIPLINAS_ALUNO, 
    method:'GET', 
    token: localStorage.getItem('accessToken')
})

export const painelItems = disciplinas.map((disciplina) => {
    return {
        name: disciplina.disciplina_nome,
        linkPainel: ROUTES.ALUNO.DISCIPLINA(disciplina.disciplina_id)
    }
})

export function SidebarAluno(size='lg') {
    return Sidebar({
        size: size,
        items: [
            {
                icon: 'house',
                title: 'Dashboard',
                link: ROUTES.ALUNO.DASHBOARD,
                active: true,
            },
            {
                icon: 'books',
                title: 'Disciplinas',
                accordion: true,
                accordionOptions: painelItems,
            },
        ],
        changePassword: true,
    })
}