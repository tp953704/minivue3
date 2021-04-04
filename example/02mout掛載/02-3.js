import { h } from './h'
import render from './render'

const elementVNode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    }
  },
  '我是文本'
)

render(elementVNode, document.getElementById('app'))
