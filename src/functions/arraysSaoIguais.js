export function arraysSaoIguais(a1, a2) {
    if (a1.length !== a2.length) return false
    return a1.every(obj1 => a2.some(obj2 => obj1.id === obj2.id))
}