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
                link: ROUTES.PROFESSOR.DASHBOARD,
                active: currentUrl.includes('dashboard'),
            },
            {
                icon: 'books',
                title: 'Painel',
                accordion: true,
                accordionOptions: painelItems,
                active: currentUrl.includes('disciplina')
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