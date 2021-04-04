import { h, Fragment, Portal } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'

const elementVnode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    },
    class: [
      'class-a',
      {
        'class-b': true,
        'class-c': true
      }
    ]
  },
  h('div', {
    style: {
      height: '50px',
      width: '50px',
      background: 'green'
    },
    class: [
      'class-a',
      {
        'class-b': true,
        'class-c': true
      }
    ]
  })
)
console.log(elementVnode)
render(elementVnode, document.getElementById('app'))
