// Functions
import { ROUTES, API_ENDPOINTS } from '/frontend/src/utils/routes.js'
import { verifyUserAccess } from '/frontend/src/auth/verifyUserAccess.js'
import { getUrlParam } from '/frontend/src/functions/getUrlParam.js'
import { makeRequest } from '/frontend/src/functions/makeRequest.js'

// Components
import { Heading } from '/frontend/src/components/heading.js'
import { SidebarProfessor } from '/frontend/src/pages/professor/components/sidebar-professor.js'
import { Empty } from '/frontend/src/components/empty.js'
import { Button } from '/frontend/src/components/button.js'
import { ListItemBoxWithTitle } from '/frontend/src/components/list.js'
import { Title } from '/frontend/src/components/fonts.js'
import { openToaster, closeToaster, SuccessToaster } from '/frontend/src/components/toaster.js'

async function DisciplinaPage() {
    try {
        verifyUserAccess('professor')
        const disciplinaId = getUrlParam('id')
        const root = document.getElementById('root')
        const main = document.getElementById('main')
        const contentContainer = document.createElement('div')
        const header = document.createElement('div')
        const accessToken = localStorage.getItem('accessToken')
        const { postados, rascunhos } = await makeRequest({ 
            url: API_ENDPOINTS.GET_QUIZZES_FOR_PROFESSOR_BY_DISCIPLINA_ID(disciplinaId), 
            method: 'GET', 
            token: accessToken, 
        })
        const reqNomeDisciplina = await makeRequest({ 
            url: API_ENDPOINTS.GET_DISCIPLINA_NAME(disciplinaId), 
            method: 'GET', 
            token: accessToken, 
        })
        const nomeDisciplina = reqNomeDisciplina.nome
        
        contentContainer.className = 'flex w-full justify-between items-start gap-10 mt-10'
        header.className = 'flex w-full justify-between items-center'
        header.append(
            Heading({ 
                goBack: true, 
                onGoBack: () => history.back(),
                title: nomeDisciplina,
                subtitle: 'Quizzes',
                subtitleSize: 'lg'
            }),
            Button({
                title: 'Criar quiz',
                ariaLabel: 'Botão para criar novo quiz',
                icon: 'file-plus',
                id: 'criar-quiz',
                link: ROUTES.PROFESSOR.QUIZ.CREATE,
            })
        )
        root.prepend(SidebarProfessor())
        main.appendChild(header)
        main.append(contentContainer)
        
        if (postados.length === 0 && rascunhos.length === 0) {
            main.appendChild(
                Empty('Não foi cadastrado nenhum quiz ainda.')
            )
        }

        if (postados.length > 0) {
            const postadosContainer = document.createElement('div')
            const navPostados = document.createElement('nav')
            const ulPostados = document.createElement('ul')
            postadosContainer.className = 'w-full'
            ulPostados.className = 'space-y-2'
            postados.forEach((quiz) => {
                ulPostados.appendChild(
                    ListItemBoxWithTitle({ 
                        title: quiz.titulo,
                        linkPainel: ROUTES.PROFESSOR.QUIZ.INFO(quiz._id),
                    })
                )
            })
            navPostados.appendChild(ulPostados)
            postadosContainer.append(
                Title({
                    title:'Postados', 
                    size: 'lg', 
                    tone: 's-700', 
                    bold: 'semibold', 
                    as:'h3', 
                }),
                navPostados,
            )
            
            contentContainer.appendChild(postadosContainer)
        }

        if (rascunhos.length > 0) {
            const rascunhosContainer = document.createElement('div')
            const navRascunhos = document.createElement('nav')
            const ulRascunhos = document.createElement('ul')
            rascunhosContainer.className = 'w-full'
            ulRascunhos.className = 'space-y-2'
            rascunhos.forEach((quiz) => {
                ulRascunhos.appendChild(
                    ListItemBoxWithTitle({ 
                        title: quiz.titulo,
                        linkPainel: ROUTES.PROFESSOR.QUIZ.RASCUNHO(quiz._id),
                    })
                )
            })
            navRascunhos.appendChild(ulRascunhos)
            rascunhosContainer.append(
                Title({
                    title:'Rascunhos', 
                    size: 'lg', 
                    tone: 's-700', 
                    bold: 'semibold', 
                    as:'h3', 
                }),
                navRascunhos,
            )
            contentContainer.appendChild(rascunhosContainer)
        }

        if (localStorage.getItem('rascunho')) {
            localStorage.removeItem('rascunho')
            openToaster(
                SuccessToaster({
                    message: 'Rascunho salvo com sucesso!'
                })
            )
            closeToaster()
        }
        if (localStorage.getItem('quizCadastrado')) {
            localStorage.removeItem('quizCadastrado')
            openToaster(
                SuccessToaster({
                    message: 'Quiz cadastrado com sucesso!'
                })
            )
            closeToaster()
        }
        if (localStorage.getItem('rascunhoDeletado')) {
            localStorage.removeItem('rascunhoDeletado')
            openToaster(
                SuccessToaster({
                    message: 'Rascunho deletado com sucesso!'
                })
            )
        }
        if (localStorage.getItem('quizDeletado')) {
            localStorage.removeItem('quizDeletado')
            openToaster(
                SuccessToaster({
                    message: 'Quiz deletado com sucesso!'
                })
            )
            closeToaster()
        }
                
    } catch (error) {
        console.log(error);
        alert('Algo deu errado, tente novamente mais tarde...')
    }
} DisciplinaPage()