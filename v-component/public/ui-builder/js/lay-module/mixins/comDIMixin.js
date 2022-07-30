(function () {
  const minxin = {
    data() {
      return {
        comNum: {}, // DI组件菜单提示标识
        nodeidArr: {
          jzStep: [],
          jzChart: [],
          jzSingleParam: [],
        }, // 所有DI节点的nodeid
      };
    },
    methods: {
      focusChangeCom(e) {
        const element = document.querySelector("#" + e.key);
        if (!element) return;
        if (e.type === "warning") {
          element.classList.add("focusWarning");
        } else {
          element.classList.add("focusError");
        }
      },
      blurChangeCom(e) {
        const element = document.querySelector("#" + e.key);
        if (!element) return;
        element.classList.remove("focusWarning", "focusError");
      },
      getParam(com) {
        if (com.paramList) {
          if (typeof com.paramList === "string") {
            com.paramList = JSON.parse(com.paramList);
          }
          const paramList = com.paramList.reduce((pre, cur) => {
            const { key, default: value } = cur;
            pre[key] = value;
            return pre;
          }, {});
          paramList.name = com.name ? com.name : "";
          paramList.id = com.id ? com.id : "";
          return paramList;
        }
      },
      getNodeId() {
        const comTree = _.cloneDeep(this.comTree);
        if (!comTree["DI组件"] || comTree["DI组件"].length === 0) return;
        comTree["DI组件"].forEach((item) => {
          const comDINode = this.getParam(item);
          if (comDINode.nodeid) {
            switch (comDINode.name) {
              case "jz-step":
                this.nodeidArr.jzStep.push(comDINode.nodeid);
                break;
              case "jz-chart":
                this.nodeidArr.jzChart.push(comDINode.nodeid);
                break;
              case "jz-single-param":
                this.nodeidArr.jzSingleParam.push(comDINode.nodeid);
                break;
            }
          }
        });
      },
      checkUp: _.debounce(function () {
        this.$nextTick(() => {
          console.log("检查组件~~~");
          const comTree = _.cloneDeep(this.comTree);
          const componentsArr = _.cloneDeep([...this.componentsArr, ...this.componentsHideArr]);
          if (!Object.keys(comTree).length) return;
          this.comNum = {};
          componentsArr.forEach((com, index) => {
            if (com.isDel) return;
            if (com.data.componentName && com.data.componentName !== "") {
              this.checkUpUibCom(com, comTree);
            } else if (com.data.enName && com.data.enName !== "") {
              this.checkUpDeepCharts(com, comTree);
            } else {
              this.checkUpDiCom(com, comTree);
            }
          });
          // 检查完组件后更新图层面板组件树，防止组件更改后组件树name错误
          setTimeout(() => {
            this.getTreeData();
          }, 100);
        });
      }, 0),

      /*
       * 检查UIB组件
       */
      checkUpUibCom(com, comTree) {
        const { type, componentName } = com.data;
        const menuArr = comTree[type];
        const temp = this.comNum[type] && Object.keys(this.comNum[type]).length !== 0 ? this.comNum[type] : {};
        menuArr.forEach((item, index) => {
          if (item.componentName === componentName) {
            temp[item.text] = this.componentCount(temp[item.text]);
          }
        });
        this.comNum[type] = temp;
      },

      /*
       * 检查deepCharts图元组件
       */
      checkUpDeepCharts(com, comTree) {
        const { type = "deepCharts", enName } = com.data;
        const menuArr = comTree[type];
        const temp = this.comNum[type] && Object.keys(this.comNum[type]).length !== 0 ? this.comNum[type] : {};
        menuArr.forEach((item, index) => {
          if (item.enName === enName) {
            temp[item.enName] = this.componentCount(temp[item.enName]);
          }
        });
        this.comNum[type] = temp;
      },

      /*
       * 检查DI组件
       */
      checkUpDiCom(com, comTree) {
        type = "DI组件";
        const menuArr = comTree[type];
        const temp =
          this.comNum[type] && Object.keys(this.comNum[type]).length !== 0 ? _.cloneDeep(this.comNum[type]) : {};
        const eleNode = this.getParam(com.data);
        if (!eleNode || !eleNode.name) return;
        menuArr.forEach((item, index) => {
          const comDINode = this.getParam(item);
          // 使用分析流名称+节点名称作为key，防止多分析流发布时出现相同名称的DI组件
          const key = item.wfName ? item.wfName + item.text : item.text;
          switch (eleNode.name) {
            case "jz-step":
              if (comDINode.name === "jz-step") {
                temp[key] = temp[key] && Object.keys(temp[key]).length !== 0 ? temp[key] : { num: 0 };
                temp[key].num = this.checkUpJzStep(eleNode, comDINode, temp[key].num, item);
                item.wfName ? (temp[key].wfName = item.wfName) : void 0;
              }
              break;
            case "jz-chart":
              if (comDINode.name === "jz-chart") {
                temp[key] = temp[key] && Object.keys(temp[key]).length !== 0 ? temp[key] : { num: 0 };
                temp[key].num = this.checkUpJzChart(eleNode, comDINode, temp[key].num, item, menuArr);
                item.wfName ? (temp[key].wfName = item.wfName) : void 0;
              }
              break;
            case "jz-single-param":
              if (comDINode.name === "jz-single-param") {
                temp[key] = temp[key] && Object.keys(temp[key]).length !== 0 ? temp[key] : { num: 0 };
                temp[key].num = this.checkUpJzSingleParam(eleNode, comDINode, temp[key].num, item, menuArr);
                item.wfName ? (temp[key].wfName = item.wfName) : void 0;
              }
              break;
            default:
              if (eleNode.name === comDINode.name) {
                temp[key] = temp[key] && Object.keys(temp[key]).length !== 0 ? temp[key] : { num: 0 };
                temp[key].num = this.componentCount(temp[key].num);
              }
              break;
          }
        });
        this.comNum[type] = temp;
      },

      /*
       * 检查DI的jz-step(执行节点)
       */
      checkUpJzStep(eleNode, comDINode, temp, item) {
        if (!comDINode.nodeid) return temp;
        let data = _.cloneDeep($(`#${eleNode.id}`).attr("data-data"));
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        const eleIndex = Number($(`#${eleNode.id}`).attr("index"));
        if (!eleNode.nodeid) {
          this.discardedComponents(data, eleNode, "error");
          return temp;
        }
        if (eleNode.nodeid === comDINode.nodeid) {
          temp = this.changeParam(temp, data, item, eleIndex, eleNode);
          return temp;
        } else if (this.nodeidArr.jzStep.length && !this.nodeidArr.jzStep.includes(eleNode.nodeid)) {
          // 执行节点在组件菜单中不存在，标识为废弃组件
          this.discardedComponents(data, eleNode, "error");
        }
        return temp;
      },

      /*
       * 检查DI的jz-chart(图元节点)
       */
      checkUpJzChart(eleNode, comDINode, temp, item, menuArr) {
        if (!comDINode.nodeid || !comDINode.chartidx || !comDINode.layoutId) return temp;
        let data = _.cloneDeep($(`#${eleNode.id}`).attr("data-data"));
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        const eleIndex = Number($(`#${eleNode.id}`).attr("index"));
        if (!eleNode.nodeid || !eleNode.chartidx || !eleNode.layoutId) {
          this.discardedComponents(data, eleNode, "error");
          return temp;
        }
        if (eleNode.nodeid === comDINode.nodeid) {
          if (eleNode.chartidx === comDINode.chartidx && eleNode.layoutId === comDINode.layoutId) {
            temp = this.changeParam(temp, data, item, eleIndex, eleNode);
            return temp;
          }
          const jzChartArr = [];
          menuArr.forEach((comJZ) => {
            let param = {};
            if (comJZ.name === "jz-chart") {
              param = this.getParam(comJZ);
              if (param.nodeid === eleNode.nodeid) {
                jzChartArr.push(param);
              }
            }
          });
          let invalid = false;
          let isError = false;
          // 检查图元是否在组件菜单中存在且参数是否正确
          jzChartArr.forEach((layout) => {
            if (!layout || !layout.nodeid || !layout.layoutId || !layout.chartidx || layout.nodeid !== eleNode.nodeid)
              return;
            if (
              layout.nodeid === eleNode.nodeid &&
              layout.layoutId === eleNode.layoutId &&
              layout.chartidx === eleNode.chartidx
            ) {
              invalid = true;
            } else if (
              layout.nodeid === eleNode.nodeid &&
              layout.layoutId === eleNode.layoutId &&
              layout.chartidx !== eleNode.chartidx
            ) {
              isError = true;
            }
          });
          // 图元在组件菜单中存在且参数正确
          if (invalid) return temp;
          // 图元在组件菜单中存在且参数有误
          if (isError && eleNode.layoutId === comDINode.layoutId) {
            temp = "change";
            this.discardedComponents(data, eleNode, "warning");
            return temp;
          }
          this.discardedComponents(data, eleNode, "error");
          return temp;
        } else if (this.nodeidArr.jzChart.length && !this.nodeidArr.jzChart.includes(eleNode.nodeid)) {
          // 图元在组件菜单中不存在，标识为废弃组件
          this.discardedComponents(data, eleNode, "error");
        }
        return temp;
      },

      /*
       * 检查DI的jz-single-param(筛选节点)
       */
      checkUpJzSingleParam(eleNode, comDINode, temp, item, menuArr) {
        if (!comDINode.nodeid || !comDINode.key) return temp;
        let data = _.cloneDeep($(`#${eleNode.id}`).attr("data-data"));
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        const eleIndex = Number($(`#${eleNode.id}`).attr("index"));
        if (!eleNode.nodeid || !eleNode.key) {
          this.discardedComponents(data, eleNode, "error");
          return temp;
        }
        if (eleNode.nodeid === comDINode.nodeid) {
          if (eleNode.key === comDINode.key) {
            temp = this.changeParam(temp, data, item, eleIndex, eleNode);
            return temp;
          }
          const jzSingleParamArr = [];
          menuArr.forEach((comJZ) => {
            let param = {};
            if (comJZ.name === "jz-single-param") {
              param = this.getParam(comJZ);
              if (param.nodeid === eleNode.nodeid) {
                jzSingleParamArr.push(param);
              }
            }
          });
          let invalid = false;
          // 检查筛选节点是否在组件菜单中存在且参数是否正确
          jzSingleParamArr.forEach((layout) => {
            if (!layout || !layout.nodeid || !layout.key || layout.nodeid !== eleNode.nodeid) return;
            if (layout.nodeid === eleNode.nodeid && layout.key === eleNode.key) {
              invalid = true;
            }
          });
          // 筛选节点在组件菜单中存在且参数正确
          if (invalid) return temp;
          // 筛选节点不存在或者参数有误
          this.discardedComponents(data, eleNode, "error");
          return temp;
        } else if (this.nodeidArr.jzSingleParam.length && !this.nodeidArr.jzSingleParam.includes(eleNode.nodeid)) {
          // 筛选节点在组件菜单中不存在，标识为废弃组件
          this.discardedComponents(data, eleNode, "error");
        }
        return temp;
      },

      /*
       * DI节点正确时，对节点数据进行修复，防止复用节点后数据错误
       */
      changeParam(temp, data, item, eleIndex, eleNode) {
        // DI节点正确，正常计数
        temp = this.componentCount(temp);
        // 如果节点正确，但是text/image错误，就替换成新的数据
        if (!data) return temp;
        if (data.text !== item.text || data.image !== item.image) {
          data.text = item.text;
          data.image = item.image;
          // 同时把paramList/view/alt/description替换成新的,防止数据出错
          data.view ? (data.view = item.view) : null;
          data.alt = `${item.name}\n${item.text}`;
          data.description = item.description;
          data.paramList = item.paramList;
          this.componentsArr[eleIndex].data = data;
          this.$set(this.componentsArr, eleIndex, this.componentsArr[eleIndex]);
        }
        if (data.invalid) {
          Reflect.deleteProperty(data, "invalid");
          $(`#${eleNode.id}`).attr("data-data", JSON.stringify(data));
        }
        this.blurChangeCom({ key: eleNode.id });
        return temp;
      },

      /*
       * 组件计数
       */
      componentCount(temp) {
        if (temp !== "change") {
          temp = typeof temp === "number" && !isNaN(temp) ? temp + 1 : 1;
        }
        return temp;
      },

      /*
       * 添加DI节点废弃标记
       */
      discardedComponents(data, eleNode, type) {
        data.invalid = true;
        $(`#${eleNode.id}`).attr("data-data", JSON.stringify(data));
        this.blurChangeCom({ key: eleNode.id });
        this.focusChangeCom({ key: eleNode.id, type });
      },

      // DI组件判证关键字更改时，启动组件检查
      checkUpKey(key) {
        if (key === "text") {
          rxjs.timer(500).subscribe(() => {
            this.getTreeData();
          });
        }
        if (key === "nodeid" || key === "chartidx" || key === "layoutId" || key === "key") {
          this.checkUp();
        }
      },
    },
  };
  window.comDIMixin = minxin;
})();
