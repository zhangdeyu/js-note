// 数组去重 indexOf
function unique(arr) {
  var ret = [];
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  for (var i = 0; i < arr.length; i ++) {
    // var index = ret.indexOf(arr[i]);
    // if (index === -1) {
    //   ret.push(arr[i]);
    // }
    if (!ret.includes(arr[i])) {
      ret.push(arr[i]);
    }
  }

  return ret;
}

var arr = [1, 1, 'true', 'true', true, true, 15, 15, false, false, undefined, undefined, null, null, NaN, NaN, 'NaN', 0, 0, 'a', 'a', {}, {}];
// console.log(unique(arr))
// console.log(Array.from(new Set(arr)))

// function curring(fn) {
//   var params = [].slice.call(arguments, 1);
//   if (fn.length === params.length) {
//     return fn.apply(this, params);
//   }
//   return function() {
//     return curring.apply(this, [fn].concat(params, [].slice.call(arguments)))
//   }
// }

// function add(x, y) {
//   return x + y;
// }

// var a = curring(add, 1);
// console.log(a(2));

// console.log(curring(add, 2, 3))


function add(x) {
  var sum = x;

  var myAdd = function (y) {
    sum += y;

    return myAdd;
  }

  myAdd.toString = function () {
    console.log('------')
    return sum;
  }

  return myAdd;
}

// console.log(add(3)(4))

function fnWithCurring(fn) {
  var params = [].slice.call(arguments, 1);
  if (fn.length === params.length) {
    return fn.apply(this, params);
  }

  return function b() {
    return fnWithCurring.apply(null, [fn].concat(params.concat([].slice.call(arguments))))
  }
}

function m(x, y, z) {
  return x * y * z;
}

console.log(fnWithCurring(m, 1, 2)(3))


function fibonacci(x) {
  var cache = {};
  function _f(x) {
    if (cache[x]) {
      return cache[x];
    }
    if (x == 1 || x == 2) {
      return 1;
    }

    var a = _f(x-1);
    var b = _f(x-2);
    cache[x-1] = a;
    cache[x-2] = b;
    return a + b;
  }

  return _f(x);
}

console.log(fibonacci(100))