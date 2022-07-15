import {
  IDOMEventMeta,
  IEventHandlersEventName,
  IMessage,
  IMessageMeta,
} from "../types/IComponent";

/**
 * 组件自定义事件装配
 */
export const componentAssemblyCustomEvents = (
  imessage: IMessage,
  events: IMessageMeta[]
) => {};

/**
 * DOM事件装配
 */
export const domAssemblyCustomEvents = (
  DOM: HTMLElement,
  events: IDOMEventMeta
) => {
  // DOM[eventName] = fn;
  // eventName: IEventHandlersEventName, fn: () => void
  Object.keys(events).forEach((eventName) => {
    // 只取数组对象中第一个的值
    const [fn] = events[eventName as IEventHandlersEventName];
    Object.assign(DOM, { [eventName]: fn });
  });
};
