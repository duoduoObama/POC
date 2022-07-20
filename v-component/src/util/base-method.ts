import { IMessage } from "../types/runtime/IMessage";
import { IMessageMeta, IDOMEventMeta, IEventHandlersEventName } from "../types/runtime/IModelSchema";
import * as $ from "jquery";



/**
 * 组件自定义事件装配
 */
export const componentAssemblyCustomEvents = (
  imessage: IMessage,
  events: IMessageMeta[]
) => { };

/**
 * DOM事件装配
 */
export const domAssemblyCustomEvents = (
  DOM: HTMLElement,
  events: IDOMEventMeta
) => {
  if (!DOM || !events) return;

  Object.keys(events).forEach((eventName) => {
    // 只取数组对象中第一个的值
    const fnArrs = events[eventName as IEventHandlersEventName];
    if (fnArrs && fnArrs.length > 0) {
      fnArrs.map((fn) => {
        $(DOM).off(eventName as any);
        return fn;
      }).forEach((fn) => {
        $(DOM).on(eventName as any, function (e: any) {
          const event = Object.defineProperties({}, Object.getOwnPropertyDescriptors(e));
          fn && fn.call(DOM, event as any);
        });
      });
    } else {
      $(DOM).off(eventName as any);
    }
  });
}; 
