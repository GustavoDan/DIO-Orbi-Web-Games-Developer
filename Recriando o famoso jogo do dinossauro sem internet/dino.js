const CACTUS_WIDTH = 60

let scoreTxt = null
let dino = null
let background = null
let isJumping = false
let position = 0
let score = 0
let cactusSpeed = 0
let cactusTime = {
    min: 0,
    max: 0
}

let cactusArray = []
let cactusIntervalArray = []

let updateScore = _ => scoreTxt.innerText = `Score: ${score}`
let setCactusPosition = (cactus) => cactus.element.style.left = `${cactus.position}px`
let removeArrayElement = (array, element) => array.splice(array.indexOf(element), 1)


function startGame() {
    isJumping = false
    position = 0
    score = 0
    cactusSpeed = 10
    cactusTime = {
        min: 500,
        max: 2000
    }

    cactusIntervalArray = []
    cactusArray = []


    scoreTxt = document.createElement('h1')
    scoreTxt.id = 'score'
    updateScore(scoreTxt)

    background = document.createElement('div')
    background.id = 'background'
    
    dino = document.createElement('div')
    dino.id = 'dino'

    document.body.innerHTML = ''
    background.appendChild(dino)
    document.body.appendChild(scoreTxt)
    document.body.appendChild(background)

    
    createCactus()
}

function createCactus() {
    let cactus = {
        element: document.createElement('div'),
        position: window.innerWidth - CACTUS_WIDTH
    }
    cactus.element.classList.add('cactus')
    setCactusPosition(cactus)

    background.appendChild(cactus.element)
    cactusArray.push(cactus)

    let leftInterval = setInterval(_ => {
        if(cactus.position >= -60) {
            cactus.position -= cactusSpeed
            setCactusPosition(cactus)
        } else {
            removeArrayElement(cactusArray, cactus)
            removeArrayElement(cactusIntervalArray, leftInterval)

            cactus.element.remove()
            clearInterval(leftInterval)

            score++
            updateScore(scoreTxt)
            handleDifficult()
        }

        if(cactus.position > 0 && cactus.position < 60 && position < 60) {
            gameOver()
        }
    }, 20)

    let continueGame = setTimeout(createCactus, Math.floor(Math.random() * (cactusTime.max - cactusTime.min + 1)) + cactusTime.min)

    cactusIntervalArray.push(leftInterval)
    cactusIntervalArray.push(continueGame)
}

function handleDifficult(){
    if(score < 10) {
        cactusSpeed = 10
        cactusTime = {
            min: 500,
            max: 2000
        }
        background.style.animationDuration = '1200s'
    } else if(score < 25) {
        cactusSpeed = 20
        cactusTime = {
            min: 400,
            max: 1600
        }
        background.style.animationDuration = '900s'
    } else if(score < 50) {
        cactusSpeed = 35
        cactusTime = {
            min: 300,
            max: 1200
        }
        background.style.animationDuration = '600s'
    } else if(score < 100) {
        cactusSpeed = 45
        cactusTime = {
            min: 200,
            max: 700
        }
        background.style.animationDuration = '300s'
    } else if(score >= 100) {
        cactusSpeed = 59
        cactusTime = {
            min: 100,
            max: 500
        }   
        background.style.animationDuration = '100s'
    } 
}

function jump() {
    isJumping = true

    let upInterval = setInterval(_ => {
        if(position < 150) {
            position += 20

            dino.style.bottom = `${position}px`
        } else {
            clearInterval(upInterval)

            let downInterval = setInterval(_ => {
                if(position > 0){
                    position -= 20
        
                    dino.style.bottom = `${position}px`
                } else {
                    clearInterval(downInterval)

                    isJumping = false
                }
            }, 20)
        }
    }, 20)
}

function gameOver() {
    finishGame()
    createGameOverScreen()
}

function finishGame() {
    cactusIntervalArray.forEach((interval) => clearInterval(interval))
    cactusArray.forEach((cactus) => cactus.element.remove())
}

function createGameOverScreen() {
    document.body.innerHTML = ''

    let gameOverScreen = document.createElement('div')
    gameOverScreen.id = 'game-over-screen'
    
    gameOverText = document.createElement('h1')
    gameOverText.id = 'game-over-text'
    gameOverText.innerText = 'Game Over!'

    gameOverScore = document.createElement('h1')
    gameOverScore.id = 'game-over-score'
    gameOverScore.innerText = `You jumped ${score} cactus.`

    gameOverButton = document.createElement('button')
    gameOverButton.id = 'game-over-button'
    gameOverButton.innerText = 'Play Again'
    gameOverButton.addEventListener('click', startGame)

    gameOverScreen.appendChild(gameOverText)
    gameOverScreen.appendChild(gameOverScore)
    gameOverScreen.appendChild(gameOverButton)
    document.body.appendChild(gameOverScreen)
}

startGame()

document.addEventListener('keydown', (event) => {
    if(event.code == 'Space') {
        if(!isJumping){
            jump()
        }
    }
})