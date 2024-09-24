export function perguntasQuizValidation(inputs) {
    const inputsArray = Array.from(inputs)
    const isEmpty = inputsArray.some((input) => input.value.trim() === '')

    return {
        success: !isEmpty
    }
}