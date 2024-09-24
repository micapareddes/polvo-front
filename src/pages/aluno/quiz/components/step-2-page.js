// Functions
import { ROUTES, API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { infoQuizValidation } from '/frontend/src/validations/infoQuizValidation.js'
import { navigateTo } from '/frontend/src/functions/navigateTo.js'
import { perguntasQuizValidation } from '/frontend/src/validations/perguntasQuizValidation.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { getUrlParam } from '/frontend/src/functions/getUrlParam.js'


// Components
import { Heading } from '/frontend/src/components/heading.js'
import { ErrorToaster, openToaster, closeToaster } from '/frontend/src/components/toaster.js'
import { openDialog, ActionDialog, SuccessDialog } from '/frontend/src/components/dialog.js'
import { Question } from '/frontend/src/components/question.js'
import { Button } from '/frontend/src/components/button.js'
import { PerguntaResposta } from '/frontend/src/components/pergunta-resposta.js'
import { Timer } from './timer.js'
import { QuestionSidecard } from '/frontend/src/components/sidecard.js'

function handleInput(e) {
    e.preventDefault()
    const form = document.querySelector('form')
    const perguntas = form.querySelectorAll(':scope > div:first-child > div')
    let respostasAluno = []

    perguntas.forEach((perg, index) => {
        const resposta = perg.querySelector('input:checked')
        const perguntaId = perg.id
        const respostaId = resposta ? resposta.value : null
        
        respostasAluno.push({
            pergunta_id: perguntaId,
            alternativa_id: respostaId,
        })

        if (resposta) {
            const sidecard = document.getElementById('sidecard')
            const perguntas = sidecard.querySelector(':scope > div')
            const pergunta = perguntas.querySelector(`[pergunta="${perguntaId}"]`) 
            const answer = pergunta.querySelector('#answer') 
            const letra = resposta.getAttribute('alternativa')
            
            answer.textContent = letra.toUpperCase()
        }
    })
    
    localStorage.setItem('respostas', JSON.stringify(respostasAluno))
}

async function handleSubmit(e) {
    e.preventDefault()
    const form = document.querySelector('form')
    const respostasAluno = JSON.parse(localStorage.getItem('respostas'))
    const data = {
        quiz_id: form.id,
        respostas_perguntas: respostasAluno
    }
    
    try {
        const accessToken = localStorage.getItem('accessToken')
        const respostaId = getUrlParam('id')
        await makeRequest({
            method: 'POST',
            url: API_ENDPOINTS.POST_RESPOSTA(respostaId),
            data,
            token: accessToken,

        })
        localStorage.removeItem('respostas')
        localStorage.removeItem('step')

        openDialog(
            SuccessDialog({
                title: 'Entregue',
                message: `O quiz foi entregue com sucesso.`, 
                buttonName: 'Ver Gabarito', 
                link: ROUTES.ALUNO.GABARITO({
                    quiz: form.id,
                    tentativa: respostaId,
                }),
                allowClose: false,
            })
        )
    } catch (error) {
        console.log(error);
    }
}

export async function Step2Page() {
    try {
        const step = localStorage.getItem('step')
        if (!step) navigateTo(ROUTES.ERROR404)
    
        const respostaId = getUrlParam('id')
        if (!respostaId) navigateTo(ROUTES.ERROR404)

        const initialAnswers = [{"pergunta_id":"66e323adf22837795ac5fc9c","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fca1","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fca6","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcab","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcb0","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcb5","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcba","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcbf","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcc4","alternativa_id":null},{"pergunta_id":"66e323adf22837795ac5fcc9","alternativa_id":null}]

        localStorage.setItem('respostas', JSON.stringify(initialAnswers))

        const accessToken = localStorage.getItem('accessToken')
        const { perguntas_quiz, nome_quiz, tempo_quiz, disciplina_id, quiz_id } = await makeRequest({
            method: 'GET',
            url: API_ENDPOINTS.GET_PERGUNTAS_QUIZ(respostaId),
            token: accessToken,
        })
        
        const root = document.getElementById('root')
        const main = document.getElementById('main')
        const form = document.createElement('form')
        const perguntasContainer = document.createElement('div')
        const sidecardContainer = document.createElement('div')
        let perguntas = [];

        root.classList.remove('root-container')
        main.classList.remove('main-container')
        main.classList.add('py-8', 'px-24')
        form.id = quiz_id
        form.className = 'flex flex-row justify-between gap-20'
        sidecardContainer.className = 'fixed top-8 right-24 flex flex-row items-start gap-6'
        perguntasContainer.className = 'pt-10 space-y-16'

        perguntas_quiz.forEach((perg, index) => {
            perguntasContainer.appendChild(
                PerguntaResposta({
                    number: index + 1,
                    pergunta: perg.pergunta,
                    alternativas: perg.alternativas,
                    perguntaId: perg._id,
                })
            )   
            perguntas.push({
                question: `Pergunta ${index + 1}`,
                questionId: perg._id,
                answer: '-'
            })
        })
        sidecardContainer.append(
            Timer({ time: tempo_quiz }),
            QuestionSidecard({
                buttonName: 'Entregar',
                onClick: () => {
                    openDialog(
                        ActionDialog({ 
                            title: 'Entregar quiz?',
                            message: 'Você irá entregar o quiz. Esta ação não pode ser desfeita.',
                            confirmarButtonName: 'Entregar',
                            onConfirm: () => {
                                form.dispatchEvent(
                                    new Event('submit'), {
                                        bubbles: true,
                                        cancelable: true
                                    }
                                )
                            },
                        })
                    )
                },
                questions: perguntas, 
            }),
        )
        form.append(
            perguntasContainer,
            sidecardContainer,
        )
        main.append(
            Heading({
                goBack: false, 
                title: nome_quiz, 
                subtitle: disciplina_id.nome,
            }),
            form,
        )

        form.oninput = handleInput
        form.onsubmit = handleSubmit

        document.addEventListener('timesUp', () => {
            form.dispatchEvent(
                new Event('submit'), {
                    bubbles: true,
                    cancelable: true
                }
            )
        })

    } catch (error) {
        console.log(error)
    }
}