import { LitElement } from "lit";
import { EVENTBUS_NAME } from "../components/constent";
import {
    IComponent,
    IEventHandlersEventName,
    IMessage,
    ISchema,
} from "./IComponent";

export class Component extends LitElement implements IComponent {
    model!: ISchema;
    eventObj: { [key: string]: Function } = {};
    constructor() {
        super();
    }

    /**
     * 添加监听器
     * @param eventName 事件名称
     * @param listener
     */
    addListener(eventName: string, listener: (imessage: any) => void) {
        const method = function (message: any) {
            listener(message.detail);
        };
        this.eventObj[eventName] = method;
        this.addEventListener(eventName, method);
    }

    /**
     * 移除监听器
     * @param eventName
     * @param listener
     */
    removeListener(eventName: string) {
        this.removeEventListener(eventName, this.eventObj[eventName] as never);
    }

    /**
     * 获取监听的事件
     * @returns
     */
    getListener() {
        return this.eventObj;
    }

    /**
     * 总线消息分发
     * @param imessage
     */
    onMessage(imessage: IMessage): void {
        const { header } = imessage;
        const { dstType } = header;
        const nativeEvents = `on${dstType}` as IEventHandlersEventName;
        const DOMEvents = this as never;
        const nativeEventsHandler = DOMEvents[nativeEvents] as Function;
        const customEventsHandler = this.model.onMessageMeta[dstType];

        customEventsHandler && customEventsHandler.forEach((current) => {
            const fn = current;

            if (nativeEventsHandler) {
                const customEvent = new CustomEvent(dstType, { detail: imessage });
                this.dispatchEvent(customEvent);
                return;
            }
            if (fn) {
                const cpFn = new Function(`imessage`, `return (${fn.toString()}).call(this,imessage)`);
                cpFn.call(this, imessage);
            }
        });
    }

    /**
     * 发送消息
     * @param imessage IMessage
     * @returns
     */
    sendMessage(imessage: IMessage): Promise<any> {
        const reply = new Promise((resolve, reject) => {
            const { header } = imessage;
            Object.assign(header, { reply: { resolve, reject } });
            const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: imessage });

            window.dispatchEvent(customEvent);
        });

        return reply;
    }
}
