// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { parseProfessores } from '/src/functions/parseProfessores.js'
import { cadastroDisciplinaValidation } from '/src/validations/cadastroDisciplinaValidation.js'

// Components
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Heading } from '/src/components/heading.js'
import { Button } from '/src/components/button.js'
import { TextInput } from '/src/components/text-input.js'
import { Select } from '/src/components/select.js'
import { SuccessToaster, ErrorToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { ErrorMessage } from '/src/components/error-message.js'

function handleChange(event) {
    const form = event.target.form
    const input = form.querySelector('#name')
    const submitButton = form.querySelector('#submit')
    const errorMessage = form.querySelector('#error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('border-red-500')
        submitButton.disabled = false
    }
}
async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target
    const select = form.querySelector('select')
    const input = form.querySelector('input')
    const inputsContainer = form.querySelector('#name-container')
    const submitButton = form.querySelector('#submit')
    const professor_id = select.value
    const nomeDisciplina = input.value
    const data = {
        'nome': nomeDisciplina,
        'professor_id': professor_id,
    }
    
    const { success } = cadastroDisciplinaValidation(nomeDisciplina)

    if (!success) {
        input.classList.add('border-red-500')
        inputsContainer.appendChild(
            ErrorMessage('O nome deve conter pelo menos 3 caracteres')
        )
        submitButton.disabled = true
        return
    }

    try {
        await makeRequest({ 
            url: API_ENDPOINTS.POST_DISCIPLINA, 
            method: 'POST', 
            token: localStorage.getItem('accessToken'), 
            data,
        })
        form.reset()
        select.selectedIndex = 0
        openToaster(
            SuccessToaster({
                message: `Disciplina "${nomeDisciplina}" cadastrada!`
            })
        )
        closeToaster()
        
    } catch (error) {
        console.log(error);
        
        if (error.status === 2409) {
            openToaster(
                ErrorToaster({
                    message: 'Disciplina já cadastrada!'
                })
            )
            closeToaster()
        } else {
            alert('Algo deu errado...')
        }
    }
}

async function CadastroDisciplinaPage() {
    verifyUserAccess('admin')
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')
    const professores = await makeRequest( { 
        url: API_ENDPOINTS.GET_PROFESSORES, 
        method:'GET', 
        token: localStorage.getItem('accessToken')
    })
    const professoresFormatados = parseProfessores(professores)

    inputsContainer.className = 'md:grid md:grid-cols-2 gap-8 space-y-8 md:space-y-0 items-start mt-10'
    buttonContainer.className = 'mt-auto text-center'
    form.className = 'h-full grid'

    root.prepend(SidebarAdmin())
    inputsContainer.append(
        TextInput({
            id: 'name', 
            labelName: 'Nome',
            placeholder: 'Nome da Disciplina' 
        }),
        Select({
            id: 'professor',
            labelName: 'Professor',
            placeholder: 'Selecione um professor',
            emptyOption: 'Nenhum professor',
            options: professoresFormatados,
            tooltip: true,
            tooltipMessage: 'Devem existir professores cadastrados para adicionar na disciplina, logo o campo é opcional.'
        })
    )
    buttonContainer.appendChild(
        Button({
            id: 'submit',
            variant: 'primary',
            size: 'lg',
            title: 'Cadastrar',
            type: 'submit',
            ariaLabel: 'Botão de submit para cadastrar'
        })
    )
    form.append(inputsContainer, buttonContainer)
    main.append(    
        Heading({
            goBack: true, 
            title: 'Cadastro da Disciplina', 
            onGoBack: () => {
                if (form.querySelector('input').value) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => navigateTo(ROUTES.ADMIN.PAINEL.DISCIPLINAS)
                        })
                    )
                    return
                }
                navigateTo(ROUTES.ADMIN.PAINEL.DISCIPLINAS)
            }
        }),
        form
    )
    
    form.onsubmit = handleSubmit
    form.oninput = handleChange
    loader.classList.add('hidden')

}
CadastroDisciplinaPage()