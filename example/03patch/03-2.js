import { h } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'
// // 旧的 VNode
// // 旧的 VNode
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))

// // 新的 VNode
// const nextVNode = h('div', null, [
//   h('p', null, '子节点 1'),
//   h('p', null, '子节点 2')
// ])
// 旧的 VNode
const prevVNode = h('p', null, '旧文本')

// 新的 VNode
const nextVNode = h('p', null, '新文本')

render(prevVNode, document.getElementById('app'))

// 2秒后更新
setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 2000)
