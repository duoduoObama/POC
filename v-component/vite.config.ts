import { defineConfig } from "vite";
import { resolve, join } from "path";
import { writeFileSync } from "fs";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  // micro App 子应用配置
  base: `${
    process.env.NODE_ENV === "production" ? "http://my-site.com" : ""
  }/v-component/`,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      },
    }),
    // 自定义插件
    (function () {
      let basePath = "";
      return {
        name: "vite:micro-app",
        apply: "build",
        configResolved(config) {
          basePath = `${config.base}${config.build.assetsDir}/`;
        },
        writeBundle(options, bundle) {
          for (const chunkName in bundle) {
            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
              const chunk = <any>bundle[chunkName];
              if (chunk.fileName && chunk.fileName.endsWith(".js")) {
                chunk.code = chunk.code.replace(
                  /(from|import\()(\s*['"])(\.\.?\/)/g,
                  (all, $1, $2, $3) => {
                    return all.replace($3, new URL($3, basePath));
                  }
                );
                const fullPath = join(options.dir, chunk.fileName);
                writeFileSync(fullPath, chunk.code);
              }
            }
          }
        },
      };
    })(),
  ],

  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
    },
    manifest: false,
    outDir: "dist/",
    assetsDir: "assets",
    rollupOptions: {
      external: /^lit/,
      output: {
        // 重点在这里哦
        // entryFileNames: `assets/[name].${timestamp}.js`,
        // chunkFileNames: `assets/[name].${timestamp}.js`,
        // assetFileNames: `assets/[name].${timestamp}.[ext]`
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      vue: resolve(__dirname, "node_modules/vue/dist/vue.esm-bundler.js"),
    },
  },
});
