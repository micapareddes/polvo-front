import { TooltipInfo } from "./tooltip-info.js"

export function Select({ 
    placeholder='Placeholder', emptyOption, options=[], labelName, id, tooltip=false, tooltipMessage  
}) {
    const container = document.createElement('div')
    const labelContainer = document.createElement('div')
    const label = document.createElement('label')
    const select = document.createElement('select')
    const placeholderOption = document.createElement('option')
    const optionDivider = document.createElement('hr')

    container.className = 'space-y-3'

    select.name = id
    select.id = id
    select.className = 'px-2 py-3 border-b border-neutral-300 bg-transparent text-base text-stone-900 w-full'

    label.textContent = labelName
    label.htmlFor = id
    label.className = 'text-base text-stone-900 capitalize'

    labelContainer.className = 'flex items-center gap-1' 

    placeholderOption.text = placeholder
    placeholderOption.value = ''
    placeholderOption.disabled = true
    placeholderOption.selected = true

    select.append(placeholderOption, optionDivider)

    if (emptyOption) {
        const empty = document.createElement('option')

        empty.text = emptyOption
        empty.value = 'null'

        select.appendChild(empty)
    }

    options.forEach((option) => {
        const optionElement = document.createElement('option')
        optionElement.text = option.text
        optionElement.value = option.value
        select.appendChild(optionElement)
    })

    labelContainer.appendChild(label)

    if (tooltip) labelContainer.appendChild( TooltipInfo({ message: tooltipMessage }) )

    if (labelName)  container.appendChild(labelContainer)

    container.append(select)

    return container
}