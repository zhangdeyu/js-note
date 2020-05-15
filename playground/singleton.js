
function Singleton(fn) {
  var instance = null;
  return function() {
    return instance || (instance = fn.apply(this, arguments));
  }
}