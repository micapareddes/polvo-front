// Functions
import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { perguntasQuizValidation } from '/src/validations/perguntasQuizValidation.js'
import { makeRequest } from '/src/functions/makeRequest.js'

// Components
import { Heading } from '/src/components/heading.js'
import { AlertDialog, openDialog } from '/src/components/dialog.js'
import { ErrorToaster, openToaster, closeToaster } from '/src/components/toaster.js'
import { Question } from '/src/components/question.js'
import { Button } from '/src/components/button.js'

async function handleGuardarRascunho() {
    const form = document.querySelector('form')
    const info = JSON.parse(localStorage.getItem('infos'))
    const perguntasContainer = Array.from(form.querySelectorAll('.pergunta-container'))
    const perguntas = 
        perguntasContainer.map((pergunta) => {
            const alternativasIncorretas = Array.from(pergunta.querySelectorAll('.incorreta'))
            const incorretasArray = alternativasIncorretas.map((i) => {
                return {
                    conteudo: i.value.trim(),
                    isCorreta: false
                }
            })
            
            return {
                pergunta: pergunta.querySelector('.pergunta').value.trim(),
                alternativas: [
                    {
                        conteudo: pergunta.querySelector('.correta').value.trim(),
                        isCorreta: true
                    },  
                    incorretasArray[0],
                    incorretasArray[1],
                    incorretasArray[2]          
                ]
            }
        })
    console.log(info);

    const formatedData = {
        titulo: info.nome,
        disciplina_id: info.disciplina.id,
        tipo: info.tipo,
        tempo: info.tempoMax,
        tentativas: info.tentativas,
        data_inicio: info.dataInicio,
        data_fim: info.dataFinal,
        orientacao: info.orientacoes,
        isRascunho: true,
        perguntas: perguntas
    }
    
    try {
        await makeRequest({
            url: API_ENDPOINTS.POST_QUIZ, 
            method: 'POST', 
            token: localStorage.getItem('accessToken'), 
            data: formatedData, 
        })
        localStorage.setItem('rascunho', true)
        localStorage.removeItem('infos')
        localStorage.removeItem('perguntas')
        localStorage.removeItem('perguntasRascunho')
        localStorage.removeItem('rascunhoId')
        localStorage.removeItem('mudou')
        navigateTo(ROUTES.PROFESSOR.DISCIPLINA(info.disciplina.id))

    } catch (error) {
        console.log(error)
        alert('Algo deu errado, tente novamente mais tarde...')
    }

}
async function handleSubmit(e) {
    e.preventDefault()
    const form = document.querySelector('form')
    const inputs = form.querySelectorAll('textarea')

    const {success} = perguntasQuizValidation(inputs)
    
    if (!success) {
        openToaster(
            ErrorToaster({message: 'Todos os campos devem ser preenchidos.'})
        )
        closeToaster()
        return
    }

    const { nome, tentativas, disciplina, tipo, tempoMax, dataInicio, dataFinal, orientacoes } = JSON.parse(localStorage.getItem('infos'))
    const perguntasContainer = Array.from(form.querySelectorAll('.pergunta-container'))
    const perguntas = 
        perguntasContainer.map((pergunta) => {
            const alternativasIncorretas = Array.from(pergunta.querySelectorAll('.incorreta'))
            const incorretasArray = alternativasIncorretas.map((i) => {
                return {
                    conteudo: i.value.trim(),
                    isCorreta: false
                }
            })
            
            return {
                pergunta: pergunta.querySelector('.pergunta').value.trim(),
                alternativas: [
                    {
                        conteudo: pergunta.querySelector('.correta').value.trim(),
                        isCorreta: true
                    },  
                    incorretasArray[0],
                    incorretasArray[1],
                    incorretasArray[2]          
                ]
            }
        })
    
    const data = {
        titulo: nome,
        disciplina_id: disciplina.id,
        tipo,
        tempo: tempoMax,
        tentativas,
        data_inicio: dataInicio,
        data_fim: dataFinal,
        orientacao: orientacoes,
        isRascunho: false,
        perguntas: perguntas,
    }
    const quizData = {
        disciplina_id: disciplina.id,
        nome_quiz: nome
    }

    try {
        const accessToken = localStorage.getItem('accessToken')
        await makeRequest({ 
            url: API_ENDPOINTS.POST_QUIZ, 
            method: 'POST', 
            token: localStorage.getItem('accessToken'), 
            data, 
        })
        await makeRequest({ 
            url: API_ENDPOINTS.PATCH_ADICIONAR_QUIZ_A_DISCIPLINA, 
            method: 'PATCH', 
            token: accessToken, 
            data: quizData, 
        })
        localStorage.removeItem('infos')
        localStorage.removeItem('perguntas')
        localStorage.removeItem('perguntasRascunho')
        localStorage.removeItem('rascunhoId')
        localStorage.setItem('quizCadastrado', true)
        navigateTo(ROUTES.PROFESSOR.DISCIPLINA(data.disciplina_id))
    } catch (error) {
        console.log(error);

        if (error.status === 5409) {            
            openToaster(
                ErrorToaster({ message: 'Já existe um quiz com esse nome!' })
            )
            closeToaster()
        } else {
            console.log(error);
            
            alert('Algo deu errado, tente novamente mais tarde...')
        }
    }
}
function saveData() {
    const form = document.querySelector('form')
    const perguntasContainer = Array.from(form.querySelectorAll('.pergunta-container'))
    const perguntas = 
        perguntasContainer.map((pergunta) => {
            const alternativasIncorretas = Array.from(pergunta.querySelectorAll('.incorreta'))
            const incorretasArray = alternativasIncorretas.map((i) => {
                return {
                    conteudo: i.value.trim(),
                    isCorreta: false
                }
            })
            
            return {
                pergunta: pergunta.querySelector('.pergunta').value.trim(),
                alternativas: [
                    {
                        conteudo: pergunta.querySelector('.correta').value.trim(),
                        isCorreta: true
                    },  
                    incorretasArray[0],
                    incorretasArray[1],
                    incorretasArray[2]          
                ]
            }
        })
    
    const jsonData = JSON.stringify(perguntas)
    localStorage.setItem('perguntas', jsonData)
}
export async function Step2Page() {
    const step = localStorage.getItem('step')
    if (!step) navigateTo(ROUTES.ERROR404)

    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const form = document.createElement('form')
    const buttonsContainer = document.createElement('div')
    const headingContainer = document.createElement('div')
    const rascunhoId = localStorage.getItem('rascunhoId')
    const { nome, disciplina } = JSON.parse(localStorage.getItem('infos'))

    form.className = 'mt-10 md:px-11 space-y-16'
    headingContainer.className = 'flex flex-row justify-between'
    buttonsContainer.className = 'gap-4 flex justify-end'
    for (let i =1; i <= 10; i++) {
        form.appendChild(
            Question({ number: i })
        )
    }
    headingContainer.appendChild(
        Heading({
            goBack: true, 
            title: nome, 
            subtitle: disciplina.nome,
            onGoBack: () => {
                saveData()
                history.back()
            }
        })
    )
    buttonsContainer.append(
        Button({
            variant: 'outline', 
            size:'md', 
            title: 'Guardar como rascunho', 
            ariaLabel: 'Botão para guardar quiz como rascunho',
            type: 'button', 
            onClick: () => handleGuardarRascunho(), 
            id: 'button-id',
        }),        
        Button({
            variant: 'primary', 
            size:'md', 
            title: 'Postar', 
            ariaLabel: 'Botão de submit para postar quiz',
            type: 'submit', 
            id: 'submit',
        }),
    )
    form.appendChild(buttonsContainer)
    main.append(
        headingContainer,
        form
    )
    
    if (rascunhoId) {
        const removeButton = document.createElement('button')
        const removeIcon = document.createElement('i')

        removeIcon.className = 'ph ph-trash-simple text-xl text-stone-400'
        removeButton.onclick = () => {
            openDialog(
                AlertDialog({
                    message: 'Você irá excluir este quiz. Esta ação não pode ser desfeita.', 
                    confirmarButtonName: 'Excluir', 
                    onConfirm: async () => {
                        await makeRequest({
                            url: API_ENDPOINTS.DELETE_QUIZ(rascunhoId), 
                            method: 'DELETE', 
                            token: localStorage.getItem('accessToken'), 
                        })
                        localStorage.removeItem('perguntas')
                        localStorage.removeItem('infos')
                        localStorage.setItem('rascunhoDeletado', true)
                        navigateTo(ROUTES.PROFESSOR.DISCIPLINA(disciplina.id))
                    }
                })
            )
        }
        removeButton.appendChild(removeIcon)
        headingContainer.appendChild(removeButton)
    }

    const perguntasAlteradas = JSON.parse(localStorage.getItem('perguntas'))
    const perguntasRascunho = JSON.parse(localStorage.getItem('perguntasRascunho'))
    const perguntas = perguntasRascunho || perguntasAlteradas
    if (perguntas && perguntas.length > 0) {
        const perguntasContainer = form.querySelectorAll('.pergunta-container')

        perguntasContainer.forEach((container) => {
            console.log(container);
            
            const pergunta = container.querySelector('.pergunta')
            const correta = container.querySelector('.correta')
            const incorretas = container.querySelectorAll('.incorreta')
            const incorreta1 = incorretas[0]
            const incorreta2 = incorretas[1]
            const incorreta3 = incorretas[2]
            const perguntaNum = pergunta.id

            pergunta.value = perguntas[perguntaNum - 1].pergunta
            pergunta.dispatchEvent(new Event('input', { bubbles: true }))
            
            correta.value = perguntas[perguntaNum - 1].alternativas[0].conteudo
            correta.dispatchEvent(new Event('input', { bubbles: true }))

            incorreta1.value = perguntas[perguntaNum - 1].alternativas[1].conteudo
            incorreta1.dispatchEvent(new Event('input', { bubbles: true }))

            incorreta2.value = perguntas[perguntaNum - 1].alternativas[2].conteudo
            incorreta2.dispatchEvent(new Event('input', { bubbles: true }))

            incorreta3.value = perguntas[perguntaNum - 1].alternativas[3].conteudo
            incorreta3.dispatchEvent(new Event('input', { bubbles: true }))

        })
    }

    form.onsubmit = handleSubmit

    loader.classList.add('hidden')
}