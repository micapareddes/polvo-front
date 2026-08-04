export function formatMatricula(value) {
    return value.replace(/\D/g, '').slice(0, 6)
}
