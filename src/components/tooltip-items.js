export function TooltipItems({ items=[] }) {
    const quantity = document.createElement('span')
    const tooltip = document.createElement('ul')

    quantity.className = 'px-2 py-1 rounded-md text-stone-400'
    quantity.textContent = items.length

    if (items.length !== 0) quantity.classList.add('cursor-pointer', 'hover:bg-neutral-200', 'group', 'text-stone-900')

    tooltip.className = 'hidden group-hover:block absolute mt-1 px-4 py-2 rounded-2xl border border-neutral-200 bg-neutral-50'

    items.forEach((item) => {
        const name = document.createElement('li')
        name.textContent = item.nome
        name.className = 'p-2 cursor-default'
        tooltip.appendChild(name)
    })

    quantity.appendChild(tooltip)

    return quantity
}