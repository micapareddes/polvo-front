// Functions
import { API_ENDPOINTS, ROUTES } from '/frontend/src/utils/routes.js'
import { verifyUserAccess } from '/frontend/src/auth/verifyUserAccess.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { getUrlParam } from '/frontend/src/functions/getUrlParam.js'
import { navigateTo } from '/frontend/src/functions/navigateTo.js'
import { editQuizValidation } from '/frontend/src/validations/editQuizValidation.js'

// Components
import { SidebarAdmin } from '/frontend/src/pages/admin/components/sidebar-admin.js'
import { Heading } from '/frontend/src/components/heading.js'
import { Button } from '/frontend/src/components/button.js'
import { InfoQuizForm } from '/frontend/src/components/info-quiz-form.js'
import { Question } from '/frontend/src/components/question.js'
import { openToaster, closeToaster, ErrorToaster } from '/frontend/src/components/toaster.js'

async function handleSubmit(e) { //TODO: Validação de erro e form mudou
    e.preventDefault()
    const quizId = getUrlParam('id')
    const form = document.getElementById('form')
    const nomeInput = form.querySelector('#nome')
    const tentativasInput = form.querySelector('#tentativas')
    const tipoInput = form.querySelector('#tipo')
    const tempoMaxInput = form.querySelector('#tempo')
    const dataInicioInput = form.querySelector('#data-inicio').querySelector('input')
    const dataFinalInput = form.querySelector('#data-final').querySelector('input')
    const orientacoesInput = form.querySelector('#orientacoes')
    const inputsContainer = document.getElementById('perguntas-container')
    const inputs = inputsContainer.querySelectorAll('textarea') 
    const perguntasContainer = Array.from(form.querySelectorAll('.pergunta-container'))
    const perguntas = 
        perguntasContainer.map((pergunta) => {
            const perguntaId = pergunta.querySelector('textarea').getAttribute('key')
            const corretaId = pergunta.querySelector('.correta').getAttribute('key')
            const alternativasIncorretas = Array.from(pergunta.querySelectorAll('.incorreta'))
            const incorretasArray = alternativasIncorretas.map((i) => {
                const id = i.getAttribute('key')
                return {
                    conteudo: i.value.trim(),
                    isCorreta: false,
                    _id: id
                }
            })
            
            return {
                pergunta: pergunta.querySelector('.pergunta').value.trim(),
                _id: perguntaId,
                alternativas: [
                    {
                        conteudo: pergunta.querySelector('.correta').value.trim(),
                        isCorreta: true,
                        _id: corretaId,

                    },  
                    incorretasArray[0],
                    incorretasArray[1],
                    incorretasArray[2]          
                ]
            }
        })
    const data = {
        titulo: nomeInput.value,
        tipo: tipoInput.value,
        tentativas: tentativasInput.value,
        tempo: tempoMaxInput.value,
        data_inicio: dataInicioInput.value,
        data_fim: dataFinalInput.value,
        orientacao: orientacoesInput.value,
        perguntas,
    }

    const { success, error } = editQuizValidation({
        nome: data.titulo,
        tipo: data.tipo,
        tentativas: data.tentativas,
        tempoMax: data.tempo,
        dataInicio: data.data_inicio,
        dataFinal: data.data_fim,
        perguntas: inputs,
    })

    if (!success) {
        openToaster(
            ErrorToaster({
                message: 'Todos os campos devem ser preenchidos e a data final deve ser maior que a data de inicio.'
            })
        )
        closeToaster()
        return
    }

    try {
        await makeRequest({
            url: API_ENDPOINTS.PATCH_QUIZ(quizId), 
            method: 'PATCH', 
            token: localStorage.getItem('accessToken'), 
            data,
        })
        localStorage.setItem('quizEditado', true)
        navigateTo(ROUTES.PROFESSOR.QUIZ.INFO(quizId))
    } catch (error) {
        console.log(error);
        alert('Algo deu errado, tente novamente mais tarde.')
    }
    
}

async function EditQuizPage() {
try {
    verifyUserAccess('professor')
    const id = getUrlParam('id')
    if (!id) history.back()

    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const form = document.createElement('form')
    const buttonContainer = document.createElement('div')
    const perguntasContainer = document.createElement('div')
    const quiz = await makeRequest({
        url: API_ENDPOINTS.GET_QUIZ(id), 
        method: 'GET', 
        token: localStorage.getItem('accessToken'), 
    })

    form.id = 'form'
    form.className = 'flex flex-col items-start pt-6 md:p-10'
    perguntasContainer.id = 'perguntas-container'
    perguntasContainer.className = 'w-full space-y-10 mt-12'
    buttonContainer.className = 'w-full flex justify-center mt-12 md:mt-24'
    
    buttonContainer.appendChild(
        Button({
            variant: 'primary',
            title: 'Salvar alterações',
            ariaLabel: 'Botão para salvar alterações',
            type: 'submit',
            id: 'submit',
        })
    )
    form.append(
        InfoQuizForm([quiz.disciplina_id]),
        perguntasContainer,
        buttonContainer
    )
    main.append(
        Heading({
            title: 'Edição do Quiz', 
            goBack: true, 
            onGoBack: () => history.back()
        }),
        form
    )
    root.prepend(SidebarAdmin())

    quiz.perguntas.forEach((pergunta, index) => {
        perguntasContainer.appendChild(
            Question({
                number: index + 1,
                questionId: pergunta._id,
                alternativas: pergunta.alternativas
            })
        )

        const perguntaInput = document.querySelector(`[key="${pergunta._id}"]`)
        perguntaInput.value = pergunta.pergunta
        
        pergunta.alternativas.forEach((alternativa) => {
            const input = document.querySelector(`[key="${alternativa._id}"]`)
            input.value = alternativa.conteudo
        })
    })

    // Set quiz values on form
    const nomeInput = document.getElementById('nome')
    const disciplinaSelect = document.getElementById('disciplina')
    const tipoSelect = document.getElementById('tipo')
    const tempoSelect = document.getElementById('tempo')
    const tentativasSelect = document.getElementById('tentativas')
    const dataInicioContainer = document.getElementById('data-inicio')
    const dataInicio = dataInicioContainer.querySelector('input')
    const dataEntregaContainer = document.getElementById('data-final')
    const dataEntrega = dataEntregaContainer.querySelector('input')
    const orientacoes = document.getElementById('orientacoes')

    nomeInput.value = quiz.titulo
    disciplinaSelect.value = quiz.disciplina_id._id
    disciplinaSelect.disabled = true
    tipoSelect.value = quiz.tipo
    tempoSelect.value = quiz.tempo
    tentativasSelect.value = quiz.tentativas
    dataInicio.value = quiz.data_inicio
    dataEntrega.value = quiz.data_fim
    orientacoes.value = quiz.orientacao

    form.onsubmit = handleSubmit
}
catch (error) {
        
}
} EditQuizPage()