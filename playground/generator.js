// function* foo(x) {
//   const y = 2 * (yield (x + 1));
//   const z = yield (y/3);
//   return (x + y + z);
// }

// const f = foo(5);
// const a = f.next();
// console.log(a.value)
// console.log(f.next(3))
// console.log(f.next(1))

// 如果给next方法传参数， 那么这个参数将会作为上一次yield语句的返回值



/* 一个简单的解释器的模拟 */
function co(gen) {
  gen = gen()
  const next = ({value, done}) => {
    return new Promise(resolve => {
      if (done) {
        resolve(value)
      } else {
        value.then(data => {
          next(gen.next(data)).then(resolve)
        })
      }
    })
  }
  return next(gen.next())
}


function run(gen) {
  gen = gen()
  return next(gen.next())

  function next({ done, value }) {
    return new Promise(resolve => {
      if (done) { // finish
        resolve(value)
      } else { // not yet
        value.then(data => {
          next(gen.next(data)).then(resolve)
        })
      }
    })
  }
}

function getRandom() {
  return new Promise(resolve => {
    setTimeout(_ => resolve(Math.random() * 10 | 0), 1000)
  })
}

function* main() {
  let num1 = yield getRandom()
  let num2 = yield getRandom()
  let num3 = yield getRandom()

  return num1 + num2 + num3
}

co(main).then(data => {
  console.log(`got data: ${data}`);
})



// Async函数始终返回一个Promise
// Await是按照顺序执行的，并不能并行执行

/* 
Generator与async function都是返回一个特定类型的对象：

Generator: 一个类似{ value: XXX, done: true }这样结构的Object
Async: 始终返回一个Promise，使用await或者.then()来获取返回值

Generator是属于生成器，一种特殊的迭代器，用来解决异步回调问题感觉有些不务正业了。。
而async则是为了更简洁的使用Promise而提出的语法，相比Generator + co这种的实现方式，更为专注，生来就是为了处理异步编程
*/