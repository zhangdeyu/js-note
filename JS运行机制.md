# JS运行机制
JS引擎为单线程。（引申：微信小程序的双线程模型，渲染层和逻辑层，通过Native的JSBridge进行通讯，传统的MMVM有虚拟DOM树的概念，且虚拟DOM树在逻辑层中，但在小程序中，虚拟DOM存在于渲染层中。）

## 进程与线程
### 进程 thread

CPU是计算的核心，承担所有的计算任务，进程是CPU资源分配的最小单位。进程可以简单理解为运行中或者进行中的程序，可独立运行且拥有自己的资源空间的任务程序。进程中包括运行中的程序和程序所使用到的内存和系统资源。

CPU中包含很多进程，且CPU会为每一个进程分配资源空间，因为CPU资源是固定的，当进程较多时，系统就会越卡。每个进程之间是相互独立的，CPU在运行（执行）一个进程时，其他的进程处于非运行的状态，详细可参考时间片轮转调度算法。

### 线程 process

线程是CPU调度的最小单位。线程是在进程的基础上一次程序运行的单位，可以理解为线程是程序中的执行片段，一个进程有多个线程组成。一个进程中只有一个执行流则被称为单线程，即程序在执行时，所有的程序路径按照连续顺序排列下来，前面的必须处理好后面的才会执行。

一个进程中多个执行流称作多线程，可以理解为在一个程序中可以同时运行多个不同的线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

### 区别
- 进程是操作系统分配资源的最小单位， 线程是程序执行的最小单位
- 一个进程有一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线
- 进程之间相互独立，但同一个进程下的各个线程之间共享程序的内存空间和资源
- 调度和切换：线程上下文切换比进程上下文切换要快得多

### 多线程和多进程
多进程：是指在同一时间里，统一计算机的操作系统允许两个或两个以上的进程处于运行状态。
多线程：指程序中包含多个执行流，即在一个程序中可以同时运行多个不同线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。


## 浏览器

### Chrome浏览器是多进程的

- Browser进程
    - 主进程，只有一个
    - 负责浏览器界面显示，用交互
    - 负责各个页面的管理，创建和销毁
    - 将渲染进程得到的内存中的Bitmap，绘制到用户界面上
    - 网络资源的管理，下载等
- 第三方插件进程
    - 每个类型的插件对应一个进程
- GPU进程
    - 只有一个 用户3D绘制
- 渲染进程
    - 即常说的浏览器内核
    - 每个Tab页面都有一个渲染进程，互不影响
    - 主要用于页面渲染，脚本执行，事件处理

### 浏览器多进程的优势

- 如果为单进程 某个Tab页面崩溃那么整个浏览器都会受到影响
- 插件崩溃也同理
- 多进程也有缺点  进程越多消耗的资源越多，会导致电脑变卡

## 渲染进程Render

页面的渲染、JS的执行、事件循环，都在渲染进程内执行

### GUI渲染线程

- 负责渲染页面，解析HTML、CSS构建DOM树和RenderObject树，布局和绘制
    - 解析HTML代码，生成DOM树
    - 解析CSS 生成 CSSOM（CSS规则树）
    - 把DOM树和CSSOM结合，生成Rendering Tree(渲染树)
- 修改颜色或背景色，会导致页面重绘（Repaint）
- 修改尺寸，会导致页面回流（Reflow）
- 页面需要重绘或者回流时，GUI线程执行，绘制页面
- 回流比重绘的成本高，要尽量避免回流和重绘
- GUI的渲染线程与JS引擎线程是互斥的
    - 当JS引擎执行的时候，GUI的线程会被挂起
    - GUI更新会被保存在一个队列中，等到JS引擎空闲时立即执行

### JS引擎线程

- 即JS内核 负责处理JS脚本（例如V8引擎）
- JS引擎线程负责解析JS脚本，执行代码
- JS引擎一直等待着任务队列中的任务到来，然后加以处理
    - 浏览器中只能同时有一个JS引擎线程在运行JS程序，JS是单线程运行的
    - 一个Tab页面中无论什么时候都是只有一个JS线程在执行JS程序
- GUI渲染线程与JS引擎线程是互斥的，JS引擎线程会阻塞GUI渲染线程
    - 常见为JS执行时间过长，造成页面渲染不连贯，导致页面渲染加载阻塞
    - 浏览器解析到script标签就会停止GUI渲染线程的执行，然后JS引擎工作执行JS代码，等JS执行完毕，JS引擎线程停止工作，GUI渲染线程继续执行。

### 事件触发线程

- 属于浏览器而不是JS引擎，用来控制事件循环，并且管理者一个事件队列（task queue）
- 当JS执行碰到事件绑定和一些异步操作（setTimeOut、鼠标点击，AJAX请求）会走事件触发线程将对应的事件添加到对应的线程中，等异步操作有了结果，便把他们的回调操作添加到事件队列，等待JS引擎线程空闲时处理。
- 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理。
- JS是单线程的，所以这些待处理队列中的事件都得排队等待JS引擎处理

### 定时触发线程

- setTimeout和setInterval所在的线程
- 浏览器定时计数器并不是由JS引擎计数的（因为JS引擎是单线程的 如果线程处于阻塞状态就会影响计时的准确）
- 通过单独线程来计时并触发定时（计时完毕后，添加到事件触发线程的事件队列中，等待JS引擎空闲后执行）这个线程就是定时触发器线程，也叫做定时器线程
- W3C在HTML标准中规定，要求setTimeout中低于4ms的时间间隔算为4ms

### 异步http请求线程

- 在XMLHttpRequest连接后是通过浏览器新开一个线程请求
- 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中再有JS引擎执行
- 当执行到一个http异步请求时，就把异步请求事件添加到异步请求线程，等收到响应，再把回调函数添加到事件队列，等待JS引擎线程来执行


## 事件循环 Event Loop
- js分为同步任务和异步任务
- 同步任务都在主线程（指JS引擎）上执行，会形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务的运行有了结果，就是任务队列之中放入事件的回调
- 一旦JS执行栈所有的同步任务执行完毕（即JS引擎空闲），系统变回读取任务队列，将可运行的异步任务添加到执行栈中开始执行。


## 宏任务macrotask & 微任务microtask
### 宏任务
宏任务macrotask又被称为task
我们可以将执行栈中依次执行的代码当做是一个宏任务，每一个宏任务回从头执行到尾执行完毕，不会执行其他
由于JS引擎线程和GUI渲染线程的互斥关系，浏览器为了宏任务和DOM任务的有序进行，会在一个宏任务执行结束后，在下一个宏任务执行前，GUI渲染线程开始工作，对页面进行渲染

宏任务（JS引擎线程） -> DOM渲染（GUI渲染线程）-> 宏任务

常见的宏任务有
- 主代码块
- setTimeout
- setInterval
- setImmediate(Node环境)
- requestAnimationFrame（浏览器环境）

### 微任务
ES6中引入了Promise标准，同时浏览器的实现上多了一个microtask的微任务的概念 microtask也被称作jobs
一个宏任务执行结束后，会执行渲染然后在执行下一个宏任务，微任务则可以理解为在当前宏任务执行结束后立即执行的任务
当一个宏任务执行完成，会在DOM渲染前，将执行期间产生的所有微任务执行完毕
宏任务（JS引擎线程）-> 微任务 -> DOM渲染（GUI渲染线程）-> 宏任务

常见的微任务有
- process.nextTick （Node环境）
- Promise.then
- catch
- finally
- Object.observe
- MutationObserver
