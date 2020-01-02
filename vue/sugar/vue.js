class Vue {
    constructor(options = {}) {
        this.$options = options
        let data = {}
        if (typeof options.data === 'function') {
            data = options.data()
        } else {
            data = options.data
        }

        this._data = data

        observe(data)

        Object.keys(this._data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                get() {
                    return this._data[key]
                },
                set(newVal) {
                    this._data[key] = newVal
                }
            })
        })

        this.initComputed()

        // compile
        new Compile(document.querySelector(options.el) || document.body, this)
    }

    initComputed() {
        const computed = this.$options.computed
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(key => {
                const val = computed[key]
                Object.defineProperty(this, key, {
                    configurable: false,
                    enumerable: true,
                    get: typeof val === 'function' ? val : (typeof val.get === 'function' ? val.get : () => { }),
                    set: () => {},
                })
            })
        }
        
    }
}

class Compile {
    constructor(el, vm) {
        this.$el = el;
        this.$vm = vm;

        this.$fragment = this.node2Fragment(el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }

    node2Fragment(el) {
        let fragment = document.createDocumentFragment()
        let child = null;
        while(child = el.firstChild) {
            fragment.appendChild(child)
        }

        return fragment
    }

    init() {
        this.compile(this.$fragment)
    }

    compile(el) {
        [].slice.call(el.childNodes).forEach(node => {
            let text = node.textContent;
            const reg = /\{\{(.*)\}\}/
            if (DOMUtils.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1.trim(), text)
            } else if (DOMUtils.isElementNode(node)) {
                this.compileElement(node)
            }

            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileElement(node) {
        let attrs = node.attributes

        ;[].slice.call(attrs).forEach(attr => {
            const name = attr.name
            const exp = attr.value
            if (DOMUtils.isDirective(name)) {
                if (name === 'v-model') {
                    node.value = Utils.getValue(this.$vm, exp)
                    new Watcher(this.$vm, exp, (val, newVal) => {
                        if (val === newVal) {
                            return;
                        }

                        node.value = Utils.getValue(this.$vm, exp)
                    })

                    node.addEventListener('input', (e) => {
                        Utils.setValue(this.$vm, exp, e.target.value)
                    })
                }
            }
        })
    }

    compileText(node, exp, text) {
        let val = Utils.getValue(this.$vm, exp);

        new Watcher(this.$vm, exp, (val, newVal) => {
            if (val === newVal) {
                return;
            }

            node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)
        })

        node.textContent = text.replace(/\{\{(.*)\}\}/, val)
    }
}

const Utils = {
    formatExp(exp) {
        return exp = exp.split('.')
    },
    getValue(obj, exp) {
        let val = obj;
        exp = this.formatExp(exp)
        exp.forEach(key => {
            val = val[key]
        })

        return val;
    },
    setValue(obj, exp, value) {
        let val = obj
        exp = this.formatExp(exp)
        exp.forEach((key, index) => {
            if (index < exp.length - 1) {
                val = val[key]
            } else {
                val[key] = value
            }
        })
    }
}

const DOMUtils = {
    isElementNode(node) {
        return node.nodeType === 1
    },
    isTextNode(node) {
        return node.nodeType === 3
    },
    isDirective(attr) {
        return attr.indexOf('v-') === 0
    }
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return
    }
    return new Observer(data)
}

class Observer {
    constructor(data) {
        this.data = data;
        this.walk(this.data)
    }
    walk(data) {
        for(let key in data) {
            this.defineReactive(data, key, data[key])
        }
    }

    defineReactive(obj, key, val) {
        const dep = new Dep()
        observe(val)
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: true,
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target)
                }

                console.log(`get ${key} = ${val}`)

                return val
            },
            set(newVal) {
                if (newVal === val) {
                    return
                }

                console.log(`set ${key} from ${val} to ${newVal}`)

                val = newVal
                observe(val)
                dep.notify()
            }
        })
    }
}

let uid = 0
class Dep {
    static target = null
    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    notify() {
        this.subs.forEach(sub => {
            // 规定sub必须有update方法
            sub.update()
        })
    }
}

Dep.target = null

class Watcher {
    constructor(vm, exp, callback) {
        this.callback = callback
        this.vm = vm
        this.exp = exp

        this.val = this.get()
    }

    get() {
        Dep.target = this
        let val = Utils.getValue(this.vm, this.exp)
        Dep.target = null

        return val
    }

    update() {
        this.run()
    }

    run() {
        let val = this.val
        let newVal = this.get()

        if (newVal !== this.val) {
            this.val = newVal
        }
        this.callback(val, newVal)
    }
}