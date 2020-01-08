// playground.js 运行一些代码

function foo() {
    console.log(arguments)
    console.log(this.a)
}

var obj = {
    a: 1
}

Function.prototype.myCall = function(context) {
    var fn = this;
    var args = [...arguments].slice(1)
    context.fn = fn;
    var res = context.fn(...args);
    delete context.fn;

    return res;
}

foo.myCall(obj, '1', 2, 3)