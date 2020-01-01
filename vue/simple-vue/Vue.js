class Vue {
    constructor($options = {}) {
        this.$options = $options;
        let data;
        if (typeof $options.data === 'function') {
            data = $options.data()
        } else {
            data = $options.data;
        }

        this._data = data;

        Object.keys(data).forEach(key => {
            this.proxyData(key)
        })

        this._initComputed()

        observe(data, this)

        this.$compile = new Compile($options.el || document.body, this)
    }

    $watch(key, cb) {
        new Watcher(this, key, cb)
    }

    _initComputed() {
        const computed = this.$options.computed
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(key => {
                Object.defineProperty(this, key, {
                    get: () => {
                        if (typeof computed[key] === 'function') {
                            return computed[key]()
                        } else if (computed[key].get && typeof computed[key].get === 'function'){
                            return computed[key].get()
                        }
                    },
                    set: () => {}
                })
            })
        } 
    }

    proxyData(key, setter, getter) {
        setter = setter || function proxySetter(newVal) {
            this._data[key] = newVal
        }

        getter = getter || function proxyGetter() {
            return this._data[key]
        }

        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get: getter,
            set: setter
        })
    }
}