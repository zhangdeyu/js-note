/* 二进制加法 */
const addBinary = (a, b) => {
  // 字符串对齐
  while (a.length < b.length) {
    a = "0" + a;
  }

  while(b.length < a.length) {
    b = "0" + b;
  }

  const res = [];
  // 进位
  let addOne = 0;
  for (let j = a.length - 1; j >= 0; j --) {
    const currA = parseInt(a[j]);
    const currB = parseInt(b[j]);
    console.log(currA, currB)
    let sum = currA + currB + addOne;
    if (sum >= 2) {
      sum = sum - 2 ;
      addOne = 1;
    } else {
      addOne = 0;
    }
    res[j] = sum;
  }

  if (addOne !== 0) {
    res.unshift('1')
  }

  return res.join('');
}

const a = '101';
const b = '1111';

console.log(addBinary(a, b));