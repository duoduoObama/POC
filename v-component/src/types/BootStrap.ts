import { IBootStrap } from "./IBootStrap";
import { IconfigData } from "./IEventBus";

declare global {
    const config: IconfigData;
    let pageModel: IconfigData;
}

var pageModel: IconfigData;

class BootStrap implements IBootStrap {

    bootStrap(config: IconfigData): any {
        if (!config) {
            return;
        }
        const { dynamicHTML } = config;

        document.body.innerHTML = dynamicHTML;
        return this.pageModelBootStrap();
    }

    pageModelBootStrap() {
        const pageModelData = new Proxy(config, {}) as IconfigData;

        pageModelData.componentsArray.forEach((component) => {
            const { id } = component;
            const componentElement = document.getElementById(id as string) as any;
            const dragElement = componentElement?.parentElement;

            if (componentElement?.model) {
                component.model = new Proxy(componentElement.model, {}) as any;
            }
            if (dragElement?.style) {
                component.initStyle = new Proxy(dragElement?.style, {}) as any;
            }

        })

        pageModel = pageModelData;
        Object.assign(window, { pageModel });
        return pageModel;
    }
}


export default new BootStrap();