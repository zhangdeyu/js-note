/* 手势库实现 

touchstart
touchmove
touchend
多手指

IOS下
gesturestart
gesturemove
gestureend

Android下需要做判断
e.touches.length >= 2

*/

/* 
Vue的声明周期
beforeCreate
created
beforeMount
mounted
beforeUpdate
updated
beforeDestory
destoryed


Vue中watch跟computed的区别
watch 当依赖的 data 的数据变化，执行回调，在方法中会传入 newVal 和 oldVal
watch 观察 Vue 实例上的一个表达式或者一个函数计算结果的变化。
watch 是对data的监听  具有实时性
watch的方式有两种

computed是计算属性  有缓存
会根据你所依赖的数据动态显示新的计算结果。计算结果会被缓存，
computed的值在getter执行后是会缓存的，只有在它依赖的属性值改变之后，
下一次获取computed的值时才会重新调用对应的getter来计算


vue-router hash模式  HTML5模式
hash模式监听window.onhashchange
HTML5 模式
history.pushState history.replaceState
搭配window.onpopstate
*/

/* axios使用
axios(method, url, data)
*/

// const axios = (method, url, data) => {
//   method = method.toUpperCase();

//   if (method === 'GET' && data) {
//     const params = [];
//     for(let k in data) {
//       params.push(`${k}=${data[key]}`)
//     }
//     url = url + '?' + params.join('&')
//     data = {};
//   }

//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.timeout = 10 * 1000;

//     xhr.open(method, url);

//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//           resolve(xhr.responseText)
//         } else {
//           reject(xhr.responseText)
//         }
//       }
//     }

//     xhr.ontimeout = function (e) {
//       reject(e)
//     }

//     xhr.send(data)
//   })
// }

// CSS 实现一个梯形

/* 
BFC
BFC（Block Formatting Context）格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器
形成BFC的条件
1、浮动元素，float 除 none 以外的值；
2、定位元素，position（absolute，fixed）；
3、display 为以下其中之一的值 inline-block，table-cell，table-caption；
4、overflow 除了 visible 以外的值（hidden，auto，scroll）；

处理问题的场景
1.浮动元素的父元素高度坍塌
2.双栏自适应布局
3.外边距垂直方向重合

*/

/* 
实现一个template 方法template(str, data)
'my name is {{name}}, age is {{age }}'{ name: 'tom', age: 16 }
my name is tom, age is 16

*/

// var str = 'my name is {{name}}, age is {{age }}';
// var data = { name: 'tom', age: 16 };


// function template(str, data) {
//   var reg = /\{\{(.[^\{][^\}]*)\}\}/g;
//   return str.replace(reg, function(match) {
//     var k = match.replace('{{', '').replace('}}', '').trim();
//     return data[k];
//   })
// }

// console.log(template(str, data));


/* 
HTTP1 HTTP2的区别

1.HTTP1浏览器限制了同一域名下的同时请求数量 Chrome限制6个连接
HTTP2的多路复用可以很好的解决这个问题  多路复用：通过一个TCP连接就可以传输所有的请求数据

HTTP1队头阻塞的原因 请求时顺序往下走的 但HTTP因为可以多路复用同一个TCP连接  请求都是同步的

帧（frame）和流（stream）
多路复用：一个TCP中存在多条数据流 可以发送多个请求 对端可以通过帧中的标识判断属于哪个请求。

2.HTTP2采用的是二进制传输 之前的版本采用的是文本传输，HTTP2引进了新的编码机制，采用二进制传输，传输的数据会被分割

3.头部压缩
HTTP1中使用文本的形式传输header
HTTP2中 使用HPACK压缩header 并且两端维护header索引

4.服务端PUSH
*/

/* 
实现求和sum，支持sum(1), sum(1,2,3,4), sum(1)(2)(3),  console.log(sum(1)(2,3)(4)) = 10
*/

// function sum(){
//   var s = 0;
//   for (var i = 0; i < arguments.length; i++) {
//     s += arguments[i];
//   }
//   function myAdd() {
//     for (var i = 0; i < arguments.length; i++) {
//       s += arguments[i];
//     }
//     return myAdd;
//   }

//   myAdd.toString = function() {
//     return s;
//   }

//   return myAdd;
// }


// chain = new Chain, chain.eat().sleep(5).eat().sleep(6).work()
/* function Chain() {
  return this;
}
Chain.prototype.eat = function() {
  console.log('eat')
  return this;
}
Chain.prototype.sleep = function(time) {
  console.log(`sleep ${time} hours`);
  return this;
}
Chain.prototype.work = function() {
  console.log('work');
  return this;
}
chain = new Chain, chain.eat().sleep(5).eat().sleep(6).work() */

/* 
XSS 跨站脚本攻击
页面被注入恶意代码

存储型
DOM型
反射型

转义
不加载白名单外的代码资源

CSRF 跨站请求伪造

构造出后端的某一请求接口地址，诱导用户去点击
GET请求不允许修改数据
Cookie设置samesite
Token校验
阻止第三方网站的请求接口
*/

/* 
html meta标签
<mate charset="">
<meta name="" content="">


*/

/* 
跨域

同源策略
域名、端口、协议有一个不同就会触发同源策略

jsonp，服务端设置access-control-allow-origin：跨域资源共享，反向代理，postMessage
*/

/* 
Vue watch的实现
遍历watch 编写Object.definePropery
*/

/* 
canvas和svg的区别
1.SVG是基于XML的矢量图形
  canvas是HTML5的画布 基于像素的位图
2.渲染模式
  cavas属于即时模式
  SVG属于保留模式

3.结构
  canvas没有图层的概念
  SVG是有图层的概念
*/

/* 
正则匹配邮箱
[0-9A-Za-z]+([_\.][0-9A-Za-z]+)*@([A-Za-z0-9]+\.)+[A-Za-z]{2,6}
*/

/* 
promise,setTimeout, requestAnimationFrame的区别
promise微任务
setTimeout requestAnimationFrame宏任务
*/

/* 
快速排序的实现

*/

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  var index = Math.floor(arr.length / 2);
  var prviot = arr.splice(index, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < prviot) {
      left.push(arr[i])
    } else {
      right.push(arr[i]);
    }
  }

  return [].concat(quickSort(left), [prviot], quickSort(right))
}
var arr = [85, 24, 63, 45, 17, 31, 96, 50]
console.log(quickSort(arr))