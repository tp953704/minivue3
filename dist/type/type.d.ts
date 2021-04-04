import { VNodeFlags } from "flags/nodeFlags";
import { ChildrenFlags } from "flags/childFlags";
export declare type Vnode = {
    _isVNode?: boolean;
    flags: VNodeFlags;
    tag: any;
    data: any;
    key?: string;
    children: Vnode[] | Vnode | null | string;
    childFlags: ChildrenFlags | null;
    el?: HTMLElement | SVGElement | null | Text;
    ref?: any;
};
