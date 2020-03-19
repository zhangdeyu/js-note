// 依赖收集
/*订阅者*/
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update()
        })
    }
}

Dep.target = null;

class Watcher {
    constructor() {
        /*在一个new Watcher对象时将该对象赋值给Dep.target 在get中会用到*/
        Dep.target = this;
    }

    update() {
        console.log('视图更新了')
    }
}


function defineReactive(obj, key, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function reactiveGetter() {
            dep.addSub(Dep.target)
            return val;
        },
        set: function reactiveSetter(newVal) {
            if (newVal !== val) {
                val = newVal
            }
            dep.notify(newVal)
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
        // 新建一个Watcher观察者对象 Dep会指向这个对象
        new Watcher();

        console.log('render', this._data.test)
    }
}

let o = new Vue({
    data: {
        test: "I am test"
    }
});
o._data.test = 'hello world'