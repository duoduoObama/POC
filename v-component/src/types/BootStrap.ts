import { isString } from "lodash-es";
import { IBootStrap } from "./IBootStrap";
import { IComponent } from "./IComponent";
import { IconfigData } from "./IEventBus";
import { eventBusSubscribe } from "../util/event-bus";

declare global {
    const config: IconfigData;
    let pageModel: any;
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
                for (const key in component.model) {
                    componentElement.model[key] = component.model[key];
                }
                // componentElement.model = deepWatchSettingProxy(componentElement.model);
                component.model = new Proxy(componentElement.model, {}) as any;
            }
            if (dragElement?.style) {

                component.initStyle = new Proxy(dragElement?.style, {}) as any;
            }
        });

        pageModel = new PageModel(pageModelData);

        Object.assign(window, { pageModel });
        return pageModel;
    }
}

class PageModel {

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
    eventBusSubscribe() {
        return eventBusSubscribe();
    };
}

const bootstrap = new BootStrap();
export default bootstrap;

