import { IComponent, IMessage } from "./IComponent";

export interface IEventBus {
    sendMessage(imessage: IMessage): Promise<any>;
    setDispatchEvent(dispatcher: (imessage: IMessage) => void): void;
}


export interface IconfigData {
    pageData: {

    },
    componentsArray: IComponent[],
    dynamicHTML: string,
}



