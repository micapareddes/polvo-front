export function LogoLado() {
    const container = document.createElement('div')
    const smallLogo = document.createElement('img')
    const logoLado = document.createElement('img')

    container.className = 'md:pt-12 lg:pl-8'

    smallLogo.src = '/src/img/logo-icon.svg'
    smallLogo.alt = 'Logo icone Polvo Branca'
    smallLogo.className = 'md:pl-9 lg:hidden'

    logoLado.src = '/src/img/logo-light.svg'
    logoLado.alt = 'Logo de lado Polvo Branca'
    logoLado.className = 'hidden lg:block'

    container.append(logoLado, smallLogo)

    return container
}