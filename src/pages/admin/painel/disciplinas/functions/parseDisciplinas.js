export function parseDisciplinas(disciplinasBack) {
    return disciplinasBack.map((disciplina) => {
        return {
            id: disciplina._id, 
            name: disciplina.nome, 
            professor: disciplina.professor_id ? disciplina.professor_id.nome : 'Nenhum Professor', 
            quizzes: disciplina.quizes, 
        }
    })
}