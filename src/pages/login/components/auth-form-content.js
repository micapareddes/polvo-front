import { TextInput } from '/src/components/text-input.js'
import { PasswordInput } from '/src/components/password-input.js'
import { Button } from '/src/components/button.js'

export function AuthFormContent() {
    const container = document.createElement('div')
    const credentialsInput = TextInput({
        id: 'credentials',
        labelName: 'Matricula ou Email',
        placeholder: 'usuario@email.com',
        size: 'regular',
        fill: true,
    })
    const password = PasswordInput({})
    const forgotPasswordButtonContainer = document.createElement('div')
    const forgotPasswordMessage = document.createElement('p')
    const forgotPasswordButton = Button({
        variant: 'ghost',
        title: 'Esqueceu a senha ou deseja trocar?',
        size: 'regular',
        ariaLabel: 'Botão para trocar a senha',
        disabled: true,
    })

    container.className = 'flex flex-col gap-8 w-full'
    forgotPasswordButtonContainer.className = 'relative flex justify-center'

    forgotPasswordMessage.textContent = 'Em breve'
    forgotPasswordMessage.className = 'hidden absolute -top-8 p-2 rounded bg-neutral-100 border border-neutral-300 text-xs text-stone-500'

    forgotPasswordButtonContainer.addEventListener('mouseenter', () => {
        forgotPasswordMessage.classList.remove('hidden')
    })
    forgotPasswordButtonContainer.addEventListener('mouseleave', () => {
        forgotPasswordMessage.classList.add('hidden')
    })

    forgotPasswordButtonContainer.append(forgotPasswordMessage, forgotPasswordButton)
    container.append(credentialsInput, password, forgotPasswordButtonContainer)

    return container
}