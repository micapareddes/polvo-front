// Functions
import { ROUTES, API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { infoQuizValidation } from '/frontend/src/validations/infoQuizValidation.js'
import { getProfessorDisciplinas } from '../../../service/getProfessorDisciplinas.js'
import { navigateTo} from '/frontend/src/functions/navigateTo.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'
import { getUrlParam } from '/frontend/src/functions/getUrlParam.js'

// Components
import { Heading } from '/frontend/src/components/heading.js'
import { AlertDialog, openDialog } from '/frontend/src/components/dialog.js'
import { TextInput } from '/frontend/src/components/text-input.js'
import { Select } from '/frontend/src/components/select.js'
import { DataInput } from '/frontend/src/components/data-input.js'
import { TextArea } from '/frontend/src/components/text-area.js'
import { Button } from '/frontend/src/components/button.js'
import { ErrorMessage } from '/frontend/src/components/error-message.js'

async function handleGuardarRascunho() {
    const form = document.getElementById('form')
    const nomeInput = form.querySelector('#nome')
    const tentativasInput = form.querySelector('#tentativas')
    const disciplinaInput = form.querySelector('#disciplina')
    const tipoInput = form.querySelector('#tipo')
    const tempoMaxInput = form.querySelector('#tempo-max')
    const dataInicioInput = form.querySelector('#data-inicio').querySelector('input')
    const dataFinalInput = form.querySelector('#data-final').querySelector('input')
    const orientacoesInput = form.querySelector('#orientacoes')
    const nomeInputContainer = form.querySelector('#nome-container')
    const tentativasInputContainer = form.querySelector('#tentativas-container')
    const disciplinaSelectContainer = form.querySelector('#disciplina-container')
    const tipoSelectContainer = form.querySelector('#tipo-container')
    const tempoMaxSelectContainer = form.querySelector('#tempo-max-container')
    const dataInicioContainer = form.querySelector('#data-inicio-container')
    const dataFinalContainer = form.querySelector('#data-final-container')
    const saveButton = form.querySelector('#guardar-rascunho-button')
    const perguntas = localStorage.getItem('perguntas')
    const data = {
        nome: nomeInput.value.trim(),
        tentativas: tentativasInput.value.trim(),
        disciplina: {
            id: disciplinaInput.value,
            nome: disciplinaInput.selectedOptions[0].textContent.trim(),
        },
        tipo: tipoInput.value,
        tempoMax: tempoMaxInput.value,
        dataInicio: dataInicioInput.value,
        dataFinal: dataFinalInput.value,
        orientacoes: orientacoesInput.value,
    }

    const { success, error } = infoQuizValidation(data)
    
    if (!success) {
        if (error.nameValidation) {
            nomeInput.classList.add('border-red-500')
            nomeInputContainer.appendChild(
                ErrorMessage('O nome deve conter pelo menos 3 caracteres.')
            )
        }
        if (error.disciplinaValidation) {
            disciplinaInput.classList.add('border-red-500')
            disciplinaSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }
        if (error.typeValidation) {
            tipoInput.classList.add('border-red-500')
            tipoSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }        
        if (error.attemptsValidation) {
            tentativasInput.classList.add('border-red-500')
            tentativasInputContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }
        if (error.maxTimeValidation) {
            tempoMaxInput.classList.add('border-red-500')
            tempoMaxSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }        
        if (error.startDateValidation) {
            dataInicioInput.classList.add('border-b-red-500')
            dataInicioContainer.appendChild(
                ErrorMessage('Data inválida.')
            )
        }
        if (error.endDateValidation) {
            dataFinalInput.classList.add('border-b-red-500')
            dataFinalContainer.appendChild(
                ErrorMessage('Data inválida.')
            )
        }
        saveButton.disabled = true
        return
    }

    const formatedData = {
        titulo: data.nome,
        disciplina_id: data.disciplina.id,
        tipo: data.tipo,
        tempo: data.tempoMax,
        tentativas: data.tentativas,
        data_inicio: data.dataInicio,
        data_fim: data.dataFinal,
        orientacao: data.orientacoes,
        isRascunho: true,
        perguntas: perguntas ? JSON.parse(perguntas) : []
    }

    try {
        await makeRequest({
            url: API_ENDPOINTS.POST_QUIZ, 
            method: 'POST', 
            token: localStorage.getItem('accessToken'), 
            data: formatedData, 
        })
        localStorage.setItem('rascunho', true)
        localStorage.removeItem('perguntas')
        localStorage.removeItem('infos')
        localStorage.removeItem('mudou')
        navigateTo(ROUTES.PROFESSOR.DISCIPLINA(data.disciplina.id))

    } catch (error) {
        console.log(error)
        alert('Algo deu errado, tente novamente mais tarde...')
    }

}
function handleCriarPerguntas(e) {
    e.preventDefault()
    const form = document.getElementById('form')
    const nomeInput = form.querySelector('#nome')
    const tentativasInput = form.querySelector('#tentativas')
    const disciplinaInput = form.querySelector('#disciplina')
    const tipoInput = form.querySelector('#tipo')
    const tempoMaxInput = form.querySelector('#tempo-max')
    const dataInicioInput = form.querySelector('#data-inicio').querySelector('input')
    const dataFinalInput = form.querySelector('#data-final').querySelector('input')
    const orientacoesInput = form.querySelector('#orientacoes')
    const nomeInputContainer = form.querySelector('#nome-container')
    const tentativasInputContainer = form.querySelector('#tentativas-container')
    const disciplinaSelectContainer = form.querySelector('#disciplina-container')
    const tipoSelectContainer = form.querySelector('#tipo-container')
    const tempoMaxSelectContainer = form.querySelector('#tempo-max-container')
    const dataInicioContainer = form.querySelector('#data-inicio-container')
    const dataFinalContainer = form.querySelector('#data-final-container')
    const submit = form.querySelector('#criar-perguntas-button')

    const data = {
        nome: nomeInput.value.trim(),
        tentativas: tentativasInput.value.trim(),
        disciplina: {
            id: disciplinaInput.value,
            nome: disciplinaInput.selectedOptions[0].textContent.trim(),
        },
        tipo: tipoInput.value,
        tempoMax: tempoMaxInput.value,
        dataInicio: dataInicioInput.value,
        dataFinal: dataFinalInput.value,
        orientacoes: orientacoesInput.value,
    }
    
    const { success, error } = infoQuizValidation(data)
    
    if (!success) {
        if (error.nameValidation) {
            nomeInput.classList.add('border-red-500')
            nomeInputContainer.appendChild(
                ErrorMessage('O nome deve conter pelo menos 3 caracteres.')
            )
        }
        if (error.disciplinaValidation) {
            disciplinaInput.classList.add('border-red-500')
            disciplinaSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }
        if (error.typeValidation) {
            tipoInput.classList.add('border-red-500')
            tipoSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }        
        if (error.attemptsValidation) {
            tentativasInput.classList.add('border-red-500')
            tentativasInputContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }
        if (error.maxTimeValidation) {
            tempoMaxInput.classList.add('border-red-500')
            tempoMaxSelectContainer.appendChild(
                ErrorMessage('Este campo é obrigatorio.')
            )
        }        
        if (error.startDateValidation) {
            dataInicioInput.classList.add('border-b-red-500')
            dataInicioContainer.appendChild(
                ErrorMessage('Data inválida.')
            )
        }
        if (error.endDateValidation) {
            dataFinalInput.classList.add('border-b-red-500')
            dataFinalContainer.appendChild(
                ErrorMessage('Data inválida.')
            )
        }
        submit.disabled = true
        return
    }

    const jsonData = JSON.stringify(data)
    localStorage.setItem('infos', jsonData)
    localStorage.setItem('step', true)

    navigateTo('/frontend/src/pages/professor/quiz/create/index.html?step=2')
}
function handleFormChange() {
    const form = document.getElementById('form')

    const nomeInputContainer = form.querySelector('#nome-container')
    const errorNome = nomeInputContainer.querySelector('.error-message')

    const tentativasInputContainer = form.querySelector('#tentativas-container')
    const erroTentativas = tentativasInputContainer.querySelector('.error-message')

    const disciplinaSelectContainer = form.querySelector('#disciplina-container')
    const erroDisciplina = disciplinaSelectContainer.querySelector('.error-message')

    const tipoSelectContainer = form.querySelector('#tipo-container')
    const erroTipo = tipoSelectContainer.querySelector('.error-message')
    
    const tempoMaxSelectContainer = form.querySelector('#tempo-max-container')
    const erroTempoMax = tempoMaxSelectContainer.querySelector('.error-message')

    const dataInicioContainer = form.querySelector('#data-inicio-container')
    const erroDataInicio = dataInicioContainer.querySelector('.error-message')

    const dataFinalContainer = form.querySelector('#data-final-container')
    const erroDataFinal = dataFinalContainer.querySelector('.error-message')

    const submit = form.querySelector('#criar-perguntas-button')
    const saveButton = form.querySelector('#guardar-rascunho-button')


    if (errorNome) {
        const nomeInput = form.querySelector('#nome')
        errorNome.remove()
        nomeInput.classList.remove('border-red-500')
    } 
    if (erroTempoMax) {
        const tempoMaxSelect = form.querySelector('#tempo-max')
        erroTempoMax.remove()
        tempoMaxSelect.classList.remove('border-red-500')
    }  
    if (erroTentativas) {
        const tentativas = form.querySelector('#tentativas')
        erroTentativas.remove()
        tentativas.classList.remove('border-red-500')
    } 
    if (erroDisciplina) {
        const disciplinaSelect = form.querySelector('#disciplina')
        erroDisciplina.remove()
        disciplinaSelect.classList.remove('border-red-500')
    }   
    if (erroTipo) {
        const tipo = form.querySelector('#tipo')
        erroTipo.remove()
        tipo.classList.remove('border-red-500')
    } 
    if (erroDataInicio) {
        const dataInicio = form.querySelector('#data-inicio')
        const input = dataInicio.querySelector('input')
        erroDataInicio.remove()
        input.classList.remove('border-b-red-500')
    }
    if (erroDataFinal) {
        const dataFinal = form.querySelector('#data-final')
        const input = dataFinal.querySelector('input')
        erroDataFinal.remove()
        input.classList.remove('border-b-red-500')
    }  
     
    submit.disabled = false
    saveButton.disabled = false

    localStorage.setItem('mudou', true)
}
export async function Step1Page() {
try {
    localStorage.removeItem('step')
    const rascunhoId = getUrlParam('id')

    const main = document.getElementById('main')
    const form = document.createElement('form')
    const nameInputContainer = document.createElement('div')
    const disciplinaSelectContainer = document.createElement('div')
    const tipoSelectContainer = document.createElement('div')
    const tentativasContainer = document.createElement('div')
    const tempoMaxSelectContainer = document.createElement('div')
    const dataInicioContainer = document.createElement('div')
    const dataFinalContainer = document.createElement('div')
    const buttonsContainer = document.createElement('div')
    const headingContainer = document.createElement('div')
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
    const disciplinas = await getProfessorDisciplinas()
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

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}min`;
        }
    }
    for (let i =30; i <= 240; i+= 30) {
        quizMaxTime.push({
            text: formatTime(i),
            value: i,
        })
    }
    form.id = 'form'
    form.className = 'pt-6 gap-6 md:gap-8 md:p-10 flex flex-col md:grid md:grid-cols-2'
    headingContainer.className = 'flex flex-row justify-between'
    buttonsContainer.className = 'md:col-span-2 flex flex-col md:flex-row gap-4 justify-end'
    nameInputContainer.className = 'col-span-2'
    disciplinaSelectContainer.id = 'disciplina-container'
    tipoSelectContainer.id = 'tipo-container'
    tentativasContainer.id = 'tentativas-container'
    tempoMaxSelectContainer.id = 'tempo-max-container'
    dataInicioContainer.id = 'data-inicio-container'
    dataFinalContainer.id = 'data-final-container'

    buttonsContainer.append(
        Button({
            variant: 'outline',
            size: 'md', 
            title: 'Guardar como rascunho', 
            ariaLabel: 'Botão para guardar quiz como rascunho',
            type: 'button', 
            onClick: () => handleGuardarRascunho(), 
            id: 'guardar-rascunho-button'
        }),            
        Button({
            variant: 'primary',
            size: 'md', 
            title: 'Criar Perguntas', 
            ariaLabel: 'Botão para criar perguntas do quiz',
            type: 'submit', 
            id: 'criar-perguntas-button'
        }),
    )
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
    tempoMaxSelectContainer.appendChild(
        Select({
            placeholder: 'Tempo máximo para realizar o quiz', 
            options: quizMaxTime,
            id: 'tempo-max',
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
    headingContainer.appendChild(
        Heading({
            goBack: true, 
            title: 'Informações do quiz', 
            onGoBack: () => {
                if (localStorage.getItem('mudou')) {
                    openDialog(
                        AlertDialog({
                            message: 'O cadastro não será salvo.',
                            confirmarButtonName: 'Voltar',
                            onConfirm: () => {
                                localStorage.removeItem('infos')
                                localStorage.removeItem('perguntas')
                                localStorage.removeItem('mudou')
                                history.back()
                            }
                        })
                    )
                    return
                }
                localStorage.removeItem('infos')
                localStorage.removeItem('perguntas')
                localStorage.removeItem('mudou')
                history.back()
            }
        }),
    )
    form.append(
        nameInputContainer,
        disciplinaSelectContainer,
        tipoSelectContainer,
        tentativasContainer,
        tempoMaxSelectContainer,
        dataInicioContainer,
        dataFinalContainer,
        TextArea({
            placeholder: 'Escreva aqui as orientações para o aluno...',
            id: 'orientacoes',
            size: 'full',
            className: 'col-span-2',
        }),
        buttonsContainer
    )
    main.append(
        headingContainer,
        form
    )

    form.onsubmit = handleCriarPerguntas
    form.oninput = handleFormChange

    const dadosPreenchidos = JSON.parse(localStorage.getItem('infos'))
    const nomeInput = form.querySelector('#nome')
    const tentativasInput = form.querySelector('#tentativas')
    const disciplinaInput = form.querySelector('#disciplina')
    const tipoInput = form.querySelector('#tipo')
    const tempoMaxInput = form.querySelector('#tempo-max')
    const dataInicioInput = form.querySelector('#data-inicio').querySelector('input')
    const dataFinalInput = form.querySelector('#data-final').querySelector('input')
    const orientacoesInput = form.querySelector('#orientacoes')
    
    if (rascunhoId) {
        const { data_fim, data_inicio, disciplina_id, orientacao, tempo, tentativas, tipo, titulo, perguntas } = await makeRequest({
            url: API_ENDPOINTS.GET_QUIZ(rascunhoId),
            method: 'GET', 
            token: localStorage.getItem('accessToken'), 
        })
        const removeButton = document.createElement('button')
        const removeIcon = document.createElement('i')

        localStorage.setItem('rascunhoId', rascunhoId)
        console.log(perguntas);
        
        const jsonData = JSON.stringify(perguntas)
        localStorage.setItem('perguntasRascunho', jsonData)

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
                        localStorage.removeItem('mudou')
                        localStorage.setItem('rascunhoDeletado', true)
                        navigateTo(ROUTES.PROFESSOR.DISCIPLINA(disciplina_id._id))
                    }
                })
            )
        }
        removeButton.appendChild(removeIcon)
        headingContainer.appendChild(removeButton)

        nomeInput.value = titulo
        disciplinaInput.value = disciplina_id._id
        tentativasInput.value = tentativas
        tempoMaxInput.value = tempo
        dataInicioInput.value = data_inicio
        dataFinalInput.value = data_fim
        orientacoesInput.value = orientacao
        tipoInput.value = tipo
    }

    if (dadosPreenchidos) {
        nomeInput.value = dadosPreenchidos.nome
        disciplinaInput.value = dadosPreenchidos.disciplina.id
        tentativasInput.value = dadosPreenchidos.tentativas
        tempoMaxInput.value = dadosPreenchidos.tempoMax
        dataInicioInput.value = dadosPreenchidos.dataInicio
        dataFinalInput.value = dadosPreenchidos.dataFinal
        orientacoesInput.value = dadosPreenchidos.orientacoes
        tipoInput.value = dadosPreenchidos.tipo
    }
} catch (error) {
    console.log(error);
    alert('Algo deu errado, tente novamente mais tarde...')
        
}
}