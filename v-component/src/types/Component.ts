import { LitElement } from "lit";
import { EVENTBUS_NAME } from "../components/constent";
import { IComponent, IMessage, ISchema } from "./IComponent";

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
        }
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
        const customEvent = new CustomEvent(dstType, { detail: imessage });
        this.dispatchEvent(customEvent);
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
            console.log(`发送完毕，等待回复`);
        });

        return reply;
    }

    initModel(): void {
        // throw new Error("Method not implemented.");
    }
}