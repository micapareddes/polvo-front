import { TooltipInfo } from "./tooltip-info.js"

export function TextInput({ 
    type='text', labelName, placeholder='Placeholder', id, size='regular', fill=false, tooltip=false, tooltipMessage, className 
}) {
    const text = {
        'regular': 'text-base',
        'large': 'text-lg',
    }

    const container = document.createElement('div')
    const labelContainer = document.createElement('div')
    const label = document.createElement('label')
    const input = document.createElement('input')

    container.className = 'space-y-3'
    container.id = `${id}-container`

    input.type = type
    input.name = id
    input.id = id
    input.placeholder = placeholder
    input.className = `px-2 py-3 rounded-md border ${fill ? 'border-neutral-200' : 'border-neutral-300'} ${fill ? 'bg-neutral-100' : 'bg-transparent'} ${text[size]} text-stone-900 w-full ${className}`

    label.textContent = labelName
    label.htmlFor = id
    label.className = 'text-base text-stone-900 capitalize'

    labelContainer.className = 'flex items-center gap-1' 

    labelContainer.appendChild(label)

    if (tooltip) labelContainer.appendChild( TooltipInfo({ message: tooltipMessage }) )

    if (labelName)  container.appendChild(labelContainer)

    container.append(input)

    return container
}