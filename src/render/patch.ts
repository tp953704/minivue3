
import { ChildrenFlags } from "flags/childFlags.js";
import { VNodeFlags } from "flags/nodeFlags";
import { Vnode } from "type/type";
import { container,mount } from "./render.js"
const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/

export function patch(prevVnode:Vnode, nextVnode:Vnode, container:HTMLElement&container){
    const nextFlags = nextVnode.flags
    const prevFlags = prevVnode.flags
  
    // 檢查新舊節點類型是否相同，相同 => 根據類型調用比對
    // 不同的畫，replaceVNode函數替換
    if(nextFlags!==prevFlags){
        replaceVNode(prevVnode,nextVnode,container)
    }else if(nextFlags & VNodeFlags.ELEMENT){
        patchElement(prevVnode,nextVnode,container)
    }else if(nextFlags & VNodeFlags.COMPONENT){
        patchComponent(prevVnode,nextVnode,container)
    }else if(nextFlags & VNodeFlags.TEXT){
        patchText(prevVnode,nextVnode)
    }else if(nextFlags & VNodeFlags.FRAGMENT){
        patchFragment(prevVnode,nextVnode,container)
    }else if(nextFlags & VNodeFlags.PORTAL){
        patchPortal(prevVnode, nextVnode)
    }
  }

function replaceVNode(prevVnode:Vnode, nextVnode:Vnode, container:HTMLElement&container){
    // 移除舊的掛新的
    container.removeChild(prevVnode.el as HTMLElement|SVGElement)
    // 如果VNode類型是組件，則需要調用該組健實例的 unmounted 鉤子函數
    if(prevVnode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL){
        // 類型唯有狀態組件Vnode children屬性被用來存組件實例對象
        const instance = prevVnode.children as any
        (instance as any).unmounted && instance.unmounted()

    }
    
    // 在新的VNode掛到容器中
    mount(nextVnode, container)
}
function patchElement(prevVnode:Vnode, nextVnode:Vnode, container:HTMLElement&container){
    // 如果新舊描述的標籤不同 ，直接replace
    if(prevVnode.tag !== nextVnode.tag){
        replaceVNode(prevVnode,nextVnode,container)
        return
    }

    // 拿到el元素 ， 這時要讓 nextVnode.el也引用
    const el = (nextVnode.el = prevVnode.el)
    console.log(nextVnode , prevVnode,nextVnode.el = prevVnode.el)
    // 拿到 新舊VNodedata
    const prevData = prevVnode.data
    const nextData = nextVnode.data

    // 新的VNodeData存在時才有必要跟新，爭對Attr
    if(nextData && el){
        for(let key in nextData){
            const prevValue = prevVnode[key as keyof Vnode]
            const nextValue = nextData[key as keyof Vnode]
            patchData(el,key,prevValue,nextValue)
        }
    }
    if(prevData && el){
        for(let key in prevData){
            const prevValue = prevVnode[key as keyof Vnode]
            if(prevVnode && !nextData.hasOwnProperty(key)){
                patchData(el,key,prevValue,null)
            }
        }
    }

    // 跟新子傑點
    patchChildren(
        prevVnode.childFlags,
        nextVnode.childFlags,
        prevVnode.children,
        nextVnode.children,
        el
    )
}
function patchComponent(prevVnode:Vnode, nextVnode:Vnode, container:HTMLElement&container){
    // 有可能因為父祖健狀態改變，資組件便不同
    if(nextVnode.tag !== prevVnode.tag){
        replaceVNode(prevVnode,nextVnode,container)
    }else if( nextVnode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL){
        // 獲取組件實例
        const instance = (nextVnode.children = prevVnode.children) as any
        // 更新Props
        (instance as any).$props = nextVnode.data
        // 更新組件
        instance._update()
    }else{
        // 函數式的邏輯
        const handle = ((nextVnode as any).handle = (prevVnode as any).handle)
        handle.prev = prevVnode
        handle.next = nextVnode
        handle.container = container
        handle.update()
    }
}
function patchText(prevVnode:Vnode, nextVnode:Vnode){
    const el = (nextVnode.el = prevVnode.el)
    if(nextVnode.children !== prevVnode.children){
        (el as any).nodeValue = (nextVnode as Vnode).children

    }
}
function patchFragment(prevVnode:Vnode, nextVnode:Vnode, container:HTMLElement&container){
    // 跟新子傑點
    patchChildren(
        prevVnode.childFlags,
        nextVnode.childFlags,
        prevVnode.children,
        nextVnode.children,
        container
    )
    switch (nextVnode.childFlags){
        case ChildrenFlags.SINGLE_VNODE:
            nextVnode.el = ((nextVnode as Vnode)?.children as Vnode)?.el
            break
        case ChildrenFlags.NO_CHILDREN:
            nextVnode.el = (prevVnode as Vnode).el
            break
        default:
            nextVnode.el = (nextVnode as any)?.children[0].el
    }
}
function patchPortal(prevVnode:Vnode, nextVnode:Vnode){
    patchChildren(
        prevVnode.childFlags,
        nextVnode.childFlags,
        prevVnode.children,
        nextVnode.children,
        prevVnode.tag // 注意 container 是舊的 container
      )
    // 讓 nextVNode.el => prevVNode.el
    nextVnode.el = prevVnode.el;
    // 如果新舊容器不同，需要搬運
    if(nextVnode.tag !== prevVnode.tag){
        // 獲取新的容器元素，及掛載目標
        const container = typeof nextVnode.tag === 'string' 
            ? document.querySelector(nextVnode.tag) : nextVnode.tag
        
        switch (nextVnode.childFlags){
            case ChildrenFlags.SINGLE_VNODE:
                    // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
                    container.appendChild((nextVnode as any).children.el)
                break
            case ChildrenFlags.NO_CHILDREN:
                // 新的 Portal 没有子节点，不需要搬运
                break
            default:
                    // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
                    for (let i = 0; i < (nextVnode as any).children.length; i++) {
                        container.appendChild((nextVnode as any).children[i].el)
                    }
                break
        }
    }
}

type keyval = {
    [key: string]: any
  }

function patchData(el:HTMLElement|SVGElement|Text ,key:string,prevValue:Vnode,nextValue:null|Vnode){
    switch(key){
        case 'style':
            // 新樣式元素
            for(let k in nextValue){
                (el as keyval).style[k] = (nextValue as keyval)[k]
            }
            // 移除不存在
            for(let k in prevValue){
                if(!(nextValue as Vnode).hasOwnProperty(key)){
                    (el as keyval).style[k] = ''
                }
            }
            break
        case 'class':
            (el as keyval).className = nextValue;
            break
        default:
            if(key[0]==='0' && key[1]==='n'){
                // 事件
                el.addEventListener(key.slice(2),nextValue as any)
                if(prevValue){
                    el.removeEventListener(key.slice(2),prevValue as any)
                }
                if(nextValue){
                    el.addEventListener(key.slice(2),nextValue as any)
                }
            }else if(domPropsRE.test(key)){
                // 當DOM Prop處理
                (el as any)[key] = nextValue
            }else{
                (el as HTMLElement).setAttribute(key,nextValue as any)
            }
            break
    }
}


function patchChildren(
    prevChildFlags :ChildrenFlags|null,
    nextChildFlags :ChildrenFlags|null,
    prevVnode : Vnode|Vnode[]|string|null,
    nextVnode:Vnode|Vnode[]|string|null,
    container:any
){
    
    switch (prevChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                patch(prevVnode as Vnode,nextVnode as Vnode,container)
              break
            case ChildrenFlags.NO_CHILDREN:
                console.log(container)
                container.removeChild((prevVnode as Vnode).el)
              break
            default:
                console.log(container,prevVnode);
                container.removeChild((prevVnode as Vnode).el)
                // (nextVnode as Vnode[]).forEach((item : Vnode)=>{
                //     mount(item,container)
                // })
                for (let i = 0; i < (nextVnode as Vnode[]).length; i++) {
                    mount((nextVnode as Vnode[])[i], container)
                  }
              break
          }
          break
        case ChildrenFlags.NO_CHILDREN:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                mount(nextVnode as Vnode,container)
              break
            case ChildrenFlags.NO_CHILDREN:
              break
            default:
                for(let i=0;i<(nextVnode as Vnode[]).length;i++){
                    mount((nextVnode as Vnode[])[i],container)
                }
              break
          }
          break
        default:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                for(let i=0;i<(prevVnode as Vnode[]).length;i++){
                    container.removeChild((prevVnode as Vnode).el)
                }
                mount(nextVnode as Vnode,container)
              break
            case ChildrenFlags.NO_CHILDREN:
                for(let i=0;i<(prevVnode as Vnode[]).length;i++){
                    container.removeChild((prevVnode as Vnode).el)
                }
              break
            default:
                // for(let i=0;i<(prevVnode as Vnode[]).length;i++){
                //     container.removeChild((prevVnode as Vnode[])[i].el)
                // }
                // for(let i=0;i<(nextVnode as Vnode[]).length;i++){
                //     mount((nextVnode as Vnode[])[i],container)
                // }
                normalDiff(prevVnode as Vnode[],nextVnode as Vnode[],container)
              break
          }
          break
      }
  
}


function normalDiff(prevVnode:Vnode[],nextVnode:Vnode[],container:any){
    for(let i=0;i<(prevVnode as Vnode[]).length;i++){
        container.removeChild((prevVnode as Vnode[])[i].el)
    }
    for(let i=0;i<(nextVnode as Vnode[]).length;i++){
        mount((nextVnode as Vnode[])[i],container)
    }
}