export function Box({ content }) {
    const container = document.createElement('div')

    container.className = `flex flex-col items-center w-full h-full bg-neutral-50 shadow-xl rounded-3xl py-12 px-5 md:py-24 md:px-24 lg:px-16`

    container.append(content)

    return container
}