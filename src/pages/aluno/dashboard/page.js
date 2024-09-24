// Functions
import { API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { verifyUserAccess } from '/frontend/src/auth/verifyUserAccess.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
// Components
import { Heading } from '/frontend/src/components/heading.js'
import { SidebarAluno, painelItems } from '/frontend/src/pages/aluno/components/sidebar.js'
import { Title } from '/frontend/src/components/fonts.js'
import { Empty } from '/frontend/src/components/empty.js'
import { ListItemBoxWithTitle } from '/frontend/src/components/list.js'

async function PageDashboard() {
    verifyUserAccess('aluno')
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const nav = document.createElement('nav')
    const ul = document.createElement('ul')

    root.prepend(SidebarAluno())
    
    try {
        const name = await makeRequest( { 
            url: API_ENDPOINTS.GET_USER_NAME, 
            method:'GET', 
            token: localStorage.getItem('accessToken')
        })
        main.prepend(
            Heading({ 
                goBack: false, 
                title: 'Dashboard', 
                subtitle: `Bem vindo, ${name}!`,
                subtitleSize: '2xl'
            })
        )
    } catch (error) {
        alert('Algo deu errado... Encerre a sessão e tente novamente.')
    }

    if (painelItems.length === 0) {
        main.appendChild(
            Empty('Você não está cadastrado em nenhuma disciplina ainda.')
        )
    } else {
        ul.className = 'space-y-2'
        main.appendChild(
            Title({
                title: 'Disciplinas',
                size: 'lg',
                tone: 's-700',
                as: 'h3',
                className: 'mt-10 mb-2',
            })
        )
        painelItems.forEach( item => {
            ul.appendChild(
                ListItemBoxWithTitle({
                    title: item.name,
                    linkPainel: item.linkPainel,
                })
            )}
        )
        nav.appendChild(ul)
        main.appendChild(nav)
    }

}

PageDashboard()