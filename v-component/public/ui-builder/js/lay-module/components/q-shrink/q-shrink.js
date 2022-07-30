Vue.component("q-shrink", {
  template: `
        <div
          class="draggable2 can-drop q-shrink"
          :id="id"
          :index="index"
          :style="style"
          style="background: rgba(0, 0, 0, 0); overflow: hidden"
          :data-data="JSON.stringify(data)"
          :data-x="data.x||0"
          :data-y="data.y||0"
          :data-element-type="data.elementType||'q-shrink'"
        >
          <link
            href="${location.origin}/ui-builder/js/lay-module/components/q-shrink/q-shrink.css"
            rel="stylesheet"
          />
          <div class="panel-put-away is-absolute" :class="positionObj[position].class">
            <a-icon :type="positionObj[position].icon"> </a-icon>
          </div>
          <div
            v-if="options.length"
            class="dropzone q-shrink-content"
            ref="shrinkContent"
            :id="options[0].tabsId"
            :style="positionObj[position].styles"
          ></div>
          <script
            src="${location.origin}/ui-builder/js/lay-module/components/q-shrink/q-shrink-external.js"
            type="application/javascript"
          ></script>
        </div>
          `,
  props: {
    data: Object,
    index: Number,
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || [{ tabsId: createHashId() }],
      paramList: this.data.paramList || [],
      style: this.data.style,
      isShow: true,
      position: "left",
      positionObj: {
        left: { styles: "width:calc(100% - 8px);height:100%", icon: "caret-left", class: "left-ui" },
        right: {
          styles: "width:calc(100% - 8px);height:100%;margin-left: 8px;",
          icon: "caret-right",
          class: "right-ui",
        },
        top: {
          styles: "height:calc(100% - 8px);width:100%",
          icon: "caret-up",
          class: "top-ui",
        },
        bottom: {
          styles: "height:calc(100% - 8px);width:100%;margin-top: 8px",
          icon: "caret-down",
          class: "bottom-ui",
        },
      },
      obj: { left: "width", right: "width", top: "height", bottom: "height" },
      positionMap: { right: "left", bottom: "top" },
      oldWidth: 0,
      oldTrans: 0,
    };
  },
  watch: {
    options(val) {
      this.data.options = val;
    },
    "data.options": function () {
      try {
        this.data.childList = JSON.parse(_.cloneDeep(this.options));
      } catch (error) {}
    },
    data: {
      handler(newValue, oldValue) {
        try {
          const { style, paramList } = newValue;
          this.paramList = paramList;
          this.style = style;
          this.updatePanel();
        } catch (error) {}
      },
      deep: true,
    },
    "$store.state.percentOrabsolute": function () {
      this.changeParamList();
    },
  },
  methods: {
    getParamListData(paramList = []) {
      return paramList.reduce((pre, cur) => {
        const { key, default: value } = cur;
        pre[key] = value;
        return pre;
      }, {});
    },
    eventChange() {
      const callback = (mutationsList) => {
        for (const item of mutationsList) {
          if (item.attributeName === "class" && item.target.id === this.id + "s") {
            setTimeout(() => {
              this.changeParamList();
            }, 500);
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(this.$refs.shrinkContent, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    },
    changeParamList() {
      if (!this.$refs.shrinkContent) return;
      const { isShow, position } = this.getParamListData(this.paramList);
      isShow === "close"
        ? this.$refs.shrinkContent.classList.add("q-shrink-content-hide")
        : this.$refs.shrinkContent.classList.remove("q-shrink-content-hide");
      const flag = this.$refs.shrinkContent.className.includes("q-shrink-content-hide");
      const parent = this.$el;
      for (let iterator of this.paramList) {
        if (iterator.key === "oldValue") {
          if (vm.percentOrabsolute === "absolute") {
            switch (isShow) {
              case "open":
                iterator.default = Number(parent.getBoundingClientRect()[this.obj[position]]).toFixed(3) + "px";
                break;
              case "close":
                if (iterator.default.includes("%")) {
                  iterator.default =
                    (
                      Number(iterator.default.replace("%", "")) *
                      Number(parent.parentElement.getBoundingClientRect()[this.obj[position]])
                    ).toFixed(3) + "px";
                }
                break;
            }
          } else {
            switch (isShow) {
              case "open":
                iterator.default =
                  (
                    Number(parent.getBoundingClientRect()[this.obj[position]]) /
                    Number(parent.parentElement.getBoundingClientRect()[this.obj[position]])
                  ).toFixed(3) + "%";
                break;
              case "close":
                if (iterator.default.includes("px")) {
                  iterator.default =
                    (
                      Number(iterator.default.replace("px", "")) /
                      Number(parent.parentElement.getBoundingClientRect()[this.obj[position]])
                    ).toFixed(3) + "%";
                }
                break;
            }
          }
        }
        iterator.key === "isShow" && (iterator.default = flag ? "close" : "open");
      }
      this.setParamList();
    },
    setParamList() {
      this.$root.componentsArr.forEach((target) => {
        if (target.id === this.data.id) {
          // this.$root.paramList = [...this.paramList];
          // this.$set(this.$root.attrObject, "paramList", JSON.stringify(this.paramList));
          this.$set(target.data, "paramList", JSON.stringify(this.paramList));
        }
      });
    },
    updatePanel() {
      try {
        if (_.isString(this.paramList)) {
          this.paramList = JSON.parse(this.paramList);
        }
        const checkPosition = ["left", "right", "top", "bottom"];
        const { isShow, position } = this.getParamListData(this.paramList);
        //todo 切换上下时置换宽和高
        this.isShow = isShow;
        if (checkPosition.includes(position)) {
          this.position = position;
        }
        this.changeParamList();
      } catch (error) {
        this.paramList = [
          { key: "position", title: "收缩方向", default: "left", visible: true },
          { key: "isShow", title: "默认显示", default: "open", visible: false },
          { key: "oldValue", title: "高宽", default: "", visible: false },
        ];
        console.log(error);
      }
    },
  },
  mounted() {
    if (_.isString(this.data.options) || _.isString(this.options)) {
      this.options = JSON.parse(this.data.options);
    }
    if (!this.options[0].tabsId) {
      this.options = [
        {
          tabsId: createHashId(),
        },
      ];
    }
    this.data.childList = _.cloneDeep(this.options);
    this.data.options = _.cloneDeep(this.options);
    this.$nextTick(() => {
      this.updatePanel();
      this.eventChange();
    });
  },
});
