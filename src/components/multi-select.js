import { TooltipInfo } from "/frontend/src/components/tooltip-info.js"

function selectedItem({ value, name, dataLabel }) {
    const selectedValue = document.createElement('span')
    const selectedValueName = document.createElement('p')
    const xIcon = document.createElement('i')
    selectedValue.id = value
    selectedValue.dataset.label = dataLabel
    selectedValue.className = 'selected-item flex-shrink-0 flex flex-nowrap items-center space-x-1 px-2 py-1 rounded-md bg-indigo-100'
    selectedValueName.textContent = name
    // xIcon.className = 'ph ph-x text-sm text-stone-500'
    selectedValue.append(selectedValueName)

    return selectedValue
}

export function MultiSelect({ 
    id='multiselect', labelName, placeholder='Placeholder', tooltip, optionsArray=[] 
}) {
    const multiselect = document.createElement('div')
    const labelContainer = document.createElement('div')
    const label = document.createElement('p')
    const selectButton = document.createElement('button')
    const selectedValuesContainer = document.createElement('div')
    const placeholderText = document.createElement('p')
    const arrow = document.createElement('i')
    const options = document.createElement('ul')

    multiselect.id = id
    multiselect.className = 'group relative space-y-3'

    label.textContent = labelName
    labelContainer.className = 'relative flex items-center gap-1'
    labelContainer.appendChild(label)
    if (tooltip) labelContainer.appendChild( TooltipInfo({ message: tooltip }) )

    selectButton.className = 'peer relative flex items-center justify-between w-full px-2 py-3 border-b border-stone-300'
    selectButton.type = 'button' 
    selectButton.dataset.open = false 
    selectButton.onclick = () => {
        const currentValue = selectButton.dataset.open === 'true'
        selectButton.dataset.open = !currentValue
    }

    placeholderText.className = 'font-base text-stone-400'
    placeholderText.textContent = placeholder
    selectedValuesContainer.className = 'flex items-center gap-2 w-full hide-scrollbar overflow-x-scroll'
    selectedValuesContainer.appendChild(placeholderText)

    arrow.className = 'ph-caret-right ph text-base text-stone-500 ml-2'

    options.className = `hidden absolute w-full peer-data-[open="true"]:block mt-1 max-h-44 md:max-h-60 hide-scrollbar overflow-y-auto space-y-1 p-2 rounded-2xl bg-neutral-50 border border-neutral-200
    [&_li]:p-2 [&_li]:rounded-lg
    `
    optionsArray.forEach((optionItem) => {
        const option = document.createElement('li')
        const optionInput = document.createElement('input')

        option.className = 'relative has-[:checked]:bg-indigo-100 hover:bg-neutral-200 cursor-pointer'
        optionInput.className = 'absolute inset-0 opacity-0'
        optionInput.type = 'checkbox'
        optionInput.id = 'option'
        optionInput.name = 'disciplinas'
        optionInput.value = optionItem._id
        optionInput.dataset.label = optionItem.nome
        option.append(optionInput, optionItem.nome)
        options.appendChild(option)
    })

    options.onchange = (e) => {
        if (e.target && e.target.type === 'checkbox') {
            const selectedOptions = options.querySelectorAll('#option:checked')
            const selectedOptionsArray = Array.from(selectedOptions)
            
            const optionsChanged = new CustomEvent('optionsChanged', {
                detail: {
                    selectedOptionsArray,
                }
            })

            selectedValuesContainer.dispatchEvent(optionsChanged)
        }
    }

    selectedValuesContainer.addEventListener('optionsChanged', (e) => {
        const checkedOptions = e.detail.selectedOptionsArray
        selectedValuesContainer.innerHTML = ''
        if (checkedOptions.length > 0) {
            checkedOptions.forEach((checkedOption) => {
                selectedValuesContainer.appendChild(
                    selectedItem({
                        name: checkedOption.getAttribute('data-label'),
                        dataLabel: checkedOption.getAttribute('data-label'),
                        value: checkedOption.value,
                    })
                )
            })
            return
        }
        selectedValuesContainer.appendChild(placeholderText)
    })

    document.addEventListener('click', (event) => {
        const isClickInsideSelect = selectButton.contains(event.target);
        const isClickInsideOptions = options.contains(event.target);
    
        if (!isClickInsideSelect && !isClickInsideOptions) {
            selectButton.dataset.open = 'false';
        }
    })
    
    selectButton.append(selectedValuesContainer, arrow)
    if (labelName) multiselect.appendChild(labelContainer)
    multiselect.append(selectButton, options)

    return multiselect
}