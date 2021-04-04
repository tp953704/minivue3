import { h,Fragment  } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'
 // 旧的 VNode
const prevVNode = h(Fragment, null, [
    h('p', null, '旧片段子节点 1'),
    h('p', null, '旧片段子节点 2')
  ])
  
  // 新的 VNode
  const nextVNode = h(Fragment, null, [
    h('p', null, '新片段子节点 1'),
    h('p', null, '新片段子节点 2')
  ])
  
  render(prevVNode, document.getElementById('app'))
  
  // 2秒后更新
  setTimeout(() => {
    render(nextVNode, document.getElementById('app'))
  }, 2000)
