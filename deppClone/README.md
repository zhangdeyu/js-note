# 深拷贝

>JS中分为基本数据类型和引用类型，在使用引用类型的过程中会出现深拷贝与浅拷贝的问题。

## 浅拷贝
拷贝的为原始对象的内存地址，其中的一个对象改变了这个地址内的内容，另外一个就会受到影响。

## 深拷贝
拷贝的为原始对象的值，从内存中将原始的对象的完整内容放到一个新的区域存放，且修改其中一个，另一个不会受到影响。


常规实现深拷贝的方式有JSON.parse、递归

## JSON.parse和JSON.stringify
常规使用方式如下
```JAVASCRIPT
const obj1 = {}
const obj2 = JSON.parse(JSON.stringify(obj1))
```

这种方式非常简单，但是有很大的缺陷，比如不适用于当obj1中存在函数、循环应用、含有其他引用类型的内容（日期、正则表达式）、原型链的情况
如下代码所示
```JAVASCRIPT
const obj1 = {
    a: 1,
    getA: function() {
        return a;
    },
    date: new Date(),
    reg: new RegExp('\\w+')
}

const obj2 = JSON.parse(JSON.stringify(obj1))
// obj2中 data变为字符串 reg为空对象

function Person(name, age) {
    this.name = name
    this.age = age
}

Person.prototype.getName = function() {
    return this.name
}
const objProto = new Person("Derek", 28)

const cloneObjProto = JSON.parse(JSON.stringify(objProto))
// cloneObjProto中无getName方法
```


## 递归
- 基础版本 这个版本用最基本的递归解决了深拷贝  但是没有考虑数组、日期等特殊情况
```JAVASCRIPT
function isObject(obj) {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}
function deepClone(obj) {
    if (!isObject(obj)) {
        return obj
    }

    let cloneObj = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key])
        }
    }

    return cloneObj;
}
```


- 循环引用
>在递归中循环引用会导致栈内存溢出 为了解决循环引用，可以开辟额外的存储空间来存储当前对象和拷贝对象的关系，当前需要拷贝对象时，先去存储空间中找，如果有则直接返回，没有则继续拷贝
```JAVASCRIPT
function isObject(obj) {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}
function deepClone(obj, weakmap = new WeakMap()) {
    if (!isObject(obj)) {
        return obj
    }

    let cloneObj = {}

    if (weakmap.get(obj)) {
        return weakmap.get(obj)
    }

    weakmap.set(obj, cloneObj)
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], weakmap)
        }
    }

    return cloneObj
}
```

- 考虑数组、日期、函数、正则表达式等引用类型

```JAVASCRIPT
function isObject(obj) {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

function getType(obj) {
    return Object.prototype.toString.call(obj)
}

// 可继续遍历的类型
const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const objectTag = '[object Tag]'
const argsTag = '[object Arguments]'

// 不可继续遍历的类型
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const errorTag = '[object Error]'
const regexpTag = '[object RegExp]'
const funcTag = '[object Function]'

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag]

// 初始化被clone的对象
function getInit(fn) {
    const Constructor = fn.constructor
    return new Constructor()
}

// clone Symbol
function cloneSymbol(symb) {
    return Object(Symbol.prototype.valueOf.call(symb))
}

// clone 正则表达式
function cloneRegExp(regexp) {
    const reFlags = /\w*$/
    const res = new regexp.constructor(regexp.source, reFlags.exec(regexp))
    res.lastIndex = regexp.lastIndex
    return res;
}

// clone Function
function cloneFunction(fn) {
    const bodyReg = /(?<={)(.|\n)+(?=})})/m
    const paramReg = /(?<=\().+(?=\)s+{})/
    const funcString = fn.toString()
    if (fn.prototype) {
        const params = paramReg.exec(funcString)
        const body = bodyReg.exec(funcString)
        if (body) {
            if (params) {
                const paramsArr = params[0].split(',');
                return new Function(...paramsArr, body[0])
            } else {
                return new Function(body[0])
            }
        } else {
            return null
        }
    } else {
        return eval(funcString)
    }
}

function cloneOtherType(obj, type) {
    const Constructor = obj.constructor
    switch(type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Constructor(obj)
        case regexpTag:
            return cloneRegExp(obj)
        case symbolTag:
            return cloneSymbol(obj)
        case funcTag:
            return cloneFunction(obj)
        default:
            return null
    }
}

function deepClone(obj, weakmap = new WeakMap()) {
    if (!isObject(obj)) {
        return obj
    }

    let cloneObj;
    const type = getType(obj)

    if (deepTag.includes(type)) {
        cloneObj = getInit(obj)
    } else {
        return cloneOtherType(obj, type)
    }

    if (weakmap.get(obj)) {
        return weakmap.get(obj)
    }

    weakmap.set(obj, cloneObj)

    // 处理set deep clone
    if (type === setTag) {
        obj.forEach(item => {
            cloneObj.add(deepClone(item, weakmap))
        })

        return cloneObj
    }

    // 处理map deep clone
    if (type === mapTag) {
        obj.forEach((v, k) => {
            cloneObj.set(k, deepClone(v, weakmap))
        })

        return cloneObj
    }

    if (type === arrayTag) {
        for(let i = 0; i < obj.lenght; i++) {
            cloneObj[i] = deepClone(obj[i], weakmap)
        }

        return cloneObj;
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], weakmap)
        }
    }

    return cloneObj
}
```

[参考](https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1)