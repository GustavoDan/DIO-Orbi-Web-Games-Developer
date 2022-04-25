function toggleDarkMode(toggleButton) {
    toggleClasses()
    toggleTexts(toggleButton)
}

function toggleClasses() {
    let darkModeTags = []

    darkModeTags.push(document.querySelector('body'))
    darkModeTags.push(...document.querySelectorAll('h1'))
    darkModeTags.push(...document.querySelectorAll('button'))
    darkModeTags.push(...document.querySelectorAll('footer'))

    darkModeTags.forEach((tag) => tag.classList.toggle('dark-mode'))
}

function toggleTexts(toggleButton) {
    let lightMode = 'Light Mode'
    let darkMode = 'Dark Mode'

    let centralText = document.querySelector('#page-title')
    
    centralText.innerText = centralText.innerText === `${lightMode} ON` ? `${darkMode} ON` : `${lightMode} ON`
    toggleButton.innerText = toggleButton.innerText === darkMode ? lightMode : darkMode
} 

let toggleButton = document.querySelector('#mode-selector')

toggleButton.addEventListener('click', () => toggleDarkMode(toggleButton))