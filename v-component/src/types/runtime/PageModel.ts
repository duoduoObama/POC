import { IComponent } from "./IComponent"; 
import { IconfigData } from "./IConfigData";

export class PageModel {

    pageModel: IconfigData;

    constructor(pageModel: IconfigData) {
        this.pageModel = pageModel;
    }

    get(id: string) {
        const component = this.pageModel.componentsArray.find((component: any) => {
            return component.id === id;
        }) as any;
        const dom = document.getElementById(id);
        if (!component) {
            Object.assign(component, { dom });
            return false;
        }
        return component;
    }

    delete(id: string) {
        const component = this.pageModel.componentsArray.findIndex((component: any) => component.id === id);
        if (component > -1) {
            document.getElementById(id)?.parentElement?.remove();
            this.pageModel.componentsArray.splice(component, 1);
            return true;
        }
        return false;
    }

    add(component: IComponent) {
        this.pageModel.componentsArray.push(component);
    }

    update(component: IComponent) {
        const index = this.pageModel.componentsArray.findIndex((component: any) => component.id === component.id);
        if (index > -1) {
            Object.assign(this.pageModel.componentsArray[index], component);
            return true;
        }
        return false;
    }
}