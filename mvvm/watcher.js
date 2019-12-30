function Watcher(vm, expOrFn, cb) {
    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;

    this.depIds = {}

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = this.parseGetter(expOrFn)
    }

    this.value = this.get()
}
Watcher.prototype.parseGetter = function(exp) {
    if (/[^\w.$]/.test(exp)) return; 
    exp = exp.replace(/\[(\d+)\]/g, '.$1').split('.')

    return function (obj) {
        for(var i = 0; i < exp.length; i ++) {
            if (!obj) {
                return;
            }

            obj = obj[exp[i]];
        }
        return obj;
    }
}

Watcher.prototype.update = function() {
    this.run()
}
Watcher.prototype.run = function () {
    var value = this.get()
    var oldVal = this.value;
    if (value !== oldVal) {
        this.value = value;
        this.cb.call(this.vm, value, oldVal);
    }
}
Watcher.prototype.get = function () {
    Dep.target = this;
    var value = this.getter.call(this.vm, this.vm)
    Dep.target = null;
    return value
}

Watcher.prototype.addDep = function(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
        dep.addSub(this);
        this.depIds[dep.id] = dep;
    }
}