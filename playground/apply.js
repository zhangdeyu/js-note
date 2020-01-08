function person(name, age) {
    console.log(this.sex)

    return {
        name: name,
        age: age,
        sex: this.sex
    }
}

var man = {
    sex: 'male'
}


Function.prototype.myApply = function(context, args) {
    context = context || window
    context.fn = this
    var res = context.fn(...args)
    delete context.fn
    return res
}

var a = person.myApply(man, ['aaa', 20])
console.log(a)