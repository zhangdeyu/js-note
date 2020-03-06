# JAVASCRIPT词法作用域

## 作用域
- 作用域是指程序源代码中定义变量的区域
- 作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限
- JavaScript采用词法作用域也就是静态作用域

## 静态作用域
静态作用于是指函数的作用于在函数定义的时候就决定了。

```JAVASCRIPT
var val = 1;
function foo() {
    console.log(val)
}

function bar() {
    var val = 2;
    foo();
}

bar() // console.log的结果为1
```
执行foo函数会先从函数内部查找是否有局部变量val,如果没有就根据书写的位置查找上一层代码

## 思考
下面代码的执行结果
```JAVASCRIPT
// 1
var scope = 'global'
function checkScope() {
    var scope = 'local'
    function f() {
        return scope;
    }

    return f();
}

checkScope();


// 2
var val = 'global'
function checkVal() {
    var val = 'local';
    function f() {
        return val;
    }

    return f;
}

checkScope()();
```
两段代码的执行结果都为local
在JS中，函数的执行用到了作用域链，这个作用域链在函数定义的时候创建。嵌套函数f定义在这个作用域链里面，其中的scope一定是局部变量