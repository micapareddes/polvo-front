export function DataInput({ labelName = 'Data', id }) {
    const container = document.createElement('div')
    const dataInput = document.createElement('input')
    const label = document.createElement('label')

    dataInput.type = 'date'
    dataInput.className = 'bg-transparent pl-4 py-3 border-b border-stone-300'
    label.textContent = labelName
    label.htmlFor = id
    label.className = 'text-stone-500'
    container.id = id
    container.className = 'flex gap-2 items-center'
    container.append(dataInput, label)
    return container
}