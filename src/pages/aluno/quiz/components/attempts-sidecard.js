import { SidecardBoxWithTitle } from "/src/components/sidecard.js"
import { Button } from '/src/components/button.js'

function AttemptItem({ attemptNumber, grade, answerLink, disabledButton=false }) {
    const container = document.createElement('div')
    const attemptNumberElement = document.createElement('p')
    const gradeElement = document.createElement('p')
    const seeAnswerButton = Button({
        variant: 'ghost',
        title: 'Gabarito',
        ariaLabel: 'Botão para ver gabarito',
        link: answerLink,
        disabled: disabledButton,
    })

    container.className = 'flex flex-row w-60 justify-between'

    attemptNumberElement.textContent = attemptNumber
    attemptNumberElement.className = 'text-base text-stone-700'

    gradeElement.textContent = grade + ' / 10'
    gradeElement.className = 'text-base font-semibold text-stone-700'

    container.append(attemptNumberElement, gradeElement, seeAnswerButton)

    return container
}

export function AttemptsSidecard({ attempts=[] }) {
    const attemptsContainer = document.createElement('div')
    const noAttemptsContainer = document.createElement('div')
    const noAttemptsMessage = document.createElement('p')

    attemptsContainer.className = 'space-y-4'

    noAttemptsContainer.className = 'h-screen flex flex-col'

    noAttemptsMessage.textContent = 'Você não possui nenhuma tentativa.'
    noAttemptsMessage.className = 'text-sm text-stone-400 text-center max-w-32 mt-auto mb-auto'

    attempts.forEach((attempt) => {
        attemptsContainer.appendChild(AttemptItem({
            attemptNumber: attempt.attemptNumber + 'º Tentativa',
            grade: attempt.grade,
            answerLink: attempt.answerLink,
        }))
    })

    noAttemptsContainer.appendChild(noAttemptsMessage)

    const content = attempts.length === 0 ? noAttemptsContainer : attemptsContainer

    return SidecardBoxWithTitle({
        title: 'Suas Tentativas',
        content,
    })
}