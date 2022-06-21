export interface IComponent {
    id: string,
    componentName: string,
    type: string,
    text: string,
    group: [string],
    createTime: Date,
    image: string,
    initStyle: string,
    description: string,
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
        fn: (messagebody: IMessage) => any
    },
    body: object
}