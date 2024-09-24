// Functions
import { ROUTES, API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { verifyUserAccess } from '/frontend/src/auth/verifyUserAccess.js'
import { infoQuizValidation } from '/frontend/src/validations/infoQuizValidation.js'
import { navigateTo } from '/frontend/src/functions/navigateTo.js'
import { perguntasQuizValidation } from '/frontend/src/validations/perguntasQuizValidation.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { getUrlParam } from '/frontend/src/functions/getUrlParam.js'

// Components
import { SidebarAluno } from '../components/sidebar.js'
import { Heading } from '/frontend/src/components/heading.js'
import { ErrorToaster, openToaster, closeToaster } from '/frontend/src/components/toaster.js'
import { openDialog, ActionDialog, SuccessDialog } from '/frontend/src/components/dialog.js'
import { Question } from '/frontend/src/components/question.js'
import { Button } from '/frontend/src/components/button.js'
import { PerguntaRespostaGabarito } from '/frontend/src/components/pergunta-resposta-gabarito.js'
import { QuestionSidecard } from '/frontend/src/components/sidecard.js'

async function GabaritoPage() {
    try {
        const quizId = getUrlParam('quiz')
        if (!quizId) navigateTo(ROUTES.ERROR404)
            
        const tentativaId = getUrlParam('tentativa')
        if (!tentativaId) navigateTo(ROUTES.ERROR404)

        const accessToken = localStorage.getItem('accessToken')
        const { nota, gabarito, nome_quiz, disciplina_id:disciplina, perguntas_quiz } = await makeRequest({
            method: 'GET',
            url: API_ENDPOINTS.GET_GABARITO(tentativaId),
            token: accessToken,
        })
        
        const root = document.getElementById('root')
        const main = document.getElementById('main')
        const content = document.createElement('div')
        const perguntasContainer = document.createElement('div')
        const sidecardContainer = document.createElement('div')
        const header = document.createElement('div')
        let perguntasQuiz = [];

        content.className = 'flex flex-row gap-20 mt-10 ml-11'
        perguntasContainer.className = 'space-y-16'
        header.className = 'flex items-center justify-between'
        sidecardContainer.className = 'fixed right-11 top-10'

        root.prepend(
            SidebarAluno('sm')
        )
        perguntas_quiz.forEach((perg, index) => {
            perguntasContainer.appendChild(
                PerguntaRespostaGabarito({
                    number: index + 1,
                    pergunta: perg.pergunta,
                    alternativas: perg.alternativas,
                    perguntaId: perg._id,
                })
            ) 
        })
        content.appendChild(perguntasContainer)
        main.append(
            Heading({
                goBack: true, 
                title: nome_quiz, 
                subtitle: disciplina.nome,
                onGoBack: () => navigateTo(ROUTES.ALUNO.QUIZ(quizId))
            }),
            content,
        )
        gabarito.forEach((item, index) => {
            const alternativa = document.getElementById(`alternativa-${item.alternativa_id}`)
            console.log(alternativa);
            
            const colorLetra = item.acertou ? 'green' : 'red'
            
            if (alternativa && !item.acertou) {
                alternativa.classList.add('bg-red-100')
            }
            perguntasQuiz.push({
                question: `Pergunta ${index + 1}`,
                questionId: item.pergunta_id,
                answer: alternativa ? alternativa.getAttribute('letra') : '-',
                color: colorLetra,
            })
            
        })
        sidecardContainer.appendChild(
            QuestionSidecard({
                title: `Nota ${nota}`,
                titleIsGrade: true,
                buttonName: 'Entregue',
                buttonVariant: 'outline',
                disabledButton: true,
                questions: perguntasQuiz, 
            }),
        )
        content.appendChild(sidecardContainer)

    } catch (error) {
        console.log(error)
    }
} GabaritoPage()