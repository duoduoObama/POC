import { type } from "os";
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
    watch: {
        get onPageModelWatchMeta(): IPageModelWatchMeta[];
        set onPageModelWatchMeta(value: IPageModelWatchMeta[]);
        [key: string]: any,
    }
}

type IPageModelWatchMeta = { [key: string]: (e: IMessage) => void }





