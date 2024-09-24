function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600)/60)
    const remainingSeconds = seconds % 60
    if (hours > 0) return `${hours} : ${minutes < 10 ? '0' : ''}${minutes} : ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    return `${minutes} : ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}
function startTimer({initialTimeInSeconds, timer}) {
    let totalTimeInSeconds;

    const savedTime = localStorage.getItem('remainingTime')

    if (savedTime) totalTimeInSeconds = Number(savedTime)
    else totalTimeInSeconds = initialTimeInSeconds

    const intervalId = setInterval(() => {
        totalTimeInSeconds--

        localStorage.setItem('remainingTime', totalTimeInSeconds)

        timer.textContent = ''
        timer.textContent = formatTime(totalTimeInSeconds)

        if (totalTimeInSeconds <= 0) {
            clearInterval(intervalId)
            localStorage.removeItem('remainingTime')
            const timesUp = new CustomEvent('timesUp')
            document.dispatchEvent(timesUp)
        }
    }, 1000)
}
export function Timer({ time = '60' }) {
    const initialTimeInSeconds = Number(time) * 60
    const container = document.createElement('span')
    container.id = 'timer'
    container.className = 'px-4 py-2 rounded-md border border-stone-400 text-stone-500 font-semibold text-nowrap'
    container.textContent = formatTime(initialTimeInSeconds)
    
    startTimer({
        initialTimeInSeconds, 
        timer: container
    })

    return container
}