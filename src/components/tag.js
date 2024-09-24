export function Tag({ title='Tag', color='indigo' }) {
    const style = {
        'indigo': 'bg-indigo-500 text-indigo-50',
        'red': 'bg-red-500 text-red-50',
        'stone': 'bg-stone-500 text-stone-50'
    }
    const tag = document.createElement('span')
    tag.className = `${style[color]} text-sm rounded-full px-4`
    tag.textContent = title

    return tag
}