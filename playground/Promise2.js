var STATUS = {
    pending: 'PENDING',
    resolved: 'RESOLVED',
    rejected: 'REJECTED'
}

function Promise(executor) {
    this.status = STATUS.pending;
    this.value = null;
    this.reason = null;

    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];

    var _ = this;
    function resolve(value) {
        if (_.status === STATUS.pending) {
            _.status = STATUS.resolve;
            _.value = value;
            _.resolvedCallbacks.forEach(function(cb) {
                cb(_.value);
            })
        }
    }

    function reject(reason) {
        if (_.status === STATUS.pending) {
            _.status = STATUS.rejected;
            _.reason = reason;
            _.rejectedCallbacks.forEach(function(cb) {
                cb(_.reason);
            })
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : function(value) { return value; };
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason; };

    var _ = this;

    // if (this.status === STATUS.pending) {
    //     this.resolvedCallbacks.push(onResolved);
    //     this.rejectedCallbacks.push(onRejected);
    // }

    // if (this.status === STATUS.resolved) {
    //     onResolved(this.value);
    // }

    // if (this.status === STATUS.rejected) {
    //     onRejected(this.reason);
    // }
    // 
    return new Promise(function(resolve, reject) {
        var resolved = function (value) {
            setTimeout(function() {
                try {
                    var res = onResolved(value);
                    if (res instanceof Promise) {
                        res.then(resolve, reject)
                    } else {
                        resolve(res);
                    }
                } catch (e) {
                    reject(e);
                }
            }, 0)
        };

        var rejected = function(reason) {
            setTimeout(function() {
                try {
                    var res = onRejected(reason);
                    if (res instanceof Promise) {
                        res.then(resolve, reject);
                    } else {
                        resolve(reason);
                    }
                } catch (e) {
                    reject(e);
                }
            }, 0)
        }

        if (_.status === STATUS.pending) {
            _.resolvedCallbacks.push(resolved);
            _.rejectedCallbacks.push(rejected);
        }

        if (_.status === STATUS.resolved) {
            resolved(_.value);
        }

        if (_.status === STATUS.rejected) {
            rejected(_.reason);
        }
    })
}

Promise.prototype.catch = function(cb) {
    return this.then(null, cb);
}

Promise.prototype.all = function(lists) {
    var count = 0;
    var arr = [];
    return new Promise(function(resolve, reject) {
        lists.forEach(function(p, index) {
            Promise.resolve(p).then(function(data) {
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

const p = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve(1);
  }, 2000);
});

p.then(function(v) {
  console.log(v);
  return 2;
}).then(function(v) {
  console.log(v);
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(3);
    }, 3000);
  });
}).then(function(v) {
  console.log(v);
});