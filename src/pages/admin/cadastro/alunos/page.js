// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { cadastroUserValidation } from '/src/validations/cadastroUserValidation.js'
import { getDisciplinas } from '/src/pages/admin/service/getDisciplinas.js'
import { resetMultiselect } from '/src/functions/resetMultiselect.js'

// Components
import { SidebarAdmin } from '/src/pages/admin/components/sidebar-admin.js'
import { Heading } from '/src/components/heading.js'
import { Button } from '/src/components/button.js'
import { TextInput } from '/src/components/text-input.js'
import { MultiSelect } from '/src/components/multi-select.js'
import { SuccessToaster, ErrorToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { ErrorMessage } from '/src/components/error-message.js'

function handleChange(event) {
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
    const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
    const nameInput = form.querySelector('#name')
    const matriculaInput = form.querySelector('#matricula')
    const emailInput = form.querySelector('#email')
    const nameInputContainer = form.querySelector('#name-container')
    const matriculaInputContainer = form.querySelector('#matricula-container')
    const emailInputContainer = form.querySelector('#email-container')
    const submitButton = form.querySelector('#submit')
    const selectedDisciplinasArray = Array.from(selectedDisciplinas)
    const hasDisciplinas = selectedDisciplinasArray.length !== 0
    const data = {
        nome: nameInput.value,
        papel: 'aluno',
        email: emailInput.value,
        matricula: matriculaInput.value,
    }
    const disciplinasData = {
        matricula: data.matricula,
        disciplinas: selectedDisciplinasArray.map((disciplina) => {
            return {
                nome: disciplina.getAttribute('data-label'),
                id: disciplina.value,
            }
        })
    }
    
    const { success, error } = cadastroUserValidation(data)

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

    try {
        const accessToken = localStorage.getItem('accessToken')
        await makeRequest({ 
            url: API_ENDPOINTS.POST_USER, 
            method: 'POST', 
            token: accessToken, 
            data, 
        })
        if (hasDisciplinas) await makeRequest({ 
            url: API_ENDPOINTS.POST_STUDENT_RELATIONS, 
            method: 'POST', 
            token: accessToken, 
            data: disciplinasData, 
        })
        form.reset()
        resetMultiselect(selectedDisciplinas)
        openToaster(
            SuccessToaster({
                message: `Aluno "${data.nome}" cadastrado!`
            })
        )
        closeToaster()
        
    } catch (error) {
        if (error.status === 1409) { 
            openToaster(
                ErrorToaster({ message: 'Aluno já foi cadastrado!' })
            )
            closeToaster()
            
            submitButton.disabled = true
        } else {
            console.log(error);
            
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}

async function CadastroAlunoPage() {
    verifyUserAccess('admin')
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')
    const disciplinas = await getDisciplinas()

    inputsContainer.className = 'grid md:grid-cols-2 gap-8 items-start mt-10'
    buttonContainer.className = 'mt-auto text-center'
    form.className = 'flex flex-col h-full'

    root.prepend(SidebarAdmin())
    inputsContainer.append(
        TextInput({
            id: 'name', 
            labelName: 'Nome',
            placeholder: 'Nome do aluno' 
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
            placeholder: 'Disciplinas do aluno',
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
            title: 'Cadastro do Aluno', 
            onGoBack: () => {
                const multiselect = form.querySelector('#multiselect')
                const selectedDisciplinas = multiselect.querySelectorAll('#option:checked')
                const nameInput = form.querySelector('#name')
                const matriculaInput = form.querySelector('#matricula')
                const emailInput = form.querySelector('#email')
                
                if (selectedDisciplinas.length > 0 || nameInput.value || matriculaInput.value || emailInput.value ) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => navigateTo(ROUTES.ADMIN.PAINEL.ALUNOS)
                        })
                    )
                    return
                }
                navigateTo(ROUTES.ADMIN.PAINEL.ALUNOS)
            }
        }),
        form
    )
    
    form.onsubmit = handleSubmit
    form.oninput = handleChange
    loader.classList.add('hidden')
    
}
CadastroAlunoPage()