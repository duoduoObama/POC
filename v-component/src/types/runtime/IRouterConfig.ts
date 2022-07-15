export interface IRouterConfig {
    [key: string]: {
        title?: string,
        src: string,
        trigger: string[],
        receive: IReceive[],
    }
}

interface IReceive {
    target: string,
    event: string[],
    script: string,
}

