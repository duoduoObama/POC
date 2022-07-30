var { Splitpanes, Pane } = splitpanes;
var vm = new Vue({
  el: "#myApp",
  store,
  components: {
    CompactPicker: VueColor.Compact,
    Splitpanes,
    Pane,
  },
  data: {
    topPanel: true,
    bottomPanel: true,
    leftPanel: true,
    rightPanel: true,
    allDraggableElement: {},
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    treeData: [],
    pageInfoPromise: null,
    theme: {},
    themeSetting: false,
    activeKey: ["4"],
    componentsArr: [],
    componentsHideArr: [],
    sendMessageTaget: null,
    message: null,
    visible: false,
    confirmLoading: false,
    isThemeColor: false,
    isCanvasColor: false,
    isRuler: false,
    isFullScreen: false,
    showEditComModal: false,
    // leftWidth: 3, // 左边面板宽度
    middleWidth: 80, // （上中下）中间面板宽度
    rightWidth: 20, // 右边面板宽度
    middleCenterHeight: 90, // 中间画板面板宽度
    middleBottomHeight: 20, // 下边面板宽度
    spinning: false,
    spinningMenu: false,
    themeConfig: {
      themeColors: document.documentElement.style.getPropertyValue("--theme-color"),
      canvasColors: document.documentElement.style.getPropertyValue("--canvas-color"),
      isGrid: true,
    },
    modelVisible: false,
    events: [],
    attrObject: {},
    comTree: [],
    publicPage: [],
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    form: {},
    addParamListModal: false,
    addParam: { key: "", title: "", default: "" },
    dexie: null,
    lines: ["xt", "xc", "xb", "yl", "yc", "yr"], // 分别对应三条横线和三条竖线
    diff: 3, // 相距 dff 像素将自动吸附
    lineStatus: {
      xt: false,
      xc: false,
      xb: false,
      yl: false,
      yc: false,
      yr: false,
    },
    customEvents: eventList,
    customParamRules: {
      interval: {
        method: [
          {
            required: true,
            message: "请选择请求类型",
            trigger: "change",
          },
        ],
        intervalUrl: [
          {
            required: true,
            message: "请输入轮询路径",
            trigger: "change",
          },
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
            required: true,
            message: "请输入正确轮询路径",
            trigger: "blur",
          },
        ],
      },
      alert: {
        message: [
          {
            required: true,
            message: "请输入警告消息",
            trigger: "change",
          },
        ],
      },
      redirect: {
        url: [
          {
            required: true,
            message: "请输入跳转路径",
            trigger: "change",
          },
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
            required: true,
            message: "请输入正确跳转路径",
            trigger: "blur",
          },
        ],
      },
      triggerEvent: {
        select: [
          {
            required: true,
            message: "请选择执行方法",
            trigger: "change",
          },
        ],
      },
    },
    leftPanelSvg: {
      数据源: "#icon-shujuyuan",
      文本: "#icon-wenben",
      基础组件: "#icon-wenben",
      容器: "#icon-rongqi0",
      deepCharts: "#icon-deepchart",
      媒体: "#icon-tupian",
      媒体组件: "#icon-tupian",
      tab: "#icon-tab",
      DI组件: "#icon-Icon-pingtaizujian",
      表单: "#icon-caidanlei-copy",
    },
    presetLine: [],
    percentOrabsolute: "absolute",
    autoSaveObserver: null,
    showTitle: false,
    componentTitle: {
      id: "",
      title: "",
      showTitle: false,
    },
    keyMoveStatus: false, // 方向键移动启用状态
    spaceKeyStatus: false,
  },
  mixins: [componentsMixin, combinationComMixin, comDIMixin, designMixin],
  watch: {
    themeConfig: {
      async handler(newValue, oldValue) {
        const rgbaCanvas = newValue.canvasColors.rgba || this.themeConfig.canvasColors;
        const rgbaTheme = newValue.themeColors.rgba || this.themeConfig.themeColors;
        const isGrid = newValue.isGrid || this.themeConfig.isGrid;
        const { results: config } = await editService.systemConfig();
        Object.assign(config, {
          app_cavans_color: _.isObject(rgbaCanvas)
            ? `rgba(${rgbaCanvas.r},${rgbaCanvas.g},${rgbaCanvas.b},${rgbaCanvas.a})`
            : rgbaCanvas,
          app_theme_color: _.isObject(rgbaTheme)
            ? `rgba(${rgbaTheme.r},${rgbaTheme.g},${rgbaTheme.b},${rgbaTheme.a})`
            : rgbaTheme,
          is_grid: isGrid,
        });
        if (this.editMode !== "read") {
          saveInfo("update", null, true);
        }
        await changeConfig(config, false);
        configMethods(vm);
        this.isCanvasColor = false;
        this.isThemeColor = false;
      },
      deep: true,
    },
    componentsArr: {
      handler: _.throttle(function (newValue) {
        this.getParentElement(newValue);
        const target = newValue.find((current) => current.id === this.attrObject.id);
        if (target && Object.keys(target).length) {
          const tempObj = Object.assign({}, target.data);
          Object.keys(tempObj).forEach((key) => {
            if (!_.isString(tempObj[key])) {
              tempObj[key] = JSON.stringify(tempObj[key]);
            }
          });
          Object.assign(this.attrObject, tempObj);
        }
      }, 800),
      deep: true,
    },
    componentsHideArr: {
      handler: _.throttle(function (newValue) {
        this.getParentElement(newValue);
      }, 800),
      deep: true,
    },
    comTree: {
      handler: _.throttle(function (newValue) {
        this.getNodeId();
        // 检查画布组件
        this.checkUp();
      }, 800),
      deep: true,
    },
    percentOrabsolute(newValue) {
      // 不计算border
      this.selectedKeys = [];
      $(".focus").removeClass("focus");
      this.$store.commit("setPercentOrabsolute", { percentOrabsolute: newValue });
      if (newValue === "absolute") {
        this.setabsolute();
      } else if (newValue === "percent") {
        this.setPercent();
      }
      comsCombination();
    },
  },
  methods: {
    /**
     * 输入输出
     * @param {*} value
     */
    handleChange(value) {
      $(".draggable2").removeClass("focusBind");
      $("#bottomcontent div.draggable").removeClass("focusBind");
      value.forEach((element) => {
        $(`#${element}`).addClass("focusBind");
      });
      // 预防存不上的情况
      const targetElement = this.showConsole()[0];
      if (this.showConsole().length === 1) {
        const data = JSON.parse(targetElement.dataset.data);
        data.componentBindArr = this.componentBindArr;
        $(targetElement).attr("data-data", JSON.stringify(data));
      }
    },
    bindCanvas() {
      // 选择需要观察变动的节点
      const targetNodeElement = $(`#inner-dropzone`);
      const bottomNodeElement = $(`#bottomcontent`);

      // 观察器的配置（需要观察什么变动）
      const config = {
        // attributes: true,
        childList: true,
        subtree: true,
      };
      // 当观察到变动时执行的回调函数

      const subject = new rxjs.Subject();

      subject.pipe(rxjs.operators.debounceTime(800)).subscribe((e) => {
        // callBack();
        // 检查组件，更新图层面板
        this.checkUp();
      });

      const callBackDebounce = (e) => {
        subject.next(e);
      };
      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callBackDebounce);
      if (!observer || !observer.observe) return;
      // 以上述配置开始观察目标节点
      observer.observe(targetNodeElement[0], config);
      observer.observe(bottomNodeElement[0], config);
    },
    changeAttrObject: _.throttle(function (key, item = {}) {
      try {
        let focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
        focusElement = $(focusElement).length ? $(focusElement) : $(`#${this.attrObject.id}`);
        const index = $(focusElement).attr("index");
        this.attrObject.paramList = JSON.stringify(this.$root.paramList);
        // $(focusElement).attr("data-data", JSON.stringify(this.attrObject));
        // 组件嵌套保存后将不属于vue组件
        if (index && focusElement.length === 1) {
          let { x, y } = this.attrObject;
          rxjs.timer(0).subscribe(() => {
            if (key === `style`) {
              [x, y] = $(focusElement)
                .css("transform")
                .replace(/[^0-9\-,.]/g, "")
                .split(",")
                .splice(-2);
              this.attrObject.x = x;
              this.attrObject.y = y;
            }
          });
          if (
            this.componentsHideArr[index] &&
            this.componentsHideArr[index].id === focusElement[0].id &&
            this.componentsHideArr[index].data
          ) {
            this.componentsHideArr[index].data = this.attrObject;
            this.$set(this.componentsHideArr, Number(index), this.componentsHideArr[index]);
          } else if (
            this.componentsArr[index] &&
            this.componentsArr[index].id === focusElement[0].id &&
            this.componentsArr[index].data
          ) {
            this.componentsArr[index].data = this.attrObject;
            this.$set(this.componentsArr, Number(index), this.componentsArr[index]);
          }

          this.checkUpKey(key);
          return;
        } else if (focusElement.length === 1) {
          changeElement({
            ...focusElement[0].dataset,
            data: this.attrObject,
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.checkUpKey(key);
    }, 500),
    changeAttrStyle(style) {
      this.$set(this.attrObject, "style", style);
      const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
      const index = $(focusElement).attr("index");

      if (index && focusElement.length === 1) {
        focusElement[0].style.cssText = hump(style);
        let { x, y, left, top } = this.attrObject;
        if (style && this.percentOrabsolute === "absolute") {
          [x, y] = $(focusElement)
            .css("transform")
            .replace(/[^0-9\-,.]/g, "")
            .split(",")
            .splice(-2);
          [x, y] = [Number(x).toFixed(), Number(y).toFixed()];
          this.attrObject.x = x;
          this.attrObject.y = y;
          focusElement.attr("data-x", x).attr("data-y", y);
        } else if (style && this.percentOrabsolute === "percent") {
          const targetElement = $(focusElement)[0];
          this.attrObject.x =
            targetElement.getBoundingClientRect().left - targetElement.parentElement.getBoundingClientRect().left;
          this.attrObject.y =
            targetElement.getBoundingClientRect().top - targetElement.parentElement.getBoundingClientRect().top;
          focusElement.attr("data-x", this.attrObject.x).attr("data-y", this.attrObject.y);
        }
        if (
          this.componentsHideArr[index] &&
          this.componentsHideArr[index].id === focusElement[0].id &&
          this.componentsHideArr[index].data
        ) {
          this.componentsHideArr[index].data = this.attrObject;
          this.$set(this.componentsHideArr, Number(index), this.componentsHideArr[index]);
        } else if (
          this.componentsArr[index] &&
          this.componentsArr[index].id === focusElement[0].id &&
          this.componentsArr[index].data
        ) {
          this.$set(this.attrObject, "style", focusElement[0].style.cssText);
          this.componentsArr[index].data = this.attrObject;
          this.$set(this.componentsArr, Number(index), this.componentsArr[index]);
        }
        rxjs.timer(50).subscribe(() => {
          focusElement[0].style.cssText = hump(style);
        });
      } else if (focusElement.length === 1) {
        changeElement({
          ...focusElement[0].dataset,
          data: this.attrObject,
        });
      }
    },
    emitChangePublicPage(data) {
      this.getPageInfo();
      changePublicPage(data);
    },
    homeTabs(e) {
      if (e === "3") {
        window.open(`${origin}/ui-builder/docs/help.html`);
      }
    },

    comsdbclick(e) {
      sendFocusMsg(e.currentTarget);
    },
    getParentElement(componentArr = []) {
      this.$nextTick(() => {
        componentArr.forEach((current) => {
          const {
            data: { parentId, id },
          } = current;
          const parentELement = document.querySelector(`#${parentId}`);
          const targetElement = document.querySelector(`#${id}`);

          if (parentId && parentELement && targetElement && parentELement !== targetElement.parentElement) {
            parentELement.append(targetElement);
          }
        });
      });
    },

    // 对齐工具
    ...alignment,
    // 标尺工具
    ...rulersTools,
    // 布局设置
    ...displayTools,
  },
  mounted() {
    this.bindCanvas();
    this.pageInfoPromise = reloadPage();
    this.getPageInfo();
    this.dexie = new Dexie("ChartDatabase");
    this.dexie.version(1).stores({ deepCharts: "id" });
    this.bindMarkEvent();
    this.getParentElement(this.componentsArr);
    this.getParentElement(this.componentsHideArr);
    this.mouseenterCom();
  },
  computed: {
    ...mapState([
      "curComponent",
      "editMode",
      "canvasStyleData",
      "layoutData",
      "snapshotData",
      "snapshotIndex",
      "isCtrlKey",
      "isShiftKey",
      "isSpaceKey",
    ]),
  },
});
