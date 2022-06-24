export interface IComponent {
    id?: string,
    componentName?: string,
    type?: string,
    text?: string,
    group?: [string],
    createTime?: Date,
    image?: string,
    initStyle?: string,
    description?: string,
    options?: any,
    readonly shema?: ISchema,
    model?: ISchema,
    addListener?(eventName: string, listener: Function): void,
    removeListener?(eventName: string, listener: Function): void,
    getListener?(): { [key: string]: Function },
    onMessage?(imessage: IMessage): void,
    initModel?(): void
}

export interface ISchema {
    eventSpecification: {
        inputEvent: IEventSpecificationEvent[],
        outputEvent: IEventSpecificationEvent[]
    }
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