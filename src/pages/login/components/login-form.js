import { AuthFormContent } from '/src/pages/login/components/auth-form-content.js'
import { AuthForm } from '/src/components/auth-form.js'

export function LoginForm() {
    const authFormContainer = document.createElement('div')
    authFormContainer.className = 'w-full max-w-[527px] px-4 md:px-0'
    authFormContainer.appendChild(
        AuthForm({
            title: 'Faça Login',
            cardContent: AuthFormContent(),
            buttonName: 'Entrar',
            buttonSize: 'lg',
        })
    )

    return authFormContainer
}