function MVVM(options) {
    this.$options = options || {}
    var data;

    if (typeof this.$options.data === 'function') {
        data = this.$options.data();
        console.log(data)
    } else {
        data = this.$options.data;
    }
    this._data = data;
    var _ = this;
    Object.keys(data).forEach(function (key) {
        _._proxyData(key)
    })

    this._initComputed()
    observe(data, this)

    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype._proxyData = function (key, setter, getter) {
    var _ = this;
    setter = setter || function proxySetter(newVal) {
        _._data[key] = newVal;
    }
    getter = getter || function proxyGetter() {
        return _._data[key]
    }
    Object.defineProperty(_, key, {
        configurable: false,
        enumerable: true,
        get: getter,
        set: setter
    });
}

MVVM.prototype.$watch = function(key, cb) {
    new Watcher(this, key, cb);
}

MVVM.prototype._initComputed = function() {
    var _ = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
        Object.keys(computed).forEach(function(key) {
            Object.defineProperty(_, key, {
                get: function() {
                    if (typeof computed[key] === 'function') {
                        return computed[key]()
                    } else {
                        if (computed[key].get && typeof computed[key].get === 'function') {
                            return computed[key].get()
                        }
                    }
                },
                set: function() {}
            })
        })
    }
}