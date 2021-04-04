// import { createdTextVNode } from "h/h";
import { patch } from "./patch.js";
export function render(vnode, container) {
    if (!container) {
        return;
    }
    const prevNode = container?.vnode;
    if (!prevNode) {
        if (vnode) {
            // 沒有舊節點有心結點
            mount(vnode, container);
            container.vnode = vnode;
        }
    }
    else {
        if (vnode) {
            // 有舊的Vnode，也有新的VNode。調用`patch`函數打補釘
            patch(prevNode, vnode, container);
            container.vnode = vnode;
        }
        else {
            container.removeChild(prevNode.el);
            container.vnode = vnode;
        }
    }
}
export function mount(vnode, container, isSVG) {
    // 普通標千
    // 組件
    // 純文本
    // Fragment
    // portal
    const Flag = vnode.flags;
    if (Flag & 3 /* ELEMENT */) {
        mountElement(vnode, container, isSVG);
    }
    else if (Flag & 60 /* COMPONENT */) {
        mountComponent(vnode, container, isSVG);
    }
    else if (Flag & 64 /* TEXT */) {
        // 掛純文本
        mountText(vnode, container);
    }
    else if (Flag & 128 /* FRAGMENT */) {
        mountFragment(vnode, container, isSVG);
    }
    else if (Flag & 256 /* PORTAL */) {
        console.log(container);
        mountPortal(vnode, container, isSVG);
    }
}
const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/;
function mountElement(vnode, container, isSVG) {
    isSVG = isSVG || !!(vnode.flags & 2 /* ELEMENT_SVG */);
    const el = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag) : document.createElement(vnode.tag);
    vnode.el = el;
    // 將內連屬性掛載
    const data = vnode.data;
    if (data) {
        for (let key in data) {
            // key可能是class,style,on
            switch (key) {
                case 'style':
                    // 如果key的值是style 說明是內連樣式，將規則應用到el
                    let style = data.style;
                    for (let k in style) {
                        el.style[k] = data.style[k];
                    }
                    break;
                case 'class':
                    if (isSVG) {
                        el.setAttribute('class', data[key]);
                    }
                    else {
                        const classArray = data[key].split(' ');
                        classArray.forEach((item) => {
                            if (item) {
                                item && el.classList.add(item);
                            }
                        });
                    }
                    break;
                default:
                    if (key[0] === 'o' && key[1] === 'n') {
                        // 事件
                        el.addEventListener(key.slice(2), data[key]);
                    }
                    else if (domPropsRE.test(key)) {
                        // 当作 DOM Prop 处理 
                        el[key] = data[key];
                    }
                    else {
                        // 当作 Attr 处理
                        el.setAttribute(key, data[key]);
                    }
                    break;
            }
        }
    }
    // 遞規卦載
    // vnode.children 有時是Array 有時是單個節點
    // vnode.flag任意型態
    const childFlags = vnode.childFlags;
    let children = vnode.children;
    if ((childFlags !== 1 /* NO_CHILDREN */) && childFlags && children) {
        if (childFlags & 2 /* SINGLE_VNODE */) {
            // 單個子傑點Mount
            mount(children, el, isSVG);
        }
        else if (childFlags & 12 /* MULTIPLE_VNODES */) {
            let childrenArray = children;
            for (let i = 0; i < childrenArray.length; i++) {
                mount(childrenArray[i], el, isSVG);
            }
        }
    }
    container.appendChild(el);
}
function mountComponent(vnode, container, isSVG) {
    if (vnode.flags & 28 /* COMPONENT_STATEFUL */) {
        mountStatefulComponent(vnode, container, isSVG);
    }
    else {
        mountFunctionalComponent(vnode, container, isSVG);
    }
}
function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children);
    vnode.el = el;
    container.appendChild(el);
}
function mountFragment(vnode, container, isSVG) {
    const { children, childFlags } = vnode;
    switch (childFlags) {
        case 2 /* SINGLE_VNODE */:
            // 如果是单个子节点，则直接调用 mount
            mount(children, container, isSVG);
            vnode.el = children.el;
            break;
        case 1 /* NO_CHILDREN */:
            // 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
            const placeholder = createdTextVNode('');
            mountText(placeholder, container);
            vnode.el = placeholder.el;
            break;
        default:
            // 多个子节点，遍历挂载之
            children.forEach((item) => {
                mount(item, container, isSVG);
                vnode.el = item.el;
            });
    }
}
function mountPortal(vnode, container, isSVG) {
    const { tag, children, childFlags } = vnode;
    const target = typeof tag === 'string' ? document.querySelector(tag) : tag;
    if (childFlags && childFlags & 2 /* SINGLE_VNODE */) {
        mount(children, target);
    }
    else if (childFlags && childFlags & 12 /* MULTIPLE_VNODES */) {
        children.forEach((item) => {
            console.log(item, container);
            mount(item, target);
        });
    }
    // 需要事件捕獲機制等，所以需要DOM
    const placeholder = createdTextVNode('');
    mountText(placeholder, container);
    vnode.el = placeholder.el;
}
function mountStatefulComponent(vnode, container, isSVG) {
    // 创建组件实例
    const instance = (vnode.children = new vnode.tag());
    // 初始化Props
    instance.$props = vnode.data;
    instance._update = function () {
        if (instance._mounted) {
            const prevVNode = instance.$vnode;
            const nextVNode = (instance.$vnode = instance.render());
            patch(prevVNode, nextVNode, prevVNode.el.parentNode);
            instance.$el = vnode.el = instance.$vnode.el;
        }
        else {
            instance.$vnode = instance.render();
            mount(instance.$vnode, container, isSVG);
            instance._mounted = true;
            instance.$el = vnode.el = instance.$vnode.el;
            instance.mounted && instance.mounted();
        }
    };
    instance._update();
}
function mountFunctionalComponent(vnode, container, isSVG) {
    // 函數式組件類型的VNODE上添加handle屬性 ，他是一個對象
    vnode.handle = {
        prev: null,
        next: vnode,
        container,
        update: () => {
            if (vnode.handle.prev) {
                // 舊的vnode
                const oldNode = vnode.handle.prev;
                // 新的vnode
                const newVnode = vnode.handle.next;
                const oldTree = oldNode.children;
                // 更新 props 數據
                const props = newVnode.data;
                // nextTree 是組件產出的新VNode
                const newInstance = (newVnode.children = newVnode.tag(props));
                // patch函數更新
                patch(oldTree, newVnode, vnode.handle.container);
            }
            else {
                // 初始化Props
                const props = vnode.data;
                // 獲取VNode
                const $vnode = (vnode.children = vnode.tag(props));
                // 掛載
                mount($vnode, container, isSVG);
                // el元素引用該組件跟元素
                vnode.el = $vnode.el;
            }
        }
    };
    // 調用
    vnode.handle.update();
}
function createdTextVNode(text) {
    return {
        _isVNode: true,
        flags: 64 /* TEXT */,
        tag: null,
        data: null,
        children: text,
        childFlags: 1 /* NO_CHILDREN */,
        el: null
    };
}
//# sourceMappingURL=render.js.map