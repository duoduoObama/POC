(function () {
  const minxin = {
    data() {
      return {
        componentBindArr: [],
        switchLayerValue: "inner-dropzone",
        switchLayerArr: [],
        showEditIcon: false,
        currentCom: null,
        currentMenu: null,
        paramList: [],
        isAddEvent: false,
        customParam: {
          method: "GET",
          isEventLoop: 0,
          eventArr: {},
        },
        customValue: null,
        customTrigger: {
          exportFun: [],
        },
        addScriptListModal: false,
        editorAce: null,
        scriptForm: {},
        scriptRules: {
          scriptName: [
            {
              required: true,
              min: 1,
              max: 15,
              message: "长度为 1 - 15",
              trigger: "blur",
            },
          ],
          scriptKey: [
            {
              required: true,
              min: 1,
              max: 15,
              message: "长度为 1 - 15",
              trigger: "change",
            },
          ],
        },
      };
    },
    methods: {
      focusSelectCom(e) {
        const dom = document.querySelector("#" + e.key);
        if (dom) {
          dom.classList.add("focusBind");
        }
      },
      blurSelectCom(e) {
        const dom = document.querySelector("#" + e.key);
        if (dom) {
          dom.classList.remove("focusBind");
        }
      },
      getDomIdArray() {
        const arrExclude = [...$.makeArray($(".draggable2")), ...$.makeArray($("#bottomcontent div.draggable"))];
        // 排除本身。
        if (this.showConsole().length === 1) {
          return arrExclude.filter((element) => element.id !== this.showConsole()[0].id);
        }
        return arrExclude;
      },
      handleBlur($event) {
        const targetElement = this.showConsole()[0];
        this.clearHandle();
        if (this.showConsole().length === 1) {
          const data = JSON.parse(targetElement.dataset.data);
          data.componentBindArr = this.componentBindArr;
          $(targetElement).attr("data-data", JSON.stringify(data));
        }
      },
      handleFoucs($event) {
        const targetElement = this.showConsole()[0];
        if (this.showConsole().length === 1) {
          const data = JSON.parse(targetElement.dataset.data);
          this.componentBindArr =
            typeof data.componentBindArr === `string`
              ? JSON.parse(data.componentBindArr || `[]`)
              : data.componentBindArr;
          this.clearHandle();
          if (!this.componentBindArr) return;
          this.componentBindArr = this.componentBindArr.filter((element) => {
            if ($event) {
              $(`#${element}`).addClass("focusBind");
            }
            if ($(`#${element}`).length) {
              return element;
            }
          });
        }
      },
      /**
       * 清除所有组件focusBind状态
       */
      clearHandle() {
        $(".draggable2").removeClass("focusBind");
        $("#bottomcontent div.draggable").removeClass("focusBind");
      },
      onClickNode() {
        this.selectedKeys = $.makeArray($(".focus")).map((element) => element.id);
        if (!this.selectedKeys.length && !$(".focusbottom").length) {
          this.events = [];
        }
        const [target] = this.selectedKeys;
        this.switchLayerValue = $(`#${target}`).parent().attr("id");
        this.switchLayerArr = this.switchLayersEle();

        // 关闭左侧功能区的drawer
        this.closeFixedMenu();
      },

      /**
       * 获取所有容器id列表
       */
      switchLayersEle() {
        if (!$(".focus").length) return;
        const root = [];
        root.push(
          ...$.makeArray(changePanelElement($(".focus")[0])).map((cur) => ({
            id: cur.id,
          }))
        );
        return root;
      },

      /**
       * 获取组件树
       */
      getTreeData() {
        const bottomTreeNode = $.makeArray($("#bottomcontent div.draggable")).map((cur) =>
          JSON.parse($(cur).attr("data-data"))
        );
        let allElement = [
          ...$.makeArray($(".draggable-grid")),
          ...$.makeArray($(".draggable2")),
          ...$.makeArray($(".draggable-info-disable")),
        ];
        if (this.editMode === `read`) {
          allElement = [...$("#inner-dropzone [data-data]")];
        }
        const treeNode = getChildList(_.unionBy(allElement, "id"))
          .map(({ id }) => this.changeTargetRoot(id))
          .filter((current) => Object.keys(current).length);
        const allTreeNode = [...treeNode, ...bottomTreeNode];

        this.eventBus(allTreeNode);
        const childArr = [];
        this.checkedKeys = [];
        let treeData = treeNode
          .map((element) => {
            const { targetId, isHidden, name, text, data = {}, targetRoot } = element;
            let { childList = [], parentId } = element;
            if (childList.length) {
              treeNode.forEach((temp) => {
                if (typeof temp.childList === `string`) {
                  temp.childList = JSON.parse(temp.childList);
                }
                if (temp.childList && Array.isArray(temp.childList)) {
                  temp.childList.forEach((child) => {
                    treeNode
                      .filter((target) => child.tabsId === target.parentId)
                      .forEach((current) => {
                        current.parentId = temp.id;
                      });
                  });
                }
              });
            }
            // if (parentId.length > 17) {
            //   parentId = parentId.slice(0, 17);
            // }
            const tag = targetRoot === "#inner-dropzone" ? "" : "-🏳️";
            return {
              key: targetId,
              title: `${data.text || text || name}${tag}`,
              text: `${data.text || text || name}${tag}`,
              parentId,
              isHidden: isHidden === void 0 || isHidden,
              children: childList,
              scopedSlots: { title: "text" },
            };
          })
          .concat(...childArr);
        treeData.forEach((element) => {
          const { key, isHidden } = element;
          this.expandedKeys.push(key);
          if (isHidden) {
            this.checkedKeys.push(key);
          }
        });
        this.treeData = getTrees(treeData);
      },

      /**
       * 组件消息订阅
       */
      eventBus(treeData = []) {
        if (!obEvents.allSubscribe.length) {
          obEvents.allSubscribe = treeData.map((element) => {
            const { id } = element;
            console.log(`组件${id}:被创建~~~`);
            return {
              [id]: element,
              id,
              // 订阅id所属的消息挂载到总线
              observable: obEvents.currentSelectedPoint(id).subscribe((data) => {
                console.log(`组件${id}接收消息:`, data);
              }),
            };
          });
        } else {
          let len = 0;
          let addLen = 0;

          // 查找新进的节点
          while (treeData[addLen]) {
            const { id } = treeData[addLen];
            const addArr = obEvents.allSubscribe.find((_) => _.id === id);
            if (!addArr) {
              console.log(`组件${id}:被创建~~~`);
              obEvents.allSubscribe.push({
                [id]: treeData[addLen],
                id,
                // 新增订阅id所属的消息挂载到总线
                observable: obEvents.currentSelectedPoint(id).subscribe((data) => {
                  console.log(`组件${id}接收消息:`, data);
                }),
              });
            }
            addLen++;
          }
          // 删除rxbus逻辑节点
          while (obEvents.allSubscribe[len]) {
            const { id } = obEvents.allSubscribe[len];
            const target = treeData.find((_) => id === _.id);
            if (!target) {
              // 取消被删除节点的订阅
              obEvents.allSubscribe[len].observable && obEvents.allSubscribe[len].observable.unsubscribe();
              obEvents.allSubscribe.splice(len, 1);
              console.log(`组件${id}:被销毁~~~`);
              continue;
            }
            target[id] = obEvents.allSubscribe[len];
            len++;
          }
        }
      },
      changeTargetRoot(id) {
        let targetRoot = ``;
        const targetELement = $(`#${id}`);
        if (!targetELement.length) return {};
        const targetData = JSON.parse(targetELement.attr("data-data"));
        if (targetELement.parents("#inner-dropzone").length) {
          targetRoot = "#inner-dropzone";
        } else {
          targetRoot = "#bottomcontent";
        }
        Object.assign(targetData, { targetRoot });
        targetELement
          .attr("data-tag", targetRoot === "#inner-dropzone" ? "up" : "bottom")
          .attr("data-data", JSON.stringify(targetData));
        return targetData;
      },

      drag(ev) {
        const parentElement = ev.target.parentElement.parentElement;
        if (ev.target.id) {
          ev.dataTransfer.setData("Text", ev.target.id);
        } else if (parentElement.id && parentElement.tagName === "LI") {
          ev.dataTransfer.setData("Text", parentElement.id);
        }
      },

      /**
       * 显示隐藏组件菜单修改按钮
       * mouseenterCom
       * mouseleaveCom
       */
      mouseenterCom() {
        $(this.$refs.pluginMenu).on(
          "mouseenter mouseleave",
          ".delegate-li",
          _.throttle((e) => {
            const { type } = e;

            if (type === "mouseout" || type === "mouseleave") {
              this.showEditIcon = false;
              this.currentCom = null;
              return;
            }
            const { comIndex, index } = e.target.dataset;
            this.showEditIcon = true;
            this.currentCom = Number(comIndex);
            this.currentMenu = Number(index);
          }, 200)
        );
      },
      /**
       * 属性过滤
       */
      disabledAttrs(target) {
        const attrs = [
          `name`,
          `parent`,
          `parentId`,
          `paramList`,
          `id`,
          `type`,
          `targetId`,
          `isShow`,
          `layoutId`,
          "childList",
        ];
        return attrs.includes(target);
      },
      ignoreMethod(key) {
        const ignoreArr = [
          "isHidden",
          "events",
          "scripts",
          "isBottom",
          "componentName",
          "_id",
          "sender",
          "transfromData",
          "exportFun",
          "isShow",
          "special",
          "invalid",
          "childList",
          "nodeName",
          "wfName",
        ];
        return !ignoreArr.includes(key);
      },
      ignoreParamList(value) {
        return _.isBoolean(value) && value === false;
      },
      ignoreComLibrary(key) {
        const ignoreArr = ["DI组件", "deepCharts"];
        return !ignoreArr.includes(key);
      },

      /**
       * 组件切换容器
       */
      switchLayers(value) {
        const focusElement = $(".focus");
        let targetRoot = this.attrObject.targetRoot;
        // 从容器内抛出
        if (focusElement.hasClass("draggable-info-disable")) {
          focusElement.removeClass("draggable-info-disable");
        }
        // 从弹力盒子中抛出
        if (focusElement.hasClass("draggable-grid")) {
          focusElement.removeClass("draggable-grid");
        }
        if (!focusElement.hasClass("draggable2")) {
          focusElement.addClass("draggable2");
        }

        if ($(`#${value}`).parents("#inner-dropzone").length) {
          targetRoot = "inner-dropzone";
        } else {
          targetRoot = "bottomcontent";
        }
        const changeInfo = { ...this.attrObject, parentId: value, targetRoot: `#${targetRoot}` };
        focusElement
          .attr("data-x", 0)
          .attr("data-y", 0)
          .attr("data-tag", targetRoot === "#inner-dropzone" ? "up" : "bottom")
          .css({
            transform: "translate(0,0)",
            height: "150px",
            width: "150px",
          })
          .attr("data-data", JSON.stringify(changeInfo));
        Object.assign(this.attrObject, changeInfo);
        const { id: targetId } = changeInfo;
        [...this.componentsArr, ...this.componentsHideArr].forEach((current) => {
          const { id, data } = current;
          if (id === targetId) {
            Object.assign(data, changeInfo);
          }
        });
        $(`#${value}`).removeClass("focusBind");
        setAttr(focusElement[0]);
      },
      layersMouseenter(e) {
        document.querySelector(`#${e.key}`).classList.add("focusBind");
      },
      layersMouseleave(e) {
        document.querySelector(`#${e.key}`).classList.remove("focusBind");
      },

      /**
       * 重置组件
       */
      restConfirm() {
        let tempStyle = `transform: translate(0px, 0px); width: 150px; height: 150px;
        color: rgb(0, 0, 0); opacity: 1; font-size: 14px; font-weight: 400;
         letter-spacing: 0px; text-align: left; z-index: 1; position: absolute;background-color: rgb(255,255,255)`;
        const menu = this.lookUpComponent();
        if (!menu) {
          this.changeAttrStyle(tempStyle);
          this.$set(this.attrObject, key, tempInfo);
          return;
        }
        const copyInfo = JSON.parse(JSON.stringify(menu));
        Reflect.deleteProperty(copyInfo, "id");
        tempStyle = tempStyle
          .replace("width: 150px", `width: ${Number(copyInfo["width"])}px`)
          .replace("height: 150px", `height: ${Number(copyInfo["height"])}px`);
        this.changeAttrStyle(tempStyle);
        Reflect.ownKeys(copyInfo).forEach((key) => {
          try {
            let tempInfo = copyInfo[key];
            if (typeof menu[key] !== `string`) {
              tempInfo = JSON.stringify(menu[key]);
            }
            if (key === `paramList`) {
              const copyParamList = JSON.parse(tempInfo);
              copyParamList.forEach((current) => {
                if (!current.default) {
                  Reflect.set(current, `default`, ``);
                }
                if (!current.title) {
                  Reflect.set(current, `title`, current.cnName);
                }
              });
              this.$root.paramList = copyParamList;
            }
            this.$set(this.attrObject, key, tempInfo);
          } catch (error) {
            console.log(error);
          }
        });
      },

      /*
       * 组件匹配
       */
      lookUpComponent() {
        let comInfo = {};
        const menu = Object.values(this.$root.comTree).reduce((pre, cur) => {
          return [...pre, ...cur];
        }, []);
        const attrObject = _.cloneDeep(this.attrObject);
        if (attrObject.componentName) {
          comInfo = menu.find((current) => {
            return current.componentName && current.componentName === this.attrObject.componentName;
          });
        } else {
          switch (attrObject.name) {
            case "jz-step":
              menu.forEach((current) => {
                if (current.name !== "jz-step") return;
                const attrObjectParam = this.getParam(attrObject);
                const currentParam = this.getParam(current);
                if (attrObjectParam.nodeid === currentParam.nodeid) {
                  comInfo = current;
                }
              });
              break;
            case "jz-chart":
              menu.forEach((current) => {
                if (current.name !== "jz-chart") return;
                const attrObjectParam = this.getParam(attrObject);
                const currentParam = this.getParam(current);
                if (
                  attrObjectParam.nodeid === currentParam.nodeid &&
                  attrObjectParam.layoutId === currentParam.layoutId &&
                  attrObjectParam.chartidx === currentParam.chartidx
                ) {
                  comInfo = current;
                }
              });
              break;
            case "jz-single-param":
              menu.forEach((current) => {
                if (current.name !== "jz-single-param") return;
                const attrObjectParam = this.getParam(attrObject);
                const currentParam = this.getParam(current);
                if (attrObjectParam.nodeid === currentParam.nodeid && attrObjectParam.key === currentParam.key) {
                  comInfo = current;
                }
              });
              break;
            default:
              comInfo = menu.find((current) => {
                return current.name && current.name === attrObject.name;
              });
              break;
          }
        }
        return comInfo;
      },

      /**
       * 添加组件参数
       */
      addParamList() {
        if (!this.paramList || !Array.isArray(this.paramList)) {
          this.paramList = [];
        }
        this.$set(this, `paramList`, [...this.paramList, this.addParam]);
        this.$set(this.attrObject, `paramList`, this.paramList);
        this.changeAttrObject();
        this.addParam = {};
      },
      /**
       * 删除组件参数
       */
      deleteParamList(key) {
        if (!this.paramList) {
          this.paramList = [];
        }
        const index = this.paramList.findIndex((cur) => cur.key == key);
        if (index >= 0) {
          this.paramList.splice(index, 1);
        }
        this.$set(this, `paramList`, [...this.paramList]);
        this.$set(this.attrObject, `paramList`, this.paramList);
        this.changeAttrObject();
        this.addParam = {};
      },

      /**
       * 添加组件事件
       */
      addCustomEvent() {
        this.isAddEvent = true;
        this.customValue = "";
        if (!this.attrObject.events) {
          this.$set(this.attrObject, "events", {});
        } else if (typeof this.attrObject.events === "string") {
          this.$set(this.attrObject, "events", JSON.parse(this.attrObject.events));
        }
        let { events = {} } = JSON.parse($(".focus").attr("data-data"));
        if (typeof events === "string") {
          events = JSON.parse(events);
        }
        const exportFun = events.triggerEvent ? JSON.parse(events.triggerEvent.exportFun || "[]") : [];
        if (exportFun.length && exportFun) {
          this.customTrigger.exportFun = exportFun;
        } else {
          this.customTrigger.exportFun =
            (exportFun.length && exportFun) || JSON.parse(this.attrObject.exportFun || "[]");
        }
        this.customEvents.forEach((current) => {
          if (!events.hasOwnProperty(current.key)) {
            events[current.key] = {};
          }
        });
        const customKeys = Object.keys(events);
        this.customParam = Object.values(events).reduce((pre, cur, index) => {
          pre = { ...pre, [customKeys[index]]: { ...cur } };
          return pre;
        }, {});
        this.$store.commit("setCurComponent", {
          component: this.attrObject,
        });
      },
      /**
       * 保存组件事件
       */
      saveEvents() {
        const saveEventsInfo = () => {
          const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
          const index = focusElement.attr("index");
          const tempInfo = focusElement.data().tag === "bottom" ? this.componentsHideArr : this.componentsArr;
          this.customParam.triggerEvent.exportFun = JSON.stringify(this.customTrigger.exportFun);
          if (!this.customValue) {
            this.isAddEvent = false;
            return;
          }
          this.$store.commit("addEvents", {
            event: this.customValue,
            param: this.customParam[this.customValue],
          });
          let { events } = this.curComponent;
          this.$set(tempInfo[index].data, "events", events);
          this.$set(tempInfo, Number(index), JSON.parse(JSON.stringify(tempInfo[index])));
          this.$set(this.attrObject, "events", events);
          this.isAddEvent = false;
        };
        this.$refs.customParamRuleForm.validate((valid) => {
          if (valid) {
            this.isAddEvent = false;
            saveEventsInfo();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      /**
       * 删除组件事件
       */
      closeTags(key) {
        const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
        const index = focusElement.attr("index");
        const tempInfo = focusElement.data().tag === "bottom" ? this.componentsHideArr : this.componentsArr;
        const { events } = tempInfo[index].data;
        this.$delete(events, key);
        this.$set(tempInfo, Number(index), tempInfo[index]);
        this.$store.commit("removeEvents", key);
      },
      /**
       * 关闭事件抽屉
       */
      closeEventsDrawer() {
        this.isAddEvent = false;
      },

      /**
       * 设置组件脚本编辑器
       */
      setAceEditor(state = "create", index = 0) {
        this.addScriptListModal = true;
        rxjs.timer(500).subscribe(() => {
          ace.require("ace/ext/language_tools");
          // 解决控制台 worker-javascript.js 404问题
          ace.config.set("workerPath", "/ui-builder/js/lay-module/ace");
          this.editorAce = ace.edit("editor");
          this.editorAce.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, //只能补全
          });

          this.editorAce.setTheme("ace/theme/monokai"); //monokai模式是自动显示补全提示
          this.editorAce.getSession().setMode("ace/mode/javascript"); //语言
          this.editorAce.setFontSize(16);
          switch (state) {
            case "create":
              this.scriptForm = {
                scriptKey: "",
                scriptName: "",
                isEdit: false,
              };
              break;
            case "edit":
              let scripts = this.attrObject.scripts;
              scripts = JSON.parse(scripts);
              this.scriptForm = {
                scriptKey: scripts[index].key,
                scriptName: scripts[index].title,
                isEdit: true,
                index,
              };
              this.editorAce.setValue(scripts[index].value);
              break;
          }
        });
      },
      /**
       * 删除组件脚本
       */
      deleteAceEditor(index) {
        let scripts = this.attrObject.scripts;
        scripts = JSON.parse(scripts);
        this.$delete(scripts, index);
        this.$set(this.attrObject, "scripts", JSON.stringify(scripts));
        this.changeAttrObject();
      },
      /**
       * 运行组件脚本
       */
      runAceEditorCode(index) {
        let scripts = this.attrObject.scripts;
        scripts = JSON.parse(scripts);
        try {
          eval(scripts[index].value);
        } catch (error) {
          console.log(error);
        }
      },
      /**
       * 添加组件脚本
       */
      async getEditorValue() {
        const results = await new Promise((res) => {
          this.$refs.scriptRuleForm.validate((valid) => {
            if (valid) {
              res(false);
            } else {
              console.log("error submit!!");
              res(true);
            }
          });
        });
        let scripts = this.attrObject.scripts;
        const aceValue = this.editorAce.getValue();
        if (results) {
          antd.message.warn("请填写正确的脚本名称和key!");
          return;
        } else if (!aceValue) {
          antd.message.warn("请填写正确的脚本内容!");
          return;
        }
        this.addScriptListModal = false;
        if (!scripts) {
          scripts = [];
        } else {
          scripts = JSON.parse(scripts);
        }
        if (!scripts.length) {
          scripts.push({
            value: aceValue,
            title: this.scriptForm.scriptName,
            key: this.scriptForm.scriptKey,
          });
        } else if (scripts.length && !this.scriptForm.isEdit) {
          const isReapt = scripts.every((c) => c.key === this.scriptForm.scriptKey);
          if (isReapt) {
            antd.message.warn("脚本key不能重复");
            return;
          }
          scripts.push({
            value: aceValue,
            title: this.scriptForm.scriptName,
            key: this.scriptForm.scriptKey,
          });
        } else if (this.scriptForm.isEdit) {
          scripts[this.scriptForm.index] = {
            value: aceValue,
            title: this.scriptForm.scriptName,
            key: this.scriptForm.scriptKey,
          };
        }
        this.$set(this.attrObject, "scripts", JSON.stringify(scripts));
        this.changeAttrObject();
      },
    },
  };
  window.componentsMixin = minxin;
})();
