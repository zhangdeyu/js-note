function takeLongTime(n) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(n + 200)
    }, n);
  })
}

function step1(n) {
  console.log(`step 1 with ${n}`);
  return takeLongTime(n)
}

function step2(n) {
  console.log(`step 2 with ${n}`);
  return takeLongTime(n)
}

function step3(n) {
  console.log(`step 3 with ${n}`);
  return takeLongTime(n)
}

function c() {
  return Promise.resolve(3000)
}

async function doIt() {
  console.time('doIt');
  const time1 = 300;
  const timeb = await c();
  console.log(0, timeb)

  const time2 = await step1(time1);
  console.log(1, time2)

  const time3 = await step2(time2);
  console.log(2, time3);

  const result = await step2(time3);
  console.log(3, result);

  console.log(`the result is ${result}`)

  console.timeEnd('doIt');
}

doIt()