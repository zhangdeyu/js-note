# JavaScript原型和原型链

## 构造函数 constructor
一般情况下我们使用构造函数创建一个对象（实例），如下所示
```JAVASCRIPT
function Person() {};

var person = new Person();

person.name = 'Derek';

console.log(person);
```

在这个例子中，Person就是构造函数，使用new 创建了一个实例对象person。

## 原型 prototype
我们知道每个函数都有一个prototype属性，比如
```JAVASCRIPT
function Person() {}
Person.prototype.name = 'Derek';

var p1 = new Person();
var p2 = new Person();

console.log(p1.name)
console.log(p2.name)
```

那么这个函数的prototypes属性指向的是什么呢？函数的propertype属性指向了一个对象，这个对象时调用这个函数创建出来的实例的原型。
可以理解为，每一个JavaScript对象（null 除外）在创建的时候都会与之关联另外一个对象，这个对象就是原型，每一个对象都会从原型上继承属性。

Person(构造函数) ----propertype----> Person.propertype(原型)
                <---constructor----

## 原型链
这是每个JavaScript对象都具有的属性，它指向创建该对象的原型
p1.__proto__ === Person.prototype
当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到就去找原型的原型，一直到最顶层为止

因为实例的原型也是一个对象，既然是对象，我们可以通过Object构造函数生成，所以实例原型的__proto__指向Object.prototype

Person.prototype ----__proto__----> Object.prototype

Object.prototype的原型是null 代表没有对象，所以原型链到Object.prototype就可以停止查找了

## 如何实现继承

- 寄生组合继承
```JAVASCRIPT

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.getName = function() {
    return this.name;
};

function Student(name, age, no) {
    Person.call(this, name, age)
    this.no = no;
}

Student.prototype = Object.create(Person.prototype, {
    constructor: {
        value: Student,
        enumerable: false,
        writable: true,
        configurable: true
    }
})

```

## new的原理及实现
- 创建一个新对象
- 将对象的原型指向构造函数的prototype
- 绑定this
- 返回新对象
```JAVASCRIPT
function create() {
    let obj = {};
    let Con = [].shift.call(arguments);
    obj.__proto__ = Con.prototype;

    let res = Con.apply(obj, arguments);

    return typeof res === 'object' ? res : obj;
}
```

## instanceof的原理及实现
instanceof可以判断对象的类型是因为其内部机制是通过原型链进行判断
```JAVASCRIPT
function myInstanceOf(left, right) {
    let prototype = right.prototype;
    while(true) {
        if (left === null) {
            return false;
        }
        if (propertype === left) {
            return true;
        }

        left = left.__proto__;
    }
}
```