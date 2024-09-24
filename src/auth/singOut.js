import { ROUTES } from '/src/utils/routes.js'

export function signOut() {
    localStorage.removeItem('accessToken')
    window.location.href = ROUTES.LOGIN
}