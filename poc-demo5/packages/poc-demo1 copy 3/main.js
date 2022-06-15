import "./style.css";
import "./src/components";
import { getTableData } from "./src/page/index";

const createTempNode = (len = 200) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < len; i++) {
    const dom = document.querySelector("#element").cloneNode(true);
    dom.classList.add(`tempnode`);
    fragment.appendChild(dom);
  }
  document.body.appendChild(fragment);
};

(function () {
  let i = 0;
  setInterval(() => {
    document.querySelectorAll(".tempnode").forEach((item) => {
      item.remove();
      console.log(12312);
    });
    i++;
    if (i < 1500) {
      setTimeout(() => {
        // createTempNode(1);
      }, 1000);
    }
  }, 5000);
  // createTempNode(10);
})();

// vite-plugin-qiankun helper
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";


function render(props = {}) { 
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
  // render({});
}

const apps = [
  {
    name: "qiankun-sub",
    entry: "//localhost:10000",
    container: "#app",
    // 因为main作为子项目会被注入一个前缀，所以孙子应用sub也要加上这个前缀
    activeRule: window.__POWERED_BY_QIANKUN_PARENT__ ? "/main/sub" : "/sub",
  },
];

registerMicroApps(apps);

start({
  prefetch: false,
});

 