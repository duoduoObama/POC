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
    body: any
}