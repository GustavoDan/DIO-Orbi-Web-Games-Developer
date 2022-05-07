const newGameArea = document.querySelector('.game-panel')
const startButton = document.querySelector('.play-button')

const LASER_SPEED = 6
const ALIEN_SPEED = 3
const MAX_LASERS = 2
const LIFE = 3
const ALIENS_IMAGE = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png', 'img/monster-4.png', 'img/monster-5.png']


const loadElementSize = element => {
    return {
        width: element.clientWidth,
        height: element.clientHeight
    }
}
const loadPlayAreaInfo = _ => {
    let element =  document.querySelector('#main-play-area')
    let size = loadElementSize(element)
    let percentSize = {
        height: size.height/100,
        width: size.width/100
    }
    let verticalStep = 2*percentSize.height


    return {element, size, percentSize, verticalStep}
}

let playArea = loadPlayAreaInfo()
let gameObjects = {
    alien: [],
    laser: [],
    interval: [],
    heart: []
}
let player, scoreTxt, lifeBar


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const updateScore = _ => scoreTxt.innerText = `Score: ${player.score}`

const removeFromArray = (array, value) => array.splice(array.indexOf(value), 1)
const deleteObject = object => {
    clearInterval(object.moveInterval)
    object.element.remove()
    removeFromArray(gameObjects[object.element.className], object)
}

const getCssProperty = (element, property) => getComputedStyle(element).getPropertyValue(property)

const setCssProperty = (element, property, value) => {element.style.setProperty(property, value)}
const valueInPx = value => `${value}px`
const setObjectPosition = object => {
    setCssProperty(object.element, 'top', valueInPx(object.position.top))
    setCssProperty(object.element, 'left', valueInPx(object.position.left))
}


const actionKeys = {
    'ArrowUp': ['move', 'up'],
    'w': ['move', 'up'],
    'ArrowDown': ['move', 'down'],
    's': ['move', 'down'],
    ' ': ['fireLaser']
}

const actions = {
    move(direction) {
        if(direction === 'up') {
            if(player.position.top - playArea.verticalStep > 0) player.position.top -= playArea.verticalStep
            else player.position.top = 0    
        } else if(direction === 'down') {
            if(player.position.top + playArea.verticalStep + player.size.height < playArea.size.height) player.position.top += playArea.verticalStep
            else player.position.top = playArea.size.height - player.size.height
        }
        setObjectPosition(player) 
    },
    fireLaser() {
        if(gameObjects.laser.length < MAX_LASERS){
            let laser = createLaserObject()
            gameObjects.laser.push(laser)
            moveLaser(laser)
        }
    }
}


function playGame() {
    createPlayer()
    createScore()
    createLifeBar()

    document.addEventListener('keydown', keyboardEvents)

    let alienInterval = setInterval(createAlien, 1500)
    let collisionInterval = setInterval(collisionHandler, 10)

    gameObjects.interval.push(alienInterval)
    gameObjects.interval.push(collisionInterval)
}

function createPlayer() {
    let element = document.createElement('div')
    element.id = 'player'
    playArea.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: 50*playArea.percentSize.height - size.height/2,
        left: 2*playArea.percentSize.width
    }

    player =  {element, size, position, life: LIFE, score: 0}

    setObjectPosition(player)
}

function createScore() {
    scoreTxt = document.createElement('p')
    scoreTxt.id = 'score'
    scoreTxt.classList.add('game-font')
    updateScore()

    playArea.element.append(scoreTxt)
}

function createLifeBar() {
    lifeBar = document.createElement('div')
    lifeBar.id = 'life-bar'
    playArea.element.append(lifeBar)
    
    for(let i = 0; i < player.life; i++) {
        let heart = document.createElement('div')
        heart.classList.add('heart')

        lifeBar.append(heart)
        gameObjects.heart.push(heart)
    }
}

function keyboardEvents(event) {
    let action = actionKeys[event.key]
  
    if(action) actions[action[0]](...action.slice(1))
}

function createLaserObject() {
    let element = document.createElement('div')
    element.classList.add('laser')
    playArea.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: player.position.top + size.height/4,
        left: player.position.left + player.size.width
    }
    
    let laserObject = {element, size, position, moveInterval: undefined}
    
    setObjectPosition(laserObject)

    return laserObject 
}

function moveLaser(laser) {
    let moveInterval = setInterval(_ => {
        if(laser.position.left + laser.size.width <= playArea.size.width) {
            laser.position.left += LASER_SPEED
            setObjectPosition(laser)
        } else {
            deleteObject(laser)
        }
    }, 10)

    laser.moveInterval = moveInterval
}

function createAlien() {
    let alien = createAlienObject()
    gameObjects.alien.push(alien)
    moveAlien(alien)
}

function createAlienObject() {
    let element = document.createElement('img')
    element.classList.add('alien')
	element.src = ALIENS_IMAGE[randInt(0, ALIENS_IMAGE.length-1)]
    playArea.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: randInt(0, playArea.size.height - size.height),
        left: playArea.size.width - size.width
    }

    let alienObject = {element, size, position, moveInterval: undefined}
    
    setObjectPosition(alienObject)

    return alienObject 
}

function moveAlien(alien) {
    let moveInterval = setInterval(_ => {
        if(alien.position.left > 0) {
            alien.position.left -= ALIEN_SPEED
            setObjectPosition(alien)
        } else {
            deleteObject(alien)
            updateLifeBar()
        }
    }, 10)

    alien.moveInterval = moveInterval
}

function updateLifeBar() {
    if(player.life > 1) {
        player.life--
        gameObjects.heart[player.life].classList.remove('heart')
        gameObjects.heart[player.life].classList.add('empty-heart')
    } else {
        gameOver()
    }
}

function collisionHandler() {
    gameObjects.alien.forEach((alien) => {
        gameObjects.laser.forEach((laser) => {
            if(checkCollision(laser, alien)) {
                player.score++
                updateScore()

                createExplosion(alien)

                deleteObject(laser)
                deleteObject(alien)
            }
        })
        
        if(checkCollision(player, alien)) {
            updateLifeBar()
            createExplosion(alien)

            deleteObject(alien)
        }
    })
}

function checkCollision(obj1, obj2) {
    let obj1Right = obj1.position.left + obj1.size.width
    let obj1Bottom = obj1.position.top + obj1.size.height

    let obj2Right = obj2.position.left + obj2.size.width
    let obj2Bottom = obj2.position.top + obj2.size.height

    if(obj1Right >= obj2.position.left && 
       obj1.position.left <= obj2Right &&
       obj1Bottom >= obj2.position.top &&
       obj1.position.top <= obj2Bottom) {
        return true
    } else {
        return false
    }
}

function createExplosion(alien) {
    let element = document.createElement('div')
    element.classList.add('explosion')
    playArea.element.append(element)

    let position = {
        top: alien.position.top,
        left: alien.position.left
    }

    let explosionObject = {element, position, duration: parseFloat(getCssProperty(element, 'animation-duration'))}

    setObjectPosition(explosionObject)

    setTimeout(_ => element.remove(), explosionObject.duration*1000)
}

function gameOver() {
    document.removeEventListener('keydown', keyboardEvents)

    createGameOverScreen()
    cleanGameObjects()
}

function createGameOverScreen() {
    let gameOverScreen = document.createElement('div')
    gameOverScreen.classList.add('game-panel')

    let infoDiv = document.createElement('div')
    infoDiv.classList.add('info')

    let playAgainButton = document.createElement('button')
    playAgainButton.classList.add('play-button', 'game-font')
    playAgainButton.innerText = 'Jogar de Novo'
    playAgainButton.addEventListener('click', _ => {
        gameOverScreen.remove()
        playGame()
    })


    let gameOverText = document.createElement('h1')
    gameOverText.classList.add('title')
    gameOverText.innerText = 'Game Over!'

    let scoreGameOverText = document.createElement('p')
    scoreGameOverText.classList.add('game-font', 'subtitle')
    scoreGameOverText.innerText = `Você destruiu ${player.score} naves!`

    
    infoDiv.append(scoreGameOverText)
    
    gameOverScreen.append(gameOverText)
    gameOverScreen.append(infoDiv)
    gameOverScreen.append(playAgainButton)
    
    playArea.element.append(gameOverScreen)
}

function cleanGameObjects() {    
    let aliens = [...gameObjects.alien]
    let lasers = [...gameObjects.laser]

    gameObjects.interval.forEach((interval) => clearInterval(interval))
    aliens.forEach((alien) => deleteObject(alien))
    lasers.forEach((laser) => deleteObject(laser))
    gameObjects = {
        alien: [],
        laser: [],
        interval: [],
        heart: []
    }

    player.element.remove()
    player = undefined

    lifeBar.remove()
    lifeBar = undefined

    scoreTxt.remove()
    scoreTxt = undefined
}

startButton.addEventListener('click', _ => {
    newGameArea.remove()
    playGame()
})

//Handle Play Area Resize
new ResizeObserver(_ => {
    playArea = loadPlayAreaInfo()
    gameObjects.alien.forEach((alien) => {
        if(alien.position.left > playArea.size.width) {
            alien.position.left = playArea.size.width-alien.size.width
        }
    })
}).observe(playArea.element)