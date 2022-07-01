import { isElement, isString } from "lodash-es";
import { IBootStrap } from "./IBootStrap";
import { IconfigData } from "./IEventBus";

declare global {
    const config: IconfigData;
    let pageModel: IconfigData;
}

var pageModel: IconfigData;

class BootStrap implements IBootStrap {
    bootStrap(root: HTMLElement | string, config: IconfigData): any {

        const { dynamicHTML } = config;

        if (!config) {
            return;
        }
        if (!root) {
            throw `root element is null;`;
        } else if (isString(root)) {
            const target = document.querySelector(root as string) as HTMLElement;
            if (!target) {
                throw `root element is null;`;
            }

            target.innerHTML = dynamicHTML;
            return this.pageModelBootStrap();
        }

        root.innerHTML = dynamicHTML;
        return this.pageModelBootStrap();
    }

    pageModelBootStrap() {
        const pageModelData = new Proxy(config, {}) as IconfigData;

        pageModelData.componentsArray.forEach((component: any) => {
            const { id } = component;
            const componentElement = document.getElementById(id as string) as any;
            const dragElement = componentElement?.parentElement;

            if (componentElement?.model) {
                component.model = new Proxy(componentElement.model, {}) as any;
            }
            if (dragElement?.style) {
                console.log(dragElement.style);
                
                component.initStyle = new Proxy(dragElement?.style, {}) as any;
            }
        });

        pageModel = pageModelData;
        console.log(pageModel);
        
        Object.assign(window, { pageModel });
        return pageModel;
    }
}

const bootstrap = new BootStrap();
export default bootstrap;
