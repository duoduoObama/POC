import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { renderWithQiankun, qiankunWindow } from './plugins/qiankun/helper';
import { registerMicroApps, start } from "qiankun";

function render(props = {}) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} 

renderWithQiankun({
  mount(props) {
    console.log("viteapp mount");
    render(props);
  },
  bootstrap() {
    console.log("bootstrap");
  },
  unmount(props) {
    console.log("viteapp unmount");
    const { container } = props;
    const mountRoot = container?.querySelector("#root");
    ReactDOM.unmountComponentAtNode(
      mountRoot || document.querySelector("#root")
    );
  },
  update(props) {
    console.log("viteapp update");
    console.log(props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

// const apps = [
//   {
//     name: "qiankun-sub",
//     entry: "//192.168.21.92:3005",
//     container: "#app",
//     // 因为main作为子项目会被注入一个前缀，所以孙子应用sub也要加上这个前缀
//     activeRule: window.__POWERED_BY_QIANKUN_PARENT__
//       ? "/poc1/sub1"
//       : "/poc1/sub1",
//   },
// ];

// console.log(qiankunWindow, qiankunWindow.__POWERED_BY_QIANKUN_PARENT__, 99999);
// registerMicroApps(apps);

// start({
//   prefetch: false,
// });
