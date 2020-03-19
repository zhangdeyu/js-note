
function defineReactive(obj, k) {
    var value = obj[k];
    Object.defineProperty(obj, k, {
        configurable: true,
        enumerable: true,
        get: function() {
            console.log('get');
            return value;
        },
        set: function(newVal) {
            if (newVal !== value) {
                console.log('set')
                value = newVal
            }
        }
    })
}

var obj = {
    name: 'Derek',
    age: 20
}

Object.keys(obj).forEach(k => {
    defineReactive(obj, k)
})

obj.name = 'newderek'

console.log(obj.age)

var arrayProto = Array.prototype;

var arrayObj = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
    Object.defineProperty(arrayObj, method, {
        value: function mutator() {
            var originMethod = arrayProto[method]
            var args = Array.from(arguments)
            return originMethod.apply(this, args)
        }
    })
})