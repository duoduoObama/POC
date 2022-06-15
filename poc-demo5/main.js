import { loadMicroApp, registerMicroApps, start } from "qiankun";

registerMicroApps(
  [
    {
      name: "poc1", // app name registered
      entry2: {
        scripts: ["//192.168.21.92:3001/main.js"],
      },
      entry: "//192.168.21.92:3004",
      container: "#app",
      activeRule: "/poc1",
    },
  ],
  {
    beforeLoad: (app) => console.log("before load", app.name),
    beforeMount: [(app) => console.log("before mount", app.name)],
  }
);

start({
  sandbox: true,
  prefetch: false,
});
