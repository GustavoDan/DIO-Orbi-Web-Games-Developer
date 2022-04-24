let array_len = 10

let apple = {
    value: 2,
}

let orange = {
    value: 3
}

function mapWithThisArg(arr, thisArg) {
    return arr.map(function (item) {return item * this.value}, thisArg)
}

function mapWithoutThisArg(arr) {
    return arr.map((item, index) => {return item * index})
}

let nums = [...Array(array_len).keys()]

console.log(`Map with this arg - apple: [${mapWithThisArg(nums, apple)}]`)
console.log(`Map with this arg - orange: [${mapWithThisArg(nums, orange)}]`)

console.log(`Map without this arg: [${mapWithoutThisArg(nums)}]`)
