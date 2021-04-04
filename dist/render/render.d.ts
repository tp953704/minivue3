import { Vnode } from "type/type";
export interface container {
    vnode?: Vnode;
    el?: HTMLElement;
}
export declare function render(vnode: Vnode, container: (HTMLElement & container) | null): void;
export declare function mount(vnode: Vnode, container: any, isSVG?: boolean): void;
