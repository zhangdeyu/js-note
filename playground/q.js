async function async1() {
  console.log(1)
  await async2();
  console.log(2)
  return await 3;
}

async function async2() {
  console.log(4)
}

setTimeout(() => {
  console.log(5);
}, 0);

async1().then(v => console.log(v))

new Promise(function(resolve) {
  console.log(6)
  for (var i = 0; i < 1000; i++) {
    if (i == 10) {
      console.log(10)
    }
    i == 99 && resolve()
  }

  console.log(7)
}).then(() => {
  console.log(8)
})

console.log(9)