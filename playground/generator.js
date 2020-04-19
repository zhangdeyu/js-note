function* foo(x) {
  const y = 2 * (yield (x + 1));
  const z = yield (y/3);
  return (x + y + z);
}

const f = foo(5);
console.log(f.next())
console.log(f.next(3))
console.log(f.next(1))

// 如果给next方法传参数， 那么这个参数将会作为上一次yield语句的返回值