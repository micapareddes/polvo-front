import { Text, Title } from "./fonts.js"
import { Tag } from "./tag.js"
import { EditRemoveActionButtons } from "./edit-remove.js"
import { Button } from "./button.js"

export function ListItemBox({ content, linkPainel }) {
    const liContainer = document.createElement('li')
    const aContainer = document.createElement('a')

    liContainer.className = 'list-none bg-neutral-100 hover:bg-neutral-200 shadow-base border border-neutral-200 rounded-xl  w-full justify-start items-center'

    aContainer.href = linkPainel
    aContainer.className = 'flex flex-1 px-5 py-4 transition-colors duration-200 cursor-pointer focus:outline-none'
    if (content) aContainer.appendChild(content)

    liContainer.appendChild(aContainer)

    return liContainer
}

export function ListItemBoxWithTitle({ title='Título', content=null, linkPainel }) {
    const titulo = Title({
        as: 'h4',
        size: 'md',
        title,
        tone: 's-900',
        bold: 'regular',
    })

    if (content) content.prepend(titulo)

    return ListItemBox({ 
        content: content ? content : titulo,
        linkPainel,
    })
}

export function QuizListItem({ name='Quiz', endDate='00 de Mes', type='exc' }) {
    const quizType = {
        'sim': 'Simulado',
        'prova': 'Prova',
        'exc': 'Exercicio'
    }
    const container = document.createElement('div')
    const date = Text({
        text: endDate,
        size: 'sm',
        tone: 's-600'
    })
    const typeTag = Tag({ title: quizType[type] })

    container.className = 'grid grid-cols-list justify-between items-center w-full'
    container.append(date, typeTag)

    return ListItemBoxWithTitle({ title: name, content: container})
}

export function EditQuizListItem({ name='Quiz', onEdit, onRemove}) {
    const container = document.createElement('div')

    container.className = 'flex flex-row justify-between items-center'
    container.appendChild(
        EditRemoveActionButtons({
            onEdit, 
            onRemove
        }))

    return ListItemBoxWithTitle({ title: name, content: container })
}
