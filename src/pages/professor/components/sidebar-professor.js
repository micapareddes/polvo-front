import { ROUTES } from '/src/utils/routes.js'
import { Sidebar } from '/src/components/sidebar.js'
import { getProfessorDisciplinas } from '../service/getProfessorDisciplinas.js'

const disciplinas = await getProfessorDisciplinas()
export const painelItems = disciplinas.map((disciplina) => {
    return {
        name: disciplina.nome,
        linkPainel: ROUTES.PROFESSOR.DISCIPLINA(disciplina._id)
    }
})
export function SidebarProfessor(size='lg') {
    const currentUrl = window.location.href
    return Sidebar({
        size,
        items: [
            {
                icon: 'house',
                title: 'Dashboard',
                accordion: true,
                accordionOptions: [
                    { name: 'Visão geral', linkPainel: ROUTES.PROFESSOR.DASHBOARD },
                    ...painelItems,
                ],
                active: currentUrl.includes('dashboard') || currentUrl.includes('disciplina')
            },
            {
                icon: 'file-plus',
                title: 'Criar quiz',
                link: ROUTES.PROFESSOR.QUIZ.CREATE,
                active: currentUrl.includes('create')
            },
        ],
        changePassword: true,
    })
}