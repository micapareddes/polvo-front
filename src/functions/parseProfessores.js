export function parseProfessores(professoresBack) {
    return professoresBack.map((professor) => {
        return {
            text: professor.nome,
            value: professor._id
        }
    })
}