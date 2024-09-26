// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { removeOriginalValuesFromStorage } from '/src/pages/admin/functions/removeOriginalValuesFromStorage.js'

// Components
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Heading } from '/src/components/heading.js'
import { AlunoTable } from './components/aluno-table.js'
import { Button } from '/src/components/button.js'
import { Empty } from '/src/components/empty.js'
import { SuccessToaster, openToaster, closeToaster } from '/src/components/toaster.js'

async function AlunosPage() {
try {
    verifyUserAccess('admin')
    removeOriginalValuesFromStorage()
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const header = document.createElement('div')
    const accessToken = localStorage.getItem('accessToken')
    const alunos = await makeRequest( { 
        url: API_ENDPOINTS.GET_ALL_STUDENTS_WITH_DISCIPLINAS, 
        method:'GET', 
        token: accessToken
    })
    const quantidadeAlunos = alunos.length
    
    header.className = 'flex flex-col gap-4 md:flex-row justify-between items-start mb-10'
    header.append(        
        Heading({
            goBack: true, 
            onGoBack: () => history.back(),
            title: 'Alunos', 
            subtitle: `${quantidadeAlunos} cadastradas`,
            subtitleSize: 'lg',
        }),
        Button({
            variant: 'primary',
            size: 'md',
            title: 'Cadastrar',
            ariaLabel: 'Botão para cadastrar novo aluno',
            icon: 'file-plus',
            link: ROUTES.ADMIN.CADASTRO.ALUNOS
        })
    )
    root.prepend(SidebarAdmin())

    main.append(header)

    if (quantidadeAlunos === 0) {
        main.appendChild(
            Empty('Não há alunos cadastrados.')
        )
    } else {
        main.appendChild(
            AlunoTable(alunos)
        )
        const alunoAlterado = localStorage.getItem('alunoAlterado')
        if (alunoAlterado) {
            openToaster(
                SuccessToaster({
                    message: `Alterações do aluno "${alunoAlterado}" salvas!`
                })
            )
            closeToaster()
            localStorage.removeItem('alunoAlterado')
        }
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })

} catch (error) {
    console.log(error);
    if (error.status === 403) {
        alert('Acesso Proibido')
        navigateTo(ROUTES.ERROR404)
    } else {
        alert('Algo deu errado...')
    }
}
}
AlunosPage()