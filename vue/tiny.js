
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