import entry from "../entry";

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html, options) {
      return {
        html: html
          .replace(
          // /<title>(.*?)<\/title>/,
          // `<title>Title replaced!</title>`
          ), // 生命周期不对，在这里修改html会被legacy插件覆盖
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/entry.js",
            },
            injectTo: "body",
          },
        ],
      };
    },
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((bundleName) => {
        if (/index-legacy/.test(bundleName)) {
          this.emitFile({
            type: "asset",
            fileName: "entry.js",
            source: entry(process.env.BASE, bundleName),
          });
        }
      });
      const template = bundle["index.html"] ? bundle["index.html"].source : "";
      if (template) {
        bundle["index.html"].source = template
          .replace(/nomodule/g, "")
          .replace(/<script type="module"(.*?)<\/script>/g, "");
      }
    },
  };
};

export default htmlPlugin;

