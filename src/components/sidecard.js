import { Button } from './button.js'
import { Card } from './card.js'

export function QuestionItem(
    { question='Bold', questionId='id', answer='Regular', color='neutral' }
) {
    const colorStyle = {
        'neutral': ' text-stone-700',
        'red': 'text-red-500',
        'green': 'text-emerald-600'
    }

    const container = document.createElement('div')
    const questionElement = document.createElement('p')
    const answerElement = document.createElement('p')

    container.className = 'flex flex-row justify-between w-40'
    container.setAttribute('pergunta', questionId)


    questionElement.textContent = question
    questionElement.className = 'text-base font-semibold text-stone-700'

    answerElement.id = 'answer'
    answerElement.textContent = answer.toUpperCase()
    answerElement.className = `text-base ${colorStyle[color]}`

    container.append(questionElement, answerElement)

    return container
}

export function SidecardBoxWithTitle({ title, titleBold, content }) {
    const titulo = document.createElement('h5')

    titulo.textContent = title
    titulo.className = `text-lg text-stone-700 ${ titleBold && 'font-bold' } mb-8 text-center`

    content.prepend(titulo)

    return Card({ size: 'lg', content })
}

export function QuestionSidecard({ 
    questions=[], title="Respostas", titleIsGrade=false, buttonVariant, buttonName, disabledButton=false, onClick
}) {
    const container = document.createElement('div')
    const perguntasContainer = document.createElement('div')
    const button = Button({ 
        variant: buttonVariant,
        title: buttonName,
        size:'md', 
        disabled: disabledButton,
        onClick,
        ariaLabel: `Botão de ${buttonName}`,
    })

    container.id = 'sidecard'
    container.className = 'flex flex-col items-center w-[320px]'
    perguntasContainer.className = 'flex flex-col gap-4 mb-8'

    questions.forEach((pergunta) => {
        const item = QuestionItem({ 
            question: pergunta.question,
            questionId: pergunta.questionId,
            answer: pergunta.answer,
            color: pergunta.color
        })
        perguntasContainer.appendChild(item)
    })

    container.append(perguntasContainer, button)

    return SidecardBoxWithTitle({
        title,
        titleBold: titleIsGrade,
        content: container
    })
}