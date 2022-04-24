function validateArray(array, length) {
    try{
        if(!array || !length) throw new ReferenceError('Está faltando pelo menos um parâmetro.');

        if(typeof(array) !== 'object') throw new TypeError('O primeiro parâmetro deve ser um array.');

        if(typeof(length) !== 'number') throw new TypeError('O segundo parâmetro deve ser númerico.');

        if(array.length != length) throw new RangeError('Tamanho do array inválido.');

        return array;
    } catch(e) {
        if(e instanceof(RangeError)){
            console.log('RangeError.')
        } else if(e instanceof(ReferenceError)){
            console.log('ReferenceError.')
        } else if(e instanceof(TypeError)){
            console.log('TypeError.')
        } else{
            console.log(`Tipo de erro não esperado: ${e.name}.`)
        }
        console.log(e.message)
    }
}

console.log(validateArray([0, 1, 2, 3, 4, 5], 6));