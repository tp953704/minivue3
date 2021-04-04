export const enum VNodeFlags {
    // html 
    ELEMENT_HTML=1,
    // SVG 
    ELEMENT_SVG=1<<1,
    COMPONENT_STATEFUL_NORMAL=1<<2,
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE=1<<3,
    COMPONENT_STATEFUL_KEPT_ALIVE=1<<4,
    // 函数式
    COMPONENT_FUNCTIONAL= 1 << 5,
    TEXT= 1 << 6,
    // Fragment
    FRAGMENT= 1 << 7,
    // Portal
    PORTAL= 1 << 8,
    ELEMENT =VNodeFlags.ELEMENT_HTML |VNodeFlags.ELEMENT_SVG,
    COMPONENT_STATEFUL = VNodeFlags.COMPONENT_STATEFUL_NORMAL
                        | VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE
                        | VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE,
    COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL
}


/*// html 元素节点
const htmlVnode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null
}

// svg 元素节点
const svgVnode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: 'svg',
  data: null
}

// 函数式组件
const functionalComponentVnode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent
}

// 普通的有状态组件
const normalComponentVnode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent
}

// Fragment
const fragmentVnode = {
  flags: VNodeFlags.FRAGMENT,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识
  tag: null
}

// Portal
const portalVnode = {
  flags: VNodeFlags.PORTAL,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target
  tag: target
} */