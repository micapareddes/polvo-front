function constructorToaster({ color, title, message, phosphor }) {
    const span = document.createElement('span')
    const divTitle = document.createElement('div')
    const divContent = document.createElement('div')
    const h4 = document.createElement('h4')
    const p = document.createElement('p')
    const button = document.createElement('button')
    const closeIcon = document.createElement('i')
    const toasterIcon = document.createElement('i')

    span.id = 'toaster'
    span.className = `px-5 py-3 rounded-md border-l-4 shadow-md absolute right-4 bottom-6 bg-${color}-100 border-l-${color}-500 flex items-start gap-12`

    divTitle.className = 'flex items-center gap-2'

    h4.className = 'font-semibold text-base'
    h4.textContent = title

    p.className = 'block text-sm pl-7'
    p.textContent = message

    button.id = 'toaster-button'

    closeIcon.className = `ph ph-x text-xl text-${color}-500 opacity-50 hover:opacity-70`
    toasterIcon.className = `ph-fill ph-${phosphor} text-xl text-${color}-500`

    divTitle.append(toasterIcon, h4)
    divContent.append(divTitle, p)
    button.appendChild(closeIcon)
    span.append(divContent, button)

    return span
}

// Tipos de Toaster
export function SuccessToaster({ message }) {
    const successToaster = constructorToaster({
        color: 'emerald', 
        title: 'Sucesso!', 
        message, 
        phosphor: 'check-circle', 
    })

    return successToaster
}

export function InfoToaster({ message }) {
    return constructorToaster({ 
        color: 'indigo', 
        title: 'Info', 
        message, 
        phosphor: 'info', 
    })
}

export function ErrorToaster({ message }) {
    return constructorToaster({ 
        color: 'red', 
        title: 'Error', 
        message, 
        phosphor: 'x-circle'
    })
}

// Métodos
export function openToaster(toaster) {
    const root = document.getElementById('root')
    const toasterId = document.getElementById('toaster')
    if (toasterId) toasterId.remove()
    root.appendChild(toaster)
}

export function closeToaster() {
    const toasterButton = document.getElementById('toaster-button')
    const toasterId = document.getElementById('toaster')

    toasterButton.addEventListener('click', () => {
        const toaster = document.getElementById('toaster')
        toaster.remove()
    })

    setTimeout(() => {
        toasterId.remove()
    }, 3000)
}
