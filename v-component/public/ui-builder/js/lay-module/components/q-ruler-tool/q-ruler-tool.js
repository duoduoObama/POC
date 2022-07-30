/**
 * 按钮
 */
 Vue.component("q-ruler-tool", {
  template: `
  <div :style="wrapperStyle" class="vue-ruler-wrapper" onselectstart="return false;">
  <span role="img" aria-label="eye" class="anticon-eye"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></span>
  <link href="${location.origin}/ui-builder/js/lay-module/components/q-ruler-tool/q-ruler-tool.css" rel="stylesheet"> 
  <section v-show="rulerToggle">
    <div ref="horizontalRuler" class="vue-ruler-h" @mousedown.stop="horizontalDragRuler">
      <span v-for="(item,index) in xScale" :key="index" :style="{left:index * 50 + 2 + 'px'}" class="n">{{ item.id }}</span>
    </div>
    <div ref="verticalRuler" class="vue-ruler-v" @mousedown.stop="verticalDragRuler">
      <span v-for="(item,index) in yScale" :key="index" :style="{top:index * 50 + 2 + 'px'}" class="n">{{ item.id }}</span>
    </div>
    <div :style="{top:verticalDottedTop + 'px'}" class="vue-ruler-ref-dot-h" />
    <div :style="{left:horizontalDottedLeft + 'px'}" class="vue-ruler-ref-dot-v" />
    <div
      v-for="item in lineList"
      :title="item.title"
      :style="getLineStyle(item)"
      :key="item.id"
      :class="'vue-ruler-ref-line-'+item.type"
      @mousedown="handleDragLine(item)"></div>
  </section>
  <div ref="content" class="vue-ruler-content" :style="contentStyle">
    <slot />
  </div>
  <div v-show="isDrag" class="vue-ruler-content-mask"></div>
</div>
  `,
  components: {},
  props: {
    layoutSize: {
      type: Object,
      defalut: () => {
        return { offsetHeight: 1080, offsetWidth: 1920 };
      },
    },
    position: {
      type: String,
      default: "relative",
      validator: function (val) {
        return ["absolute", "fixed", "relative", "static", "inherit"].indexOf(val) !== -1;
      },
    }, // 规定元素的定位类型
    isHotKey: {
      type: Boolean,
      default: true,
    }, // 热键开关
    isScaleRevise: {
      type: Boolean,
      default: false,
    }, // 刻度修正(根据content进行刻度重置)
    value: {
      type: Array,
      default: () => {
        return []; // { type: 'h', site: 50 }, { type: 'v', site: 180 }
      },
    }, // 预置参考线
    contentLayout: {
      type: Object,
      default: () => {
        return { top: 0, left: 0 };
      },
    }, // 内容部分布局
    parent: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    stepLength: {
      type: Number,
      default: 50,
      validator: (val) => val % 10 === 0,
    }, // 步长
  },
  data() {
    return {
      size: 17,
      left_top: 18, // 内容左上填充
      windowWidth: 0, // 窗口宽度
      windowHeight: 0, // 窗口高度
      xScale: [], // 水平刻度
      yScale: [], // 垂直刻度
      topSpacing: 0, // 标尺与窗口上间距
      leftSpacing: 0, //  标尺与窗口左间距
      isDrag: false,
      dragFlag: "", // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
      horizontalDottedLeft: -999, // 水平虚线位置
      verticalDottedTop: -999, // 垂直虚线位置
      rulerWidth: 0, // 垂直标尺的宽度
      rulerHeight: 0, // 水平标尺的高度
      dragLineId: "", // 被移动线的ID
      keyCode: {
        r: 82,
      }, // 快捷键参数
      rulerToggle: true, // 标尺辅助线显示开关
    };
  },
  computed: {
    wrapperStyle() {
      const { offsetHeight, offsetWidth } = this.layoutSize || document.querySelector("#inner-dropzone");
      if (offsetHeight <= 0) {
        return {
          width: this.windowWidth + "px",
          height: this.windowHeight + "px",
          position: this.position,
        };
      }
      return {
        width: offsetWidth + "px",
        height: offsetHeight + "px",
        position: this.position,
      };
    },
    contentStyle() {
      return {
        left: this.contentLayout.left + "px",
        top: this.contentLayout.top + "px",
        padding: this.left_top + "px 0px 0px " + this.left_top + "px",
      };
    },
    lineList() {
      let hCount = 0;
      let vCount = 0;
      return this.value.map((item) => {
        const isH = item.type === "h";
        return {
          id: `${item.type}_${isH ? hCount++ : vCount++}`,
          type: item.type,
          title: item.site.toFixed(2) + "px",
          [isH ? "top" : "left"]: item.site / (this.stepLength / 50) + this.size,
        };
      });
    },
  },
  watch: {
    visible: {
      handler(visible) {
        this.rulerToggle = visible;
      },
      immediate: true,
    },
    layoutSize() {
      this.xScale = [];
      this.yScale = [];
      this.init();
    },
  },
  mounted() {
    on(document, "mousemove", this.dottedLineMove);
    on(document, "mouseup", this.dottedLineUp);
    on(document, "keyup", this.keyboard);
    this.init();
    on(window, "resize", this.windowResize);
  },
  beforeDestroy() {
    off(document, "mousemove", this.dottedLineMove);
    off(document, "mouseup", this.dottedLineUp);
    off(document, "keyup", this.keyboard);
    off(window, "resize", this.windowResize);
  },
  methods: {
    init() {
      this.box();
      this.scaleCalc();
    },
    windowResize() {
      this.xScale = [];
      this.yScale = [];
      this.init();
    },
    getLineStyle({ type, top, left }) {
      return type === "h" ? { top: top + "px" } : { left: left + "px" };
    },
    handleDragLine(item) {
      const { type, id } = item;
      return type === "h" ? this.dragHorizontalLine(id) : this.dragVerticalLine(id);
    },
    box() {
      if (this.isScaleRevise) {
        // 根据内容部分进行刻度修正
        const content = this.$refs.content;
        const contentLeft = content.offsetLeft;
        const contentTop = content.offsetTop;
        this.getCalcRevise(this.xScale, contentLeft);
        this.getCalcRevise(this.yScale, contentTop);
      }
      if (this.parent) {
        const style = window.getComputedStyle(this.$el.parentNode, null);
        this.windowWidth = parseInt(style.getPropertyValue("width"), 10);
        this.windowHeight = parseInt(style.getPropertyValue("height"), 10);
      } else {
        this.windowWidth = document.documentElement.clientWidth - this.leftSpacing;
        this.windowHeight = document.documentElement.clientHeight - this.topSpacing;
      }
      this.rulerWidth = this.$refs.verticalRuler.clientWidth;
      this.rulerHeight = this.$refs.horizontalRuler.clientHeight;
      this.setSpacing();
    }, // 获取窗口宽与高
    setSpacing() {
      this.topSpacing = this.$refs.horizontalRuler.getBoundingClientRect().y; //.offsetParent.offsetTop
      this.leftSpacing = this.$refs.verticalRuler.getBoundingClientRect().x; // .offsetParent.offsetLeft
    },
    scaleCalc() {
      const { offsetHeight, offsetWidth } = this.layoutSize || document.querySelector("#inner-dropzone");
      this.getCalc(this.xScale, offsetWidth);
      this.getCalc(this.yScale, offsetHeight);
    }, // 计算刻度
    getCalc(array, length) {
      for (let i = 0; i < (length * this.stepLength) / 50; i += this.stepLength) {
        if (i % this.stepLength === 0) {
          array.push({ id: i });
        }
      }
    }, // 获取刻度方法
    getCalcRevise(array, length) {
      for (let i = 0; i < length; i += 1) {
        if (i % this.stepLength === 0 && i + this.stepLength <= length) {
          array.push({ id: i });
        }
      }
    }, // 获取矫正刻度方法
    newLine(val) {
      this.isDrag = true;
      this.dragFlag = val;
    }, // 生成一个参考线
    dottedLineMove($event) {
      this.setSpacing();
      switch (this.dragFlag) {
        case "x":
        case "h":
          if (this.isDrag) {
            this.verticalDottedTop = $event.pageY - this.topSpacing;
          }
          break;
        case "y":
        case "v":
          if (this.isDrag) {
            this.horizontalDottedLeft = $event.pageX - this.leftSpacing;
          }
          break;
        default:
          break;
      }
    }, // 虚线移动
    dottedLineUp($event) {
      this.setSpacing();
      if (this.isDrag) {
        this.isDrag = false;
        const { clientY, clientX } = $event;
        const cloneList = JSON.parse(JSON.stringify(this.value));
        switch (this.dragFlag) {
          case "x":
            const horizontalRuler = this.$refs.horizontalRuler.getBoundingClientRect();
            if (clientY <= horizontalRuler.y + 18) {
              break;
            }
            cloneList.push({
              type: "h",
              site: ($event.pageY - this.topSpacing - this.size) * (this.stepLength / 50),
            });
            this.$emit("input", cloneList);
            break;
          case "y":
            const verticalRuler = this.$refs.verticalRuler.getBoundingClientRect();
            if (clientX <= verticalRuler.x + 18) {
              break;
            }
            cloneList.push({
              type: "v",
              site: ($event.pageX - this.leftSpacing - this.size) * (this.stepLength / 50),
            });
            this.$emit("input", cloneList);
            break;
          case "h":
            this.dragCalc(cloneList, $event.pageY, this.topSpacing, this.rulerHeight, "h");
            this.$emit("input", cloneList);
            break;
          case "v":
            this.dragCalc(cloneList, $event.pageX, this.leftSpacing, this.rulerWidth, "v");
            this.$emit("input", cloneList);
            break;
          default:
            break;
        }
        this.verticalDottedTop = this.horizontalDottedLeft = -10;
      }
    }, // 虚线松开
    dragCalc(list, page, spacing, ruler, type) {
      if (page - spacing < ruler) {
        let Index, id;
        this.lineList.forEach((item, index) => {
          if (item.id === this.dragLineId) {
            Index = index;
            id = item.id;
          }
        });
        list.splice(Index, 1, {
          type: type,
          site: -600,
        });
      } else {
        let Index, id;
        this.lineList.forEach((item, index) => {
          if (item.id === this.dragLineId) {
            Index = index;
            id = item.id;
          }
        });
        list.splice(Index, 1, {
          type: type,
          site: (page - spacing - this.size) * (this.stepLength / 50),
        });
      }
    },
    horizontalDragRuler() {
      this.newLine("x");
    }, // 水平标尺处按下鼠标
    verticalDragRuler() {
      this.newLine("y");
    }, // 垂直标尺处按下鼠标
    dragHorizontalLine(id) {
      this.isDrag = true;
      this.dragFlag = "h";
      this.dragLineId = id;
    }, // 水平线处按下鼠标
    dragVerticalLine(id) {
      this.isDrag = true;
      this.dragFlag = "v";
      this.dragLineId = id;
    }, // 垂直线处按下鼠标
    keyboard($event) {
      if ($("textarea,input").is(":focus")) {
        return;
      }
      if (this.isHotKey) {
        switch ($event.keyCode) {
          case this.keyCode.r:
            this.rulerToggle = !this.rulerToggle;
            this.$emit("update:visible", this.rulerToggle);
            if (this.rulerToggle) {
              this.left_top = 18;
            } else {
              this.left_top = 0;
            }
            break;
        }
      }
    }, // 键盘事件
  },
});

/**
 * @description 绑定事件 on(element, event, handler)
 */
const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();
