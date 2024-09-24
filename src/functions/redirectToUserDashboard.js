import { ROUTES } from '/src/utils/routes.js'

export function redirectToUserDashboard(userType) {
    if (userType === 'aluno') {
        window.location.href = ROUTES.ALUNO.DASHBOARD
    } else if (userType === 'professor') {
        window.location.href = ROUTES.PROFESSOR.DASHBOARD
    } else if (userType === 'admin') {
        window.location.href = ROUTES.ADMIN.DASHBOARD
    }
}