function Foo() {
    getName = function() {
        alert(1);
    }

    return this;
}

Foo.getName = function () {
    alert(2);
}

Foo.prototype.getName = function() {
    alert(3);
}

var getName = function() {
    alert(4);
}


function getName() {
    alert(5);
}

Foo.getName(); // 2

getName(); // 4

Foo().getName(); // 1

getName(); // 1

new Foo.getName(); // 2 

new Foo().getName(); // 3

new new Foo().getName() // 3

/*
    需要考虑的知识点

    Foo.getName()
    直接调用函数的静态方法

    getName 是直接调用window下面的方法
    全局的 getName 声明有两种 一种是变量式的声明 一种是函数式的声明
    

 */