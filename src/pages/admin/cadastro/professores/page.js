// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { cadastroUserValidation } from '/src/validations/cadastroUserValidation.js'

// Components
import { Heading } from '/src/components/heading.js'
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Button } from '/src/components/button.js'
import { TextInput } from '/src/components/text-input.js'
import { SuccessToaster, ErrorToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { ErrorMessage } from '/src/components/error-message.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { MultiSelect } from '/src/components/multi-select.js'

function handleInput(event) {
    const form = event.target.form
    const nameInput = form.querySelector('#name')
    const matriculaInput = form.querySelector('#matricula')
    const emailInput = form.querySelector('#email')
    const submitButton = form.querySelector('#submit')
    const errorMessage = form.querySelectorAll('#error-message')
    
    if (errorMessage) {
        nameInput.classList.remove('border-red-500')
        matriculaInput.classList.remove('border-red-500')
        emailInput.classList.remove('border-red-500')
        errorMessage.forEach((error) => error.remove())
        submitButton.disabled = false
    }
}

async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target
    const multiselect = form.querySelector('#multiselect')
    const selectedDisciplinasOnContainer = multiselect.querySelectorAll('.selected-item')
    const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
    const nameInput = form.querySelector('#name')
    const matriculaInput = form.querySelector('#matricula')
    const emailInput = form.querySelector('#email')
    const nameInputContainer = form.querySelector('#name-container')
    const matriculaInputContainer = form.querySelector('#matricula-container')
    const emailInputContainer = form.querySelector('#email-container')
    const submitButton = form.querySelector('#submit')
    const selectedDisciplinasArray = Array.from(selectedDisciplinas)
    const data = {
        nome: nameInput.value,
        papel: 'professor',
        email: emailInput.value,
        matricula: matriculaInput.value,
    }
    const disciplinasData = {
        matricula: data.matricula,
        disciplinas: selectedDisciplinasArray.map((disciplina) => {
            return {
                id: disciplina.value,
            }
        })
    }
    
    const { success, error } = cadastroUserValidation(data)

    if (!success) {
        if (error.emailValidation) {
            emailInput.classList.add('border-red-500')
            emailInputContainer.appendChild(
                ErrorMessage('Insira um email valido.')
            )
        }
        if (error.matriculaValidation) {
            matriculaInput.classList.add('border-red-500')
            matriculaInputContainer.appendChild(
                ErrorMessage('Insira uma matricula de 6 números.')
            )
        }
        if (error.nameValidation) {
            nameInput.classList.add('border-red-500')
            nameInputContainer.appendChild(
                ErrorMessage('Insira um nome valido.')
            )
        }

        submitButton.disabled = true
        return
    }

    try {
        const accessToken = localStorage.getItem('accessToken')
        await makeRequest({ 
            url: API_ENDPOINTS.POST_USER, 
            method: 'POST', 
            token: accessToken, 
            data, 
        })
        if (selectedDisciplinasArray.length > 0) await makeRequest({ 
            url: API_ENDPOINTS.PATCH_PROFESSORES_TO_DISCIPLINAS, 
            method: 'PATCH', 
            token: accessToken, 
            data: disciplinasData, 
        })
        form.reset()
        selectedDisciplinasOnContainer.forEach((selected) => selected.remove())
        openToaster(
            SuccessToaster({
                message: `Professor "${data.nome}" cadastrado!`
            })
        )
        closeToaster()
        
    } catch (error) {
        console.log(error);
        
        if (error.status === 1409) { 
            openToaster(
                ErrorToaster({ message: 'Professor já foi cadastrado!' })
            )
            closeToaster()
            
            submitButton.disabled = true
        } else if (error.status === 2410) { 
            openToaster(
                ErrorToaster({ message: error.message })
            )
            closeToaster()
            
            submitButton.disabled = true
        } else {
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}

async function CadastroProfessorPage() {
try {
    verifyUserAccess('admin')
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')
    const accessToken = localStorage.getItem('accessToken')
    const disciplinas = await makeRequest({ 
        url: API_ENDPOINTS.GET_DISCIPLINAS_SEM_PROFESSOR, 
        method:'GET', 
        token: accessToken
    })
    
    inputsContainer.className = 'grid md:grid-cols-2 gap-8 items-start mt-10'
    buttonContainer.className = 'mt-auto text-center'
    form.className = 'flex flex-col h-full'

    root.prepend(SidebarAdmin())
    inputsContainer.append(
        TextInput({
            id: 'name', 
            labelName: 'Nome',
            placeholder: 'Nome do professor' 
        }),
        TextInput({
            id: 'matricula', 
            labelName: 'Matricula',
            placeholder: '000000' 
        }),
        TextInput({
            id: 'email', 
            labelName: 'Email',
            placeholder: 'email@email.com' 
        }),
        MultiSelect({
            labelName: 'Disciplinas',
            placeholder: 'Disciplinas do professor',
            optionsArray: disciplinas,
            tooltip: 'Devem existir disciplinas cadastradas, logo o campo é opcional.'
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
            title: 'Cadastro de Professor', 
            onGoBack: () => { 
                const multiselect = form.querySelector('#multiselect')
                const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
                const nameInput = form.querySelector('#name')
                const matriculaInput = form.querySelector('#matricula')
                const emailInput = form.querySelector('#email')
                
                if (selectedDisciplinas.length > 0 || nameInput.value || matriculaInput.value || emailInput.value) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => navigateTo(ROUTES.ADMIN.PAINEL.PROFESSORES)
                        })
                    )
                    return
                }
                navigateTo(ROUTES.ADMIN.PAINEL.PROFESSORES)
            }
        }),
        form
    )
    
    form.onsubmit = handleSubmit
    form.oninput = handleInput
    loader.classList.add('hidden')
}
catch(error) {
    console.log(error)
    alert('Algo deu errado...')
}
}
CadastroProfessorPage()