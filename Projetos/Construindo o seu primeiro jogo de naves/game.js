const gameBackground = document.querySelector('#game-background')
const gameInfoPanel = document.querySelector('#game-info')
const playButton = document.querySelector('#play-button')
const sounds = {
	backgroundMusic: document.querySelector("#background-music"),
	gameOverMusic: document.querySelector("#game-over-sound"),
	shoot: document.querySelector("#shoot-sound"),
	explosion: document.querySelector("#explosion-sound"),
	dead: document.querySelector("#dead-sound"),
	saved: document.querySelector("#saved-sound")
}

const DEFAULT_LIFE = 3
const DEFAULT_VEL = 5

let player, enemy1, enemy2, ally, bullet, scoreTxt, lifeBar, gameOverScreen
let game, hasGameEnded, canShoot, score, saved, dead, life, vel, enemy1Top


const valueInPx = value => `${value}px`
const getCssProperty = (element, property) => getComputedStyle(element).getPropertyValue(property)
const setCssProperty = (element, property, value) => element.style.setProperty(property, value)
const removeFromArray = (array, value) => array.splice(array.indexOf(value), 1)

const ACTION_KEYS = {
    'ArrowUp': 'move up',
    'w': 'move up',
    'ArrowDown': 'move down',
    's': 'move down',
    ' ': 'shoot',
    'd': 'shoot'
}

const DIRECTION_LIST = {
	'up': (top) => setCssProperty(player, 'top', valueInPx(top > 0 ? top-10 : 0)),
	'down': (top) => setCssProperty(player, 'top', valueInPx(top < 434 ? top+10 : 434))
}

const actions = {
    move(direction) {
		DIRECTION_LIST[direction](parseFloat(getCssProperty(player, 'top')))
    },
    shoot() {
		if(canShoot) {
			createBullet()
			moveBullet(bullet)
		}
    }
}

function startGame() {
	loadDefaultValues()
	loadGame()
	
	document.addEventListener('keydown', (event) => game.pressed.add(ACTION_KEYS[event.key]))
	document.addEventListener('keyup', (event) => game.pressed.delete(ACTION_KEYS[event.key]))
	sounds.backgroundMusic.addEventListener("ended", _ => {
		sounds.backgroundMusic.currentTime = 0 
		sounds.backgroundMusic.play()
	})
	sounds.backgroundMusic.play()

	game.timer = setInterval(_ => {
		moveBackground()
		keyboardEvents()
		moveEnemy1()
		moveEnemy2()
		moveAlly()
		handleCollision()
		updateScore()
	}, 30)
}

function loadDefaultValues() {
	game = {
		pressed: new Set(),
		time: undefined
	}
	hasGameEnded = false
	canShoot = true
	score = 0
	saved = 0
	dead = 0
	life = DEFAULT_LIFE
	vel = DEFAULT_VEL
	enemy1Top = parseInt(Math.random() * 334)
}

function loadGame() {
	player = document.createElement('div')
	player.id = 'player'

	enemy1 = document.createElement('div')
	enemy1.id = 'enemy1'

	enemy2 = document.createElement('div')
	enemy2.id = 'enemy2'

	ally = document.createElement('div')
	ally.id = 'ally'

	scoreTxt = document.createElement('h2')
	scoreTxt.id = 'score'

	lifeBar = document.createElement('div')
	lifeBar.id = 'life'

	for(let i = 0; i < life; i++){
		let energy = document.createElement('div')
		energy.id = 'battery'

		lifeBar.append(energy)
	}

	gameBackground.append(player)
	gameBackground.append(enemy1)
	gameBackground.append(enemy2)
	gameBackground.append(ally)
	gameBackground.append(scoreTxt)
	gameBackground.append(lifeBar)
}

function moveBackground() {
	let left = parseFloat(getCssProperty(gameBackground, 'background-position'))
	setCssProperty(gameBackground, 'background-position', valueInPx(left-1))
}

function keyboardEvents() {
	game.pressed.forEach(action => {
		if(action) {
			action = action.split(' ')

			actions[action[0]](...action.slice(1))
		}
	})
}

function createBullet() {
	sounds.shoot.play()
	canShoot=false
	
	let playerTop = parseFloat(getCssProperty(player, 'top'))
	let playerLeft = parseFloat(getCssProperty(player, 'left'))

	bullet = document.createElement('div')
	bullet.id = 'bullet'
	setCssProperty(bullet, 'top', valueInPx(playerTop + 37))
	setCssProperty(bullet, 'left', valueInPx(playerLeft + 190))

	gameBackground.append(bullet)
}

function moveBullet(bullet) {
	let bulletInterval = setInterval(_ => {
		let left = parseFloat(getCssProperty(bullet, 'left'))

		if(left <= 900) {
			setCssProperty(bullet, 'left', valueInPx(left + 15))
		} else {
			clearInterval(bulletInterval)
			canShoot = true
			bullet.remove()
			bullet = undefined
		}
	}, 30)
}

function moveEnemy1() {
	let enemy1Left = parseFloat(getCssProperty(enemy1, 'left'))

	if(enemy1Left > 0) {
		setCssProperty(enemy1, 'top', valueInPx(enemy1Top))
		setCssProperty(enemy1, 'left', valueInPx(enemy1Left - vel))
	} else {
		reloadEnemy1()
	}
}

function reloadEnemy1() {
	enemy1Top = Math.floor(Math.random() * 334)

	setCssProperty(enemy1, 'top', valueInPx(enemy1Top))
	setCssProperty(enemy1, 'left', valueInPx(694 + vel))
}

function moveEnemy2() {
	let left = parseFloat(getCssProperty(enemy2, 'left'))

	setCssProperty(enemy2, 'left', valueInPx(left >= 0 ? left - 3 : 775))
}

function moveAlly() {
	let left = parseFloat(getCssProperty(ally, 'left'))

	setCssProperty(ally, 'left', valueInPx(left <= 906 ? left + 1 : 0))
}

function handleCollision() {
	let collision1 = checkCollision(player, enemy1)
	let collision2 = checkCollision(player, enemy2)
	let collision3 = checkCollision(bullet, enemy1)
	let collision4 = checkCollision(bullet, enemy2)
	let collision5 = checkCollision(player, ally)
	let collision6 = checkCollision(enemy2, ally)
		
	if(collision1) {
		updateLifeBar()

		let enemy1Top = parseFloat(getCssProperty(enemy1, 'top'))
		let enemy1Left = parseFloat(getCssProperty(enemy1, 'left'))
		explosion(enemy1Left, enemy1Top, 1)
	
		reloadEnemy1()
	}

	if(collision2) {
		updateLifeBar()

		let enemy2Top = parseFloat(getCssProperty(enemy2, 'top'))
		let enemy2Left = parseFloat(getCssProperty(enemy2, 'left'))
		explosion(enemy2Left, enemy2Top, 2)
			
		reloadEnemy2();
	}

	if(collision3) {
		score += 100
		vel += 0.3

		let enemy1Top = parseFloat(getCssProperty(enemy1, 'top'))
		let enemy1Left = parseFloat(getCssProperty(enemy1, 'left'))
		explosion(enemy1Left, enemy1Top, 1)

		reloadEnemy1()
		destroyBullet()
	}

	if(collision4) {
		score += 50

		let enemy2Top = parseFloat(getCssProperty(enemy2, 'top'))
		let enemy2Left = parseFloat(getCssProperty(enemy2, 'left'))
		explosion(enemy2Left, enemy2Top, 2)

		reloadEnemy2()
		destroyBullet()		
	}

	if(collision5) {
		sounds.saved.play()
		
		saved++

		reloadAlly();
	}

	if(collision6) {
		dead++

		let allyTop = parseFloat(getCssProperty(ally, 'top'))
		let allyLeft = parseFloat(getCssProperty(ally, 'left'))
		explosion(allyLeft, allyTop, 3)

		reloadAlly();
	}
}

function checkCollision(elem1, elem2) {
	if(elem1 && elem2) {
		let elem1Pos = {
			top: parseFloat(getCssProperty(elem1, 'top')),
			left: parseFloat(getCssProperty(elem1, 'left'))
		}
		elem1Pos.bottom = elem1Pos.top + elem1.clientHeight
		elem1Pos.right = elem1Pos.left + elem1.clientWidth

		let elem2Pos = {
			top: parseFloat(getCssProperty(elem2, 'top')),
			left: parseFloat(getCssProperty(elem2, 'left'))
		}
		elem2Pos.bottom = elem2Pos.top + elem2.clientHeight
		elem2Pos.right = elem2Pos.left + elem2.clientWidth

		if(elem1Pos.right >= elem2Pos.left && 
		elem1Pos.left <= elem2Pos.right &&
		elem1Pos.bottom >= elem2Pos.top &&
		elem1Pos.top <= elem2Pos.bottom) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}

function explosion(elemLeft, elemTop, explosionType) {
	if(explosionType === 3) sounds.dead.play()
	else sounds.explosion.play()

	let explosion = document.createElement('div')
	explosion.id = `explosion${explosionType}`
	setCssProperty(explosion, 'top', valueInPx(elemTop))
	setCssProperty(explosion, 'left', valueInPx(elemLeft))

	gameBackground.append(explosion)

	let animationDuration = parseFloat(getCssProperty(explosion, 'animation-duration')) * 1000
	setTimeout(_ => explosion.remove(), animationDuration)
}

function reloadEnemy2() {
	enemy2.remove()

	setTimeout(_ => {
		if(!hasGameEnded) {
			enemy2 = document.createElement('div')
			enemy2.id = 'enemy2'
			
			gameBackground.append(enemy2)
		}
	}, 5000)
}

function destroyBullet() {
	setCssProperty(bullet, 'left', valueInPx(950))
}

function reloadAlly() {
	ally.remove()

	setTimeout(_ => {
		if (!hasGameEnded) {
			ally = document.createElement('div')
			ally.id = 'ally'

			gameBackground.append(ally)
		}
	}, 6000)
}

function updateScore() {
	scoreTxt.innerText = `Pontos: ${score} Salvos: ${saved} Perdidos: ${dead}`
}

function updateLifeBar() {
	life--

	lifeBar.children[life].remove()

	if(life <= 0) gameOver()
}

function gameOver() {
	sounds.backgroundMusic.pause()
	sounds.gameOverMusic.play()

	hasGameEnded=true
	clearInterval(game.timer);
	
	player.remove()
	enemy1.remove()
	enemy2.remove()
	ally.remove()
	scoreTxt.remove()
	lifeBar.remove()
	bullet.remove()

	gameOverScreen = document.createElement('div')
	gameOverScreen.id = 'game-over'

	let gameOverTxt = document.createElement('h1')
	gameOverTxt.innerText = 'Game Over'

	let scoreGameOverTxt = document.createElement('p')
	scoreGameOverTxt.innerText = `Você fez ${score} pontos.`

	let savedGameOverTxt = document.createElement('p')
	savedGameOverTxt.innerText = `Você salvou ${saved} aliados.`
	
	let deadGameOverTxt = document.createElement('p')
	deadGameOverTxt.innerText += `Você deixou ${dead} aliados morrerem.`

	let playAgainButton = document.createElement('button')
	playAgainButton.id = 'play-again'
	playAgainButton.innerText = 'Jogar Novamente'
	playAgainButton.addEventListener('click', playAgain)
		
	gameOverScreen.append(gameOverTxt, scoreGameOverTxt, savedGameOverTxt, deadGameOverTxt, playAgainButton)

	gameBackground.append(gameOverScreen)
}

function playAgain() {
	sounds.gameOverMusic.pause()

	gameOverScreen.remove()
	startGame()
}


playButton.addEventListener('click', _ => {
	gameInfoPanel.remove()
	startGame()
})