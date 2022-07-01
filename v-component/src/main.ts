import "./components/index";

// const modules = import.meta.globEager(
//   "./components/*/component.json"
// );

// const components = Object.values(modules).reduce((pre, cur) => {
//   const { componentName } = cur;
//   pre[componentName] = cur;
//   return pre;
// }, {});

// console.log(components);

import { eventBusSubscribe } from "./util/event-bus";
import bootstrap from "./types/BootStrap";
(window as any).v_component = {
  eventBusSubscribe,
  bootstrap,
};
