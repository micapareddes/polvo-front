export function editQuizValidation(data) {
    const name = data.nome.length >= 3
    const type = !!data.tipo
    const attempts = !!data.tentativas
    const maxTime = !!data.tempoMax
    const startDate = data.dataInicio
    const endDate = data.dataFinal

    const isStartDateValid = !!startDate
    const isEndDateValid = endDate > startDate

    const inputsArray = Array.from(data.perguntas)
    const isEmpty = inputsArray.some((input) => input.value.trim() === '')
    
    return {
        success: name && type && attempts && maxTime && isStartDateValid && isEndDateValid && !isEmpty,
        error: {
            nameValidation: !name,
            typeValidation: !type,
            attemptsValidation: !attempts,
            maxTimeValidation: !maxTime,
            startDateValidation: !isStartDateValid,
            endDateValidation: !isEndDateValid,
            perguntasValidation: isEmpty,
        }
    }
}