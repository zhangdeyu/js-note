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
    if (_.status === status.pending) {
      _.status = status.resolved;
      _.value = value;
      _.resolvedCallbacks.forEach(function(cb) {
        cb(_.value);
      })
    }
  }

  function reject(reason) {
    if (_.status = status.pending) {
      _.status = status.rejected;
      _.reason = reason;
      _.rejectedCallbacks.forEach(function(cb) {
        cb(_.reason);
      })
    }
  }

  exec(resolve, reject) // 执行promise传的回调函数
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  var _ = this;
  if (this.status = status.pending) {
    this.resolvedCallbacks.push(onResolved);
    this.rejectedCallbacks.push(onRejected);
  }

  if (this.status === status.resolved) {
    onResolved(this.value);
  }

  if (this.status === status.rejected) {
    onRejected(this.value);
  }
}

MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

// 接受一个Promise实例的数组
// 如果元素不是Promise对象，则使用 Promise.resolve转换
// 全部成功 状态转换成resolved 返回值将直接传递给回调
// 只要有一个失败，状态就变成rejected 
MyPromise.prototype.all = function(promises) {
  promises = Array.from(promises);
  let count = 0;
  let res = [];
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      Promise.resolve(p).then((result) => {
        res[index] =result;
        count++;
        if (count === promises.length) {
          resolve(res)
        }
      }).catch(e => {
        reject(e)
      })
    })
  })
}

var p = new MyPromise(function(resolve, reject) {
  console.log('start')
  setTimeout(() => {
    resolve('data1')
  }, 1000);
})

p.then(function(v) {
  console.log(v)
})

console.log('end')