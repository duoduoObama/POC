import qiankun from "vite-plugin-qiankun"; 
import { join } from "path";
import { writeFileSync } from "fs";

export default {
  // 这里的 'myMicroAppName' 是子应用名，主应用注册时AppName需保持一致
  plugins: [
    qiankun("poc1", { useDevMode: true }),
    // (function () {
    //   let basePath = "";
    //   return {
    //     name: "vite:micro-app",
    //     apply: "build",
    //     configResolved(config) {
    //       basePath = `${config.base}${config.build.assetsDir}/`;
    //     },
    //     // renderChunk(code, chunk) {
    //     //   if (chunk.fileName.endsWith('.js')) {
    //     //     code = code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
    //     //       return all.replace($3, new URL($3, basePath))
    //     //     })
    //     //   }
    //     //   return code
    //     // },
    //     // writeBundle 钩子可以拿到完整处理后的文件，但已经无法修改
    //     writeBundle(options, bundle) {
    //       for (const chunkName in bundle) {
    //         if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
    //           const chunk = bundle[chunkName];
    //           if (chunk.fileName && chunk.fileName.endsWith(".js")) {
    //             chunk.code = chunk.code.replace(
    //               /(from|import\()(\s*['"])(\.\.?\/)/g,
    //               (all, $1, $2, $3) => {
    //                 return all.replace($3, new URL($3, basePath));
    //               }
    //             );
    //             const fullPath = join(options.dir, chunk.fileName);
    //             writeFileSync(fullPath, chunk.code);
    //           }
    //         }
    //       }
    //     },
    //     // generateBundle 执行时import() 还是 q(()=>import("./page2.cdecf1fd.js"),"__VITE_PRELOAD__")
    //     // generateBundle (options, bundle) {
    //     //   for (const chunkName in bundle) {
    //     //     if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
    //     //       const chunk = bundle[chunkName]
    //     //       if (chunk.fileName && chunk.fileName.endsWith('.js')) {
    //     //         chunk.code = chunk.code.replace(/(from|import)(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
    //     //           return all.replace($3, new URL($3, basePath))
    //     //         })

    //     //         if (chunk.fileName.includes('index')) {
    //     //           console.log(22222222, chunk.code)
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     // },
    //   };
    // })(),
  ],
  // 生产环境需要指定运行域名作为base
};
