// Functions
import { ROUTES } from '/src/utils/routes.js'
import { verifyUserAccess } from '/src/auth/verifyUserAccess.js'
import { navigateTo } from '/src/functions/navigateTo.js'
import { getUrlParam } from '/src/functions/getUrlParam.js'

// Components
import { SidebarProfessor } from '/src/pages/professor/components/sidebar-professor.js'
import { Step1Page } from './components/step-1-page.js'
import { Step2Page } from './components/step-2-page.js'

async function NovoQuizPage() {
    const currentStep = getUrlParam('step')
    if (!currentStep) navigateTo(ROUTES.ERROR404)
    verifyUserAccess('professor')
    const root = document.getElementById('root')
    const loader = document.querySelector('.loader-container')

    document.addEventListener("DOMContentLoaded", function() {
        loader.classList.add('hidden')
    })
    
    root.prepend(SidebarProfessor())
    const step = {
        '1': Step1Page,
        '2': Step2Page,
    }
    step[currentStep]()

}
NovoQuizPage()