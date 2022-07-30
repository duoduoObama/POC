(function () {
  const minxin = {
    data() {
      return {
        colorsPostion: null,
        activeMenuKey: [],
        comTreeAll: [],
        editComOption: null,
        editComOptionProxy: null,
        editorAce: null,
        comMenu: {
          visible: false,
          fixed: false,
        },
        pageLibrary: {
          visible: false,
          fixed: false,
        },
        schemaJson: {
          visible: false,
          fixed: false,
        },
        schemaDrawerWidth: 500,
        helpDocsVisible: false,
        helpDocsUrl: `${origin}/ui-builder/docs/help.html`,
      };
    },
    methods: {
      // 重置主题
      async resetTheme() {
        const config = $("html").data("config");
        await saveInfo("update");
        await changeConfig({
          ...config,
          app_theme_color: `rgba(0,0,0,1)`,
          app_cavans_color: `rgba(255,255,255,1)`,
          is_grid: true,
        });
        configMethods(vm);
      },
      // 组件菜单栏编辑组件
      async updateComConfig() {
        let config = this.editComOption;
        let res = await editService.updateComponent(config);
        if (res.info.msg === "success") {
          this.getPageInfo();
          layer.msg("更新成功");
        }
      },
      editComOptionInfo() {
        this.editComOptionProxy = new Proxy(this.editComOption, {
          get: function (target, propKey, receiver) {
            if (propKey === "options" && typeof target[propKey] === "object") {
              target.hiddenAttr = true;
              return JSON.stringify(Reflect.get(target, propKey, receiver));
            }
            return Reflect.get(target, propKey, receiver);
          },
          set: function (target, propKey, value, receiver) {
            if (target.hiddenAttr && propKey === "options") {
              try {
                return Reflect.set(target, propKey, JSON.parse(value), receiver);
              } catch (error) {
                console.log(error);
                return;
              }
            }
            return Reflect.set(target, propKey, value, receiver);
          },
        });
      },
      // 重置布局
      resetLayout() {
        this.$store.commit("setLayout", {
          // leftWidth: 3,
          middleWidth: 80,
          rightWidth: 20,
          middleCenterHeight: 90,
          middleBottomHeight: 20,
        });
      },
      // 开启关闭画布全屏
      fullScreen() {
        if (this.isFullScreen) {
          this.$store.commit("setLayout", {
            // leftWidth: 0,
            middleWidth: 100,
            rightWidth: 0,
            middleCenterHeight: 100,
            middleBottomHeight: 0,
          });
        } else {
          this.resetLayout();
        }
      },

      /**
       * 图层面板组件树操作
       * onExpand
       * onCheckBox
       * onSelect
       */
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onCheckBox(checkedKeys, info) {
        $.makeArray($(".draggable2")).forEach((cur) => {
          const isHidden = checkedKeys.checked.includes(cur.id);

          if (!isHidden) {
            $(cur).hide();
          } else {
            $(cur).show();
          }

          const allComponent = [...this.componentsArr, ...this.componentsHideArr];
          let len = 0;
          while (allComponent[len]) {
            if (allComponent[len].id === cur.id) {
              this.$set(allComponent[len].data, "style", cur.style.cssText);
              this.$set(allComponent[len].data, "isHidden", isHidden);
              break;
            }
            len++;
          }
        });
      },
      onSelect(selectedKeys, info) {
        const [key] = selectedKeys;
        if (selectedKeys.length > 1) {
          this.attrObject = {};
        }
        const domInfo = $(`#${key}`).attr("data-data");
        if (!domInfo) return;

        $(".focusbottom").removeClass("focusbottom");
        $(`.focus`).removeClass("focus");
        this.selectedKeys = selectedKeys;
        rxjs.timer(50).subscribe(() => {
          selectedKeys.forEach((element) => {
            $(`#${element}`).addClass("focus");
            setEvents($(`#${element}`)[0]);
          });
          if (selectedKeys.length === 1) {
            setAttr($(`#${key}`)[0]);
          }
          //防止跳动dom
          if (!selectedKeys.length) {
            this.events = [];
          }
          comsCombination();
        });
      },

      /**
       * focus组件数量
       */
      showConsole() {
        return [...this.selectedKeys.map((id) => $(`#${id}`)), ...$.makeArray($(".focusbottom"))].filter(
          (current) => $(current).length
        );
      },

      /**
       * 获取页面配置
       */
      getPageInfo() {
        this.spinning = true;
        this.pageInfoPromise.then(async (data) => {
          let { theme, custom_result_componet } = data;
          this.spinning = false;
          theme = JSON.parse(theme || "{}");
          const {
            topPanel = true,
            bottomPanel = true,
            leftPanel = true,
            rightPanel = true,
            // leftWidth = 3,
            middleCenterHeight = 90,
            middleBottomHeight = 20,
          } = theme;

          // 适配以前的分割布局(leftWidth+middleWidth+rightWidth)
          let { middleWidth = 80, rightWidth = 20 } = theme;
          try {
            middleWidth = 100 - Number(rightWidth);
          } catch (error) {
            middleWidth = 80;
            rightWidth = 20;
          }

          custom_result_componet =
            custom_result_componet && custom_result_componet.length ? JSON.parse(custom_result_componet) : [];
          this.topPanel = topPanel;
          this.bottomPanel = bottomPanel;
          this.leftPanel = leftPanel;
          this.rightPanel = rightPanel;
          this.$store.commit("setLayout", {
            // leftWidth,
            middleWidth,
            rightWidth,
            middleCenterHeight,
            middleBottomHeight,
          });
          this.spinningMenu = true;
          const { components = `all`, charts = `all` } = theme;
          const comTree = await editService.systemMenu({ components, charts });
          this.spinningMenu = false;
          comTree.results["DI组件"] = custom_result_componet.map((item) => {
            item.description = item.help
              ? `${item.name}: ${item.help.text || item.text}`
              : `${item.name}: ${item.text}`;
            return item;
          });
          const {
            info: { page = {}, custom = {} },
          } = comTree;
          this.publicPage = page;
          this.combinationComsTree = custom;
          for (const customkey in custom) {
            if (Object.hasOwnProperty.call(custom, customkey)) {
              this.leftPanelSvg[customkey] = "#icon-caozuo";
            }
          }

          for (let key in comTree.results) {
            comTree.results[key].map((item) => {
              item._id = item.id;
              item.id = createHashId();
            });
          }
          this.comTreeAll = { ...comTree.results };
          this.comTree = { ...comTree.results, ...custom };
          // 读取配置
          configMethods(vm);
          // 自动保存(首屏不加入监听)
          if (this.editMode !== "read" && !this.autoSaveObserver) {
            this.autoSaveObserver = menuTools.autoSave();
          }
          // 保存画布初始数据
          vm.$store.commit("recordSnapshot");
        });
      },

      /**
       * 顶部菜单栏操作
       */
      handleMenuClick(e) {
        this.getColorPosition(e.domEvent);
        switch (e.key) {
          case `1`:
            this.isThemeColor = true;
            break;
          case `2`:
            this.isCanvasColor = true;
            break;
          case `3`:
            this.$refs.inputRef.click();
            break;
          case `4`:
            $("#inner-dropzone").data("bgImage", "");
            this.cancelBg();
            break;
          case `5`:
            this.resetLayout();
            break;
          case `6`:
            this.resetTheme();
            break;
          case `7`:
            this.isRuler = !this.isRuler;
            break;
          case `8`:
            this.isFullScreen = !this.isFullScreen;
            this.fullScreen();
            break;
          case `9`:
            this.$store.commit("undo");
            break;
          case `10`:
            this.$store.commit("redo");
            break;
        }
      },

      /**
       * 设置画布背景图片
       */
      changePic(e) {
        const reader = new FileReader();
        const fileData = new FormData();
        fileData.append("files", this.$refs.inputRef.files[0]);
        reader.readAsDataURL(this.$refs.inputRef.files[0]);
        this.spinning = true;
        reader.onloadend = (e) => {
          this.spinning = false;
          editService
            .fileUpload(fileData)
            .then((data) => {
              this.spinning = false;
              const { fileName = `` } = data.results;
              if (!fileName) return;
              $("#inner-dropzone").data("bgImage", fileName);
              $("#inner-dropzone").css({
                background: `url('${fileName}')`,
                backgroundSize: "cover",
              });
            })
            .catch((error) => {
              this.spinning = false;
              console.log(error);
            });
        };
      },
      // 取消背景图片
      cancelBg() {
        this.$refs.inputRef.value = "";
        $("#inner-dropzone").css({
          background: "none",
          backgroundImage: `
              repeating-linear-gradient( 
              0deg,
              var(--canvas-fence-color) 0px,
              var(--canvas-fence-color) 0px,
              transparent 1px, transparent 16px ),
              repeating-linear-gradient(90deg,
              var(--canvas-fence-color) 0px,
              var(--canvas-fence-color) 0px,
              var(--canvas-color) 1px,
              var(--canvas-color) 16px )`,
        });
      },
      // 主题设置颜色选择器位置
      getColorPosition(target = {}) {
        const { clientX, clientY } = target;
        const { innerHeight, innerWidth } = window;
        let pX = clientX;
        let pY = clientY;
        if (clientX + 220 >= innerWidth) {
          pX = innerWidth - 220;
        }
        if (clientY + 301 >= innerHeight) {
          pY = innerWidth - 301;
        }
        this.colorsPostion = `position:absolute;left:${pX}px;top:${pY}px;z-index:99999`;
      },

      // 改变画布尺寸
      handleChangeCanvas(value) {
        if (!value.includes("x")) return;
        const [width, height] = value.split("x").map(Number);
        this.$store.commit("setCanvasStyle", { width, height });
      },

      /**
       * 改变画布宽高布局
       * resizeWidthLayout
       * resizeHeightLayout
       */
      resizeWidthLayout(value) {
        // const [leftWidth, middleWidth, rightWidth] = value.map((i) => i.size);
        // this.$store.commit("setLayout", { leftWidth, middleWidth, rightWidth });
        const [middleWidth, rightWidth] = value.map((i) => i.size);
        this.$store.commit("setLayout", { middleWidth, rightWidth });
      },
      resizeHeightLayout(value) {
        const [middleCenterHeight, middleBottomHeight] = value.map((i) => i.size);
        this.$store.commit("setLayout", {
          middleCenterHeight,
          middleBottomHeight,
        });
      },

      /**
       * 组件菜单组件查找
       */
      searchComponents(key) {
        this.activeMenuKey = [];
        if (key) {
          let index = -1;
          for (const i in this.comTreeAll) {
            this.comTree[i] = [];
            index++;
            this.comTreeAll[i].forEach((item) => {
              // datatype1 本地组件 enName 图元组件 false di组件
              const onlyKey = item.datatype === 1 || item.enName ? "name" : "text";
              if (item[onlyKey].indexOf(key) > -1) {
                let replaceReg = new RegExp(key, "g"); // 匹配关键字正则
                let replaceString = '<span class="highlights-text">' + key + "</span>"; // 高亮替换v-html值
                let temp = { ...item };
                temp["highlights"] = temp[onlyKey].replace(replaceReg, replaceString);
                this.comTree[i].push(temp);
                if (!this.activeMenuKey.includes(index)) {
                  this.activeMenuKey.push(index);
                }
              }
            });
          }
          let length = 0;
          for (const key in this.comTree) {
            this.comTree[key].forEach((item) => {
              length += item.length;
            });
          }
          if (length === 0) {
            antd.message.warning("未搜索到匹配组件");
          }
        } else {
          this.comTree = { ...this.comTreeAll };
        }
      },

      async showSchema() {
        const tempObj = await release(null, true);
        if (!tempObj) {
          antd.message.warning("页面暂无Schema JSON数据!");
          return;
        }
        try {
          const width = $(".content-body .content").width() + 4;
          if (width) this.schemaDrawerWidth = width;
        } catch (error) {}
        this.editorAce = null;
        this.schemaJson.visible = true;
        const jsonStr = JSON.stringify(tempObj, null, "\t");
        rxjs.timer(500).subscribe(() => {
          ace.require("ace/ext/language_tools");
          // 解决控制台 worker-javascript.js 404问题
          ace.config.set("workerPath", "/ui-builder/js/lay-module/ace");
          this.editorAce = ace.edit("schema-editor");
          this.editorAce.$blockScrolling = Infinity; // 关闭浏览器控制台警告
          this.editorAce.setOptions({
            enableSnippets: true,
            enableLiveAutocompletion: true,
          });
          this.editorAce.setTheme("ace/theme/monokai"); //monokai模式是自动显示补全提示
          this.editorAce.getSession().setMode("ace/mode/javascript"); //语言
          this.editorAce.setFontSize(16);
          // editorAce.setReadOnly(true);
          this.editorAce.setShowPrintMargin(false);
          this.editorAce.setValue(jsonStr);
          this.editorAce.scrollToLine(0);

          const resizeFun = _.debounce(() => {
            try {
              const width = $(".content-body .content").width() + 4;
              if (width) {
                this.schemaDrawerWidth = width;
                this.editorAce.resize();
              }
            } catch (error) {}
          }, 200);

          // 监听编辑器DOM大小，自适应编辑器显示内容区域大小
          const resizeObserver = new ResizeObserver((entries) => {
            resizeFun();
          });
          resizeObserver.observe($(".content-body .content")[0]);
        });
      },

      async updateSchema() {
        const _this = this;
        let schemaJsonArr = [];
        try {
          schemaJsonArr = JSON.parse(_this.editorAce.getValue());
        } catch (error) {
          console.log(error);
          antd.message.error("Schema JSON数据有误, 请检查代码！");
          return;
        }
        antd.Modal.confirm({
          title: "确定更改Schema JSON数据吗?",
          content: "请认真检查更改后的Schema JSON数据是否有误, 关键数据或代码有误可能导致UIBuilder页面出错!",
          autoFocusButton: null,
          okText: "确定",
          cancelText: "取消",
          zIndex: 9999,
          onOk() {
            return new Promise(async (reslove, reject) => {
              if (!Array.isArray(schemaJsonArr) || schemaJsonArr.length === 0) {
                _this.schemaJson.visible = false;
                reject();
                return;
              }
              const tempObj = { id: getQueryVariable("id"), custom_model: [], custom_componet: [], theme: {} };
              schemaJsonArr.forEach(async (item) => {
                if (!item.id) return;
                switch (item.id) {
                  case "bottomcontent":
                    break;
                  case "configElement":
                    tempObj.theme = item.theme ? item.theme : await getThemeInfo(vm);
                    break;
                  default:
                    if (item.bakParamList) {
                      if (_.isString(item.bakParamList)) {
                        item.bakParamList = JSON.parse(item.bakParamList) || [];
                      }
                      item.paramList = item.bakParamList;
                      Reflect.deleteProperty(item, "bakParamList");
                    }
                    const temp = {
                      data: item,
                      style: item.style,
                      tag: item.targetRoot === "#inner-dropzone" ? "up" : "bottom",
                      x: item.x,
                      y: item.y,
                    };
                    if (Number(temp.data.datatype) === 1) {
                      tempObj.custom_componet.push(temp);
                    } else {
                      tempObj.custom_model.push(temp);
                    }
                }
              });
              const ajax = editService.updateSaveInfo(tempObj);
              ajax
                .then((res) => {
                  vm.componentsArr = [];
                  vm.componentsHideArr = [];
                  const reload = reloadPage();
                  reload.then((data) => {
                    antd.message.success("更改Schema JSON成功");
                    _this.schemaJson.visible = false;
                    reslove();
                  });
                })
                .catch((err) => {
                  antd.message.error("更改Schema JSON出错!");
                  _this.schemaJson.visible = false;
                  reject();
                });
            });
          },
        });
      },

      closeFixedMenu() {
        this.comMenu.fixed ? void 0 : (this.comMenu.visible = false);
        this.pageLibrary.fixed ? void 0 : (this.pageLibrary.visible = false);
        this.schemaJson.fixed ? void 0 : (this.schemaJson.visible = false);
      },
      closeDrawerMenu() {
        this.comMenu.visible = false;
        this.pageLibrary.visible = false;
        this.schemaJson.visible = false;
      },
      showDrawerMenu(key) {
        if (this[key].visible) {
          this[key].visible = false;
          return;
        }
        this.closeDrawerMenu();
        switch (key) {
          case "comMenu":
            this[key].visible = true;
            break;
          case "pageLibrary":
            this[key].visible = true;
            break;
          case "schemaJson":
            this.showSchema();
            break;
        }
      },
    },
  };
  window.designMixin = minxin;
})();
