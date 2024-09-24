export function resetMultiselect(checkboxes) {
    checkboxes.forEach((checkbox) => {
        const event = new Event('change', { bubbles: true })
        checkbox.dispatchEvent(event)
    })
}