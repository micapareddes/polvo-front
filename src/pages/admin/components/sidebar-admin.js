import { ROUTES } from '/src/utils/routes.js'
import { Sidebar } from '/src/components/sidebar.js'
export const painelItems = [
    {
        name: 'Alunos',
        linkPainel: ROUTES.ADMIN.PAINEL.ALUNOS,
        linkCadastro: ROUTES.ADMIN.CADASTRO.ALUNOS,
    },{
        name: 'Professor',
        linkPainel: ROUTES.ADMIN.PAINEL.PROFESSORES,
        linkCadastro: ROUTES.ADMIN.CADASTRO.PROFESSORES,
    },{
        name: 'Disciplinas',
        linkPainel: ROUTES.ADMIN.PAINEL.DISCIPLINAS,
        linkCadastro: ROUTES.ADMIN.CADASTRO.DISCIPLINAS,
    },
]
export function SidebarAdmin() {
    return Sidebar({
        size: 'lg',
        items: [
            {
                icon: 'house',
                title: 'Dashboard',
                link: ROUTES.ADMIN.DASHBOARD,
                active: true,
            },
            {
                icon: 'books',
                title: 'Painel',
                accordion: true,
                accordionOptions: painelItems,
            },
        ],
        changePassword: true,
    })
}