/**
 * q-pop-panel
 */
Vue.component("q-pop-panel", {
  template: ` 
          <div class="draggable2 dropzone nochanges can-drop" :id="data.id" :index="index" :style="data.style" :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0" data-element-type="jz-pop-panel" ref="panelRef"> 
            <div v-if="$root.editMode!=='read'" class="screen" style="position: absolute; width: 30px; height: 30px; border: 1px solid; right: 0px; cursor: pointer; display: none;">
                <a-icon :type="iconStr" :style="{ fontSize: '28px' }"/>
            </div>
            <!-- 动态组件 -->
            <component :is="item.name" v-for="item,index in data.childrenElement"
                :index="index" :data="item.data||{}" :key="index">
            </component>
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
          const { style, childrenElement } = newValue;
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
      options: this.data.options || [],
      style: this.data.style,
      iconStr: "fullscreen",
    };
  },
  methods: {
    bindFullScreen() {
      let oldObj = {};
      // 包裹容器放大事件
      this.$refs.panelRef.addEventListener("mouseenter", (e) => {
        const currentTarget = e.currentTarget;
        const parentTarget = currentTarget.parentElement;
        const { offsetWidth, offsetHeight } = parentTarget;
        const fullScreen = $(currentTarget).find(".screen");
        fullScreen
          .show()
          .off()
          .on("click", (e) => {
            if (this.iconStr === "fullscreen") {
              const [x, y] = $(currentTarget)
                .css("transform")
                .replace(/[^0-9\-,.]/g, "")
                .split(",")
                .splice(-2);
              oldObj = {
                width: $(currentTarget).width(),
                height: $(currentTarget).height(),
                x,
                y,
              };
              $(currentTarget).css({
                height: `${offsetHeight}px`,
                width: `${offsetWidth}px`,
                transform: `translate(0px, 0px)`,
              });
              $(currentTarget).attr("data-x", 0);
              $(currentTarget).attr("data-y", 0);
              this.iconStr = "fullscreen-exit";
            } else {
              const { width, height, x, y } = oldObj;
              $(currentTarget).css({
                height: `${height}px`,
                width: `${width}px`,
                transform: `translate(${x}px, ${y}px)`,
              });
              $(currentTarget).attr("data-x", x);
              $(currentTarget).attr("data-y", y);
              this.iconStr = "fullscreen";
            }
          });
      });
      this.$refs.panelRef.addEventListener("mouseleave", (e) => {
        const currentTarget = e.currentTarget;
        $(currentTarget).find(".screen").hide();
      });
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
    this.bindFullScreen();
  },
});
