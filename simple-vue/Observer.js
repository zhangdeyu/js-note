class Observer {
    constructor(data) {
        this.$data = data;
        this.walk(data)
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            this.convert(data, key, data[key]);
        });
    }

    convert(obj, key, val) {
        this.defineReactive(obj, key, val);
    }

    defineReactive(obj, key, val) {
        const dep = new Dep();
        let childObj = observe(val);
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: true,
            set: (newVal) => {
                console.log(`set ${key}: ${val} -> ${newVal}`);
                if (newVal === val) {
                    return;
                }
                childObj = observe(newVal);
                val = newVal;

                dep.notify();

            },
            get: () => {
                console.log(`get ${key}: -> ${val}`);
                
                if (Dep.target) {
                    dep.depend();
                }

                return val;
            }
        })
    }
}

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
}

let uid = 0;
class Dep {
    static target = null;
    constructor() {
        this.id = uid ++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);

        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    }

    depend() {
        Dep.target.addDep(this)
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}