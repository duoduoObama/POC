import "./components";

const modules = import.meta.globEager("./components/*/component.json");

console.log(modules);
