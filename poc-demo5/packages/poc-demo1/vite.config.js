import qiankun from "vite-plugin-qiankun";

export default {
  // 这里的 'myMicroAppName' 是子应用名，主应用注册时AppName需保持一致
  plugins: [qiankun("poc1", { useDevMode: true })],
  // 生产环境需要指定运行域名作为base
};
