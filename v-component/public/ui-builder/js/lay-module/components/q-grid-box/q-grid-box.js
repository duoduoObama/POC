/**
 * 弹力盒子
 */
var { mapState } = Vuex;
Vue.component("q-grid-box", {
  template: ` 
<!--   <a-dropdown :trigger="trigger">-->
     <div :class="dynamicClass" :id="data.id" ref="boxRef" :data-element-type="data.name" ondragover="allowDrop" :index="index" :style="data.style" :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">    
     </div> 
<!--     <a-menu slot="overlay" @click="handleMenuClick">-->
<!--       <a-menu-item key="1">-->
<!--         编辑-->
<!--       </a-menu-item>-->
<!--       <a-menu-item key="2">-->
<!--         退出编辑-->
<!--       </a-menu-item> -->
<!--     </a-menu>-->
<!--   </a-dropdown> -->
         `,
  props: {
    data: Object,
    index: Number,
    handleMenu: Object,
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style } = newValue;
          this.style = style;
          this.setStartCss();
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
    curMenu(val) {
      if (this.data.id !== this.$root.curComponent.id) {
        return;
      }
      this.handleMenuClick(val);
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || [],
      style: this.data.style,
      dynamicClass: `draggable2 dropzone nochanges`,
      trigger: ["contextmenu"],
    };
  },
  methods: {
    setStartCss() {
      let { options = {} } = this.data;
      if (typeof options === `string`) {
        try {
          options = JSON.parse(options);
        } catch (error) {
          console.log(error);
        }
      }
      const { row = 3, col = 3 } = options;
      const tempStyle = {
        display: `grid`,
        gridTemplateColumns: `repeat(${col}, 1fr)`,
        gridTemplateRows: `repeat(${row}, 1fr)`,
      };
      Object.keys(tempStyle).forEach((current) => {
        this.$refs.boxRef.style[current] = tempStyle[current];
      });
      const tempNode = document.createElement("div");
      tempNode.style.cssText = `${this.$refs.boxRef.style.cssText};${this.style};`;
      this.style = tempNode.style.cssText; 
    },
    startEdit() {
      this.dynamicClass = `draggable-grid dropzone nochanges`;
    },
    endEdit() {
      this.dynamicClass = `draggable2 dropzone nochanges`;
    },
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.startEdit();
          break;
        case "2":
          this.endEdit();
          break;
      }
    },
    observerDom() {
      const config = {
        // attributes: true,
        childList: true,
        subtree: true,
      };
      const callback = (e, q) => {
        const [{ removedNodes = [{}], addedNodes = [] }] = e;
        setTimeout(() => {
          addedNodes.forEach((element) => {
            if (!$(element).hasClass("swiper-pagination-bullet")) {
              element.style = JSON.parse($(element).attr("data-data")).style;
              $(element).removeClass("draggable2").addClass("draggable-grid").css({
                transform: "",
                position: "relative",
              });
            }
          });
        }, 50);
      };
      const observer = new MutationObserver(callback);
      observer && observer.observe(this.$refs.boxRef, config);
    },
    setGridBoxInterrect() {
      function updateResizable(event) {
        const target = event.target;

        // update the element's style
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        // translate when resizing from top or left edges
      }
      interact("[data-element-type=弹力盒子] .draggable-grid").resizable({
        margin: 0,
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: updateResizable,
          end: (e) => {
            setAttr(e.target);
            const index = $(e.target).attr("index");
            if (index) {
              // this.$root.componentsArr[index].data.style = $(e.target).attr("style");
              return;
            }
          },
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),

          // minimum size
          interact.modifiers.restrictSize({
            // min: { width: 100, height: 100 },
            //   max: {
            //     width: $("#inner-dropzone").width(),
            //     height: $("#inner-dropzone").height(),
            //   },
          }),
        ],
        inertia: true,
      });
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "object",
        properties: {
          row: { type: "integer" },
          col: { type: "integer" },
        },
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
  },
  mounted() {
    this.receiveInfo();
    this.observerDom();
    this.setStartCss();
    if (!document.querySelector(`.headers-content`)) {
      this.trigger = [];
    } else {
      dragula([this.$refs.boxRef]);
      this.setGridBoxInterrect();
    }
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
