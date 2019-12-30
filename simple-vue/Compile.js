class Compile {
    constructor(el, vm) {
        this.$el = el;
        this.$vm = vm;

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el)
            this.init();
            this.$el.appendChild(this.$fragment)
        }
    }

    isElementNode(el) {
        return el && el.nodeType === 1;
    }

    isTextNode(el) {
        return el && el.nodeType === 3;
    }

    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child = null;
        while(child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    init() {
        this.compile(this.$fragment);
    }
    compile(el) {
        let childNodes = el.childNodes;
        Array.prototype.slice.call(childNodes).forEach(node => {
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/
            if (this.isElementNode(node)) {
                this.compileElement(node)
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1.trim())
            }

            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileElement(node) {
        const nodeAttrs = node.attributes;
        [].slice.call(nodeAttrs).forEach(attr => {
            const attrName = attr.name;

            if (this.isDirective(attrName)) {
                const exp = attr.value;
                const dir = attrName.substring(2)

                if (this.isEventDirective(dir)) {
                    // 事件
                    compileUtil.eventHandler(node, this.$vm, exp, dir)
                } else {
                    // 普通
                    compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
                }

                node.removeAttribute(attrName)
            }
        })
    }

    compileText(node, key) {
        compileUtil.text(node, this.$vm, key)
    }

    isDirective(attr) {
        return attr.indexOf('v-') === 0;
    }

    isEventDirective(attr) {
        return attr.indexOf('on') === 0;
    }
}

const Updater = {
    textUpdater(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    htmlUpdater(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },
    classUpdater(node, val, oldVal) {
        let className = node.className;
        className.replace(oldVal, '').replace(/\s$/, '');
        if (value) {
            className = `${className} ${val}`;
        }

        node.className = className;
    },
    modelUpdater(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
}

const compileUtil = {
    eventHandler(node, vm, exp, dir) {
        const eventType = dir.split(':')[1];
        const fn = vm.$options.methods && vm.$options.methods[exp]

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },
    bind(node, vm, exp, dir) {
        const fn = Updater[`${dir}Updater`]
        fn && fn(node, this._getVMVal(vm, exp))

        new Watcher(vm, exp, (val, oldVal) => {
            console.log(val, oldVal)
            fn && fn(node, val, oldVal)
        })
    },
    text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    html(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    class(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    model(node, vm, exp) {
        this.bind(node, vm, exp, 'model');
        
        const val = this._getVMVal(vm, exp)
        node.addEventListener('input', (e) => {
            const newVal = e.target.value;
            if (val === newVal) {
                return;
            }

            this._setVMVal(vm, exp, newVal);
        })
    },
    _getVMVal(vm, exp) {
        exp = exp.replace(/\[(\d+)\]/g, '$1').split('.');
        let val = vm;
        exp.forEach(k => {
            val = val[k];
        });

        return val;
    },
    _setVMVal(vm, exp, val) {
        exp = exp.replace(/\[(\d+)\]/g, '$1').split('.');
        let obj = vm;
        exp.forEach(function (key, index) {
            // 不是最后一个则更新val
            if (index < exp.length - 1) {
                obj = obj[key]
            } else {
                // 执行这里
                obj[key] = val
            }
        })
    }
}