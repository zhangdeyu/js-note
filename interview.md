# KOA
# HTTP + HTTPS
- headers
    - response headers
    - request headers
# 安全
    - Hybird App安全问题
        - 白名单
            - 访问页面白名单
            - 请求domain白名单
# 兼容

# Hybird App
- JS bridge
    - ios wkwebview
    - android uiwebview
    - API 注入 native获取JS的上下文 并在上面挂在对象和方法 Native调用JS 直接执行拼接好的JS字符串
- 离线包
    - 增量更新 生成zip包  跟前一个版本比较zip的二进制文件  bsdiff
    - 全量更新
     from to
    - 原来的方案  比较每个文件的hash 不同则更新
    - 更新机制
        - 初始化的时候查询
        - 运行过程中轮训
        - push消息通知的方式更新
- 模拟页面栈
    - 改写打开连接方法 指定是否为新的webview打开
- 安全
    - 访问页面 请求地址白名单
- Native组件
    - 开发环境下前端实现一份相同的组件 在bridge handler做一层处理
    - 打包的过程中移除掉

