// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { parseProfessores } from '/src/functions/parseProfessores.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { removeOriginalValuesFromStorage } from '/src/pages/admin/functions/removeOriginalValuesFromStorage.js'
import { saveOriginalValues } from '/src/pages/admin/functions/saveOriginalValues.js'
import { obtainOriginalValuesFromStorage } from '/src/pages/admin/functions/obtainOriginalValuesFromStorage.js'
import { cadastroDisciplinaValidation } from '/src/validations/cadastroDisciplinaValidation.js'
import { makeRequest } from '/src/functions/makeRequest.js'

// Components
import { Heading } from '/src/components/heading.js'
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Button } from '/src/components/button.js'
import { TextInput } from '/src/components/text-input.js'
import { Select } from '/src/components/select.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { InfoToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { ErrorMessage } from '/src/components/error-message.js'
import { QuizTable } from './components/quiz-table.js'
import { Title, Text } from '/src/components/fonts.js'

async function handleSubmit(e) {
    e.preventDefault()

    const form = e.target
    const inputContainer = form.querySelector('#name-container')
    const input = form.querySelector('input')
    const select = form.querySelector('select')
    const submitButton = form.querySelector('#submit')
    const { nome, professorId } = obtainOriginalValuesFromStorage()
    const professor_id = professorId === null ? 'null' : professorId
    let editedData = {
        nome: input.value.trim(),
        professor_id: !select.value.trim() ? 'null' : select.value.trim()
    }

    const { success } = cadastroDisciplinaValidation(editedData.nome)
    if (!success) {
        input.classList.add('border-red-500')
        inputContainer.appendChild(
            ErrorMessage('O nome deve conter pelo menos 3 caracteres')
        )
        submitButton.disabled = true
        return
    }
    
    const formMudou = nome !== editedData.nome  || professor_id !== editedData.professor_id

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
        const accessToken = localStorage.getItem('accessToken')
        const id = getUrlParam('id')
        await makeRequest({ 
            url: API_ENDPOINTS.PATCH_DISCIPLINA_BY_ID(id), 
            method:'PATCH', 
            data: editedData, 
            token: accessToken 
        })
        removeOriginalValuesFromStorage()
        localStorage.setItem('disciplinaAlterada', editedData.nome)
        navigateTo(ROUTES.ADMIN.PAINEL.DISCIPLINAS) 
    } catch (error) {
        if (error.status === 403) {
            alert('Acesso Proibido')
            localStorage.removeItem('accessToken')
            navigateTo('/src/pages/login.html')
        } else {
            console.log(error);
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}

function handleChange(event) {
    const form = event.target.form
    const input = form.querySelector('input')
    const submitButton = form.querySelector('#submit')
    const errorMessage = form.querySelector('#error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('border-red-500')
        submitButton.disabled = false
    }
}

async function EdicaoCadastroPage() {
try {
    verifyUserAccess('admin')
    const id = getUrlParam('id')
    if (!id) {
        navigateTo(ROUTES.ADMIN.PAINEL.DISCIPLINAS)
        return
    }

    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')
    const contentContainer = document.createElement('div')
    const accessToken = localStorage.getItem('accessToken')
    const professores = await makeRequest( { 
        url: API_ENDPOINTS.GET_PROFESSORES, 
        method:'GET', 
        token: accessToken,
    })
    const professoresFormatados = parseProfessores(professores)
    const { nome, professor_id, quizes } = await makeRequest({ 
        url: API_ENDPOINTS.GET_DISCIPLINA(id), 
        method:'GET', 
        token: accessToken, 
    })
    
    inputsContainer.className = 'md:grid md:grid-cols-2 gap-8 space-y-8 md:space-y-0 items-start mt-10'
    buttonContainer.className = 'mt-auto text-center'
    form.className = 'h-full grid'
    contentContainer.className = ''

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
            title: 'Salvar alterações',
            type: 'submit',
            ariaLabel: 'Botão de submit para salvar alterações'
        })
    )
    contentContainer.append(
        inputsContainer, 
        Title({
            title: 'Quizzes', 
            size: 'md', 
            tone: 's-900', 
            bold: 'regular', 
            as: 'h3', 
            className: 'mt-8' 
        })
    )

    if (quizes.length > 0) {
        contentContainer.appendChild(
            QuizTable(quizes)
        )
    } else {
        contentContainer.appendChild(
            Text({
                text: 'Nenhum quiz cadastrado.',
                className: 'pt-6',
                tone: 's-400'
            })
        )  
    }
    form.append(contentContainer, buttonContainer)
    main.append(    
        Heading({
            goBack: true, 
            onGoBack: () => {
                const input = form.querySelector('input')
                const select = form.querySelector('select')
                const professorId = professor_id === null ? 'null' : professor_id
                
                if (nome !== input.value.trim()  || professorId !== select.value.trim()) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => {
                                removeOriginalValuesFromStorage()
                                history.back()
                            }
                        })
                    )
                    return
                }
                removeOriginalValuesFromStorage()
                history.back()
            },
            title: 'Edição da Disciplina', 
        }),
        form
    )

    const input =  form.querySelector('input')
    const select = form.querySelector('select')
    input.value = nome
    select.value = String(professor_id)

    saveOriginalValues({ nome, professorId: professor_id })

    form.onsubmit = handleSubmit
    form.oninput = handleChange
    loader.classList.add('hidden')
    
} catch (error) { //TODO: Adicionar tratamento de erros
    console.log(error);
    alert('Algo deu errado, tente novamente mais tarde...')
}
}
EdicaoCadastroPage()