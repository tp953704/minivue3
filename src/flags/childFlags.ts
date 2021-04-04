export const enum ChildrenFlags {
    // 未知children 
    UNKNOWN_CHILDREN= 0,
    // 沒有 children
    NO_CHILDREN=1,
    // children 是單個VNODE
    SINGLE_VNODE=1<<1,

    // children 是多個擁有的KEY 的 VNODE
    KEYED_VNODES=1<<2,
    // children 是個沒有Key的VNODE
    NONE_KEYED_VNODES=1<<3,
    MULTIPLE_VNODES = ChildrenFlags.KEYED_VNODES|ChildrenFlags.NONE_KEYED_VNODES,

}

/*// 没有子节点的 div 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null,
  children: null,
  childFlags: ChildrenFlags.NO_CHILDREN
}

// 文本节点的 childFlags 始终都是 NO_CHILDREN
const textVNode = {
  tag: null,
  data: null,
  children: '我是文本',
  childFlags: ChildrenFlags.NO_CHILDREN
}

// 拥有多个使用了key的 li 标签作为子节点的 ul 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'ul',
  data: null,
  childFlags: ChildrenFlags.KEYED_VNODES,
  children: [
    {
      tag: 'li',
      data: null,
      key: 0
    },
    {
      tag: 'li',
      data: null,
      key: 1
    }
  ]
}

// 只有一个子节点的 Fragment
const elementVNode = {
  flags: VNodeFlags.FRAGMENT,
  tag: null,
  data: null,
  childFlags: ChildrenFlags.SINGLE_VNODE,
  children: {
    tag: 'p',
    data: null
  }
} */

