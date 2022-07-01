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

    pageModelData.componentsArray.forEach((component: any) => {
      const { id } = component;
      const componentElement = document.getElementById(id as string) as any;
      const dragElement = componentElement?.parentElement;

      if (componentElement?.model) {
        component.model = new Proxy(componentElement.model, {}) as any;
      }
      if (dragElement?.style) {
        component.initStyle = new Proxy(dragElement?.style, {}) as any;
      }
    });

    pageModel = pageModelData;
    Object.assign(window, { pageModel });
    return pageModel;
  }
  // const { pageData = {}, componentsArray = [], dynamicHTML } = config;

  // componentsArray.forEach(component => {
  //     const { componentName, initStyle, options, id } = component;
  //     const dragElement = document.createElement("div");
  //     const componentElement = document.createElement(componentName as string);

  //     dragElement.style.cssText = initStyle as string;
  //     componentElement.id = id as string;
  //     componentElement.dataset.data = JSON.stringify(options);
  //     componentElement.dataset.component = "true";
  //     dragElement.appendChild(componentElement);
  //     document.body.appendChild(dragElement);
  // });
  // document.body.innerHTML = dynamicHTML;
  // this.pageModelBootStrap();
}

// pageModelBootStrap() {
//   const tempConfig = { componentsArray: [{ id: "q-data-source" }] };
//   const pageModel = new Proxy(tempConfig, {}) as IconfigData;

//   pageModel.componentsArray.forEach((component) => {
//     const { id } = component;
//     const componentElement = document.getElementById(id as string) as any;
//     const dragElement = componentElement?.parentElement;

//     if (componentElement?.model) {
//       component.model = new Proxy(componentElement.model, {}) as any;
//     }
//     if (dragElement?.style) {
//       component.initStyle = new Proxy(dragElement.style, {}) as any;
//     }
//   });

//   (window as any).pageModel = pageModel;
// }
const bootstrap = new BootStrap();
export default bootstrap;
