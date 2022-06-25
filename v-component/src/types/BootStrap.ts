import { IBootStrap } from "./IBootStrap";
import { IconfigData } from "./IEventBus";

declare global {
    const config: IconfigData;
}

class BootStrap implements IBootStrap {

    bootStrap(config: IconfigData): any {
        if (!config) {
            return;
        }
        const { pageData = {}, componentsArray = [] } = config;


        componentsArray.forEach(component => {
            const { componentName, initStyle, options, id } = component;
            const dragElement = document.createElement("div");
            const componentElement = document.createElement(componentName as string);

            dragElement.style.cssText = initStyle as string;
            componentElement.id = id as string;
            componentElement.dataset.data = JSON.stringify(options);
            componentElement.dataset.component = "true";
            dragElement.appendChild(componentElement);
            document.body.appendChild(dragElement);
        });
        this.pageModelBootStrap();
    }

    pageModelBootStrap() {
        const pageModel = new Proxy(config, {}) as IconfigData;

        pageModel.componentsArray.forEach((component) => {
            console.log(component);
            const { id, model = { eventSpecification: {} } } = component;
            const componentElement = document.getElementById(id as string) as any;
            const dragElement = componentElement.parentElement;
            if (componentElement.model) {
                component.model = new Proxy(componentElement.model, {}) as any;
            }
            component.initStyle = new Proxy(dragElement.style, {}) as any;
        })

        console.log(pageModel);
        window.pageModel = pageModel;
    }
}


export default new BootStrap();