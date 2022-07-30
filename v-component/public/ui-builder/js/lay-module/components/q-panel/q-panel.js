/**
 * 按钮
 */
Vue.component("q-panel", {
  template: ` 
          <div class="draggable2 dropzone nochanges can-drop"
          style="background-color:#FFFFFF;"
          :id="data.id" :index="index" :style="data.style" :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0" data-element-type="jz-panel" ref="panelRef"> 
            <div v-if="$root.editMode!=='read'" class="screen" style="position: absolute; width: 30px; height: 30px; border: 1px solid; right: 0px; cursor: pointer; display: none;">
              <a-icon :type="iconStr" :style="{ fontSize: '28px' }"/>
            </div>
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
          if (_.isString(paramList)) {
            this.paramList = JSON.parse(paramList);
          } else {
            this.paramList = paramList;
          }
          this.style = style;
          this.changeParamList();
        } catch (error) {}
      },
      deep: true,
    },
    "$store.state.percentOrabsolute": function () {
      this.changeParamList();
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      paramList: this.data.paramList || [],
      style: this.data.style,
      iconStr: "fullscreen",
    };
  },
  methods: {
    bindFullScreen() {
      this.$refs.panelRef.addEventListener("mouseenter", (e) => {
        const currentTarget = e.currentTarget;
        $(currentTarget).find(".screen").show();
      });
      this.$refs.panelRef.addEventListener("mouseleave", (e) => {
        const currentTarget = e.currentTarget;
        $(currentTarget).find(".screen").hide();
      });

      // 包裹容器放大缩小事件
      const currentTarget = this.$el;
      const fullScreen = $(currentTarget).find(".screen");
      fullScreen.off().on("click", (e) => {
        const currentTarget = e.currentTarget.parentElement;
        const parentTarget = currentTarget.parentElement;
        const { scrollWidth, scrollHeight } = parentTarget;
        const { oldX, oldY, oldWidth, oldHeight } = this.getParamListData(this.paramList);
        const isPosition = $(currentTarget).css("transform") === "none";
        if (this.iconStr === "fullscreen") {
          if (!isPosition) {
            $(currentTarget).css({
              height: `${scrollHeight}px`,
              width: `${scrollWidth}px`,
              transform: `translate(0px, 0px)`,
            });
          } else {
            $(currentTarget).css({
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
            });
          }
          $(currentTarget).attr("data-x", 0);
          $(currentTarget).attr("data-y", 0);
          this.iconStr = "fullscreen-exit";
        } else {
          if (!isPosition) {
            $(currentTarget).css({
              height: oldHeight.includes("px") ? oldHeight : oldHeight + "px",
              width: oldWidth.includes("px") ? oldWidth : oldWidth + "px",
              transform: `translate(${oldX.includes("px") ? oldX : oldX + "px"}, ${
                oldY.includes("px") ? oldY : oldY + "px"
              }`,
            });
            $(currentTarget).attr("data-x", Number(oldX.replace("px", "")));
            $(currentTarget).attr("data-y", Number(oldY.replace("px", "")));
          } else {
            $(currentTarget).css({
              height: oldHeight.includes("%") ? oldHeight : oldHeight + "%",
              width: oldWidth.includes("%") ? oldWidth : oldWidth + "%",
              left: oldX.includes("%") ? oldX : oldX + "%",
              top: oldY.includes("%") ? oldY : oldY + "%",
            });
            $(currentTarget).attr("data-x", (Number(oldX.replace("%", "")) / 100) * scrollWidth);
            $(currentTarget).attr("data-y", (Number(oldY.replace("%", "")) / 100) * scrollHeight);
          }
          this.iconStr = "fullscreen";
        }
        this.data.style = currentTarget.style.cssText;
      });
    },
    getParamListData(paramList = []) {
      return paramList.reduce((pre, cur) => {
        const { key, default: value } = cur;
        pre[key] = value;
        return pre;
      }, {});
    },
    changeParamList() {
      if (!this.$refs.panelRef) return;
      let tempX = null;
      let tempY = null;
      let tempWidth = null;
      let tempHeight = null;
      if (vm.percentOrabsolute === "absolute") {
        [tempX, tempY, tempWidth, tempHeight] = this.absoluteHandle();
      } else {
        [tempX, tempY, tempWidth, tempHeight] = this.percentHandle();
      }
      for (let iterator of this.paramList) {
        switch (iterator.key) {
          case "state":
            iterator.default = this.iconStr;
            break;
          case "oldX":
            if (tempX && tempY && tempWidth && tempHeight) {
              iterator.default = tempX;
            }
            break;
          case "oldY":
            if (tempX && tempY && tempWidth && tempHeight) {
              iterator.default = tempY;
            }
            break;
          case "oldWidth":
            if (tempX && tempY && tempWidth && tempHeight) {
              iterator.default = tempWidth;
            }
            break;
          case "oldHeight":
            if (tempX && tempY && tempWidth && tempHeight) {
              iterator.default = tempHeight;
            }
            break;
        }
      }
      this.setParamList();
    },
    absoluteHandle() {
      const { oldX, oldY, oldWidth, oldHeight } = this.getParamListData(this.paramList);
      const parent = this.$el;
      let tempX = null;
      let tempY = null;
      let tempWidth = null;
      let tempHeight = null;
      switch (this.iconStr) {
        case "fullscreen":
          const [x, y] = $(parent)
            .css("transform")
            .replace(/[^0-9\-,.]/g, "")
            .split(",")
            .splice(-2);
          if (x && y) {
            tempX = x;
            tempY = y;
          }
          tempWidth = $(parent).css("width");
          tempHeight = $(parent).css("height");
          break;
        case "fullscreen-exit":
          if (oldWidth.includes("%") && oldHeight.includes("%")) {
            tempX =
              ((Number(oldX.replace("%", "")) / 100) * Number(parent.parentElement.scrollWidth)).toFixed(3) + "px";
            tempY =
              ((Number(oldY.replace("%", "")) / 100) * Number(parent.parentElement.scrollHeight)).toFixed(3) + "px";
            tempWidth =
              ((Number(oldWidth.replace("%", "")) / 100) * Number(parent.parentElement.scrollWidth)).toFixed(3) + "px";
            tempHeight =
              ((Number(oldHeight.replace("%", "")) / 100) * Number(parent.parentElement.scrollHeight)).toFixed(3) +
              "px";
          }
          break;
      }
      return [tempX, tempY, tempWidth, tempHeight];
    },
    percentHandle() {
      const { oldX, oldY, oldWidth, oldHeight } = this.getParamListData(this.paramList);
      const parent = this.$el;
      let tempX = null;
      let tempY = null;
      let tempWidth = null;
      let tempHeight = null;
      switch (this.iconStr) {
        case "fullscreen":
          // 初次渲染时此处百分比并未转化完成，直接取值还是空值和px, 所以取translate和width、height的值进行计算
          const [x, y] = $(parent)
            .css("transform")
            .replace(/[^0-9\-,.]/g, "")
            .split(",")
            .splice(-2);
          const [left, top] = [parent.style.left, parent.style.top];
          if (x && y) {
            tempX = ((Number(x) / Number(parent.parentElement.scrollWidth)) * 100).toFixed(3) + "%";
            tempY = ((Number(y) / Number(parent.parentElement.scrollHeight)) * 100).toFixed(3) + "%";
          } else if (left && top) {
            tempX = left;
            tempY = top;
          }
          tempWidth =
            (
              (Number($(parent).css("width").replace("px", "")) / Number(parent.parentElement.scrollWidth)) *
              100
            ).toFixed(3) + "%";
          tempHeight =
            (
              (Number($(parent).css("height").replace("px", "")) / Number(parent.parentElement.scrollHeight)) *
              100
            ).toFixed(3) + "%";
          break;
        case "fullscreen-exit":
          if (oldWidth.includes("px") && oldHeight.includes("px")) {
            tempX =
              ((Number(oldX.replace("px", "")) / Number(parent.parentElement.scrollWidth)) * 100).toFixed(3) + "%";
            tempY =
              ((Number(oldY.replace("px", "")) / Number(parent.parentElement.scrollHeight)) * 100).toFixed(3) + "%";
            tempWidth =
              ((Number(oldWidth.replace("px", "")) / Number(parent.parentElement.scrollWidth)) * 100).toFixed(3) + "%";
            tempHeight =
              ((Number(oldHeight.replace("px", "")) / Number(parent.parentElement.scrollHeight)) * 100).toFixed(3) +
              "%";
          }
          break;
      }
      return [tempX, tempY, tempWidth, tempHeight];
    },
    setParamList() {
      this.$root.componentsArr.forEach((target) => {
        if (target.id === this.data.id && this.$root.attrObject.id === this.data.id) {
          this.$set(this.$root.attrObject, "paramList", JSON.stringify(this.paramList));
          this.$set(target.data, "paramList", JSON.stringify(this.paramList));
        }
      });
    },
    updatePanel() {
      try {
        if (_.isString(this.paramList)) {
          this.paramList = JSON.parse(this.paramList);
        }
        const { state } = this.getParamListData(this.paramList);
        this.iconStr = state;
        this.changeParamList();
      } catch (error) {
        this.paramList = [
          { key: "state", title: "放大缩小状态", default: "fullscreen", visible: false },
          { key: "oldX", title: "缩小状态X坐标", default: 0, visible: false },
          { key: "oldY", title: "缩小状态Y坐标", default: 0, visible: false },
          { key: "oldWidth", title: "缩小状态宽度", default: 0, visible: false },
          { key: "oldHeight", title: "缩小状态高度", default: 0, visible: false },
        ];
        console.log(error);
      }
    },
  },
  mounted() {
    this.bindFullScreen();
    this.updatePanel();
  },
});
