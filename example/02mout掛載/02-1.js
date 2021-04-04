import { h, Fragment, Portal } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'

const elementVnode = h('input', {
  class: 'cls-a',
  type: 'checkbox',
  checked: true,
  custom: '1'
})
console.log(elementVnode)
render(elementVnode, document.getElementById('app'))
