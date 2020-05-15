// function func(num) {
//   if (num === 1) return 0;

//   if (num % 2 === 0) {
//     return 1 + func(num / 2);
//   } else {
//     return 1 + func((3 * num + 1) / 2);
//   }
// }

function func(num) {
  var steps = 0;
  while(num > 1) {
    if (num % 2 === 0) {
      num = num / 2;
    } else {
      num = (3 * num + 1) / 2;
    }
    steps ++;
  }

  return steps;
}

function throttle(fn, duration) {
  var previous = 0;
  function throttled() {
    var _ = this;
    var args = [].slice.call(arguments);
    var now = Date.now();

    if (now - previous >= duration) {
      previous = now;
      return fn.apply(_, args);
    }
  }

  throttled.cancel = function () {
    previous = 0;
  }

  return throttled;
}

function debounce(fn, duration) {
  var timer = null;
  function debounced() {
    clearTimeout(timer);
    var _ = this;
    var args = [].slice.call(arguments);
    timer = settimeout(function() {
      var res = fn.apply(_, args);
      clearTimeout(timer);
      return res;
    }, duration);
  }

  debounced.cancel = function() {
    clearTimeout(timer);
  }

  return debounced;
}


function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
  // obj instanceof Array
  // Array.isArray()
}

function deepClone(obj) {
  if (!isObject(obj)) {
    return obj;
  }

  if (isArray(obj)) {
    var newArr = [];
    for (var i = 0; i < obj.length; i ++) {
      newArr[i] = deepClone(obj[i]);
    }

    return newArr;
  } else {
    var newObj = {};
    for (var k in obj) {
      newObj[k] = deepClone(obj[k]);
    }

    return newObj;
  }
}


function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHi = function() {
  return "my name is " + this.name + ", and I'am " + this.age + " years old";
}

function Student(name, age, no) {
  Person.call(this, name, age);
  this.no = no;
}

Student.prototype = Object.create(Person.prototype, {
  constructor: {
    value: Student,
    configurable: true,
    enumerable: false,
    writable: true
  }
})

fn.myCall(this, )

Function.prototype.myCall = function(content) {
  content = content || window;
  content.fn = this;
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var res = eval('content.fn(' + args.join(',') +')');
  delete content.fn;
  return res;
}

Function.prototype.myApply = function(content, args) {
  content = content || window;
  content.fn = this;
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var res = eval('content.fn(' + args.join(',') + ')');
  delete content.fn;
  return res;
}

Function.prototype.myBind = function(content) {
  content = content || window;
  var fn = this;
  var args = [].slice.call(arguments, 1);

  function F() {
    if (this instanceof F) {
      return new fn(...args, ...arguments);
    } else {
      return fn.apply(content, args.join(...arguments))
    }
  }

  return F;
}


function myNew(Constructor) {
  var obj = {};
  obj.__proto__ = Constructor.prototype;
  var args = [].slice.call(arguments, 1);

  var res = Constructor.apply(obj, args);

  return typeof res === 'object' ? res : obj;
}


function curry(fn) {
  var args = [].slice.call(arguments, 1);
  if (fn.length === args.length) {
    return fn(...args);
  } else {
    return function() {
      return curry(fn, ...args, ...[].slice.call(arguments));
    }
  }
}

var status = {
  pending: 'PENDING',
  resolved: 'RESOLVED',
  rejected: 'REJECTED'
}

function MyPromise(exec) {

  this.status = status.pending;
  this.value = null;
  this.reason = null;

  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];

  var _ = this;

  function resolve(value) {
    if (_.status === status.resolved) {
      _.value = value;
      _.resolvedCallbacks.forEach(function(cb) {
        cb(_.value)
      })
    }
  }

  function reject(reason) {
    if (_.status === status.rejected) {
      _.reason = reason;
      _.rejectedCallbacks.forEach(function(cb) {
        cb(_.reason);
      })
    }
  }

  exec(resolve, reject)
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  var _ = this;

  return new MyPromise(function(resolve, reject) {
    var resolved = function(value) {
      setTimeout(function () {
        try {
          var res = onResolved(value);

          if (res instanceof MyPromise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }

        } catch (e) {
          reject(e)
        }
      }, 0);
    }

    var rejected = function(reason) {
      setTimeout(function() {
        try {
          var res = onRejected(reason);

          if (res instanceof MyPromise) {
            res.then(resolve, reject);
          } else {
            resolve(reason);
          }
        } catch (e) {
          reject(e);
        }
      }, 0);
    }

    if (_.status === status.pending) {
      _.resolvedCallbacks.push(resolved);
      _.rejectedCallbacks.push(rejected)
    }

    if (_.status === status.resolved) {
      resolved(_.value);
    }

    if (_.status === status.rejected) {
      rejected(_.reason);
    }
  })
}

MyPromise.prototype.catch = function(cb) {
  return this.then(null, cb);
}

MyPromise.prototype.all = function(lists) {
  var count = 0;
  var arr = [];

  return new MyPromise(function(resolve, reject) {
    lists.forEach(function(item, index) {
      MyPromise.resolve(item).then(function(data) {
        arr[index] = data;
        count ++;
        if (count === lists.length) {
          resolve(arr);
        }
      }).catch(function(e) {
        reject(e);
      })
    })
  })
}


function defineReactive(obj, k, v) {
  Object.defineProperty(obj, k, {
    get: function() {
      return v;
    },
    set: function (newVal) {
      if (v !== newVal) {
        v = newVal;
      }
    }
  })
}

const arrayProto = Array.prototype;
const arrayProtoMethods = Object.create(arrayProto);

['push', 'pop', 'reverse', 'sort', 'shift', 'unshift', 'spllice'].forEach(function(method) {
  Object.defineProperty(arrayProtoMethods, method, {
    value: function() {
      const originMethod = arrayProto[method];
      const args = Array.from(arguments);

      // notify
      return originMethod.apply(this, args);
    }
  })
})

function watchArray(target) {
  target.__proto__ = arrayProtoMethods;
}

function Vnode(tag, data, children, text, el) {
  // 标签
  this.tag = tag;
  // 数据  attr props
  this.data = data;
  // 子节点
  this.children = children;
  // 文本
  this.text = text;
  // 对应的元素
  this.el = el;
}