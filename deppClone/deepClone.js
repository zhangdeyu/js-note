const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const argsTag ='[object Arguments]'

const dateTag = '[object Date]'
const symbolTag = '[object Symbol]'
const boolTag = '[object Boolean]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const regExpTag = '[object RegExp]'
const errorTag = '[object Error]'
const funcTag = '[object Function]'

const deepTag = [arrayTag, objectTag, mapTag, setTag, argsTag, funcTag]

const getType = obj => {
    return Object.prototype.toString.call(obj)
}

const isObject = obj => {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

const getInit = fn => {
    const Constructor = fn.constructor

    return Constructor()
}

function cloneSymbol(symbol) {
    return Object(Symbol.prototype.valueOf.call(symbol))
}

function cloneRegExp(regexp) {
    const reFlags = /\w*$/
    const res = new regexp.constructor(regexp.source, reFlags.exec(regexp))
    res.lastIndex = regexp.lastIndex
    return res;
}

function cloneFunction(fn) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m
    const paramsReg = /(?<=\().+(?=\)\s+{)/
    const funcString = fn.toString()

    if (fn.prototype) {
        const params = paramsReg.exec(funcString)
        const body = bodyReg.exec(funcString)

        if (body) {
            if (params) {
                const paramsArr = params[0].split(',')
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
        case dateTag:
        case stringTag:
        case numberTag:
        case errorTag:
        case boolTag:
            return new Constructor(obj)
        case regExpTag:
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

    let cloneObj
    const type = getType(obj)
    if (deepTag.includes(type)) {
        cloneObj = getInit(obj)
    } else {
        return cloneOtherType(obj, type)
    }

    weakmap.set(obj, cloneObj)

    if (type === setTag) {
        obj.forEach(item => {
            cloneObj.add(deepClone(item, weakmap))
        })

        return cloneObj
    }

    if (type === mapTag) {
        obj.forEach((v, k) => {
            cloneObj.set(k, deepClone(v, weakmap))
        })
        return cloneObj
    }

    if (type === arrayTag) {
        for (let i = 0; i < obj.length; i++) {
            cloneObj[i] = deepClone(obj[i], weakmap)
        }

        return cloneObj
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], weakmap)
        }
    }
    return cloneObj
}