// 响应式系统
function cb(val) {
    /*渲染视图*/
    console.log('视图更新了')
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function reactiveGetter() {
            return val;
        },
        set: function reactiveSetter(newVal) {
            if (newVal !== val) {
                val = newVal
                cb(newVal)
            }
        }
    })
}


function observer(value) {
    if (!value || (typeof value !== 'object')) {
        return;
    }
    Object.keys(value).forEach((key) => {
        defineReactive(value, key, value[key])
    })
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}

let o = new Vue({
    data: {
        test: "I am test"
    }
});
o._data.test = 'hello world'
