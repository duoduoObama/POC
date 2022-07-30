var store = new Vuex.Store({
  state: {
    editMode:
      location.href.includes("dist") || location.href.includes("customApp") // ui-builder本地环境，di环境
        ? "read"
        : "edit", // 编辑器模式 edit read
    canvasStyleData: {
      // 页面全局数据
      width: 1920,
      height: 1080,
    },
    percentOrabsolute: "absolute",
    layoutData: {
      // leftWidth: 3, // 左边面板宽度
      middleWidth: 80, // （上中下）中间面板宽度
      rightWidth: 20, // 右边面板宽度
      middleTopHeight: 15, // 上边面板宽度
      middleCenterHeight: 70, // 中间画板面板宽度
      middleBottomHeight: 15, // 下边面板宽度
    },
    curComponent: null,
    curMenu: null, // 右键菜单
    snapshotData: {
      componentsArr: [],
      componentsHideArr: [],
    }, // 编辑器快照数据
    pageRoladSnapshotData: {
      componentsArr: [],
      componentsHideArr: [],
    }, // 页面初始化快照数据
    snapshotIndex: -1, // 快照索引
    isCtrlKey: false, // ctrl按键
    isShiftKey: false, // shift按键
    isSpaceKey: false, // space按键
  },
  mutations: {
    setCurComponent(state, { component }) {
      state.curComponent = component;
    },
    setCurMenu(state, { menu }) {
      state.curMenu = menu;
    },
    addEvents({ curComponent }, { event, param }) {
      curComponent.events[event] = { ...param };
    },
    removeEvents({ curComponent }, event) {
      Reflect.deleteProperty(curComponent.events, event);
    },
    setCanvasStyle(state, style) {
      state.canvasStyleData = style;
    },
    setLayout(state, style) {
      state.layoutData = { ...state.layoutData, ...style };
    },
    setPercentOrabsolute(state, { percentOrabsolute }) {
      state.percentOrabsolute = percentOrabsolute;
    },
    addComponent(state, component) {
      state.componentData.push(component);
    }, 
    undo(state) {
      const { componentsArr, componentsHideArr } = state.pageRoladSnapshotData;
      if (state.snapshotIndex >= 0) {
        state.snapshotIndex--;
        vm.componentsArr =
          _.cloneDeep(state.snapshotData.componentsArr[state.snapshotIndex]) || _.cloneDeep(componentsArr);
        vm.componentsHideArr =
          _.cloneDeep(state.snapshotData.componentsHideArr[state.snapshotIndex]) || _.cloneDeep(componentsHideArr);
      }
    },
    redo(state) {
      const { componentsArr, componentsHideArr } = state.pageRoladSnapshotData;
      if (state.snapshotIndex < state.snapshotData.componentsArr.length - 1) {
        state.snapshotIndex++;
        vm.componentsArr =
          _.cloneDeep(state.snapshotData.componentsArr[state.snapshotIndex]) || _.cloneDeep(componentsArr);
        vm.componentsHideArr =
          _.cloneDeep(state.snapshotData.componentsHideArr[state.snapshotIndex]) || _.cloneDeep(componentsHideArr);
      }
    },
    recordSnapshot(state) {
      // 添加新的快照
      console.log("添加新的快照");
      const len = ++state.snapshotIndex;

      state.snapshotData.componentsArr[len] = _.cloneDeep(vm.componentsArr);
      state.snapshotData.componentsHideArr[len] = _.cloneDeep(vm.componentsHideArr);

      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.componentsArr.length - 1) {
        state.snapshotData.componentsArr = state.snapshotData.componentsArr.slice(0, state.snapshotIndex + 1);
        state.snapshotData.componentsHideArr = state.snapshotData.componentsHideArr.slice(0, state.snapshotIndex + 1);
      }

      comsCombination();
    },
    setPageRoladSnapshotData(state, { componentsArr = [], componentsHideArr = [] }) {
      state.pageRoladSnapshotData = {
        componentsArr,
        componentsHideArr,
      };
    },
    setIsCtrlKey(state, { isCtrlKey }) {
      state.isCtrlKey = isCtrlKey;
    },
    setIsShiftKey(state, { isShiftKey }) {
      state.isShiftKey = isShiftKey;
    },
    setIsSpaceKey(state, { isSpaceKey }) {
      state.isSpaceKey = isSpaceKey;
    },
  },
});

var { mapState } = Vuex;
