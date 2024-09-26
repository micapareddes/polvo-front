// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { removeOriginalValuesFromStorage } from '/src/pages/admin/functions/removeOriginalValuesFromStorage.js'

// Components
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Heading } from '/src/components/heading.js'
import { ProfessorTable } from './components/professor-table.js'
import { Button } from '/src/components/button.js'
import { Empty } from '/src/components/empty.js'
import { SuccessToaster, openToaster, closeToaster } from '/src/components/toaster.js'

async function ProfessoresPage() {
try {
    verifyUserAccess('admin')
    removeOriginalValuesFromStorage()
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const header = document.createElement('div')
    const accessToken = localStorage.getItem('accessToken')

    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })

    const professores = await makeRequest( { 
        url: API_ENDPOINTS.GET_ALL_PROFESSORES_WITH_DISCIPLINAS, 
        method:'GET', 
        token: accessToken
    })
    const quantidadeProfessores = professores.length
    
    header.className = 'flex flex-col gap-4 md:flex-row justify-between items-start mb-10'
    header.append(        
        Heading({
            goBack: true, 
            onGoBack: () => history.back(),
            title: 'Professores', 
            subtitle: `${quantidadeProfessores} cadastrados`,
            subtitleSize: 'lg',
        }),
        Button({
            variant: 'primary',
            size: 'md',
            title: 'Cadastrar',
            ariaLabel: 'Botão para cadastrar novo professor',
            icon: 'file-plus',
            link: ROUTES.ADMIN.CADASTRO.PROFESSORES
        })
    )
    root.prepend(SidebarAdmin())

    main.append(header)

    if (quantidadeProfessores === 0) {
        main.appendChild(
            Empty('Não há professores cadastrados.')
        )
    } else {
        main.appendChild(
            ProfessorTable(professores)
        )
        const professorAlterado = localStorage.getItem('professorAlterado')
        if (professorAlterado) {
            openToaster(
                SuccessToaster({
                    message: `Alterações do aluno "${professorAlterado}" salvas!`
                })
            )
            closeToaster()
            localStorage.removeItem('professorAlterado')
        }
    }
    
} catch (error) {
    console.log(error);
    
    if (error.status === 403) {
        alert('Acesso Proibido')
        redirectTo404()
    } else {
        alert('Algo deu errado...')
    }
}
}
ProfessoresPage()