import "http://192.168.21.40:3000/v-component/src/components/index";

const modules = import.meta.globEager(
  "http://192.168.21.40:3000/v-component/src/components/*/component.json"
);

const components = Object.values(modules).reduce((pre, cur) => {
  const { componentName } = cur;
  pre[componentName] = cur;
  return pre;
}, {});

console.log(components);
