// Functions
import { API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { verifyUserAccess } from '/frontend/src/auth/verifyUserAccess.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { removeOriginalValuesFromStorage } from '/frontend/src/pages/admin/functions/removeOriginalValuesFromStorage.js'

// Components
import { Heading } from '/frontend/src/components/heading.js'
import { SidebarAdmin, painelItems } from '/frontend/src/pages/admin/components/sidebar-admin.js'
import { RegisterListItem } from '/frontend/src/pages/admin/dashboard/components/registerListItem.js'


async function PageDashboard() {
    verifyUserAccess('admin')
    removeOriginalValuesFromStorage()
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const painel = document.getElementById('painel')

    root.prepend(SidebarAdmin())
    
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

    painelItems.forEach((item) => {
        painel.appendChild(
            RegisterListItem({ 
                name: item.name,
                registerLink: item.linkCadastro,
                linkPainel: item.linkPainel,
            })
        )
    })

}

PageDashboard()