import { ROUTES } from '/src/utils/routes.js'
import { Text } from '/src/components/fonts.js';
import { ListItemBoxWithTitle } from '/src/components/list.js';
import { Tag } from '/src/components/tag.js';
import { formatDate } from '/src/functions/formatDate.js';
import { getCurrentDate } from '/src/functions/getCurrentDate.js';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function QuizRow({ 
    nome='Quiz', data='00 do Mes', isEndDateToday=false, isDateOver=false, tipo='Tipo', link
}) {
    const container = document.createElement('div')
    const dateTone = isEndDateToday ? 'r-500' : 's-600'
    const dateContainer = document.createElement('div')
    const date = isDateOver ? Tag({
        title: 'Encerrado',
        color: 'stone',
    }) : Text({
        text: data,
        size: 'sm',
        tone: dateTone,
    })
    const typeTag = Tag({ title: capitalizeFirstLetter(tipo) })

    container.className = 'grid grid-cols-list justify-between items-center w-full'
    dateContainer.appendChild(date)
    container.append(dateContainer, typeTag)

    return ListItemBoxWithTitle({ 
        title: nome, 
        content: container, 
        linkPainel: link
    })
}

export function QuizTable(quizzes) {
    const headerContent = [
        {
            name: 'Nome',
            style: 'pl-4',
        },        
        {
            name: 'Data Entrega',
            style: 'pl-11',
        },        
        {
            name: 'Tipo',
            style: 'pr-12',
        },
    ]
    const container = document.createElement('div')
    const header = document.createElement('div')
    container.className = 'mt-10 space-y-2'
    header.className = 'flex w-full justify-between mb-2'
    headerContent.forEach((content) => {
        const container = document.createElement('div')
        container.className = content.style
        container.appendChild(
            Text({
                size: 'sm',
                text: content.name,
                bold: 'regular',
                tone: 's-500',
            })
        )
        header.appendChild(container)
    })
    container.appendChild(header)
    quizzes.forEach((quiz) => {
        container.appendChild(
            QuizRow({
                nome: quiz.nome, 
                data: formatDate(quiz.quiz_id.data_fim), 
                tipo: quiz.quiz_id.tipo, 
                isDateOver: quiz.quiz_id.data_fim < getCurrentDate(), 
                isEndDateToday: getCurrentDate === quiz.quiz_id.data_fim, 
                link: ROUTES.ALUNO.QUIZ(quiz.quiz_id._id),
            })
        )
    })

    return container
}