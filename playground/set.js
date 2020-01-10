const arr = [1, 2, 3, 4, 5, 6, 2, 4, 7]

const set = new Set(arr)

console.log(set.size)
console.log(set)

set.add(0)

console.log(set)
console.log(set.has(9))
console.log(set.delete(9))
console.log(set.keys())
console.log(set.values())
console.log(set.entries())

for (let key of set.keys()) {
    console.log(key)
}

for (let v of set.values()) {
    console.log(v)
}

for (let item of set.entries()) {
    console.log(item)
}

set.clear()
console.log(set)