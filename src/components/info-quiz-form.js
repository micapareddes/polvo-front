import { formatMinutesToHs } from "/frontend/src/functions/formatMinutesToHs.js"
import { TextInput } from '/frontend/src/components/text-input.js'
import { Select } from '/frontend/src/components/select.js'
import { DataInput } from '/frontend/src/components/data-input.js'
import { TextArea } from '/frontend/src/components/text-area.js'

export function InfoQuizForm(disciplinas=[]) {
    const container = document.createElement('div')
    const nameInputContainer = document.createElement('div')
    const disciplinaSelectContainer = document.createElement('div')
    const tipoSelectContainer = document.createElement('div')
    const tentativasContainer = document.createElement('div')
    const tempoSelectContainer = document.createElement('div')
    const dataInicioContainer = document.createElement('div')
    const dataFinalContainer = document.createElement('div')
    const tiposDeQuiz = [
        {
            text: 'Prova',
            value: 'prova'
        },
        {
            text: 'Quiz',
            value: 'quiz'
        },
        {
            text: 'Simulado',
            value: 'simulado'
        },
    ]
    const disciplinasFormatadas = disciplinas.map((disciplina) => {
        return {
            text: disciplina.nome,
            value: disciplina._id
        }
    })
    const quizMaxTime = []
    const tentativasOptions = [
        {
            text: 'Aberto',
            value: 0
        },
        {
            text: '1 Tentativa',
            value: 1
        },
        {
            text: '2 Tentativas',
            value: 2
        },
        {
            text: '3 Tentativas',
            value: 3
        },
        {
            text: '4 Tentativas',
            value: 4
        },
        {
            text: '5 Tentativas',
            value: 5
        },
    ]
    for (let i =30; i <= 240; i+= 30) {
        quizMaxTime.push({
            text: formatMinutesToHs(i),
            value: i,
        })
    }

    container.className = 'gap-6 md:gap-8 flex flex-col md:grid md:grid-cols-2 w-full'
    nameInputContainer.className = 'col-span-2'
    disciplinaSelectContainer.id = 'disciplina-container'
    tipoSelectContainer.id = 'tipo-container'
    tentativasContainer.id = 'tentativas-container'
    tempoSelectContainer.id = 'tempo-container'
    dataInicioContainer.id = 'data-inicio-container'
    dataFinalContainer.id = 'data-final-container'

    nameInputContainer.appendChild(
        TextInput({
            placeholder: 'Nome do quiz',
            id: 'nome',
        })
    )
    disciplinaSelectContainer.appendChild(
        Select({
            placeholder: 'Selecione a disciplina', 
            options: disciplinasFormatadas, 
            id: 'disciplina',
        })
    )
    tipoSelectContainer.appendChild(
        Select({
            placeholder: 'Selecione o tipo de quiz', 
            options: tiposDeQuiz,
            id: 'tipo',
        })
    )
    tempoSelectContainer.appendChild(
        Select({
            placeholder: 'Tempo máximo para realizar o quiz', 
            options: quizMaxTime,
            id: 'tempo',
        })
    )
    tentativasContainer.appendChild(
        Select({
            placeholder: 'Tentativas para realizar o quiz', 
            options: tentativasOptions,
            id: 'tentativas',
        })
    )
    dataInicioContainer.appendChild(
        DataInput({
            labelName: 'Data de inicio',
            id: 'data-inicio'
        })
    )
    dataFinalContainer.appendChild(
        DataInput({
            labelName: 'Data de entrega',
            id: 'data-final'
        })
    )
    container.append(
        nameInputContainer,
        disciplinaSelectContainer,
        tipoSelectContainer,
        tentativasContainer,
        tempoSelectContainer,
        dataInicioContainer,
        dataFinalContainer,
        TextArea({
            placeholder: 'Escreva aqui as orientações para o aluno...',
            id: 'orientacoes',
            size: 'full',
            className: 'col-span-2',
        }),
    )
    return container
}