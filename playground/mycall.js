Function.prototype.myCall = function(context) {
    context = context || window;
    context.fn = this;

    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    var result = eval('context.fn(' + args.join(',') + ')');
    delete context.fn;
    return result;
}

function foo() {
    console.log(arguments)
    console.log(this.a)
}

var obj = {
    a: 1
}

foo.myCall(obj, '1', 2, 3)


// Function.prototype.myBind = function(context) {
//     context = context || window;

//     var args = [];
//     for (var i = 1; i < arguments.length; i++) {
//         args.push(arguments[i]);
//     }

//     var fn = this;

//     function F() {
//         for (var i = 1; i < arguments.length; i++) {
//             args.push(arguments[i]);
//         }
//         if (this instanceof F) {
//             return eval('new fn('+ args.join(',') +')')
//         } else {
//             return fn.apply(context, args)
//         }
//     }

//     return F;
// }
// 
Function.prototype.myBind = function(context) {
    if (typeof this !== 'function') {
        throw new Error('not function')
    }

    var fn = this;
    var args = [].slice.call(arguments, 1);

    var fNOP = function() {};

    var fBound = function() {
        var bindArgs = [].slice.call(arguments);

        args = args.concat(arguments);
        if (this instanceof fNOP) {
            return fn.apply(this, args);
        } else {
            return fn.apply(context, args)
        }
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
}

function myNew(fn) {
    var obj = {};
    obj.__proto__ = fn.prototype
    var result = fn.apply(obj, [].slice.call(arguments, 1));

    return typeof result === 'object' ? result : obj;
}


function curry(fn) {
    var args = [].slice.call(arguments, 1);
    if (fn.length > args.length) {
        return function() {
            return curry(fn, ...args, ...arguments)
        }
    } else {
        return fn(...args);
    }
}


var add = function (a, b, c) {
    return a + b + c;
}

console.log(curry(add, 2)(3)(5))
