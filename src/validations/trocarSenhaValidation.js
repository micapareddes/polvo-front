export function trocarSenhaValidation(data) {
    const senhaAtual = data.senhaAtual.trim() !== ''
    const novaSenha = data.novaSenha.trim().length >= 6
    const senhasIguais = data.novaSenha === data.confirmarSenha

    return {
        success: senhaAtual && novaSenha && senhasIguais,
        error: {
            senhaAtualValidation: !senhaAtual,
            novaSenhaValidation: !novaSenha,
            senhasIguaisValidation: !senhasIguais,
        }
    }
}
