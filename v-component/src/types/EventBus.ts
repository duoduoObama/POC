import { EVENTBUS_NAME } from "../components/constent";
import { IMessage } from "./IComponent";
import { IEventBus } from "./IEventBus";

class EventBus implements IEventBus {

    /**
     * 事件
     */
    private eventObj: { [key: string]: Function } = {};

    /**
     * 发送消息
     * @param imessage 
     * @returns 
     */
    sendMessage(imessage: IMessage): Promise<any> {
        const reply = new Promise((resolve, reject) => {
            const { header } = imessage;
            Object.assign(header, { reply: { resolve, reject } });
            const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: imessage });
            this.setDispatchEvent(customEvent);
            console.log(`发送完毕，等待回复`);
        });

        return reply;
    }

    /**
     * 消息分发
     * @param imessage 
     */
    setDispatchEvent(imessage: any): void {
        window.dispatchEvent(imessage);
    }

    /**
     * 接收消息
     * @param eventName 事件名称
     * @param callBack 
     */
    onMessage(eventName: string, callBack: Function): void {
        this.eventObj[eventName] = callBack;
        window.addEventListener(eventName, (event: any) => {
            callBack && callBack(event)
        });
    }

    /**
     * 获取总线事件
     * @returns 
     */
    getListener(): { [key: string]: Function } {
        return this.eventObj;
    }
}


export const eventBus = new EventBus();