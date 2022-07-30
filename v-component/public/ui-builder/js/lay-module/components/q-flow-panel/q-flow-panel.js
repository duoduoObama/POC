/**
 * 流布局容器
 */
Vue.component("q-flow-panel", {
  template: ` 
          <div class="draggable2 dropzone" :data-element-type="data.componentName||'q-flow-panel'" :id="data.id" :index="index" :style="data.style"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-flow-panel/q-flow-panel.css" rel="stylesheet">  
          </div> 
        `,
  props: {
    data: Object,
    index: Number,
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style } = newValue;
          this.style = style;
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || "",
      style: this.data.style,
    };
  },
  methods: {
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "string",
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        if (check(body)) {
          this.data.options = body;
          this.options = this.data.options;
          rxjs.timer(500).subscribe(() => {
            this.$refs.videoRef.play();
          });
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
    startFlow() {
      const targetNode = this.$el;
      // 观察器的配置（需要观察什么变动）
      const config = {
        // attributes: true,
        childList: true,
        subtree: true,
      };
      // 当观察到变动时执行的回调函数
      const callback = (e, q) => {
        const [{ addedNodes = [{}] }] = e;
        addedNodes.forEach((element) => {
          // 如果是添加的菜单不添加样式
          if (Object.prototype.toString.call(element) === `[object HTMLLIElement]`) {
            return;
          }
          this.$nextTick(() => {
            element.style.removeProperty("transform");
            element.style.setProperty("position", "relative");
            Reflect.deleteProperty(element.dataset, "x");
            Reflect.deleteProperty(element.dataset, "y");
          });
        });
      };
      const observer = new MutationObserver(callback);
      observer && observer.observe(targetNode, config);
    },
  },
  updated() {
    try {
      this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.receiveInfo();
    this.startFlow();
  },
});
