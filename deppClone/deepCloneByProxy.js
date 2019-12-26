// 参考 头条面试官：你知道如何实现高性能版本的深拷贝嘛？
// 使用Proxy实现高性能的深拷贝

const MY_IMMER = Symbol('my-immer1')

/**
 * plain object 通过 var obj = {}、Object.create() 、 new Object()创建的对象为纯对象
 * 纯对象的原型只能是null或者Object.prototype
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
const isPlainObject = obj => {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }

    let proto = obj
    // Object.getPrototypeOf(Object)  不是  Object.prototype
    // Object.getPrototypeOf(Object) === Object.__proto__
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return proto === Object.getPrototypeOf(proto)
}

const isProxy = value => {
    console.log('------isProxy', value)
    return !!value && !!value[MY_IMMER]
}

function produce(baseState, fn) {
    const proxies = new Map()
    const copies = new Map()

    const objectTraps = {
        get(target, key) {

            console.log('-------get', target, key)
            if (key === MY_IMMER) {
                return target
            }
            const data = copies.get(target) || target

            return getProxy(data[key])
        },
        set(target, key, val) {
            console.log('-------set', target, key, val)
            const copy = getCopy(target)
            const newValue = getProxy(val)
            copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue

            return true
        }
    }

    const getProxy = data => {
        console.log('-----getProxy', data)
        if (isProxy(data)) {
            return data
        }

        if (isPlainObject(data) || Array.isArray(data)) {
            if (proxies.has(data)) {
                return proxies.get(data)
            }

            const proxy = new Proxy(data, objectTraps)

            proxies.set(data, proxy)

            return proxy
        }

        return data
    }

    const getCopy = data => {
        console.log('----getCopy', data)
        if (copies.has(data)) {
            return copies.get(data)
        }

        const copy = Array.isArray(data) ? data.slice() : {...data}
        copies.set(data, copy)

        return copy
    }

    const isChange = data => {
        console.log('----isChange', data)
        if (proxies.has(data) || copies.has(data)) {
            return true
        }
        return false
    }

    const finalize = data => {
        console.log('----finalize', data)
        if (isPlainObject(data) || Array.isArray(data)) {
            if (!isChange(data)) {
                return data
            }

            const copy = getCopy(data)
            Object.keys(copy).forEach(key => {
                copy[key] = finalize(copy[key])
            })

            return copy
        }

        return data
    }

    const proxy = getProxy(baseState)
    fn(proxy)
    return finalize(baseState)
}

const state = {
  info: {
    name: 'Derek',
    career: {
      first: {
        name: '360'
      }
    }
  },
  data: [1]
}

const data = produce(state, draftState => {
  console.log('fn', draftState)
  draftState.info.age = 26
  draftState.info.career.first.name = 'baidu'
})

console.log(data, state)
console.log(data.data === state.data)