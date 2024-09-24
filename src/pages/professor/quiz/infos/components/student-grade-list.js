import { ListItemBoxWithTitle } from "/frontend/src/components/list.js"
import { Button } from '/frontend/src/components/button.js'
import { Text } from '/frontend/src/components/fonts.js'

export function StudentGradeListItem({ studentName='Nome', answerLink, grade='x' }) {
    const container = document.createElement('div')
    const answerContainer = document.createElement('div')

    container.className = 'flex flex-row justify-between items-center w-full'

    answerContainer.className = 'flex flex-row gap-5'
    answerContainer.append(
        Button({
            title: 'Ver Respostas',
            ariaLabel: 'Botão para ver respostas do aluno',
            variant: 'ghost',
            size: 'sm',
            link: answerLink,
        }),  
        Text({
            as: 'span',
            text: grade + ' / 10',
            size: 'sm',
            tone: 's-600',
        })
    )
    
    container.appendChild(answerContainer)

    return ListItemBoxWithTitle({ title: studentName, content: container })
}