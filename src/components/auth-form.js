import { Button } from "./button.js";
import { Box } from "./box.js";
import { Text, Title } from "./fonts.js";

export function AuthForm({ 
    title='Titulo', subtitle, buttonSize='full', buttonName, cardContent
}) {
    const container = document.createElement('form')
    const heading = document.createElement('div')
    const titulo = Title({
        title: title,
        size: '3xl',
        tone: 's-900',
        bold: 'semibold'
    })
    const subtitulo = Text({
        text: subtitle,
        size: 'md',
        tone: 's-700',
        className: 'text-center'
    })
    const button = Button({
        id: 'submit',
        type: 'submit',
        variant: 'primary',
        title: buttonName,
        size: buttonSize,
        ariaLabel: 'Botão de submit'
    })
    container.id = 'auth-form'
    container.className = 'flex flex-col justify-center items-center space-y-8 w-full'
    heading.className = 'flex flex-col items-center pb-5 px-7 border-b border-neutral-300 mb-12 space-y-5'
    heading.appendChild(titulo)

    if (subtitle) heading.appendChild(subtitulo)

    container.append(heading, cardContent, button)
    return Box({ content: container })
}