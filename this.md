# this
- this 指当前函数执行的上下文context
- this规则
    - 一般情况下，this只依赖于调用函数的对象
        - 如果是直接调用，那么则指向window
        - 对于obj.foo()的类型 this指向obj
    - 如果为new的情况，那么this 绑定在new出来的对象上

- 判断规则
    - 判断函数类型
        - 箭头函数 向外层查找
        - call apply bind 中 this指向第一个参数
        - 普通函数
            - 是否为直接调用还是对象调用
                - foo() 指向window
                - obj.foo() 指向obj
            - new this指向new出来的实例上

```JAVASCRIPT
var a = 'window a'
function foo() {
    console.log(this.a)
}

foo() // 指向window

var obj = {
    a: 'obj a',
    foo: function() {
        console.log(this.a)
    }
}

obj.foo() // 指向obj

var objfoo = obj.foo

objfoo() // 直接调用  指向window

var c = new foo() //new  指向c


```

## 箭头函数

- 箭头函数没有this 箭头函数中的this 指向箭头函数外部的第一个不是箭头函数的this

## call/apply/bind
- 都是改变函数的this指向

### call
Function.prototype.call(thisArg, arg1, arg2, ...)
- 接受多个参数 第一个参数为this指向 第二个参数开始为被调用函数所需要的参数
- 改变函数的this指向，并返回执行结果
```JAVASCRIPT
function foo() {
    console.log(this.a) // this被指向为obj
    return this
}

var obj = {
    a: 'obja'
}

var res = foo.call(obj)
console.log(res) // res {a: 'obja'}
```
#### 模拟实现call
```JAVASCRIPT
Function.prototype.myCall = function(context) {
    context = context || window
    var fn = this;
    var args = [...arguments].slice(1)
    context.fn = fn;
    var res = context.fn(...args);
    delete context.fn;

    return res;
}
```


### apply
Function.prototype.apply(thisArg, [argsArray])
- 最多接受两个参数 第一个参数为this的指向 第二个参数为调用函数所需参数的数组
- 改变函数的this指向，并返回执行结果
```JAVASCRIPT
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

var a = person.apply(man, ['aaa', 20]) // {name: "aaa", age: 20, sex: "male"}

```
#### 模拟实现apply
```JAVASCRIPT
Function.prototype.myCall = function(context) {
    var fn = this;
    var args = [].slice.call(arguments, 1)
    context.fn = fn;
    var res = context.fn(...args);
    delete context.fn;

    return res;
}
```

### bind
Function.prototype.bind(thisArg[, arg1[, arg2[, ...]]])
- 创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
- 与call apply不同点在于bind返回的函数可以用 new 调用 new调用的情况下改变this的指向就失效了
```JAVASCRIPT
function person(name, age) {
    return {
        name: name,
        age: age,
        sex: this.sex
    }
}

var obj = {
    sex: 'male'
}



var man = person.bind(obj, 'aaaaa')

var a = man(10)
console.log(a) // { name: 'aaaaa', age: 10, sex: 'male' }
```
#### 模拟实现
```JAVASCRIPT
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
```
## new 运算符
new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例
- 创建一个空的简单JavaScript对象（即{}）；
- 链接该对象（即设置该对象的构造函数）到另一个对象 ；
- 将步骤1新创建的对象作为this的上下文 ；
- 如果该函数没有返回对象，则返回this。
```JAVASCRIPT
function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}

var man = new Person('Derek', 28, 'male');
```

### new模拟实现
```JAVASCRIPT
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
```