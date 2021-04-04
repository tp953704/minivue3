import { Vnode } from "type/type";
export declare const Fragment: unique symbol;
export declare const Portal: unique symbol;
export declare function h(tag: any, data?: any, children?: Vnode | string | Vnode[] | null): Vnode;
export declare function createdTextVNode(text: string): Vnode;
