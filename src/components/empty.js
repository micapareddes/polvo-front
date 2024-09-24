export function Empty(message) {
    const container = document.createElement('div')
    const icon = document.createElement('img')
    const messageContainer = document.createElement('p')

    container.className = 'flex h-screen flex-col items-center justify-center'

    icon.src = '/frontend/src/img/no-data.svg'
    icon.alt = 'Duas pranchetas sobrepostas com clipes lilas.'
    icon.className = 'w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96'

    messageContainer.textContent = message
    messageContainer.className = 'px-5 py-4 text-stone-400 text-lg md:text-xl lg:text-2xl block text-center mt-6'

    container.appendChild(icon)
    container.appendChild(messageContainer)

    return container
}