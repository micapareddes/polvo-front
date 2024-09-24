export function cadastroDisciplinaValidation(nomeDisciplina) {
    return {
        success: nomeDisciplina.length > 3
    }
}