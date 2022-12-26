export default (
  base,
  filename
) => `console.log('before', window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)

const base = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__

async function bootstrap() {
  // 异步等到promise resolve才会去调用mount，保证mount的时候window上一定有函数。
 return System.import("${base}/${filename}").then((mod) => {
    console.log('bootstrap', window.purehtml)
    console.log('mod', mod)
    window.purehtml.bootstrap()
  })
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
async function mount(props) {
  console.log('mount', window.purehtml)
  window.purehtml.mount(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
async function unmount(props) {
  console.log('unmount', window.purehtml)
  window.purehtml.unmount(props)
}

((global) => {
  global["purehtml"] = {
    bootstrap,
    mount,
    unmount,
  };
})(window);

console.log('after', window.purehtml)`;
