class VNode {
  constructor(tag, data, children, text, el) {
    // 当前节点标签名
    this.tag = tag;
    // 当前节点的一些数据 props attrs等
    this.data = data;
    // 当前节点的子节点是一个数组
    this.children = children;
    // 当前节点的文本
    this.text = text;
    // 当前节点的虚拟节点对应的真实DOM节点
    this.el = el;
  }
}

function createEmptyVNode() {
  const node = new VNode();
  node.text = '';
  return node;
}

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}