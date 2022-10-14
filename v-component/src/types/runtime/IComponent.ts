import { IMessage } from "./IMessage";
import { ISchema } from "./IModelSchema";


export interface IComponent {
    model?: ISchema,
    onMessage(message: IMessage): void;
    sendMessage(message: IMessage): Promise<any>;
}


