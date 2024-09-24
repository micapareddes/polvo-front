export function loginFormValidation(userData) {
    let isCredentialValid

    const isPasswordValid = userData.senha.trim() !== ''

    if (userData.email) {
        isCredentialValid = userData.email.trim() !== ''
    } else {
        isCredentialValid = userData.matricula.trim() !== ''
    }

    return {
        success: isCredentialValid && isPasswordValid,
    }
}