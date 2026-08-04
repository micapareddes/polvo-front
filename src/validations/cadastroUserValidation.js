export function cadastroUserValidation(data) {
    const name = data.nome.length >= 3 && !/\d/.test(data.nome) && /\S+\s+\S+/.test(data.nome.trim())
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    const matricula = /^\d{6}$/.test(data.matricula)
    return {
        success: name && email && matricula,
        error: {
            nameValidation: !name,
            emailValidation: !email,
            matriculaValidation: !matricula,
        }
    }
}