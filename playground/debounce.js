function debounce(fn, wait) {
    var timer = null;
    var debounced = function() {
        clearTimeout(timer)
        var _ = this;
        timer = setTimeout(function() {
            fn.apply(_, [].slice.call(arguments))
            timer = null;
            clearTimeout(timer)
        }, wait);
    }

    debounced.cancel = function() {
        timer = null;
        clearTimeout(timer)
    }

    return debounced;
}

function throttle(fn, duration) {
    var previous = 0;
    function throttled() {
        var _ = this;
        var current = Date.now();
        if (current - previous >= duration) {
            fn.apply(_, [].slice.call(arguments))
            previous = current;
        }
    }

    throttled.cancel = function() {
        previous = 0;
    }
}