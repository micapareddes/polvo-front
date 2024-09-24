export function obtainOriginalValuesFromStorage() {
    const jsonData = localStorage.getItem('originalValues')
    return JSON.parse(jsonData)
}