// Functions
import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'


// Components
import { Heading } from '/src/components/heading.js'
import { PerguntaRespostaGabarito } from '/src/components/pergunta-resposta-gabarito.js'
import { QuestionSidecard } from '/src/components/sidecard.js'
import { SidebarProfessor } from "../../components/sidebar-professor.js"

async function GabaritoPage() {
    try {
        verifyUserAccess('professor')

        const quizId = getUrlParam('quiz')
        if (!quizId) navigateTo(ROUTES.ERROR404)
            
        const tentativaId = getUrlParam('tentativa')
        if (!tentativaId) navigateTo(ROUTES.ERROR404)

        document.addEventListener("DOMContentLoaded", function() {
            loader.classList.add('hidden')
        })

        const accessToken = localStorage.getItem('accessToken')
        const { disciplina_id: disciplina, perguntas, titulo } = await makeRequest({
            method: 'GET',
            url: API_ENDPOINTS.GET_QUIZ_FOR_GABARITO_BY_ID(quizId),
            token: accessToken,
        })
        const { nota, gabarito } = await makeRequest({
            method: 'GET',
            url: API_ENDPOINTS.GET_GABARITO(tentativaId),
            token: accessToken,
        })
        
        const root = document.getElementById('root')
        const main = document.getElementById('main')
        const loader = document.querySelector('.loader-container')
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
            SidebarProfessor('sm')
        )
        perguntas.forEach((perg, index) => {
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
                title: titulo, 
                subtitle: disciplina.nome,
                onGoBack: () => history.back()
            }),
            content,
        )
        gabarito.forEach((item, index) => {
            const alternativa = document.getElementById(`alternativa-${item.alternativa_id}`)
            const colorLetra = item.acertou ? 'green' : 'red'
            
            if (!item.acertou) {
                alternativa.classList.add('bg-red-100')
            }
            perguntasQuiz.push({
                question: `Pergunta ${index + 1}`,
                questionId: item.pergunta_id,
                answer: alternativa.getAttribute('letra'),
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
            })
        )
        content.appendChild(sidecardContainer)

    } catch (error) {
        console.log(error)
    }
} GabaritoPage()