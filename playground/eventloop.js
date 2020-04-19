// 异步任务完成后，会通知主线程，以 callback 的方式获取结果或者执行回调。
// 但是如果当前的主线程是忙碌的，异步任务的信号无法接收到怎么办呢。
// 所以还需要一个地方保存这些 callback，也就是任务队列(task queue)。
// 完整的描述下，就是主线程运行产生堆、栈，执行栈遇到异步任务（浏览器通常是调用 WebAPIs），不会等待，而是继续执行往下执行。
// 而异步任务就会以各种方式，把 callback 加入任务队列中。待当前执行栈执行完毕，
// 也就是出栈完毕，主线程就会从任务队列里读取第一个 callback，执行。
// 同样的生成执行栈，结束后主线程如果发现任务队列中还有 callback，则会继续取出执行，如此重复操作。
// 而这种循环的机制，就称之为事件循环（Event Loop）。

/* 练习1 */
// setTimeout(() => {
//   console.log(1);
// }, 1000);

// setTimeout(() => {
//   console.log(2);
// }, 0);

// console.log(3);

/* 练习2 */
// setTimeout(() => {
//   console.log(4);
// }, 300);

// setTimeout(() => {
//   console.log(3);
// }, 200);

// for (let i = 0; i < 10000; i++) {
//   console.log(1);
// }

// setTimeout(() => {
//   console.log(2);
// }, 100);

/* 练习3 */
// setTimeout(() => {
//   console.log(1);
//   setTimeout(() => {
//     console.log(2);
//   }, 100);
// }, 100);

// setTimeout(() => {
//   console.log(3);
// }, 200);

// console.log(4);
/* 
宏任务、微任务
在任务队列这里，还有一个小的区分。异步任务分为宏任务（macro task）和微任务（micro task），并且会添加到不同的任务队列中。


常见的宏任务 tasks 包括：
XMLHttpRequest 回调
事件回调（onClick）
setTimeout/setInterval
history.back


microtask queue 在每个事件循环中只有一个，跟 tasks 区分，它的本意是尽可能早的执行异步任务。常见的 microtask 包括：
常见的 microtask 包括：
Promise.then
MutationObserver
Object.observe
process.nextTick(node 中)
*/

/* 微任务例子 */

// 1. 加入 tasks 队列
setTimeout(() => {
  // 7. 首次 eventloop 结束，从 tasks 中取出 setTimeout callback，执行。
  console.log('timer');
  // 8. 加入 microtask 中
  Promise.resolve().then(function () {
    console.log('promise1')
  })
  // 9. task 执行完，清空 micro 队列，输出 'promise1'
}, 0);

// 2. 加入 microtask 队列
Promise.resolve().then(function () {// 5. 第一个 microtask 任务
  console.log('promise2');
  // 6. 把 promise3 加入 micro 队列，发现队列不为空，执行输出 'promise3'
  Promise.resolve().then(function () {
    console.log('promise3');
  })
})

// 3. 执行，输出 'script'
console.log('script');
// 4. 第一个 eventloop task 阶段完毕, 开始执行 microtask queue