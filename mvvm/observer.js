
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
}

function Observer(data) {
    this.data = data;
    this.walk(data);
}


Observer.prototype.walk = function (data) {
    var _ = this;
    Object.keys(data).forEach(function(key) {
        _.convert(data, key, data[key]);
    })
}

Observer.prototype.convert = function(data, key, val) {
    this.defineReactive(data, key, val);
}

Observer.prototype.defineReactive = function(data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);
    Object.defineProperty(data, key, {
        configurable: false,
        enumerable: true,
        set: function(newVal) {
            console.log('set', key, 'from', val, 'to', newVal)
            if (newVal === val) {
                return;
            }

            childObj = observe(newVal);

            val = newVal;

            dep.notify()
        },
        get: function() {
            console.log('get', key, val);

            if (Dep.target) {
                dep.depend();
            }

            return val;
        }
    })
}

var uid = 0;
function Dep() {
    this.id = uid++; 
    this.subs = [];
}

Dep.target = null;

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub)
}

Dep.prototype.depend = function() {
    Dep.target.addDep(this)
}

Dep.prototype.removeSub = function(sub) {
    var index = this.subs.indexOf(sub)
    if (index !== -1) {
        this.subs.splice(index, 1);
    }
}

Dep.prototype.notify = function() {
    this.subs.forEach(function(sub){
        sub.update();
    })
}