var regexp = /^(\d)+$/i;

// test返回的是否捕获

console.log(regexp.test('123456'))
console.log(regexp.test('dd123456'))
console.log(regexp.test('1'))

// exec 用户返回捕获到的内容

console.log(regexp.exec('123456'))
console.log(regexp.exec('dd123456'))
console.log(regexp.exec('1'))

/* 
元字符
. 除换行符以外的所有字符
\w 匹配字母数字下划线 [0-9a-zA-Z_]
\s 任意空白符
\d 数字 [0-9]
\b 匹配单词边界
| 或匹配 x|y
^ 开始
$ 结束

反义字符
[^0-9] 除数字以外的所有字符
[^xyz] 除xyz以外的所有字符
\W 除字母数字下划线以外的所有字符
\D 除数字以外的所有字符
\S 除空格以外的所有字符
\B 除边界以外的所有字符


重复匹配
* 零次或多次
+ 一次或多次
? 零次或一次
{n} 出现n次
{n,} 至少出现n次
{n, m} 出现n到m次
*/


// \d == [0-9] 匹配0-9的任意一个数字  相反的为 \D == [^0-9] 除去0-9意外的所有字符
// \w == [0-9a-zA-Z_]

// 银行卡正则匹配加空格

// var bankNo = '6201222200003334567'
// var reg = /(\d{4})(?=\d)/g;
// console.log(reg.exec(bankNo))
// // console.log(reg.exec(bankNo))
// // console.log(reg.exec(bankNo))
// // console.log(reg.exec(bankNo))
// var f = bankNo.replace(/(\d{4})(?=\d)/g, "$1 ")
// console.log(f)

function formatBankNo(bankNo) {
  var reg = /(\d{4})(?=\d)/g
  return bankNo.replace(reg, '$1 ');
}
var bankNo = '6201222200003334567'
console.log(formatBankNo(bankNo));


// var s1 = "get-element-by-id"; 给定这样一个连字符串，写一个function转换为驼峰命名法形式的字符串 getElementById

function wordsToUpperCase(str) {
  return str.replace(/-\w/g, function(s) {
    return s.slice(1).toUpperCase();
  })
}

console.log(wordsToUpperCase('get-element-by-id'))

/* 
判断字符串是否包含数字
*/

function containsNumber(str) {
  return /\d/.test(str);
}

console.log(containsNumber('sgdgsgdjsghgD'))
console.log(containsNumber('sgdgsgd1jsghgD'))

// 判断电话号码
function isPhone(str) {
  return /^1[34578]\d{9}$/.test(str)
}

console.log(isPhone('13297974566'))

function formatMoney(str) {
  return str.replace(/(?=(\B\d{3})+$)/g, ',');
}

console.log(formatMoney('1000000000000'))