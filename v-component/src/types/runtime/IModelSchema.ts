import { IMessage } from "./IMessage";

export interface ISchema {
    get id(): string;
    get componentName(): string;
    get type(): string;
    get text(): string;
    get group(): string[];
    get createTime(): Date;
    get image(): string;
    get initStyle(): string;
    set initStyle(value: string);
    get description(): string;
    get iovSchema(): ICustomSchema;
    get onMessageMeta(): IMessageMeta;
    set onMessageMeta(value: IMessageMeta);
    get onDOMEvent(): IDOMEventMeta;
    set onDOMEvent(value: IDOMEventMeta);
    get onWatchSetting(): IWatchSetting;
    set onWatchSetting(value: IWatchSetting);
    // initModel(schema: ISchema): IWatch;
    // shuxingshezhi: IWatch;
    [key: string]: any,
}


type IEventHandler = (e: IMessage) => void;
type IWatchFn = (newVal: any, oldVal: any, component: any) => void;

export type IWatchSetting = { [key: string]: IWatchFn[] };
export type IEventHandlersEventName = `on${keyof GlobalEventHandlersEventMap}`;
export type IDOMEventMeta = { [key in IEventHandlersEventName]: IEventHandler[] };
export type IMessageMeta = { [key: string]: IEventHandler[] };


export interface ICustomSchema {
    eventSpecification: {
        inputMessage: IEventSpecificationEvent[],
        outputMessage: IEventSpecificationEvent[]
    }
    optionsView: {
        list: IOptionsView[],
    }
}

export interface IOptionsView {
    type: string,
    label: string,
    options: {
        type: string,
        width: string,
        defaultValue: string,
        placeholder: string,
        clearable: boolean,
        maxLength: number,
        prepend: string,
        append: string,
        tooptip: string,
        hidden: boolean,
        disabled: boolean,
        dynamicHide: boolean,
        dynamicHideValue: string,
    },
    model: string,
    key: string,
    rules: IOptionsViewRules[],
}

export interface IOptionsViewRules {
    required: boolean,
    message: string,
    trigger: string[]
}

export interface IEventSpecificationEvent {
    text: string,
    eventType: string,
    messageSchema: string,
    messageDemo: string,
}
