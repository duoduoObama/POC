/**
 * 切换面板
 */

//  <div class="panel-toggle-icon">▼</div>
//  <div class="panel-top-header">
//   <div class="icons-list">
//     <a-button data-index="0"><a-icon type="left-square" :style="{ fontSize: '30px'}"/></a-icon></a-button>
//     <a-button data-index="1"><a-icon type="right-square" :style="{ fontSize: '30px'}"/></a-icon></a-button>
//     <a-button data-index="2"><a-icon type="down-square" :style="{ fontSize: '30px'}"/></a-icon></a-button>
//   </div>
// </div>
Vue.component("q-toogle-panel", {
  template: `  
  <div class="draggable2 can-drop dropzone q-toogle-panel" :id="id" :index="index" :style="data.style" :data-data="JSON.stringify(data)" 
    :data-x="data.x||0" :data-y="data.y||0" :data-element-type="data.elementType||'q-toogle-panel'">
    <link
      href="${location.origin}/ui-builder/js/lay-module/components/q-toogle-panel/q-toogle-panel.css"
      rel="stylesheet"/>
    <div class="panel-top-more"> 

    </div> 
    <div class="q-toogle-panel-wrapper">
        <div class="tpanel-left-horizontal" >
      <div class="panel-put-away left-ui external-wrap" data-index="0" >
        <a-icon type="caret-left"> </a-icon>
      </div>
      <div class="tpanel-content-horizontal" :style="{width:left,height:'100%'}" data-key-name="leftbol">
        <div class="layui-tab-item dropzone layui-show" :id="id+1"></div>
      </div>
    </div> 
        <div class="tpanel-container-horizontal" :data-height="bottom"   :style="{marginTop}">
        <div class="panel-expand-handler external-wrap" data-index="2" >
        <a-icon type="caret-down" ></a-icon>
        </div>
        <div class="tpanel-content-horizontal container-ui" :style="{height:bottom}" data-key-name="bottombol">
          <div class="layui-tab-item dropzone layui-show" :id="id+3"></div>
        </div>
        </div> 
        <div class="tpanel-right-horizontal">
    <div class="panel-put-away right-ui external-wrap" data-index="1" >
      <a-icon type="caret-right"> </a-icon>
    </div>
    <div class="tpanel-content-horizontal" :style="{width:right,height:'100%'}" data-key-name="rightbol" >
      <div class="layui-tab-item dropzone layui-show" :id="id+2"></div>
    </div>
    </div> 
       
    </div>
   
    <script
        src="${location.origin}/ui-builder/js/lay-module/components/q-toogle-panel/q-toogle-panel-external.js"
        type="application/javascript"></script>
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
          const styleObj = styleToObj(style);
          this.wrapH = parseFloat(styleObj.height || "200");
          this.paramList = paramList;
          this.updatePanel();
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
  },
  computed: {
    marginTop() {
      const node = $(`#${this.data.id}`).find(".tpanel-container-horizontal").find(".tpanel-content-horizontal");
      if (node.hasClass("panel-content-none")) return $(`#${this.data.id}`).height() + "px";
      return `${this.wrapH - parseFloat(this.bottom)}px`;
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
      wrapH: 200,
      left: "200px",
      right: "200px",
      bottom: "200px",
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
        const { paramList } = this;
        if (typeof paramList === "string") {
          this.paramList = JSON.parse(paramList);
        } else {
          this.paramList = paramList;
        }
        this.left = this.paramList.find((current) => current.key === "left").default + "px";
        this.right = this.paramList.find((current) => current.key === "right").default + "px";
        this.bottom = this.paramList.find((current) => current.key === "bottom").default + "px";

        const [left, right, bottom] = [
          $(this.$el).find(".tpanel-left-horizontal")[0],
          $(this.$el).find(".tpanel-right-horizontal")[0],
          $(this.$el).find(".tpanel-container-horizontal")[0],
        ];
        this.paramList.forEach((current) => {
          const defalutValue = current.default === "close" ? "panel-content-none" : "";
          const obj = { left: { target: left }, right: { target: right }, bottom: { target: bottom } };
          if (current.key === "leftbol" && defalutValue) {
            $(left).find(".tpanel-content-horizontal")[0].classList.add(defalutValue);
          }
          if (current.key === "rightbol" && defalutValue) {
            $(right).find(".tpanel-content-horizontal")[0].classList.add(defalutValue);
          }
          if (current.key === "bottombol" && defalutValue) {
            $(bottom).find(".tpanel-content-horizontal")[0].classList.add(defalutValue);
          }

          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              const opTarget = this.paramList.filter((i) => i.key === key + "op")[0];
              const bgTarget = this.paramList.filter((i) => i.key === key + "bg")[0];
              bgTarget &&
                ($(obj[key]["target"]).find(".tpanel-content-horizontal")[0].children[0].style.background =
                  bgTarget["default"] || "#fff");
              // 透明度
              opTarget &&
                ($(obj[key]["target"]).find(".tpanel-content-horizontal")[0].style.opacity = +opTarget["default"] || 1);
            }
          }
        });
      } catch (error) {
        this.paramList = [
          { key: "left", title: "左侧面板", default: "200" },
          { key: "right", title: "右侧面板", default: "200" },
          { key: "bottom", title: "底部面板", default: "200" },
          { key: "leftbol", title: "左面板是否关闭", default: "open" },
          { key: "rightbol", title: "右面板是否关闭", default: "open" },
          { key: "bottombol", title: "底部面板是否关闭", default: "open" },
          { key: "leftbg", title: "左面板背景色", default: "#fff" },
          { key: "rightbg", title: "右面板背景色", default: "#fff" },
          { key: "bottombg", title: "下面板背景色", default: "#fff" },
          { key: "leftop", title: "左面板透明度", default: "1" },
          { key: "rightop", title: "右面板透明度", default: "1" },
          { key: "bottomop", title: "下面板透明度", default: "1" },
        ];
        console.log(error);
      }
    },
    eventChange() {
      const config = { attributes: true, childList: true, subtree: true };
      const [left, right, bottom] = [
        $(this.$el).find(".tpanel-left-horizontal")[0],
        $(this.$el).find(".tpanel-right-horizontal")[0],
        $(this.$el).find(".tpanel-container-horizontal")[0],
      ];

      const callback = (mutationsList, observer) => {
        const dom = mutationsList[0].target;
        const keyName = dom.getAttribute("data-key-name");
        if (mutationsList[0].attributeName !== "class") return;
        this.paramList.forEach((element) => {
          const result = dom.classList.value.includes("panel-content-none");
          if (element.key === keyName) {
            element.default = result ? "close" : "open";
          }

          // 左右侧面板缩放后重新设置中间面板位置及宽度
          if (keyName === "leftbol") {
            let width = +$(".tpanel-container-horizontal").width().toFixed(0);
            let left = $(".tpanel-container-horizontal").position().left;
            let realLeft = result ? left - +element.default : left + +element.default;
            if (realLeft < 10 || realLeft > +element.default + 10) return;
            const style = result
              ? { width: `${width + +element.default}px`, left: realLeft + "px" }
              : { width: `${width - +element.default}px`, left: realLeft + "px" };
            $(".tpanel-container-horizontal").css(style);
          }

          if (keyName === "rightbol") {
            let width = +$(".tpanel-container-horizontal").width().toFixed(0);
            let pwidth = +(
              $(".tpanel-container-horizontal").parent().width() -
              20 -
              this.paramList.filter((i) => i.key === "left")[0]?.default
            ).toFixed(0);
            let realWidth = result ? width + +element.default : width - +element.default;
            if (realWidth > pwidth || realWidth < pwidth - +element.default) return;
            $(".tpanel-container-horizontal").css("width", realWidth);
          }
        });

        this.$root.componentsArr.forEach((target) => {
          if (target.id === this.data.id && this.$root.attrObject.id === this.data.id) {
            this.$root.paramList = [...this.paramList];
            this.$set(this.$root.attrObject, "paramList", JSON.stringify(this.paramList));
            this.$set(target.data, "paramList", JSON.stringify(this.paramList));
          }
        });
      };
      const observer = new MutationObserver(callback);
      observer.observe(left, config);
      observer.observe(right, config);
      observer.observe(bottom, config);
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
    this.eventChange();
    this.updatePanel();
  },
});
