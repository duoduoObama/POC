/**
 * 右键菜单
 */
Vue.component("q-contextmenu", {
  template: `  
  <div class="draggable2 can-drop dropzone" :id="id" :index="index" :style="data.style" :data-data="JSON.stringify(data)" 
    :data-x="data.x||0" :data-y="data.y||0" :data-element-type="data.elementType||'q-contextmenu'">
    <link href="${location.origin}/ui-builder/js/lay-module/components/q-contextmenu/jquery.contextmenu.css" rel="stylesheet"/>
    <link href="${location.origin}/ui-builder/js/lay-module/components/q-contextmenu/q-contextmenu.css" rel="stylesheet"/> 

    <script src="${location.origin}/ui-builder/js/lay-module/components/q-contextmenu/jquery.contextmenu.js" type="application/javascript"></script>
    <script src="${location.origin}/ui-builder/js/lay-module/components/q-contextmenu/q-contextmenu-external.js" type="application/javascript"></script>
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
          const { style, paramList } = newValue;
          this.style = style;
          this.paramList = paramList;
          this.updatePanel();
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
      options: this.data.options || [],
      paramList: this.data.paramList || [],
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
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
    updatePanel() {
      try {
        if (typeof this.paramList === "string") {
          this.paramList = JSON.parse(this.paramList);
        }
        for (let item of this.paramList) {
          item.key === "curId" && (item.default = this.id);
        }
      } catch (e) {
        this.paramList = [
          {
            key: "contextmenu",
            title: "菜单列表",
            default: '[{"title":"菜单一","id":"test"}]',
          },
          {
            key: "bindId",
            title: "目标组件Id",
            default: "",
          },
          {
            key: "curId",
            title: "当前组件Id",
            default: "",
          },
        ];
        console.log(error);
      }
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
    this.updatePanel();
  },
});
