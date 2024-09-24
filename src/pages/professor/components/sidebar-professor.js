import { ROUTES } from '/frontend/src/utils/routes.js'
import { Sidebar } from '/frontend/src/components/sidebar.js'
import { getProfessorDisciplinas } from '../service/getProfessorDisciplinas.js'

const disciplinas = await getProfessorDisciplinas()
export const painelItems = disciplinas.map((disciplina) => {
    return {
        name: disciplina.nome,
        linkPainel: ROUTES.PROFESSOR.DISCIPLINA(disciplina._id)
    }
})
export function SidebarProfessor(size='lg') {
    return Sidebar({
        size,
        items: [
            {
                icon: 'house',
                title: 'Dashboard',
                link: ROUTES.PROFESSOR.DASHBOARD,
                active: true,
            },
            {
                icon: 'books',
                title: 'Painel',
                accordion: true,
                accordionOptions: painelItems,
            },
            {
                icon: 'file-plus',
                title: 'Criar quiz',
                link: ROUTES.PROFESSOR.QUIZ.CREATE,
            },
        ],
        changePassword: true,
    })
}