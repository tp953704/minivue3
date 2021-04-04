import { VNodeFlags } from "flags/nodeFlags";
import { ChildrenFlags } from "flags/childFlags";
import { Vnode } from "type/type";
//唯一標示
export const Fragment = Symbol(); 
// Prtal類型也應該是唯一
export const Portal = Symbol();
export function h(tag:any,data:any = null,children:Vnode|string|Vnode[]|null = null):Vnode{
    // 利用傳入的tag取得Flags
    let flags = null
    if(typeof tag === 'string') {
        flags = tag === 'svg'?VNodeFlags.ELEMENT_SVG:VNodeFlags.ELEMENT_HTML
    }else if(tag === Fragment){
        flags = VNodeFlags.FRAGMENT;
    }else if(tag === Portal){
        flags = VNodeFlags.PORTAL;
        tag = data && data?.target;
    }else{
        // 兼容Vue2對象是組件
        if(tag!==null && typeof tag === 'object'){
            flags = tag.functional
            ?VNodeFlags.COMPONENT_FUNCTIONAL      //函數是組件
            :VNodeFlags.COMPONENT_STATEFUL_NORMAL //有狀態組件
        }else if(typeof tag === 'function'){
            //VUe3的類組建
            flags = tag.prototype && tag.prototype.render
                ?VNodeFlags.COMPONENT_STATEFUL_NORMAL //有狀態組件
                :VNodeFlags.COMPONENT_FUNCTIONAL      //函數是組件
        }
    }
    let childFlags:ChildrenFlags|null = null;
    if(Array.isArray(children)){
        const length = children.length;
        if(length === 0 ){
            childFlags = ChildrenFlags.NO_CHILDREN
        }else if(length ===1){
            childFlags = ChildrenFlags.SINGLE_VNODE;
            children = children[0] as Vnode;
        }else{
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    }else if(children ==null){
        childFlags = ChildrenFlags.NO_CHILDREN;
    }else if((children as Vnode)._isVNode){
        childFlags = ChildrenFlags.SINGLE_VNODE;
    }else{
        // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
        childFlags = ChildrenFlags.SINGLE_VNODE
        if(typeof children === 'string'){
            children = createdTextVNode(children)
        }
    }

    // 處理data.class裡的訊息
    if(data){
        data.class = classTranfrom(data?.class)
    }

    return  {
        _isVNode: true,
        flags:flags as VNodeFlags,
        tag,
        data,
        key:data&&data.key?data.key:null,
        children:children as Vnode|Vnode[]|null,
        childFlags,
        el: null
    }
}


function normalizeVNodes(children:Vnode[]):Vnode[]{
    const newChildren = children.map((item,index)=>{
        const child = item;
        if(!child.key){
            child.key = '|'+index;
        }
        return child;
    })
    return newChildren;
}

export function createdTextVNode(text:string):Vnode {
    return {
        _isVNode: true,
        flags:VNodeFlags.TEXT,
        tag: null,
        data:null,
        children: text,
        childFlags: ChildrenFlags.NO_CHILDREN,
        el: null
    }
}
type classPropType = {
    [key:string]:any;
}
function classTranfrom(classProp:classPropType):string {
    // 如果classProp 是Array
    if(Array.isArray(classProp)){
        
        let result = classProp.reduce(function(total:string, item:any){
            if(typeof item === 'string'){
                
                return total+`${item}`;
            }else{
                return `${total}${classTranfrom(item)}`
            }
        });
        return result;
    }
   
     // 如果是class {'class':true}
    if(typeof classProp === 'object' && classProp){
        let result =""
        for(let key in classProp){
            if(typeof classProp[key] === 'boolean' || classProp[key] instanceof Boolean){
                if(classProp[key]){
                    result = result +` ${key}`
                }
            }else{
                result = result+classTranfrom(classProp[key])
            }
        }
        return result
    }
     if(typeof classProp === 'string'){
        return classProp;
    }else{
        return ""
    }
}