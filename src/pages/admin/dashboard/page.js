// Functions
import { API_ENDPOINTS } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { removeOriginalValuesFromStorage } from '/src/pages/admin/functions/removeOriginalValuesFromStorage.js'

// Components
import { Heading } from '/src/components/heading.js'
import { SidebarAdmin, painelItems } from '/src/pages/admin/components/sidebar-admin.js'
import { RegisterListItem } from '/src/pages/admin/dashboard/components/registerListItem.js'


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

    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })

}

PageDashboard()