import { cloneDeep, isString } from "lodash-es";
import { IBootStrap } from "./IBootStrap";
import { eventBus } from "./EventBus";
import { PageModel } from "./PageModel";
import { IconfigData } from "./IConfigData";

declare global {
    let pageModel: any;
}

class BootStrap implements IBootStrap {

    constructor(root: HTMLElement | string, config: IconfigData) {
        this.bootStrap(root, config);
    }

    bootStrap(root: HTMLElement | string, config: IconfigData): any {

        this.htmlBootStrap(root, config);
        eventBus.eventBusInit();
        return this.pageModelBootStrap(config);
    }

    private htmlBootStrap(root: HTMLElement | string, config: IconfigData) {

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
            return this.pageModelBootStrap(cloneDeep(config));
        }

        root.innerHTML = dynamicHTML;
    }

    private pageModelBootStrap(config: IconfigData) {

        const pageModelData = new Proxy(config, {}) as IconfigData;

        pageModelData.componentsArray.forEach((component: any) => {
            const { id } = component;
            const componentElement = document.getElementById(id as string) as any;
            const dragElement = componentElement?.parentElement;

            if (componentElement?.model) {
                for (const key in component.model) {
                    componentElement.model[key] = component.model[key];
                }
                component.model = componentElement.model;
            }
            if (component?.model?.initStyle) {
                component.model.initStyle = dragElement?.style.cssText;
            }
        });

        Object.assign(window, { pageModel: new PageModel(pageModelData) });

        return pageModel;
    }
}



export default BootStrap;

