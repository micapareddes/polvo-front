export function saveOriginalValues(userData) { //TODO: Utilizar em disciplinas tmb
    const jsonData = JSON.stringify(userData)
    localStorage.setItem('originalValues', jsonData)
}