let array_len = 101

function somaArray(arr){
    return arr.reduce((total, item) => total + item)
}

function calculaSaldo(itens, saldo){
    return itens.reduce((total, item) => (total - item.preco), saldo);
}

let nums = [...Array(array_len).keys()]

console.log(`Soma array: ${somaArray(nums)}`)

let lista = [
	{
		nome: 'maçã',
		preco: 2,
	},
	{
		nome: 'roupa',
		preco: 30,
	},
	{
		nome: 'carne',
		preco: 25,
	},
]

let saldo = 100

console.log(`Calcula saldo: ${calculaSaldo(lista, saldo)}`)