// Functions
import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { navigateTo } from '/src/functions/navigateTo.js'

// Components
import { Heading } from '/src/components/heading.js'
import { SidebarProfessor } from '/src/pages/professor/components/sidebar-professor.js'
import { AlertDialog, openDialog } from '/src/components/dialog.js'
import { openToaster, closeToaster, SuccessToaster } from '/src/components/toaster.js'
import { Empty } from '/src/components/empty.js'
import { Button } from '/src/components/button.js'
import { Title } from '/src/components/fonts.js'
import { QuizInfo } from '/src/components/quiz-info.js'
import { Text } from '/src/components/fonts.js'
import { StudentGradeListItem } from './components/student-grade-list.js'

async function QuizInfoPage() {
try {
    verifyUserAccess('professor')
    const quizId = getUrlParam('id')
    const root = document.getElementById('root')
    const main = document.getElementById('main')
    const loader = document.querySelector('.loader-container')
    const content = document.createElement('div')
    const alunosContainer = document.createElement('div')
    const headingContainer = document.createElement('div')
    const dotMenuContainer = document.createElement('div')
    const dotMenu = document.createElement('button')
    const dotMenuIcon = document.createElement('i')
    const dotMenuOptions = document.createElement('i')
    const removeButton = document.createElement('button')
    const editButton = document.createElement('button')
    const removeIcon = document.createElement('i')
    const editIcon = document.createElement('i')
    const navAlunosContainer = document.createElement('nav')
    const listaAlunosContainer = document.createElement('ul')
    const accessToken = localStorage.getItem('accessToken')

    const { alunos, data_fim, data_inicio, disciplina, orientacao, tempo, tentativas, titulo } = await makeRequest({ 
        url: API_ENDPOINTS.GET_QUIZ_INFO_FOR_PROFESSOR_BY_ID(quizId), 
        method: 'GET', 
        token: accessToken, 
    })
    
    content.className = 'ml-11 mt-8 space-y-10'
    headingContainer.className = 'flex justify-between'
    alunosContainer.className = 'space-y-3'
    listaAlunosContainer.className = 'space-y-2'
    dotMenuContainer.className = 'relative'    
    dotMenuIcon.className = 'ph ph-dots-three text-2xl p-2 rounded-lg text-stone-700 hover:bg-neutral-100'
    dotMenuOptions.className = 'hidden absolute right-0 top-8 mt-1 p-2 rounded-2xl border border-neutral-200 bg-neutral-50'
    removeButton.textContent = 'Remover'
    removeButton.className = 'rounded-lg p-2 hover:bg-neutral-100 w-full flex gap-2 items-center justify-start text-stone-700'
    removeIcon.className = 'ph ph-trash-simple text-lg'
    editButton.textContent = 'Editar'
    editButton.className = 'rounded-lg p-2 hover:bg-neutral-100 w-full flex gap-2 items-center justify-start text-stone-700'
    editIcon.className = 'ph ph-pencil-simple-line text-lg'

    if (alunos.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'mt-14'
        empty.appendChild(
            Text({
                text: 'Nenhum aluno respondeu ainda :(',
                tone: 's-400'
            })
        )
        navAlunosContainer.appendChild(empty)
    } else {
        alunos.forEach((aluno) => {
            listaAlunosContainer.append(
                StudentGradeListItem({ 
                    studentName: aluno.aluno_id.nome, 
                    answerLink: ROUTES.PROFESSOR.QUIZ.GABARITO({
                        quiz: quizId,
                        tentativa: aluno._id
                    }), 
                    grade: aluno.nota 
                })
            )
            navAlunosContainer.appendChild(listaAlunosContainer)
        })
    }

    removeButton.prepend(removeIcon)
    editButton.prepend(editIcon)
    dotMenu.appendChild(dotMenuIcon)
    dotMenuOptions.append(
        editButton,
        removeButton,
    )
    dotMenuContainer.append(
        dotMenu,
        dotMenuOptions,
    )
    root.prepend(SidebarProfessor())
    headingContainer.append(
        Heading({ 
            goBack: true, 
            onGoBack: () => history.back(),
            title: titulo, 
            subtitle: disciplina.nome,
            subtitleSize: 'lg'
        }),
        dotMenuContainer,
    )
    alunosContainer.append(
        Title({
            title: 'Alunos que responderam',
            size: 'lg', 
            tone: 's-700', 
            bold: 'semibold', 
            as: 'h4', 
        }),
        navAlunosContainer,
    )
    content.append(
        QuizInfo({
            orientacao,
            tentativas,
            tempo,
            dataFim: data_fim,
            dataInicio: data_inicio,
        }),
        alunosContainer
    )
    main.append(
        headingContainer,
        content,
    )

    removeButton.onclick = () => {
        openDialog(
            AlertDialog({
                message: `Você irá remover o quiz ${titulo}. Esta ação não pode ser desfeita.`, 
                confirmarButtonName: 'Remover', 
                onConfirm: async () => {
                    await makeRequest({ //TODO: Adicionar try catch
                        url: API_ENDPOINTS.DELETE_QUIZ(quizId), 
                        method: 'DELETE', 
                        token: accessToken, 
                    })
                    localStorage.setItem('quizDeletado', true)
                    navigateTo(ROUTES.PROFESSOR.DISCIPLINA(disciplina.id))
                } 
            })
        )
    }

    editButton.onclick = () => {
        navigateTo(ROUTES.PROFESSOR.QUIZ.EDIT(quizId))
    }

    dotMenu.onclick = () => {
        dotMenuOptions.classList.toggle('hidden')
    }

    document.addEventListener('click', (event) => {
        const isClickInside = dotMenu.contains(event.target) || dotMenuOptions.contains(event.target)
        if (!isClickInside) {
            dotMenuOptions.classList.add('hidden')
        }
    })

    if (localStorage.getItem('quizEditado')) {
        localStorage.removeItem('quizEditado')
        openToaster(
            SuccessToaster({
                message: 'Edicoes de quiz salvas!'
            })
        )
        closeToaster()
    }
    loader.classList.add('hidden')

} catch (error) {
    console.log(error);
    alert('Algo deu errado...')
    
}
} QuizInfoPage()