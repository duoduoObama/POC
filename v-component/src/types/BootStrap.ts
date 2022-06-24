import { IBootStrap } from "./IBootStrap";
import { IconfigData } from "./IEventBus";

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
        })
    }
}

export default new BootStrap();