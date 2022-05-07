let array_len = 100

let nums = [...Array(array_len).keys()]

console.log(nums.filter((item) => item % 2 === 0).toString())