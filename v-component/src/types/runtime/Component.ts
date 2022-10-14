import { LitElement } from "lit";
import { cloneDeep, isObject, merge } from "lodash-es";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { mergeModel } from "../../util/utils";
import { eventBus } from "./EventBus";
import { IComponent } from "./IComponent";
import { IMessage } from "./IMessage";
import { IDOMEventMeta, IEventHandlersEventName, ISchema, IWatchSetting } from "./IModelSchema";

export class Component extends LitElement implements IComponent {

    model: ISchema = {} as ISchema;
    eventObj: { [key: string]: Function } = {};
    eventBus: any = eventBus;

    constructor() {
        super();
        this.initBaseModel();

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
        const nativeEventsHandler = DOMEvents[nativeEvents] as Function[];
        const customEventsHandler = this.model.onMessageMeta[dstType];

        if (nativeEventsHandler && nativeEventsHandler.length) {
            this.dispatchEvent(imessage.body);
            return;
        }

        customEventsHandler && customEventsHandler.forEach((current) => {
            const fn = current;

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
        return eventBus.sendMessage(imessage);
    }

    private initBaseModel() {

        const self = this;

        mergeModel(this.model, {
            get id() {
                return cloneDeep(self.id);
            },
            set id(value) {
                self.setAttribute("id", value);
            },
            get createTime() {
                return new Date();
            },
            get image() {
                return "";
            },
            _initStyle: {},
            get initStyle() {
                return this._initStyle;
            },
            set initStyle(value) {
                const div = document.createElement("div");
                if (self.parentElement) {
                    div.style.cssText = `${self.parentElement.style.cssText};${this.initStyle};${value}`;
                    self.parentElement.style.cssText = div.style.cssText;
                }

                this._initStyle = div.style.cssText;
            },
            _onMessageMeta: {
            },
            _onDOMEvent: {
            },
            _onWatchSetting: {
            },
            get onMessageMeta() {
                return cloneDeep(this._onMessageMeta);
            },
            set onMessageMeta(value) {
                if (!isObject(value)) {
                    return;
                }
                const mergeValue = merge(this._onMessageMeta, value);
                this._onMessageMeta = mergeValue;
            },
            get onDOMEvent() {
                return cloneDeep(this._onDOMEvent);
            },
            set onDOMEvent(value) {
                if (!isObject(value)) {
                    return;
                }
                const mergeValue = merge(this._onDOMEvent, value);
                domAssemblyCustomEvents(self, mergeValue as IDOMEventMeta);
                this._onDOMEvent = mergeValue;
            },
            get onWatchSetting() {
                return cloneDeep(this._onWatchSetting);
            },
            set onWatchSetting(value: IWatchSetting) {
                if (!isObject(value)) {
                    return;
                }
                const mergeValue = merge(this._onWatchSetting, value);
                this._onWatchSetting = mergeValue;
            }
        });
    }
} 