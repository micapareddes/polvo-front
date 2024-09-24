import { ROUTES } from '/frontend/src/utils/routes.js'

export function signOut() {
    localStorage.removeItem('accessToken')
    window.location.href = ROUTES.LOGIN
}