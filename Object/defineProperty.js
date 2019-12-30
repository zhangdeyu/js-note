var obj = {}

// 1.给object定义一个a 属性 其他都为false
Object.defineProperty(obj, 'a', {
    configurable: false,
    enumerable: false,
    value: 1,
    writable: false
})

Object.defineProperty(obj, 'b', {
    configurable: false,
    enumerable: true,
    value: 2,
    writable: false
})

console.log(obj) // 展示{ b: 2 } a的enumerable为false 不能被枚举

Object.defineProperty(obj, 'c', {
    configurable: true,
    enumerable: true,
    value: 'c',
    writable: false
})

Object.defineProperty(obj, 'd', {
    configurable: false,
    enumerable: true,
    value: 'd',
    writable: true
})

Object.defineProperty(obj, 'e', {
    configurable: true,
    enumerable: true,
    value: 'e',
    writable: true
})

console.log(Object.keys(obj)) // 只能打印enumerable为true的属性

obj.c = 'c1' // 数据描述符只配置configurable 不能被修改
obj.d = 'd1' // 只配置writable 不能被修改
obj.e = 'e1' // configurable
console.log(obj)

// configurable或者writable为true的情况可通过Object.defineProperty()进行修改
Object.defineProperty(obj, 'c', {
    value: 'newc1'
})

Object.defineProperty(obj, 'd', {
    value: 'newd1'
})

Object.defineProperty(obj, 'e', {
    value: 'newe1'
})

console.log(obj)
delete obj.c
delete obj.d
delete obj.e

console.log(obj)

Object.defineProperty(obj, 'arr', {
    configurable: false,
    enumerable: true,
    value: [1],
    writable: false
})

console.log(obj)
obj.arr.push(2) // 属性为数组时push不受影响
console.log(obj)
obj.arr = [] // 属性为数组时直接修改受影响
console.log(obj)
// 由此可见对于 configurable以及writable为false时 对于对象、数组等对象数据类型(对象数据类型在执行栈中保存的是数据在堆中存放的地址) 该属性对应的栈中的地址不能被修改

