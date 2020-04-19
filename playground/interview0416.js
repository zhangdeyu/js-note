const debounce = (fn, duration) => {
  let timer = null;
  function debounced() {
    const args = Array.prototype.slice.call(arguments);

    clearTimeout(timer);
    timer = setTimeout(() => {
      const res = fn.apply(this, args)
      clearTimeout(timer);
      return res;
    }, duration);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
  }

  return debounced;
}


const throttle = (fn, duration) => {
  let previous = 0;
  function throttled() {
    const now = Date.now();

    if (now - previous >= duration) {
      previous = now;
      const args = Array.prototype.slice.call(arguments);
      return fn.apply(this, args);
    }
  }

  throttled.cancel = () => {
    previous = 0;
  }

  return throttled;
}

const fn = () => {
  console.log('scroll')
}

document.addEventListener('scroll', debounce(fn, 3000))

/* 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
示例 1:
输入: 121
输出: true
示例 2:
输入: -121
输出: false
解释: 从左向右读, 为 - 121 。 从右向左读, 为 121 - 。因此它不是一个回文数。
示例 3:
输入: 10
输出: false
解释: 从右向左读, 为 01 。因此它不是一个回文数。 */

function judge(str) {
  var i = 0;
  var j = str.length - 1;
  var flag = true;

  while (i <= j) {
    if (str[i] === str[j]) {
      i++;
      j--;
    } else {
      flag = false;
      break;
    }
  }

  return flag;
}