let order = []
let clickedOrder = []
let score = 0
let level = 1
let waitForPattern = true
let waitInterval = 500
let colorList = ['green', 'red', 'yellow', 'blue']
let colors = {}

let mainArea = document.querySelector('#main-area')
let gameArea = document.querySelector('#game-area')
let startButton = document.querySelector('#start-game')
let levelTxt = null
let scoreTxt = null

let updateScore = _ => scoreTxt.innerText = `Score: ${score}`
let updateLevel = _ => levelTxt.innerText = `Level: ${level}`

function createGame() {
    startButton.remove()

    createInfoBar()
    createGenius()

    startGame()
}

function createInfoBar() {
    let infoBar = document.createElement('div')
    infoBar.id = 'info-bar'
    
    levelTxt = document.createElement('p')
    levelTxt.classList.add('game-font')
    levelTxt.id = 'level'
    
    scoreTxt = document.createElement('p')
    scoreTxt.classList.add('game-font')
    scoreTxt.id = 'score'

    
    infoBar.appendChild(levelTxt)
    infoBar.appendChild(scoreTxt)

    mainArea.insertBefore(infoBar, gameArea)
}

function createGenius() {
    let genius = document.createElement('div')
    genius.id = 'genius'
    gameArea.appendChild(genius)

    colorList.forEach((color) => {
        let colorDiv = document.createElement('div')
        colorDiv.id = color
        colorDiv.addEventListener('click', _ => guessColor(color))

        genius.appendChild(colorDiv)
        colors[`${color}`] = colorDiv
    })
}

function startGame() {
    order = []
    clickedOrder = []
    score = 0
    updateScore()
    level = 1
    updateLevel()

    shuffleOrder()
}

function shuffleOrder() {
    clickedOrder = []

    order.push(colorList[Math.floor(Math.random() * colorList.length)])

    waitForPattern = true
    order.forEach((color, idx) => lightColor(colors[`${color}`], idx+1))
    setTimeout(_ => {waitForPattern = false}, level*waitInterval)
}

function lightColor(element, number) {
    number = number * waitInterval
    setTimeout(_ => element.classList.add('selected'), number-(waitInterval/2))
    setTimeout(_ => element.classList.remove('selected'), number)
}

function guessColor(color) {
    if(!waitForPattern) {
        clickedOrder.push(color)
        
        colorClasses = colors[`${color}`].classList
        colorClasses.add('selected')

        setTimeout(_ => {
            colorClasses.remove('selected')
            checkOrder()
        }, waitInterval/2)
    }
}

function checkOrder() {
    let lastElement = clickedOrder.length-1

    if(clickedOrder[lastElement] !== order[lastElement]) {
        callGameOverModal()
    }
    else if(clickedOrder.length === order.length) {
        score++
        level++

        updateScore()
        updateLevel()

        shuffleOrder()
    }
}

function callGameOverModal() {
    let modal = createModal()
    createInternalModalElements(modal)
}

function createModal() {
    let backdrop = document.createElement('div')
    backdrop.classList.add('backdrop', 'delete-modal')
    backdrop.addEventListener('click', closeModal)

    let modal = document.createElement('div')
    modal.classList.add('modal', 'delete-modal')
    
    document.body.appendChild(modal)
    document.body.appendChild(backdrop)

    return modal
}

function createInternalModalElements(modal) {    
    let modalTitle = document.createElement('p')
    modalTitle.innerText = `Game Over!`
    modalTitle.classList.add('game-font')
    modalTitle.id = 'modal-title'

    let messageTxt = document.createElement('p')
    messageTxt.innerText = `Score: ${score}\nClose the modal to start a new game`
    messageTxt.classList.add('game-font')
    messageTxt.id = 'modal-text'
    
    let closeButton = document.createElement('button')
    closeButton.innerText = 'Close'
    closeButton.id = 'close-modal'
    closeButton.addEventListener('click', closeModal)


    modal.appendChild(modalTitle)
    modal.appendChild(messageTxt)
    modal.appendChild(closeButton)
}

function closeModal() {
    let closeModal = document.querySelectorAll('.delete-modal')
    closeModal.forEach(modalElement => modalElement.remove())

    startGame()
}


startButton.addEventListener('click', createGame)
