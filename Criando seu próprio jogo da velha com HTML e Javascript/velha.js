let jogador = null
let vencedor = null

let jogadorSelecionado = document.querySelector('#jogador-selecionado')
let divVencedor = document.querySelector('#vencedor')
let quadrados = document.querySelectorAll('.quadrado')

mudarJogador('X')

function escolherQuadrado(id) {
    let quadrado = document.querySelector(`[id='${id}'`)

    if(quadrado.innerHTML === '-' && !vencedor){
        quadrado.innerHTML = jogador
        quadrado.classList.add('selecionado')

        checaVencedor()
        checaVelha()
        mudarJogador(jogador === 'X' ? 'O' : 'X')
    }
}

function mudarJogador(valor) {
    jogador = valor
    jogadorSelecionado.innerHTML = jogador
}

function checaVencedor() {
    let quadradosTestados = []
    //Linhas verticais
    for(let i = 0; i <= 2; i++){
        quadradosTestados = [quadrados[i], quadrados[i+3], quadrados[i+6]]
        if (checaSequencia(...quadradosTestados)) mudaCorQuadrado(quadradosTestados)
    }

    //Linhas horizontais
    for(let i = 0; i <= 6; i += 3){
        quadradosTestados = [quadrados[i], quadrados[i+1], quadrados[i+2]]
        if (checaSequencia(...quadradosTestados)) mudaCorQuadrado(quadradosTestados)
    }

    //Diagonais
    quadradosTestados = [quadrados[0], quadrados[4], quadrados[8]]
    if (checaSequencia(...quadradosTestados)) mudaCorQuadrado(quadradosTestados)

    quadradosTestados = [quadrados[2], quadrados[4], quadrados[6]]
    if (checaSequencia(...quadradosTestados)) mudaCorQuadrado(quadradosTestados)
}

function checaSequencia(quadrado1, quadrado2, quadrado3){
    let igual = false

    if(quadrado1.innerHTML !== '-' && new Set([quadrado1.innerHTML, quadrado2.innerHTML, quadrado3.innerHTML]).size === 1)
    {igual = true}

    return igual
}

function mudaCorQuadrado(quadradosVencedores = null) {
    if(quadradosVencedores){
        quadradosVencedores.forEach((quadrado) => quadrado.classList.add('quadrado-vencedor'))
        fimDeJogo(false)
    } else{
        quadrados.forEach((quadrado) => quadrado.classList.add('velha'))
        fimDeJogo(true)
    }

}

function checaVelha() {
    for(let i = 0; i < quadrados.length; i++){
        if(quadrados[i].innerHTML === '-') return
    }
    mudaCorQuadrado()
}

function fimDeJogo(velha) {
    if(velha){
        vencedor = 'Velha'
    } else {
        vencedor = jogador
    }
    divVencedor.innerHTML = vencedor
}

function reiniciarJogo() {
    vencedor = null
    divVencedor.innerHTML = '-'

    quadrados.forEach((quadrado) => {
        quadrado.innerHTML = '-'
        quadrado.classList.remove('selecionado')
        quadrado.classList.remove('quadrado-vencedor')
        quadrado.classList.remove('velha')
    })

    mudarJogador('X')
}

quadrados.forEach((quadrado) => {
    quadrado.addEventListener('click', () => escolherQuadrado(quadrado.id))
})

document.querySelector('#reiniciar').addEventListener('click', reiniciarJogo)