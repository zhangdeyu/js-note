const obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}`)
        // 等同于obj[key]
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key} = ${value}`)
        // 等同于
        return Reflect.set(target, key, value, receiver)
    }
})

obj.count = 1

++obj.count

obj.arr = []
obj.arr.push(1)

console.log(obj.arr)
