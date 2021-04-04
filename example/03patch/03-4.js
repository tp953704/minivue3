import { h } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'

// 子组件类
class ChildComponent {
  render() {
    return h('p', null, this.$props.text)
  }
}
// 父组件类
class ParentComponent {
  localState = 'one'

  render() {
    return h(ChildComponent, {
      text: this.localState
    })
  }
}
// 有状态组件 VNode
const compVNode = h(ParentComponent)

render(compVNode, document.getElementById('app'))
