import { h, Fragment } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'


const elementVNode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    }
  },
  h(Fragment, null, [
    h('span', null, '我是标题1......'),
    h('span', null, '我是标题2......')
  ])
)
console.log(elementVNode)
render(elementVNode, document.getElementById('app'))
