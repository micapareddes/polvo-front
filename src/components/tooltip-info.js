export function TooltipInfo({ message='Esta é uma mensagem informativa.' }) {
    const container = document.createElement('span')
    const infoButton = document.createElement('button')
    const infoIcon = document.createElement('img')
    const infoMessage = document.createElement('p')

    infoButton.className = 'flex items-center'
    infoButton.type = 'button'
    container.className = 'relative w-full'

    infoIcon.src = '/src/img/icones/question.svg'
    infoIcon.alt = 'Ícone de pergunta arredondada e cinza.'

    infoMessage.textContent = message
    infoMessage.className = 'hidden absolute bottom-3 ml-4 p-2 rounded bg-neutral-100 border border-neutral-300 text-xs text-stone-500'

    infoButton.appendChild(infoIcon)

    container.append(infoMessage, infoButton)

    infoButton.addEventListener('mouseenter', () => {
        infoMessage.classList.remove('hidden');
    });
    infoButton.addEventListener('mouseleave', () => {
        infoMessage.classList.add('hidden');
    });

    infoButton.addEventListener('focus', () => {
        infoMessage.classList.remove('hidden');
    });
    infoButton.addEventListener('blur', () => {
        infoMessage.classList.add('hidden');
    });

    return container
}