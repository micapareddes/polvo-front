import { getCurrentDate } from '/frontend/src/functions/getCurrentDate.js'

export function infoQuizValidation(data) {
    const name = data.nome.length >= 3
    const disciplina = !!data.disciplina.id
    const type = !!data.tipo
    const attempts = !!data.tentativas
    const maxTime = !!data.tempoMax
    const startDate = data.dataInicio
    const endDate = data.dataFinal
    const currentDate = getCurrentDate()

    const isStartDateValid = startDate >= currentDate
    const isEndDateValid = endDate > startDate
    
    return {
        success: name && disciplina && type && attempts && maxTime && isStartDateValid && isEndDateValid,
        error: {
            nameValidation: !name,
            disciplinaValidation: !disciplina,
            typeValidation: !type,
            attemptsValidation: !attempts,
            maxTimeValidation: !maxTime,
            startDateValidation: !isStartDateValid,
            endDateValidation: !isEndDateValid,
        }
    }
}