// (function(root, factory) {
//     if (typeof define === 'function' && define.amd) {
//         define([], factory)
//     } else if (typeof exports === 'object') {
//         module.exports = factory()
//     } else {
//         root.returnExports = factory()
//     }
// })(this, function() {
//     return {}
// })
// 
// UMD vue写法
(function(global, factory){
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        global = global || self;
        global.Vue  = factory()
    }
})(this, function() {
    'use strict';
})
