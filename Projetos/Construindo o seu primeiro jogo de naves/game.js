const GAME_PANEL = document.querySelector('#game-panel')
const PLAY_BUTTON = document.querySelector('#play-button')
const SOUNDS = loadSounds()

const GROUND_TOP = 517
const DEFAULT_SCORE_GAIN = 50
const DEFAULT_LIFE = 3
const BACKGROUND_VEL = 3
const DEFAULT_VEL = 3
const DEFAULT_VEL_GAIN = 0.3
const PLAYER_VEL = 7
const BULLET_VEL = 12
const ALLY_VEL = 0.5
const DEFAULT_INTERVAL_TIME = 10
const ENEMY_TRUCK_RESPAWN_TIME = 5000
const ALLY_RESPAWN_TIME = 6000

let player, enemyHelicopter, enemyTruck, ally, bullet, scoreTxt, lifeBar, gameOverScreen
let keysPressed, gameLoop, vel, deathAnimationArray, truckRespawnTimeout, allyRespawnTimeout
let gameBackground = loadGameBackgroundInfo()


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const removeFromArray = (array, value) => array.splice(array.indexOf(value), 1)

let addAction = (event) => keysPressed.add(ACTION_KEYS[event.key])
let deleteAction = (event) => keysPressed.delete(ACTION_KEYS[event.key])
const respawnEnemyTruck = _ => {truckRespawnTimeout = setTimeout(createEnemyTruck, ENEMY_TRUCK_RESPAWN_TIME)}
const respawnAlly = _ => {allyRespawnTimeout = setTimeout(createAlly, ALLY_RESPAWN_TIME)}
const updateScore = _ => scoreTxt.innerText = `Pontos: ${player.score} Salvos: ${player.allySaved} Perdidos: ${player.allyDead}`

const deleteObject = object => {
	if(object) {
		if(object.moveInterval) clearInterval(object.moveInterval)
		object.element.remove()
		return undefined
	}
}

const getCssProperty = (element, property) => getComputedStyle(element).getPropertyValue(property)
const setCssProperty = (element, property, value) => element.style.setProperty(property, value)

const valueInPx = value => `${value}px`
const setObjectPosition = object => {
    setCssProperty(object.element, 'top', valueInPx(object.position.top))
    setCssProperty(object.element, 'left', valueInPx(object.position.left))
}

const ACTION_KEYS = {
    'ArrowUp': 'move up',
    'w': 'move up',
    'ArrowDown': 'move down',
    's': 'move down',
    'ArrowLeft': 'move left',
    'a': 'move left',
    'ArrowRight': 'move right',
    'd': 'move right',
    ' ': 'shoot',
}
const DIRECTION_LIST = {
	'up': _ => player.position.top > 0 ? player.position.top -= PLAYER_VEL : player.position.top = 0,
	'down': _ => player.position.top < 434 ? player.position.top += PLAYER_VEL : player.position.top = 434,
	'left': _ => player.position.left > 0 ? player.position.left -= PLAYER_VEL : player.position.left = 0,
	'right': _ => {
		let maxLeft = gameBackground.size.width - player.size.width
		player.position.left < maxLeft ? player.position.left += PLAYER_VEL : player.position.left = maxLeft
	},
}
const ACTIONS = {
    move(direction) {
		DIRECTION_LIST[direction]()
		setObjectPosition(player)
    },
    shoot() {
		if(!bullet) createBullet()
    }
}


function loadElementSize(element) {
    return {
        width: element.clientWidth,
        height: element.clientHeight
    }
}

function loadGameBackgroundInfo() {
    let element =  document.querySelector('#game-background')
    let size = loadElementSize(element)
    let percentSize = {
        height: size.height/100,
        width: size.width/100
    }
    let verticalStep = 2*percentSize.height

	let position = {
		top: 0,
		left: 0
	}

    return {element, size, percentSize, verticalStep, position}
}

function loadSounds() {
	let sounds = document.querySelectorAll('audio')
	let soundsObject = {}

	sounds.forEach((sound) => {
		let soundName = sound.id.split('-')
		let soundFirstName = soundName[0]

		soundName.shift()
		soundName = soundName.filter(word => word.toLowerCase() !== 'sound')
		soundName = soundName.map(name => name[0].toUpperCase() + name.slice(1))
		soundName = [soundFirstName, ...soundName].join('')

		soundsObject[soundName] = sound
	})

	return soundsObject
}

function startGame() {
	document.addEventListener('keydown', addAction)
	document.addEventListener('keyup', deleteAction)
	SOUNDS.backgroundMusic.addEventListener("ended", _ => {
		SOUNDS.backgroundMusic.currentTime = 0 
		SOUNDS.backgroundMusic.play()
	})

	SOUNDS.backgroundMusic.play()

	vel = DEFAULT_VEL
	deathAnimationArray = []
	keysPressed = new Set()
	createGameObjects()	

	gameLoop = setInterval(_ => {
		moveBackground()
		keyboardEvents()
		handleCollision()
	}, DEFAULT_INTERVAL_TIME)
}

function createGameObjects() {
	createPlayer()
	createEnemyTruck()
	createEnemyHelicopter()
	createAlly()
	createScore()
	createLifeBar()
}

function createPlayer() {
	let element = document.createElement('div')
    element.id = 'player'
    gameBackground.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: 50*gameBackground.percentSize.height - size.height/2,
        left: 2*gameBackground.percentSize.width
    }

    player =  {element, size, position, life: DEFAULT_LIFE, score: 0, allySaved: 0, allyDead: 0}

    setObjectPosition(player)
}

function createEnemyTruck() {
	element = document.createElement('div')
	element.id = 'enemy-truck'
    gameBackground.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: GROUND_TOP - size.height,
        left: gameBackground.size.width - size.width
    }

    enemyTruck =  {element, size, position, deathAnimation: 2, moveInterval: undefined}

    setObjectPosition(enemyTruck)
	moveEnemyTruck()
}

function moveEnemyTruck() {
	enemyTruck.moveInterval = setInterval(_ => {
		if(enemyTruck.position.left - vel > 0) {
			enemyTruck.position.left -= vel
			setObjectPosition(enemyTruck)
		} else {
			enemyTruck.position.left -= enemyTruck.position.left
			setObjectPosition(enemyTruck)
			
			enemyTruck = deleteObject(enemyTruck)
			createEnemyTruck()
		}
	}, DEFAULT_INTERVAL_TIME)
}

function createEnemyHelicopter() {
	element = document.createElement('div')
	element.id = 'enemy-helicopter'
    gameBackground.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: randInt(0, GROUND_TOP - size.height*3),
        left: gameBackground.size.width - size.width
    }

    enemyHelicopter =  {element, size, position, deathAnimation: 1, moveInterval: undefined}

    setObjectPosition(enemyHelicopter)
	moveEnemyHelicopter()
}

function moveEnemyHelicopter() {
	enemyHelicopter.moveInterval = setInterval(_ => {		
		if(enemyHelicopter.position.left - vel > 0) {
			enemyHelicopter.position.left -= vel
			setObjectPosition(enemyHelicopter)
		} else {
			enemyHelicopter.position.left -= enemyHelicopter.position.left
			setObjectPosition(enemyHelicopter)

			enemyHelicopter = deleteObject(enemyHelicopter)
			createEnemyHelicopter()
		}
	}, DEFAULT_INTERVAL_TIME)
}

function createAlly() {
	element = document.createElement('div')
	element.id = 'ally'
    gameBackground.element.append(element)

    let size = loadElementSize(element)
    let position = {
        top: GROUND_TOP - size.height,
        left: 0
    }

    ally =  {element, size, position, deathAnimation: 3, moveInterval: undefined}

    setObjectPosition(ally)
	moveAlly()
}

function moveAlly() {
	ally.moveInterval = setInterval(_ => {		
		let allyRight = ally.position.left + ally.size.width

		if(allyRight + ALLY_VEL < gameBackground.size.width) {
			ally.position.left += ALLY_VEL
			setObjectPosition(ally)
		} else {
			ally.position.left += gameBackground.size.width - allyRight
			setObjectPosition(ally)
			
			ally = deleteObject(ally)
			createAlly()
		}
	}, DEFAULT_INTERVAL_TIME)
}

function createScore() {
	scoreTxt = document.createElement('p')
	scoreTxt.id = 'score'
	scoreTxt.classList.add('game-font')

	updateScore()

	gameBackground.element.append(scoreTxt)
}

function createLifeBar() {
	lifeBar = document.createElement('div')
	lifeBar.id = 'life'

	for(let i = 0; i < player.life; i++){
		let energy = document.createElement('div')
		energy.id = 'battery'

		lifeBar.append(energy)
	}

	gameBackground.element.append(lifeBar)
}

function moveBackground() {
	let backgroundLeft = parseFloat(getCssProperty(gameBackground.element, 'background-position'))
	setCssProperty(gameBackground.element, 'background-position', valueInPx(backgroundLeft - (BACKGROUND_VEL*vel/10)))
}

function keyboardEvents() {
	keysPressed.forEach(action => {
		if(action) {
			action = action.split(' ')

			ACTIONS[action[0]](...action.slice(1))
		}
	})
}

function createBullet() {
	SOUNDS.shoot.play()

	element = document.createElement('div')
	element.id = 'bullet'
	gameBackground.element.append(element)

	let size = loadElementSize(element)
    let position = {
        top: player.position.top + player.size.height - 2*size.height,
        left: player.position.left + player.size.width - size.width
    }

    bullet = {element, size, position, moveInterval: undefined}

    setObjectPosition(bullet)
	moveBullet()
}

function moveBullet() {
	bullet.moveInterval = setInterval(_ => {
		let bulletRight = bullet.position.left + bullet.size.width

		if(bulletRight + BULLET_VEL < gameBackground.size.width) {
			bullet.position.left += BULLET_VEL
			setObjectPosition(bullet)
		} else {
			bullet.position.left += gameBackground.size.width - bulletRight
			setObjectPosition(bullet)

			bullet = deleteObject(bullet)
		}
	}, DEFAULT_INTERVAL_TIME)
}

function handleCollision() {		
	if(checkCollision(player, enemyHelicopter)) {
		animateDeath(enemyHelicopter)
		
		enemyHelicopter = deleteObject(enemyHelicopter)
		createEnemyHelicopter()

		updateLifeBar()
	}

	if(checkCollision(player, enemyTruck)) {
		animateDeath(enemyTruck)
		
		enemyTruck = deleteObject(enemyTruck)
		respawnEnemyTruck()

		updateLifeBar()
	}

	if(checkCollision(bullet, enemyHelicopter)) {
		vel += DEFAULT_VEL_GAIN
		player.score += DEFAULT_SCORE_GAIN*2
		updateScore()

		animateDeath(enemyHelicopter)

		bullet = deleteObject(bullet)
		enemyHelicopter = deleteObject(enemyHelicopter)
		createEnemyHelicopter()
	}

	if(checkCollision(bullet, enemyTruck)) {
		player.score += DEFAULT_SCORE_GAIN
		updateScore()

		animateDeath(enemyTruck)

		bullet = deleteObject(bullet)
		enemyTruck = deleteObject(enemyTruck)
		respawnEnemyTruck()
	}

	if(checkCollision(ally, player)) {
		SOUNDS.saved.play()
		
		player.allySaved++
		updateScore()

		ally = deleteObject(ally)
		respawnAlly()
	}

	if(checkCollision(ally, enemyTruck)) {
		player.allyDead++
		updateScore()

		animateDeath(ally)

		ally = deleteObject(ally)
		respawnAlly()
	}
}

function checkCollision(obj1, obj2) {
	if(obj1 && obj2) {
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
	} else {
		return false
	}
}

function updateLifeBar() {
	player.life--

	lifeBar.children[player.life].remove()

	if(player.life <= 0) gameOver()
}

function animateDeath(object) {
	if(object.deathAnimation === 3) SOUNDS.dead.play()
	else SOUNDS.explosion.play()

	let element = document.createElement('div')
	element.id = `deathAnimation${object.deathAnimation}`
	gameBackground.element.append(element)

	let position = {
		top: object.position.top,
		left: object.position.left
	}

	let deathAnimation = {element, position, duration: parseFloat(getCssProperty(element, 'animation-duration')) * 1000}
	deathAnimationArray.push(deathAnimation)
	setObjectPosition(deathAnimation)

	setTimeout(_ => {
		deleteObject(deathAnimation)
		removeFromArray(deathAnimationArray, deathAnimation)
	}, deathAnimation.duration)
}

function gameOver() {
	document.removeEventListener('keydown', addAction)
	document.removeEventListener('keyup', deleteAction)

	SOUNDS.backgroundMusic.pause()
	SOUNDS.gameOverMusic.play()

	clearTimeout(truckRespawnTimeout)
	clearTimeout(allyRespawnTimeout)
	clearInterval(gameLoop)

	createGameOverScreen()

	deleteAllObjects()
}

function createGameOverScreen() {
	gameOverScreen = document.createElement('div')
	gameOverScreen.id = 'game-panel'

	let gameOverTxt = document.createElement('p')
	gameOverTxt.id = ('title')
	gameOverTxt.classList.add('game-font')
	gameOverTxt.innerText = 'Game Over'
	
	let gameOverInfo = document.createElement('div')
	gameOverInfo.id = 'game-info'
	
	let scoreGameOverTxt = document.createElement('p')
	scoreGameOverTxt.classList.add('game-font')
	scoreGameOverTxt.innerText = `Voce fez ${player.score} pontos.`
	
	let savedGameOverTxt = document.createElement('p')
	savedGameOverTxt.classList.add('game-font')
	savedGameOverTxt.innerText = `Voce salvou ${player.allySaved} aliados.`
	
	let deadGameOverTxt = document.createElement('p')
	deadGameOverTxt.classList.add('game-font')
	deadGameOverTxt.innerText += `Voce deixou ${player.allyDead} aliados morrerem.`
	
	let playAgainButton = document.createElement('button')
	playAgainButton.id = 'play-button'
	playAgainButton.classList.add('game-font')
	playAgainButton.innerText = 'Jogar Novamente'
	playAgainButton.addEventListener('click', playAgain)
	
	gameOverInfo.append(scoreGameOverTxt, savedGameOverTxt, deadGameOverTxt)
	gameOverScreen.append(gameOverTxt, gameOverInfo, playAgainButton)
	gameBackground.element.append(gameOverScreen)
}

function deleteAllObjects() {
	player = deleteObject(player)
	bullet = deleteObject(bullet)
	enemyHelicopter = deleteObject(enemyHelicopter)
	enemyTruck = deleteObject(enemyTruck)
	ally = deleteObject(ally)
	scoreTxt.remove()
	lifeBar.remove()
	deathAnimationArray.forEach((deathAnimation => deathAnimation.element.remove()))

	gameLoop = undefined
}

function playAgain() {
	SOUNDS.gameOverMusic.pause()

	gameOverScreen.remove()
	startGame()
}


PLAY_BUTTON.addEventListener('click', _ => {
	GAME_PANEL.remove()
	startGame()
})

//Handle game background Resize
new ResizeObserver(_ => {
    gameBackground = loadGameBackgroundInfo()
	if(enemyHelicopter && enemyHelicopter.position.left > gameBackground.size.width) {
		enemyHelicopter.position.left = gameBackground.size.width - enemyHelicopter.size.width
		setObjectPosition(enemyHelicopter)
	}
	if(enemyTruck && enemyTruck.position.left > gameBackground.size.width) {
		enemyTruck.position.left = gameBackground.size.width - enemyTruck.size.width
		setObjectPosition(enemyTruck)
	}
}).observe(gameBackground.element)