import { h, Fragment, Portal } from '../../dist/h/h.js'
import { render } from '../../dist/render/render.js'
// 事件回调函数
function handler() {
    alert('click me')
  }
  
  // VNode
  const elementVnode = h('div', {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    },
    class: [
      'class-a',
      {
        'class-b': true,
        'class-c': true
      }
    ],
    // 点击事件
    onclick: handler
  },
  '我是文本')
//   console.log(elementVnode)
  render(elementVnode, document.getElementById('app'))
  