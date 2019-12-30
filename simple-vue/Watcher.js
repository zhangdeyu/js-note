class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        this.expOrFn = expOrFn;
        this.depIds = {}

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }

        this.value = this.get();
    }

    run() {
        let value = this.get();
        let oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal)
        }
    }

    update() {
        // Dep触发 update
        this.run();
    }

    get() {
        Dep.target = this;
        let val = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return val;
    }

    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    parseGetter(exp) {
        if (/[^\w.$]/.test(exp)) return;
        exp = exp.replace(/\[(\d+)\]/g, '.$1').split('.');

        return (obj) => {
            for (let i = 0; i < exp.length; i++) {
                if (!obj) {
                    return;
                }

                obj = obj[exp[i]];
            }

            return obj;
        }
    }
}