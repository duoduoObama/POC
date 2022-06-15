import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";
import legacy from "@vitejs/plugin-legacy";
import Inspect from "vite-plugin-inspect";
import htmlPlugin from "./src/plugins/html-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    react({
      babel: {
        babelrc: false,
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
      },
    }),
    qiankun("poc5", { useDevMode: true }),
  ],
});
