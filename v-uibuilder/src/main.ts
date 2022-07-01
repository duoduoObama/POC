import { createApp } from "vue";
import App from "./App.vue";
import microApp from "@micro-zoe/micro-app";

// createApp(App).mount("#vite-app");

microApp.start({
  plugins: {
    modules: {
      // appName即应用的name值
      "v-component": [
        {
          loader(code) {
            console.log(process.env.NODE_ENV, `start`);
            if (process.env.NODE_ENV === "development") {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              code = code.replace(
                /(from|import)(\s*['"])(\/basename\/)/g,
                (all) => {
                  return all.replace(
                    "/v-component/",
                    "http://192.168.21.40:3000/basename/"
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
