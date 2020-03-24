Function.prototype.myCall = function(context) {
    context = context || window;
    context.fn = this;

    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    var res = eval('context.fn(' + args.join(',') + ')');
    delete context.fn;
    return res;
}

Function.prototype.myApply = function(context, args) {
    context = context || window;
    context.fn = this;

    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    var res = eval('context.fn(' + args.join(',') + ')');
    delete context.fn;
    return res;
}

Function.prototype.myBind = function(context) {
    context = context || window;
    var fn = this;
    var args = [].slice.call(arguments, 1);

    function F() {
        args = args.concat([].slice.call(arguments));
        if (this instanceof F) {
            return eval('new fn(' + args.join(',') + ')')
        } else {
            return fn.apply(context, args)
        }
    }

    return F;
}

var obj = {
    a: 1
}

function fn() {
    console.log(this.a)
}

fn.myApply(obj)

var f = fn.myBind(obj)
f()

function myNew(ctor) {
    var obj = {};
    obj.__proto__ = ctor.prototype;
    var args = [].slice.call(arguments, 1)
    var res = ctor.apply(obj, args);
    return typeof res === 'object' ? res : obj;
}

function myInstanceof(left, right) {
    left = left.__ptoto__;
    right = right.prototype;
    while (true) {
        if (left === right) {
            return true;
        }
        if (left === null) {
            return false;
        }
        left = left.__proto__;
    }
}

// debounce

function debounce(fn, delay) {
    var timer = null;

    function debounced() {
        var _ = this;
        var args = [].slice.call(arguments);
        timer = null;
        clearTimeout(timer);
        timer = setTimeout(function() {
            timer = null;
            clearTimeout(timer);
            fn.apply(_, args);
        }, delay);
    }

    debounced.cancel = function() {
        timer = null;
        clearTimeout(timer);
    }

    return debounced;
}

// throttle

function throttle(fn, duration) {
    var previous = 0;

    function throttled() {
        var _ = this;
        var args = [].slice.call(arguments);
        var current = Date.now();
        if (current - previous >= duration) {
            previous = current;
            fn.apply(_, args);
        }
    }

    throttled.cancel = function() {
        previous = 0;
    }

    return throttled;
}

// meta
// <meta name="viewport" content="width=device-width;initial-scale=1;maxinum-scale=1;mininum-scale=1;user-scaleble=1no" >

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function ajax(method, url, params = {}, data = {}, headers = {}, withCredentials = true, successCb, failCb) {
    var xhr = new XMLHttpRequest();

    xhr.withCredentials = withCredentials;
    xhr.timeout = 10 * 1000;
    xhr.setRequestHeader('Accept', "application/json");

    Object.keys(headers).forEach(function(header) {
        xhr.setRequestHeader(header, headers[header]);
    })

    method = method.toUpperCase();

    if (method === 'GET' && !isEmpty(params)) {
        url = url + '?' + Object.keys(params).reduce(function(query, k) {
            query = query + '&' + k + '=' + params[k];
            return query;
        }, '');
    }

    xhr.open(method, url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCb && successCb(xhr.responseText);
        } else {
            failCb && failCb(xhr.responseText);
        }
    }

    xhr.ontimeout = function(e) {
        failCb && failCb(e);
    }

    xhr.onerror = function(e) {
        failCb && failCb(e);
    }

    xhr.send(data);
}

var uid = 0;

function jsonp(url, params = {}, successCb) {
    uid++;
    var cb = 'jsonpcallback' + uid;
    var script = document.createElement('script');

    window[cb] = function() {
        successCb && successCb()
        delete window[cb];
        document.body.removeChild(script);
    }

    params.callback = cb;

    var query = Object.keys(params).reduce(function(query, k) {
        query = query + k + '=' + params[k];
        return query;
    }, '');

    url = url + '?' + query;

    script.src = url
    document.body.appendChild(script);
}

function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}

function deepClone(obj) {
    if (!isObject(obj)) return obj;

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (obj instanceof Date) {
        return new Date(obj);
    }

    if (Array.isArray(obj)) {
        var arr = [];
        obj.forEach((item, index) => {
            arr[index] = deepClone(item);
        })

        return arr;
    }

    var newObj = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            newObj[k] = deepClone(obj[k]);
        }
    }

    return newObj;
}

function curry(fn) {
    var args = [].slice.call(arguments, 1);
    console.log(fn.length, args.length)

    if (fn.length === args.length) {
        return fn(...args);
    } else {
        return function() {
            return curry(fn, ...args, ...arguments);
        }
    }
}

function add(a, b, c) {
    return a + b + c;
}

var ff = curry(add, 1)

console.log(ff(2)(3))

function fun(m, n) {
  console.log(m)
  return {
    fun: function(l) {
      return fun(n, l)
    }
  }
}




var b = fun(0).fun(1).fun(2).fun(3);
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);