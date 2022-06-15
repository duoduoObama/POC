import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import qiankun from "vite-plugin-qiankun";
import { join } from "path";
import { writeFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  base: `${
    process.env.NODE_ENV === "production" ? "http://my-site.com" : ""
  }/poc-demo2/`,
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
    // qiankun("poc2", { useDevMode: true }),
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
              const chunk = bundle[chunkName];
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
    manifest: false,
    outDir: "dist/",
    assetsDir: "assets",
    rollupOptions: {
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
});
