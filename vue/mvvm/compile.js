function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }
}

Compile.prototype.isElementNode = function(el) {
    return el && el.nodeType === 1
}

Compile.prototype.isTextNode = function (el) {
    return el && el.nodeType === 3
}

Compile.prototype.node2Fragment = function (el) {
    var fragment = document.createDocumentFragment(),
        child;
    while (child = el.firstChild) {
        fragment.appendChild(child)
    }

    return fragment;
}

Compile.prototype.init = function() {
    this.compileElement(this.$fragment);
}

Compile.prototype.compileElement = function(el) {

    var childNodes = el.childNodes,
        _ = this;
    [].slice.call(childNodes).forEach(function(node) {
        var text = node.textContent;
        var reg = /\{\{(.*)\}\}/; //是否为 {{}}类型的解析
        if (_.isElementNode(node)) {
            // 解析DOM
            _.compile(node)
        } else if (_.isTextNode(node) && reg.test(text)) {
            // 解析文本
            _.compileText(node, RegExp.$1.trim())
        }

        if (node.childNodes && node.childNodes.length) {
            _.compileElement(node)
        }
    })
}

Compile.prototype.compile = function(node) {
    var nodeAttrs = node.attributes,
        _ = this;
    [].slice.call(nodeAttrs).forEach(function(attr) {
        var attrName = attr.name
        if (_.isDirective(attrName)) {
            var exp = attr.value;
            var dir = attrName.substring('2')
            console.log(exp, '-', dir)
            // 事件指令
            if (_.isEventDirective(dir)) {
                compileUtil.eventHandler(node, _.$vm, exp, dir)
            } else {
                // 普通指令
                compileUtil[dir] && compileUtil[dir](node, _.$vm, exp)
            }

            node.removeAttribute(attrName)
        }
        
    })
}

Compile.prototype.compileText = function(node, exp) {
    compileUtil.text(node, this.$vm, exp)
}

Compile.prototype.isDirective = function(attr) {
    return attr.indexOf('v-') === 0;
}

Compile.prototype.isEventDirective = function(dir) {
    return dir.indexOf('on') === 0;
}

var compileUtil = {
    eventHandler: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },
    _getVMVal: function(vm, exp) {
        // 获取data  这个地方参考lodash get方法 exp有可能是路径 a.b.c 或者 a[0].c
        // var val = vm;
        // exp = exp.split('.')
        // exp.forEach(function(k) {
        //     val = val[k]
        // })

        // return val
        exp = exp.replace(/\[(\d+)\]/g, '.$1').split('.')
        var val = vm;
        exp.forEach(function(key) {
            val = Object(val)[key];
        })

        return val;
    },
    _setVMVal: function(vm, exp, value) {
        exp = exp.replace(/\[(\d+)\]/g, '.$1').split('.')
        var val = vm;
        exp.forEach(function (key, index) {
            // 不是最后一个则更新val
            if (index < exp.length - 1) {
                val = val[key]
            } else {
                val[key] = value
            }
        })
    },
    bind: function(node, vm, exp, dir) {
        var updateFn = updater[dir + 'Updater']
        updateFn && updateFn(node, this._getVMVal(vm, exp))
        // Watcher
        new Watcher(vm, exp, function(value, oldVal) {
            console.log('bind Watcher', value, oldVal)
            updateFn && updateFn(node, value, oldVal)
        })
    },
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model')

        var _ = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            _._setVMVal(vm, exp, newValue)
            // val = newValue
        })
    },
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    }
}

var updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value
    },
    classUpdater: function(node, value, oldValue) {
        var className = node.className
        className = className.replace(oldValue, '').replace(/\s$/, '')
        var space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
}