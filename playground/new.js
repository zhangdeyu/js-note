function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}

var man = new Person('Derek', 28, 'male');
console.log(man)

function create(fn) {
    var obj = Object.create({})
    obj.__proto__ = fn.prototype;
    var args = [].slice.call(arguments, 1)
    var res = fn.apply(obj, args);
    if (res instanceof Object) {
        return res
    }
    return obj;
}

var oman = create(Person, 'Derek', 28, 'male')
console.log(oman)