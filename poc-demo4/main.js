import "./src/components";
import { loadMicroApp, registerMicroApps, start } from "qiankun";
import microApp from "@micro-zoe/micro-app";

console.log(`start1111`);
microApp.start({
  plugins: {
    modules: {
      // appName即应用的name值
      "appname-vite": [
        {
          loader(code) {
            console.log(process.env.NODE_ENV, `start`);
            if (process.env.NODE_ENV === "development") {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              code = code.replace(
                /(from|import)(\s*['"])(\/basename\/)/g,
                (all) => {
                  return all.replace(
                    "/poc-demo2/",
                    "http://192.168.21.92:3002/basename/"
                  );
                }
              );
            }

            return code;
          },
        },
      ],
    },
  },
});

registerMicroApps(
  [
    {
      name: "poc1", // app name registered
      entry: "//192.168.21.92:3001",
      container: "#poc1",
      activeRule: "/poc1",
    },
    {
      name: "poc2",
      entry2: {
        scripts: ["//192.168.21.92:3002/main.js"],
      },
      entry: "//192.168.21.92:3002",
      container: "#poc2",
      activeRule: "/poc2",
    },
    // ,
    // {
    //   name: "poc3",
    //   entry2: {
    //     scripts: ["//192.168.21.92:3002/main.js"],
    //   },
    //   entry: "//192.168.21.92:3001",
    //   container: "#poc2",
    //   activeRule: "/poc3",
    // },
    {
      name: "poc3",
      entry2: {
        scripts: ["//192.168.21.92:6063/main.js"],
      },
      entry: "//192.168.21.92:6063/appSite/",
      container: "#poc2",
      activeRule: "/poc3",
    },
  ],
  {
    beforeLoad: (app) => console.log("before load", app.name),
    beforeMount: [(app) => console.log("before mount", app.name)],
  }
);

start();

window.duoduo = 123123;
