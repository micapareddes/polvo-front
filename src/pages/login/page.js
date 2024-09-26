import { checkAndRedirectUser } from '/src/auth/checkAndRedirectUser.js'
import { loginFormValidation } from '/src/validations/loginFormValidation.js'
import { reqLogin } from '/src/pages/login/service/login.js'
import { LoginForm } from '/src/pages/login/components/login-form.js'
import { ErrorMessage } from '/src/components/error-message.js'

async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target
    const inputCredentials = form.credentials
    const inputPassword = form.password
    const passwordContainer = form.querySelector('#password-container')
    const fieldPassword = form.querySelector('#field-password')
    const submitButton = form.querySelector('#submit')

    let userData

    if (inputCredentials.value.includes('@')) {
        userData = {
            email: inputCredentials.value,
            senha: inputPassword.value
        }
    } else {
        userData = {
            matricula: inputCredentials.value,
            senha: inputPassword.value
        }
    }

    const {success} = loginFormValidation(userData)

    if (!success) {
        inputCredentials.classList.add('border-red-500')
        passwordContainer.classList.add('border-red-500')

        fieldPassword.appendChild(
            ErrorMessage('Todos os campos devem ser preenchidos!')
        )

        submitButton.disabled = true

        return 
    }

    try {
        await reqLogin(userData)
    } catch (error) {
        if (error.status === 1401) {
            inputCredentials.classList.add('border-red-500')
            passwordContainer.classList.add('border-red-500')
            fieldPassword.appendChild(
                ErrorMessage('Senha ou usuario inválidos!')
            )
            submitButton.disabled = true

            return
        }
        alert('Ocorreu um erro inesperado, tente novamente mais tarde.')
    }
}

function handleInput() {
    const form = document.getElementById('auth-form')
    const inputCredentials = form.querySelector('#credentials')
    const passwordContainer = form.querySelector('#field-password')
    const inputPassword = form.querySelector('#password-container')
    const submitButton = form.querySelector('#submit')
    const passwordErrorMessage = passwordContainer.querySelector('#error-message')

    inputCredentials.classList.remove('border-red-500')
    inputPassword.classList.remove('border-red-500')

    if (passwordErrorMessage) passwordErrorMessage.remove()

    submitButton.disabled = false
}

function PageLogin() {
    checkAndRedirectUser()
    const main = document.getElementById('main')
    const formContainer = LoginForm()
    const form = formContainer.querySelector('form')
    const loader = document.querySelector('.loader-container')

    form.onsubmit = handleSubmit
    form.oninput = handleInput

    main.appendChild(formContainer)

    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })
}

PageLogin()