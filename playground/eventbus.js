
function EventEmitter() {
    this.listeners = {};
}

EventEmitter.prototype.on = function(event, cb) {
    if (!this.listeners[event]) {
        this.listeners[event] = [cb]
    } else if (this.listeners[event].indexOf(cb) === -1) {
        this.listeners[event].push(cb)
    }
}

EventEmitter.prototype.emit = function(event) {
    var args = [].slice.call(arguments, 1);
    this.listeners[event].forEach(function(cb) {
        cb.apply(null, args);
    })
}

EventEmitter.prototype.removeListener = function(event, listener) {
    var index = this.listeners[event].indexOf(listener);
    if (index !== -1) {
        this.listeners[event].splice(index, 1);
    }
}

EventEmitter.prototype.once = function(event, listener) {
    var _ = this;
    function fn() {
        listener.apply(null, [].slice.call(arguments));
        _.removeListener(event, listener);
    }

    this.on(event, fn);
}

EventEmitter.prototype.removeAllListeners = function(event) {
     this.listeners[event] = [];
}