export function cadastroUserValidation(data) {
    const name = data.nome.length >= 3
    const email = data.email.includes('@') && data.email.includes('.com')//TODO: melhorar validação
    const matricula = data.matricula.length === 6 //TODO: validar que seja numeros
    return {
        success: name && email && matricula,
        error: {
            nameValidation: !name,
            emailValidation: !email,
            matriculaValidation: !matricula,
        }
    }
}