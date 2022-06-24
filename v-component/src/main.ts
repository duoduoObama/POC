import "./components";

const modules = import.meta.globEager("./components/*/component.json");

const components = Object.values(modules).reduce((pre, cur) => {
    const { componentName } = cur;
    pre[componentName] = cur;
    return pre;
}, {})

console.log(components);
