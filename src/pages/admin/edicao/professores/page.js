// Services and others
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { getDisciplinas } from '/src/pages/admin/service/getDisciplinas.js'
import { cadastroUserValidation } from '/src/validations/cadastroUserValidation.js'
// Functions
import { getUrlParam } from '/src/functions/getUrlParam.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { saveOriginalValues } from '/src/pages/admin/functions/saveOriginalValues.js'
import { obtainOriginalValuesFromStorage } from '/src/pages/admin/functions/obtainOriginalValuesFromStorage.js'
import { removeOriginalValuesFromStorage } from '/src/pages/admin/functions/removeOriginalValuesFromStorage.js'
import { arraysSaoIguais } from '/src/functions/arraysSaoIguais.js'
// Components
import { Heading } from '/src/components/heading.js'
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Button } from '/src/components/button.js'
import { TextInput } from '/src/components/text-input.js'
import { MultiSelect } from '/src/components/multi-select.js'
import { InfoToaster, ErrorToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { ErrorMessage } from '/src/components/error-message.js'

async function handleSubmit(e) {
    e.preventDefault()

    const form = e.target
    const multiselect = form.querySelector('#multiselect')
    const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
    const selectedDisciplinasArray = Array.from(selectedDisciplinas)
    const nameInput = form.querySelector('#name')
    const matriculaInput = form.querySelector('#matricula')
    const emailInput = form.querySelector('#email')
    const nameInputContainer = form.querySelector('#name-container')
    const matriculaInputContainer = form.querySelector('#matricula-container')
    const emailInputContainer = form.querySelector('#email-container')
    const submitButton = form.querySelector('#submit')
    const { nome, email, matricula, disciplinas } = obtainOriginalValuesFromStorage()
    const editedData = {
        nome: nameInput.value.trim(),
        matricula: matriculaInput.value.trim(),
        email: emailInput.value.trim(),
    }
    const editedDisciplinas = selectedDisciplinasArray.map((disciplina) => {
        return disciplina.value
    })
    const { success, error } = cadastroUserValidation(editedData)

    if (!success) {
        if (error.emailValidation) {
            emailInput.classList.add('border-red-500')
            emailInputContainer.appendChild(
                ErrorMessage('Formato de email inválido.')
            )
        }
        if (error.matriculaValidation) {
            matriculaInput.classList.add('border-red-500')
            matriculaInputContainer.appendChild(
                ErrorMessage('Matricula deve ter extamanete 6 números.')
            )
        }
        if (error.nameValidation) {
            nameInput.classList.add('border-red-500')
            nameInputContainer.appendChild(
                ErrorMessage('O nome deve conter pelo menos 3 caracteres.')
            )
        }

        submitButton.disabled = true
        return
    }
    
    const disciplinasMudaram = () => {
        if (disciplinas.length !== editedDisciplinas.length) return true
        return disciplinas.every(i1 => editedDisciplinas.some(i2 => i1.id !== i2))
    }

    const dataMudou = nome !== editedData.nome  || email !== editedData.email  || matricula !== editedData.matricula
    const formMudou = dataMudou || disciplinasMudaram()


    if (!formMudou) {
        openToaster(
            InfoToaster({
                message: 'Não foi feita nenhuma alteração para salvar.',
            })
        )
        closeToaster()

        return
    }

    try {
        const id = getUrlParam('id')
        const accessToken = localStorage.getItem('accessToken')
        if (dataMudou) await makeRequest({ 
            url: API_ENDPOINTS.PATCH_USER(id), 
            method:'PATCH', 
            token: accessToken,
            data: editedData,
        })
        if (disciplinasMudaram) await makeRequest({ 
            url: API_ENDPOINTS.PATCH_DISCIPLINA_POFESSOR_BY_ID(id), 
            method:'PATCH', 
            token: accessToken,
            data: editedDisciplinas 
        })
        removeOriginalValuesFromStorage()
        localStorage.setItem('professorAlterado', editedData.nome)
        navigateTo(ROUTES.ADMIN.PAINEL.PROFESSORES) 
    } catch (error) {
        if (error.status === 403) {
            alert('Acesso Proibido')
            localStorage.removeItem('accessToken')
            navigateTo(ROUTES.LOGIN)
        } else if (error.status === 2410) { 
            openToaster(
                ErrorToaster({ message: error.message })
            )
            closeToaster()
            
            submitButton.disabled = true
        } else {
            console.log(error);
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}

function handleChange(event) { //TODO: reset error handler
    const form = event.target.form
    const input = form.querySelector('input')
    const submitButton = form.querySelector('#submit')
    const errorMessage = form.querySelector('#error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('border-red-500')
    }
    submitButton.disabled = false
}

async function EdicaoCadastroPage() {
try {
    verifyUserAccess('admin')
    const id = getUrlParam('id')
    if (!id) {
        navigateTo(ROUTES.ADMIN.PAINEL.PROFESSORES)
        return
    }

    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')
    const disciplinasCadastradas = await getDisciplinas()
    const { nome, matricula, email, disciplinas } = await makeRequest({ 
        url: API_ENDPOINTS.GET_PROFESSOR_WITH_DISCIPLINA(id), 
        method:'GET', 
        token: localStorage.getItem('accessToken') 
    })
    const disciplinasIds = new Set(disciplinas.map(disciplina => disciplina.id))

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
            optionsArray: disciplinasCadastradas,
            tooltip: 'Devem existir disciplinas cadastradas, logo o campo é opcional.'
        })
    )
    buttonContainer.appendChild(
        Button({
            id: 'submit',
            variant: 'primary',
            size: 'lg',
            title: 'Salvar alterações',
            type: 'submit',
            ariaLabel: 'Botão de submit para salvar alterações'
        })
    )
    form.append(inputsContainer, buttonContainer)
    main.append(    
        Heading({
            goBack: true, 
            title: 'Edição do Professor', 
            onGoBack: () => {
                const nameInput = form.querySelector('#name')
                const matriculaInput = form.querySelector('#matricula')
                const emailInput = form.querySelector('#email')
                const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
                const selectedDisciplinasArray = Array.from(selectedDisciplinas)
                const editedDisciplinas = selectedDisciplinasArray.map((disciplina) => {
                    return {
                        nome: disciplina.getAttribute('data-label'),
                        id: disciplina.value,
                    }
                })
                const disciplinasMudaram = !arraysSaoIguais(editedDisciplinas, disciplinas)
                if (nome !== nameInput.value.trim()  || email !== emailInput.value.trim()  || matricula !== matriculaInput.value.trim() || disciplinasMudaram) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => history.back()
                        })
                    )
                    return
                }
                history.back()
            }
        }),
        form
    )

    const nameInput = form.querySelector('#name')
    const matriculaInput = form.querySelector('#matricula')
    const emailInput = form.querySelector('#email')
    const multiselect = form.querySelector('#multiselect')
    const options = multiselect.querySelectorAll('#option')
    nameInput.value = nome
    matriculaInput.value = matricula
    emailInput.value = email
    options.forEach((option) => {
        if (disciplinasIds.has(option.value)) {
            option.checked = true
            const event = new Event('change', { bubbles: true })
            option.dispatchEvent(event)
        }
    })

    saveOriginalValues({
        nome,
        matricula,
        email,
        disciplinas,
    })

    form.onsubmit = handleSubmit
    form.oninput = handleChange

    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })

} catch (error) { //TODO: Adicionar tratamento de erros
    console.log(error);
    alert('Algo deu errado...')
}
}
EdicaoCadastroPage()