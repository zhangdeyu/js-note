# v8引擎
# 混合开发通信方式
- 挂载对象 jsbridge
- 拦截 拦截url 拦截Alert Prompt

## IOS
- native 调用 JS
    - 通过UIWebView组件的stringByEvaluatingJavaScriptFromString方法来实现，该方法返回js脚本的执行结果
- JS 调用 Native
    - JS调用Native并没有现成的Api 需要以下间接的方式去实现。 UIWebView有一个特性，在UIWebView内发起的所有网络请求，都可以通过delegate函数在NAtive层得到通知。这样，我们可以在UIWebView内发起一个自定义的网络请求，通过Native的原生逻辑去拦截 Schema的方式

## Android
- js 调用 Native
    - 通过Schema方式 shouldOverrideUrlLoading
    - 在Webview中直接注入原生的JS代码
    - Native重写 prompt、console.log、alert的方式
- Native 调用JS
    - loadUrl

# 白屏问题
## 可能的原因
- CSS文件需要加载
- 网络问题 html在下载过程中
- js阻塞渲染
- 首页无实际内容，需要等待异步请求结果渲染数据

## 解决方案
- 压缩JS等体积
- CSS代码前置和内联
- 本地存储+缓存
- SSR 直出
    - 优点
        - SEO
        - 加快内容展现
    - 不足
        - 需要服务端支持（涉及到构建、部署、负载、缓存策略等）
- 预渲染 在项目构建的过程中，通过一些渲染机制，比如puppeteer或者jsdom将页面在构建过程中渲染好
- 骨架屏

# 离线包
- 解决白屏问题
- 解决体验问题
- 有预加载

- 可以预先下载整个离线包，按照业务模块配置，离线包包含业务模块相关的所有页面，可以一次性预加载。
- 离线包核心文件和页面动态的图片资源文件缓存分离，可以更方便的管理缓存 离线包也可以整体提前加载进缓存，较少磁盘IO耗时
- 基于离线包可以做增强更新
- 离线包为压缩包的方式下发，同时会经过加密和校验，运营商和第三方无法对其劫持篡改

# 马踏棋盘 DFS 贪心算法  八皇后 回溯方法
# 缓存


浏览器兼容问题 熟悉Chrome
TCP/IP HTTP基本工作原理
web安全知识和防范技术