import { type } from "os";

export interface IComponent {
    model?: ISchema,
}
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
    get options(): any;
    get schema(): ICustomSchema;
    get onMessageMeta(): IMessageMeta;
    set onMessageMeta(value: IMessageMeta);
    get onDOMEvent(): IDOMEventMeta;
    set onDOMEvent(value: IDOMEventMeta);
    get onWatchSetting(): IWatchSetting;
    set onWatchSetting(value: IWatchSetting);
    [key: string]: any,
}

type IEventHandler = (e: IMessage) => void;

export type IMessageMeta = { [key: string]: IEventHandler[] };

type IWatchFn = (newVal: any, oldVal: any, component: any) => void;
export type IWatchSetting = { [key: string]: IWatchFn[] };

export type IEventHandlersEventName = `on${keyof GlobalEventHandlersEventMap}`;
export type IDOMEventMeta = { [key in IEventHandlersEventName]: IEventHandler[] };



// interface IDOMEventMeta {
//     [key in IEventHandlersEventName]:string; 
//     // get [`on${keyof GlobalEventHandlersEventMap}`]:()=>void;
//     // set eventName(value: `on${keyof GlobalEventHandlersEventMap } `);
//     // get eventFunction(): (e: Event) => void;
//     // set eventFunction(value: (e: Event) => void);
// }

export interface ICustomSchema {
    eventSpecification: {
        inputEvent: IEventSpecificationEvent[],
        outputEvent: IEventSpecificationEvent[]
    }
    optionsView: {
        list: IOptionsView[],
    }
}
export interface IOptionsViewRules {
    required: boolean,
    message: string,
    trigger: string[]
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

export interface IEventSpecificationEvent {
    text: string,
    eventType: string,
    messageSchema: string,
    messageDemo: string,
}

export interface IMessage {
    header: {
        src: string,
        srcType: string,
        dst: string,
        dstType: string,
        fn?: (messagebody: IMessage) => any,
        reply?: {
            resolve: (messagebody: IMessage) => any,
            reject: (messagebody: IMessage) => any
        },
    },
    body: object
}