import { ROUTES } from '/src/utils/routes.js'
import { Sidebar } from '/src/components/sidebar.js'
export const painelItems = [
    {
        name: 'Alunos',
        linkPainel: ROUTES.ADMIN.PAINEL.ALUNOS,
        linkCadastro: ROUTES.ADMIN.CADASTRO.ALUNOS,
    },{
        name: 'Professores',
        linkPainel: ROUTES.ADMIN.PAINEL.PROFESSORES,
        linkCadastro: ROUTES.ADMIN.CADASTRO.PROFESSORES,
    },{
        name: 'Disciplinas',
        linkPainel: ROUTES.ADMIN.PAINEL.DISCIPLINAS,
        linkCadastro: ROUTES.ADMIN.CADASTRO.DISCIPLINAS,
    },
]
export function SidebarAdmin() {
    const currentUrl = window.location.href
    return Sidebar({
        size: 'lg',
        items: [
            {
                icon: 'house',
                title: 'Dashboard',
                accordion: true,
                accordionOptions: [
                    { name: 'Visão geral', linkPainel: ROUTES.ADMIN.DASHBOARD },
                    ...painelItems,
                ],
                active: currentUrl.includes('dashboard') || currentUrl.includes('painel')
            },
        ],
        changePassword: true,
    })
}