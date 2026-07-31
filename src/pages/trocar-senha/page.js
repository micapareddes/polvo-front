// Functions
import { API_ENDPOINTS, ROUTES } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { redirectToUserDashboard } from '/src/functions/redirectToUserDashboard.js'
import { trocarSenhaValidation } from '/src/validations/trocarSenhaValidation.js'

// Components
import { Heading } from '/src/components/heading.js'
import { Button } from '/src/components/button.js'
import { PasswordInput } from '/src/components/password-input.js'
import { SuccessToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { openDialog, AlertDialog } from '/src/components/dialog.js'
import { ErrorMessage } from '/src/components/error-message.js'

function handleChange(event) {
    const form = event.target.form
    const senhaAtualContainer = form.querySelector('#senhaAtual-container')
    const novaSenhaContainer = form.querySelector('#novaSenha-container')
    const confirmarSenhaContainer = form.querySelector('#confirmarSenha-container')
    const novaSenhaInput = form.querySelector('#novaSenha')
    const confirmarSenhaInput = form.querySelector('#confirmarSenha')
    const submitButton = form.querySelector('#submit')

    form.querySelectorAll('#error-message').forEach((error) => error.remove())
    senhaAtualContainer.classList.remove('border-red-500')
    novaSenhaContainer.classList.remove('border-red-500')
    confirmarSenhaContainer.classList.remove('border-red-500')
    submitButton.disabled = false

    if (novaSenhaInput.value && confirmarSenhaInput.value && novaSenhaInput.value !== confirmarSenhaInput.value) {
        novaSenhaContainer.classList.add('border-red-500')
        confirmarSenhaContainer.classList.add('border-red-500')
        form.querySelector('#field-confirmarSenha').appendChild(
            ErrorMessage('As senhas não coincidem.')
        )
        submitButton.disabled = true
    }
}

async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target
    const senhaAtualInput = form.querySelector('#senhaAtual')
    const novaSenhaInput = form.querySelector('#novaSenha')
    const confirmarSenhaInput = form.querySelector('#confirmarSenha')
    const senhaAtualContainer = form.querySelector('#senhaAtual-container')
    const novaSenhaContainer = form.querySelector('#novaSenha-container')
    const confirmarSenhaContainer = form.querySelector('#confirmarSenha-container')
    const submitButton = form.querySelector('#submit')
    const data = {
        senhaAtual: senhaAtualInput.value,
        novaSenha: novaSenhaInput.value,
        confirmarSenha: confirmarSenhaInput.value,
    }

    const { success, error } = trocarSenhaValidation(data)

    if (!success) {
        if (error.senhaAtualValidation) {
            senhaAtualContainer.classList.add('border-red-500')
        }
        if (error.novaSenhaValidation) {
            novaSenhaContainer.classList.add('border-red-500')
            form.querySelector('#field-novaSenha').appendChild(
                ErrorMessage('A nova senha deve conter pelo menos 6 caracteres.')
            )
        }
        if (error.senhasIguaisValidation) {
            novaSenhaContainer.classList.add('border-red-500')
            confirmarSenhaContainer.classList.add('border-red-500')
            form.querySelector('#field-confirmarSenha').appendChild(
                ErrorMessage('As senhas não coincidem.')
            )
        }
        submitButton.disabled = true
        return
    }

    try {
        await makeRequest({
            url: API_ENDPOINTS.PATCH_ALTERAR_SENHA,
            method: 'PATCH',
            token: localStorage.getItem('accessToken'),
            data: { senhaAtual: data.senhaAtual, novaSenha: data.novaSenha },
        })
        form.reset()
        openToaster(
            SuccessToaster({ message: 'Senha alterada com sucesso!' })
        )
        closeToaster()
    } catch (error) {
        if (error.status === 1406) {
            senhaAtualContainer.classList.add('border-red-500')
            form.querySelector('#field-senhaAtual').appendChild(
                ErrorMessage('Senha atual incorreta.')
            )
            submitButton.disabled = true
        } else {
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}

async function getSidebarByUserType(userType) {
    if (userType === 'aluno') {
        const { SidebarAluno } = await import('/src/pages/aluno/components/sidebar.js')
        return SidebarAluno()
    }
    if (userType === 'professor') {
        const { SidebarProfessor } = await import('/src/pages/professor/components/sidebar-professor.js')
        return SidebarProfessor()
    }
    const { SidebarAdmin } = await import('/src/pages/admin/components/sidebar-admin.js')
    return SidebarAdmin()
}

async function TrocarSenhaPage() {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        navigateTo(ROUTES.LOGIN)
        return
    }

    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const inputsContainer = document.createElement('div')
    const buttonContainer = document.createElement('div')

    const { userType } = await makeRequest({
        url: API_ENDPOINTS.GET_USER_TYPE,
        method: 'GET',
        token: accessToken,
    })

    inputsContainer.className = 'flex flex-col gap-8 max-w-md mt-10'
    buttonContainer.className = 'mt-auto text-center'
    form.className = 'flex flex-col h-full'

    root.prepend(await getSidebarByUserType(userType))
    inputsContainer.append(
        PasswordInput({ id: 'senhaAtual', labelName: 'Senha atual' }),
        PasswordInput({ id: 'novaSenha', labelName: 'Nova senha' }),
        PasswordInput({ id: 'confirmarSenha', labelName: 'Confirmar senha' }),
    )
    buttonContainer.appendChild(
        Button({
            id: 'submit',
            variant: 'primary',
            size: 'lg',
            title: 'Salvar',
            type: 'submit',
            ariaLabel: 'Botão de submit para trocar senha'
        })
    )
    form.append(inputsContainer, buttonContainer)
    main.append(
        Heading({
            goBack: true,
            title: 'Trocar senha',
            onGoBack: () => {
                const senhaAtualInput = form.querySelector('#senhaAtual')
                const novaSenhaInput = form.querySelector('#novaSenha')
                const confirmarSenhaInput = form.querySelector('#confirmarSenha')

                if (senhaAtualInput.value || novaSenhaInput.value || confirmarSenhaInput.value) {
                    openDialog(
                        AlertDialog({
                            message: 'As alterações não serão salvas.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => redirectToUserDashboard(userType)
                        })
                    )
                    return
                }
                redirectToUserDashboard(userType)
            }
        }),
        form
    )

    form.onsubmit = handleSubmit
    form.oninput = handleChange
    loader.classList.add('hidden')
}
TrocarSenhaPage()
