// Functions
import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'
import { formatDate } from '/src/functions/formatDate.js'
import { getCurrentDate } from '/src/functions/getCurrentDate.js'
import { navigateTo } from '/src/functions/navigateTo.js'
// Components
import { Heading } from '/src/components/heading.js'
import { QuizInfo } from '/src/components/quiz-info.js'
import { Title, Text } from '/src/components/fonts.js'
import { Button } from '/src/components/button.js'
import { AttemptsSidecard } from './attempts-sidecard.js'
import { openDialog, ActionDialog } from '/src/components/dialog.js'

export async function Step1Page() {
    try {
        const id = getUrlParam('id')
        const accessToken = localStorage.getItem('accessToken')
        const data = await makeRequest({
            method: 'GET',
            url: API_ENDPOINTS.GET_QUIZ_INFO_FOR_STRUDENT_BY_ID(id),
            token: accessToken,
        })
        const main = document.getElementById('main')
        const loader = document.querySelector('.loader-container')
        const container = document.createElement('div')
        const infoContainer = document.createElement('div')
        const sidecardContainer = document.createElement('div')
        const tentativasAluno = data.tentativas_aluno
        const attempts = tentativasAluno.map((tentativa, index) => {
            return {
                attemptNumber: index + 1,
                grade: tentativa.nota,
                answerLink: ROUTES.ALUNO.GABARITO({
                    quiz: id,
                    tentativa: tentativa._id
                })
            }

        })
        const quizExpirou = getCurrentDate() > data.data_fim
        const alunoEsgotouTentativas = data.tentativas !== 0 && data.tentativas <= tentativasAluno.length
       
        main.classList.add('flex', 'justify-between', 'md:flex-row', 'gap-24')
        container.className = 'space-y-4'
        infoContainer.className = 'pl-11 pb-11 space-y-12'

        sidecardContainer.appendChild(
            AttemptsSidecard({
                attempts,
            })
        )
        infoContainer.prepend(
            QuizInfo({
                orientacao: data.orientacao, 
                tentativas: data.tentativas, 
                tempo: data.tempo, 
                dataInicio: data.data_inicio, 
                dataFim: data.data_fim,
            }),
            Button({
                id: 'open-quiz',
                title: quizExpirou ? 'Encerrado' : alunoEsgotouTentativas ? 'Entregue' : 'Começar quiz',
                onClick: () => {
                    localStorage.setItem('step', true)
                    openDialog(
                        ActionDialog({
                            title: 'Deseja começar agora?', 
                            message: 'Ao clicar no botão o quiz começará imediatamente e deve ser entregue para poder sair.', 
                            confirmarButtonName: 'Começar', 
                            onConfirm: async () => {
                                const respostaId = await makeRequest({
                                    method: 'POST',
                                    url: API_ENDPOINTS.EMBARALHA(id),
                                    token: accessToken,
                                })
                                navigateTo(`/src/pages/aluno/quiz/index.html?step=2&id=${respostaId}`)
                            },
                        })
                    )
                },
                ariaLabel: quizExpirou ? 'Quiz encerrado' : alunoEsgotouTentativas ? 'Quiz entregue' : 'Botão para começar o quiz',
                disabled: quizExpirou || alunoEsgotouTentativas,
            })
        )
        container.append(            
            Heading({ 
                goBack: true, 
                onGoBack: () => history.back(),
                title: data.titulo, 
                subtitle: data.disciplina_nome,
                subtitleSize: 'lg'
            }),
            infoContainer
        )
        main.append(
            container,
            sidecardContainer
        )
    
        localStorage.removeItem('remainingTime')
        loader.classList.add('hidden')

    } catch (error) {
        console.log(error);
        alert('Algo deu errado... Encerre a sessão e tente novamente.')
        
    }
}