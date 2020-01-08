function person(name, age) {
    console.log(this)
    return {
        name: name,
        age: age,
        sex: this.sex
    }
}

var obj = {
    sex: 'male'
}


Function.prototype.myBind = function(context) {
    context = context || window
    var args = [].slice.call(arguments, 1)
    var fn = this

    function F() {
        if (this instanceof F) {
            return new fn(...args, ...arguments)
        }
        return fn.apply(context, args.concat(...arguments))
    }

    return F;
}

var man = person.bind(obj, 'aaaaa')

var a = new man(10)
console.log(a)
console.log(man(11))