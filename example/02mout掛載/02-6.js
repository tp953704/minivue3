import { h, Fragment,Portal } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'

class MyComponent {
  render() {
    return h(
      'div',
      {
        style: {
          background: 'green'
        }
      },
      [
        h('span', null, '我是组件的标题1......'),
        h('span', null, '我是组件的标题2......')
      ]
    )
  }
}

const compVnode = h(MyComponent)
render(compVnode, document.getElementById('app'))
