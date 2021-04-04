import { h } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'

// 组件类
class MyComponent {
  localState = 'one'

  mounted() {
    setTimeout(() => {
      this.localState = 'two'
      this._update()
    }, 2000)
  }

  render() {
    return h('div', null, this.localState)
  }
}
// 有状态组件 VNode
const compVNode = h(MyComponent)

render(compVNode, document.getElementById('app'))
