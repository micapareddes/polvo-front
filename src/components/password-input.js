export function PasswordInput({ className }) {
    const container = document.createElement('div')
    const inputContainer = document.createElement('div')
    const label = document.createElement('label')
    const input = document.createElement('input')
    const eyeButton = document.createElement('button')
    const eyeIcon = document.createElement('img')

    container.id = 'field-password'
    inputContainer.className = 'flex w-full px-2 py-3 rounded-md bg-neutral-100 border border-neutral-200 mt-3 has-[:focus]:ring-2 has-[:focus]:ring-yellow-400'

    inputContainer.id = 'password-container'
    
    input.type = 'password'
    input.name = 'password'
    input.id = 'password'
    input.placeholder = '••••••••'
    input.className = `peer w-full mr-2 bg-transparent focus:outline-none ${className}`

    label.textContent = 'Senha'
    label.htmlFor = 'password'
    label.className = 'block'

    eyeIcon.src = '/frontend/src/img/icones/eye.svg'

    eyeButton.setAttribute('aria-label', 'Mostrar ou ocultar senha') 
    eyeButton.addEventListener("click", (event) => {
        event.preventDefault()

        if (input.type === 'password') {
            input.type = 'text'
            eyeIcon.src = '/frontend/src/img/icones/eye-slash.svg'
        } else {
            input.type = 'password'
            eyeIcon.src = '/frontend/src/img/icones/eye.svg'
        }
    })

    eyeButton.appendChild(eyeIcon)
    inputContainer.append(input, eyeButton)
    container.append(label, inputContainer)

    return container
}