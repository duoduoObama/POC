import { IMessage } from "./IMessage";

export interface IEventBus {
    sendMessage: (imessage: IMessage) => void;
    eventBusInit: () => void;
} 





