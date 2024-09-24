export function Card({  size='md', content }) {
    const variant = {
        'md': 'px-14 py-24',
        'lg': 'h-[600px] py-10 w-80'
    }
    const container = document.createElement('div')

    container.className = `flex flex-col items-center ${variant[size]} bg-neutral-100 rounded-3xl`

    container.append(content)

    return container
}