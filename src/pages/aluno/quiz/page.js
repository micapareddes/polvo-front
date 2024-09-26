// Functions
import { ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'

// Components
import { SidebarAluno } from '../components/sidebar.js'
import { Step2Page } from './components/step-2-page.js'
import { Step1Page } from './components/step-1-page.js'

async function QuizPage() {
    const currentStep = getUrlParam('step')
    if (!currentStep) navigateTo(ROUTES.ERROR404)
    verifyUserAccess('aluno')

    const loader = document.querySelector('.loader-container')
    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })
    
    if (currentStep === '1') root.prepend(SidebarAluno())
    const step = {
        '1': Step1Page,
        '2': Step2Page,
    }
    step[currentStep]()
}
QuizPage()