# Object.defineProperty

```Object.defineProperty()``` 可以给某一特定的对象添加或修改属性
常规添加修改属性的方式可以直接通过赋值操作来做，例如 ```obj.a = 1 ```。通过赋值操作增加的对象属性是可以通过```for ··· in ···```以及```Object.keys()```枚举出来的，并且可以被删除```delete obj.a```，同时可以继续使用赋值语句或者```Object.defineProperty()```进行修改。但通过```Object.defineProperty()```定义或者修改的属性，默认情况下不能被枚举、不能被删除且不能修改。如下图所示：

| 方式 | 可枚举 | 可修改 | 可删除 |
| ---- | ---- | ---- | ---- |
| 赋值语句 | Yes | Yes | Yes |
| ```Object.defineProperty()``` | No | No | No |

## 参数
- object 需要定义（修改）属性的对象
- prop 需要定义（修改）的属性名
- descriptor 属性的描述符
    - configurable
    - enumerable
    - value / writable 数据描述符
    - get / set 存取描述符

## 返回值
- 被定义（修改）属性后的object

## 属性描述符
查阅MDN文档，属性描述符有两种形式**数据描述符**和**存取描述符**
- 数据描述符是一个具有值的属性，这个值有可能可写也有可能不可写。
- 存取描述符是一个具有getter和setter函数的属性。
对于一个属性描述符只能是数据描述符或者存取描述符，两者不能同时存在。

### 键值
- configurable 默认为false。只有当为true的时候，属性描述符对应的属性才能被改变和删除。
- enumerable 默认为false。只有当为true时，属性才能被枚举。
- value 数据描述符对应的键，为属性对应的值，默认为undefined。
- writable 数据描述符对应的键，默认为false。只有当为true时，属性描述符对应的属性的值才能被运算符进行修改。
- get 为属性提供的getter方法 存取描述符对应的键，默认为undefined。当访问属性的值时触发该方法。
- set 为属性提供的setter方法 存取描述符对应的键，默认为undefined。当修改修改属性的值时触发。

| - | configurable | enumerable | value | writable | set | get|
| ---- | ---- | ---- | ---- | --- | --- | --- |
| 数据描述符 | √ | √ | √ | √ | - | - |
| 存取描述符 | √ | √ | - | - | √ | √ |