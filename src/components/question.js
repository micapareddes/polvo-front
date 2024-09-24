import { Title } from './fonts.js'
import { TextArea } from './text-area.js'

function RespostaIncorreta({ questionNum, incorretaNum, id }) {
    const respostaIncorretaContainer = document.createElement('div')
    const xIcon = document.createElement('i')
    const incorreta = TextArea({
        placeholder: 'Digite aqui uma resposta incorreta...', 
        size: 'fit', 
        className: 'incorreta bg-red-50 w-full',
        id: `${questionNum}-incorreta-${incorretaNum}`,
    })
    incorreta.setAttribute('key', id)
    respostaIncorretaContainer.className = 'w-full flex flex-row items-center gap-2'
    xIcon.className = 'ph-fill ph-x-circle text-red-500 text-3xl'

    respostaIncorretaContainer.append(
        xIcon,
        incorreta,
    )
    return respostaIncorretaContainer
}

export function Question({ number='1', questionId, alternativas }) {
    const container = document.createElement('div')
    const respostasContainer = document.createElement('div')
    const checkIcon = document.createElement('i')
    const respostaCorretaContainer = document.createElement('div')
    const pergunta = TextArea({
        placeholder: 'Digite aqui a pergunta...', 
        id: `${number}`,
        size: 'fit', 
        className: 'pergunta mb-5',
    })
    const respostaCorreta = TextArea({
        placeholder: 'Digite aqui a resposta correta...', 
        id: `${number}-correta`,
        size: 'fit', 
        className: 'correta bg-emerald-50 w-full',
    })

    container.id = questionId
    if (questionId) pergunta.setAttribute('key', questionId)
    if (alternativas) respostaCorreta.setAttribute('key', alternativas[0]._id)
    container.className = 'pergunta-container flex flex-col'
    respostasContainer.className = 'flex flex-col space-y-5'
    respostaCorretaContainer.className = 'w-full flex flex-row items-center gap-2'
    checkIcon.className = 'ph-fill ph-check-circle text-emerald-400 text-3xl'    

    respostaCorretaContainer.append(
        checkIcon,
        respostaCorreta
    )
    respostasContainer.append(
        respostaCorretaContainer,
        RespostaIncorreta({
            questionNum: number,
            incorretaNum: 1,
            id: alternativas && alternativas[1]._id
        }),
        RespostaIncorreta({
            questionNum: number,
            incorretaNum: 2,
            id: alternativas && alternativas[2]._id
        }),
        RespostaIncorreta({
            questionNum: number,
            incorretaNum: 3,
            id: alternativas && alternativas[3]._id
        }),
    )    
    container.append(
        Title({
            title: `Pergunta ${number}`, 
            size: 'xl',
            tone: 's-700', 
            as: 'h3',
            className: 'mb-3',
        }),
        pergunta,
        respostasContainer,
    )
    return container
}