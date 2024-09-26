// Functions
import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'

// Components
import { Heading } from '/src/components/heading.js'
import { SidebarAluno } from '/src/pages/aluno/components/sidebar.js'
import { Empty } from '/src/components/empty.js'
import { QuizTable } from '../components/quiz-table.js'

async function PageDashboard() {
    try {
        verifyUserAccess('aluno')
        const root = document.getElementById('root')
        const main = document.getElementById('main')
        const loader = document.querySelector('.loader-container')
        const id = getUrlParam('id')

        document.addEventListener("DOMContentLoaded", function() {
            loader.classList.add('hidden')
        })

        const data = await makeRequest({
            url: API_ENDPOINTS.GET_QUIZ_INFO_BY_DISCIPLINA_ID(id), 
            method:'GET', 
            token: localStorage.getItem('accessToken')
        })
        const quizzes = data.quizes
        
        root.prepend(SidebarAluno())
        main.prepend(
            Heading({ 
                goBack: true, 
                onGoBack: () => history.back(),
                title: data.nome, 
                subtitle: 'Quizzes',
                subtitleSize: 'lg'
            })
        )

        if (quizzes.length === 0) {
            main.appendChild(
                Empty('Não há nenhum quiz cadastrado ainda.')
            )
        } else {
            main.appendChild(
                QuizTable(quizzes)
            )
        }
    
    } catch (error) {
        console.log(error);
        alert('Algo deu errado... Encerre a sessão e tente novamente.')
        
    }
}
PageDashboard()