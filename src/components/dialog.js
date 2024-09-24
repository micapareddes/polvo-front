import { Button } from './button.js'
import { Title, Text } from './fonts.js'

function constructorDialog({ title, message, confirmarButtonName = 'Confirmar', onConfirm, color='neutral' }) {
    const container = document.createElement('dialog')
    const div = document.createElement('div')
    const buttonsContainer = document.createElement('div')
    const h4 = document.createElement('h4')
    const p = document.createElement('p')
    const cancelarButton = document.createElement('button')
    const confirmarButton = document.createElement('button')

    container.className = 'fixed left-0 top-0 bg-indigo-950 bg-opacity-50 backdrop-blur-sm h-screen w-screen flex items-center justify-center'
    container.id = 'dialog'

    div.className = 'bg-neutral-50 rounded-3xl px-6 py-8'

    buttonsContainer.className = 'text-end'

    h4.className = 'text-xl lg:text-2xl font-semibold text-stone-900 mb-4'
    h4.textContent = title

    p.className = 'mb-6 text-stone-700 text-base w-64 md:w-[350px] lg:w-[479px]'
    p.textContent = message

    cancelarButton.className = 'px-6 py-2 border border-neutral-400 text-neutral-500 rounded-md mr-4'
    cancelarButton.id = 'cancelar-button'
    cancelarButton.textContent = 'Cancelar'

    // fecha dialog quando clica em botão de cancelar
    cancelarButton.addEventListener('click', () => {
        container.remove()
    })
    
    confirmarButton.className = `px-6 py-2 border rounded-md text-neutral-50 bg-${color}-500`
    confirmarButton.id = 'confirmar-button'
    confirmarButton.textContent = confirmarButtonName

    // roda função passada via props
    confirmarButton.addEventListener('click', () => {
        container.remove()
        onConfirm()
    })

    buttonsContainer.append(cancelarButton, confirmarButton)
    div.append(h4, p, buttonsContainer)
    container.appendChild(div)

    return container
}

export function AlertDialog({ message, confirmarButtonName, onConfirm }) {
    return constructorDialog({ 
        title: 'Tem certeza?', 
        message, 
        confirmarButtonName, 
        onConfirm, 
        color: 'red' 
    })
}

export function ActionDialog({ title, message, confirmarButtonName, onConfirm }) {
    return constructorDialog({ 
        title, 
        message, 
        confirmarButtonName, 
        onConfirm, 
        color: 'indigo' 
    })
}

export function SuccessDialog({ 
    title='Título', message='Mensagem do dialog', buttonName='Redirecionar', link, allowClose=true
}) {
    const container = document.createElement('dialog')
    const div = document.createElement('div')
    const headingContainer = document.createElement('header')
    const icon = document.createElement('i')
    const dialogTitle = Title({
        as: 'h4',
        title,
    })
    const dialogMessage = Text({
        text: message,
        tone: 's-700',
        size: 'md'
    })
    const closeButton = document.createElement('button')
    const redirectButton = Button({
        variant: 'ghost',
        title: buttonName,
        link: link,
        ariaLabel: `Botão de ${buttonName}`,
    })

    container.className = 'fixed left-0 top-0 bg-indigo-950 bg-opacity-50 backdrop-blur-sm h-screen w-screen flex items-center justify-center'
    headingContainer.className = 'flex flex-row gap-2 items-center'
    div.className = 'bg-neutral-50 rounded-3xl px-6 pt-10 pb-10 flex flex-col items-center justify-center gap-4 min-w-96'
    icon.className = 'ph-fill ph-check-circle text-emerald-500 text-2xl'
    closeButton.className = 'ph ph-x text-stone-900 opacity-20 w-full text-end'

    if (allowClose) div.classList.add('pt-5')
    closeButton.onclick = () => container.remove()

    if (allowClose) div.appendChild(closeButton)
    headingContainer.append(icon, dialogTitle)
    div.append(headingContainer, dialogMessage, redirectButton)
    container.appendChild(div)

    return container
}

export function openDialog(dialog) {
    const root = document.getElementById('root')
    root.appendChild(dialog)
}