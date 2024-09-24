import { Title } from "./fonts.js"

export function Heading({ title='Titulo', subtitle='', subtitleSize='lg', goBack=false, onGoBack=null }) {
    const heading = document.createElement('div')
    const eTitle = Title({ 
        title,
        size: '3xl',
        tone: 's-900',
    })
    const eSubtitle = Title({ 
        as: 'h2',
        title: subtitle,
        size: subtitleSize,
        tone: 's-700',
        bold: 'regular',
    })

    heading.append(eTitle, eSubtitle)

    if (goBack) {
        heading.classList.add('grid', 'grid-cols-heading', 'grid-rows-heading', 'items-center', 'justify-start')
        eSubtitle.classList.add('row-start-2', 'col-start-2')

        const goBackButton = document.createElement('button')
        const leftArrow = document.createElement('i')
        const div = document.createElement('div')

        div.className = 'flex justify-start w-8 h-8 mr-3'

        leftArrow.className = 'ph ph-caret-left text-2xl'

        goBackButton.className = 'row-span-2 hover:bg-neutral-200 rounded-md p-1'
        goBackButton.appendChild(leftArrow)
        div.appendChild(goBackButton)

        heading.prepend(div)

        goBackButton.onclick = onGoBack
    }
    
    return heading
}