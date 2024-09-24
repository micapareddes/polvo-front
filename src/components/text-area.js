export function TextArea({ 
    placeholder='Placeholder...', id, size='fit', className,
}) {
    const handleFitRows = () => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }
    const sizeStyle = {
        'fit': 'h-auto',
        'full': 'h-64',
    }
    const textarea = document.createElement('textarea')
    textarea.id = id
    textarea.className = `resize-none px-2 py-3 bg-transparent border border-stone-300 rounded-md ${sizeStyle[size]} ${className} hide-scrollbar`
    textarea.placeholder = placeholder
    if (size === 'fit') {
        textarea.rows = 1
        textarea.addEventListener('input', handleFitRows)
    }

    return textarea
}