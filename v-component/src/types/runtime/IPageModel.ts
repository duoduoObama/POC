import { IComponent } from "./IComponent";
import { IconfigData } from "./IConfigData";

export interface IPageModel {
    pageModel: IconfigData;
    get(id: string): any;
    delete(id: string): boolean;
    add(component: IComponent): void;
    update(component: IComponent): boolean;
}