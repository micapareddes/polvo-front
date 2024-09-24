import { Title, Text } from './fonts.js'

export function PerguntaResposta({ 
    number='num', pergunta='Esta é uma pergunta?', perguntaId='id', alternativas=[],
 }) {
    const container = document.createElement('div')
    const alternativasContainer = document.createElement('div')

    container.id = perguntaId
    alternativasContainer.className = 'space-y-5'

    alternativas.forEach((alt, index) => {
        const bigContainer = document.createElement('div')
        const container = document.createElement('div')
        const icon = document.createElement('img')
        const input = document.createElement('input')
        const label = document.createElement('label')
        const iconAlternativas = {
            0: '/src/img/icones/a.svg',
            1: '/src/img/icones/b.svg',
            2: '/src/img/icones/c.svg',
            3: '/src/img/icones/d.svg',
        }
        const letra = {
            0: 'a',
            1: 'b',
            2: 'c',
            3: 'd',
        }
        icon.src = iconAlternativas[index]
        container.className = 'relative inline-flex block space-x-2 cursor-pointer has-[:checked]:bg-yellow-100'

        input.type = 'radio'
        input.id = alt._id
        input.setAttribute('alternativa', letra[index])
        input.value = alt._id
        input.name = `alternativa-pergunta${number}`
        input.className = 'absolute inset-1 cursor-pointer opacity-0'

        label.htmlFor = alt._id
        label.textContent = alt.conteudo
        label.className = 'text-stone-700'

        container.append(
            icon,
            input,
            label
        )
        bigContainer.appendChild(container)
        alternativasContainer.appendChild(bigContainer)
    })

    container.append(
        Title({
            title: `Pergunta ${number}`, 
            size: 'xl',
            tone: 's-700', 
            as: 'h3',
            className: 'mb-2',
        }),
        Text({
            text: pergunta,
            tone: 's-700',
            size: 'text-lg',
            className: 'mb-5'
        }),
        alternativasContainer
    )

    return container
}