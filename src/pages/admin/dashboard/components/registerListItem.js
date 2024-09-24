import { ListItemBoxWithTitle } from '/src/components/list.js'
import { Button } from '/src/components/button.js'

export function RegisterListItem({ name='Text', registerLink, linkPainel }) {
    const container = document.createElement('div')

    container.className = 'flex w-full flex-row justify-between items-center'
    container.appendChild(
        Button({
            title: 'Cadastrar novo',
            variant: 'ghost',
            size: 'md',
            link: registerLink,
            ariaLabel: 'Botão para cadastrar novo'
        })
    )

    return ListItemBoxWithTitle({ 
        title: name, content: container,
        linkPainel,
    })
}