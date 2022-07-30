/**
 * 数据转换
 */
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

Vue.component("q-data-transform", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;text-align:center;border-radius: 4px;display:flex;justify-content: center;
            align-items: center;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-data-transform/q-data-transform.css" rel="stylesheet"> 
            <span class="default-font">
              <a-icon type="interaction" style="padding-right: 5px" />
              数据转换
              <a-icon type="sync" v-if="isLoading" style="font-size: 18px;animation: fa-spin 2s infinite linear;"/>
            </span>
            <q-modal class="modal-box" width="50%" okText="保存" title="编辑数据转换" v-if="showEditModal" @ok="confirmFun" @cancel="cancleFun" :visible.sync="showEditModal">
            <template slot="modalBody">
                <a-row>
                    <a-col :span="11">
                        <a-row type="flex" align="middle">
                            <a-col flex="80px">输入组件：</a-col>
                            <a-col flex="auto">
                                <a-input placeholder="" disabled v-model="transfromData.sender" />
                            
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="11" :push="2">
                        <a-row type="flex" align="middle">
                            <a-col flex="80px">输出组件：</a-col>
                            <a-col flex="auto">
                                <a-select  style="width:100%" @change="outDataChange"  mode="multiple" :maxTagCount="1" :value="transfromData.receiver">
                                <a-select-option  @mouseenter="focusSelectCom" @mouseleave="blurSelectCom" :value="key.id"  v-for="(key,i) in outDataSelList" :key="key.id"><strong>{{JSON.parse(key.dataset.data).name}}：</strong>{{key.id}}</a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
                <a-row :gutter="[0, 20]">
                    <a-col :span="24">
                        <div class="transform-options-wrapper">
                            <a-tabs default-active-key="1" tab-position="left" class="transform-tabs-wrapper" @change="tabsChange">
                                <a-tab-pane key="1" tab="管道" >
                                <a-input-search style="margin:8px 0;padding-right: 10px" placeholder="方法查找" @change="onChange" size="small" />
                                <a-tree
                                  :expanded-keys="expandedKeys"
                                  :auto-expand-parent="autoExpandParent"
                                  :tree-data="pipeTreeData"
                                  @expand="onExpand"
                                  @select="(e,sel) => {
                                    this.showDes(e,sel)
                                  }"
                                >
                                  <template slot="title" slot-scope="{ title,  selfData}">
                                    <span v-if="title.indexOf(searchValue) > -1">
                                      {{ title.substr(0, title.indexOf(searchValue)) }}
                                      <span style="color: #f50">{{ searchValue }}</span>
                                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                                    </span>
                                    <span v-else>{{ title }}</span>
                                    <a-icon type="plus" style="color: #1890FF;" @click.stop="pipeTreeSelect(selfData, 'add')"/>
                                  </template>
                                </a-tree> 
                                </a-tab-pane>
                                <a-tab-pane key="2" tab="函数">
                                <a-input-search style="margin:8px 0;padding-right: 10px" placeholder="方法查找" @change="onChange" size="small" />
                                <a-tree
                                  :expanded-keys="expandedKeys"
                                  :auto-expand-parent="autoExpandParent"
                                  :tree-data="funTreeData"
                                  @expand="onExpand"
                                  @select="(e,sel) => {
                                    this.showDes(e,sel)
                                  }"
                                >
                                  <template slot="title" slot-scope="{ title, selfData }">
                                    <span v-if="title.indexOf(searchValue) > -1">
                                      {{ title.substr(0, title.indexOf(searchValue)) }}
                                      <span style="color: #f50">{{ searchValue }}</span>
                                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                                    </span>
                                    <span v-else>{{ title }}</span>
                                    <a-icon type="plus" style="color: #1890FF;" @click.stop="pipeTreeSelect(selfData, 'add')"/>
                                  </template>
                                </a-tree>
                                </a-tab-pane>
                                <a-tab-pane key="3" tab="自定义">
                                <a-input-search style="margin:8px 0;padding-right: 10px" placeholder="方法查找" @change="onChange" size="small" />
                          
                                <a-tree
                                  :expanded-keys="expandedKeys"
                                  :auto-expand-parent="autoExpandParent"
                                  :tree-data="customTreeData"
                                  @expand="onExpand"
                                  style="position: relative"
                                  @select="(e,sel) => {
                                    this.showDes(e,sel)
                                  }"
                                >
                                  <template slot="key" slot-scope="{ title, options }">{{title}}
                                  <a-icon type="plus" style="color: #1890FF; position: absolute;top: 12px; right: 65px;" @click.stop="handleCustomFun(options, 'add')"/>
                                  
                                  </template>
                                  <template slot="title" slot-scope="{ title,selfData }">
                                    <span v-if="title.indexOf(searchValue) > -1">
                                      {{ title.substr(0, title.indexOf(searchValue)) }}
                                      <span style="color: #f50">{{ searchValue }}</span>
                                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                                    </span>
                                    <span v-else @mouseover.stop="showCusHandel">{{ title }} </span>
                                    <a-icon type="plus" style="color: #1890FF;" @click.stop="pipeTreeSelect(selfData, 'add')"/>
                                    <a-icon type="edit" style="color: #1890FF" @click.stop="handleCustomFun(selfData, 'edit')"/>
                                    <a-icon type="delete" style="color: #e74e37" @click.stop="handleCustomFun(selfData, 'del')"/>
                                  </template>
                                 
                                </a-tree>
                                </a-tab-pane>
                            </a-tabs>
                            <div class="transform-selected-wrapper">
                                <div class="transform-selected-show" id="transform-selected-show">
                                <a-textarea class="transform-selected-show-textarea" placeholder="" v-model="transfromData.transfSelValue" style="display: none" />
                                  <div class="transform-selected-item" v-if="transfromData.transfSelArr.length" >
                                    <div class="label">操作</div>
                                    <div class="condition">条件</div>
                                  </div>
                                  <div class="transform-selected-item" v-for="(item,i) in transfromData.transfSelArr" :key="i" @click=showDes({},{},item)>
                                    <div class="label">{{item.name}}</div>
                                        <div class="condition" :style="{'flex-direction': !item.options.setting || item.options.setting.length === 0  ? 'row-reverse' : 'row'}">
                                            <div v-for="(inp,k) in item.options.setting" :key="k" style="position: relative;" :style="{width: item.options.setting.length === 1 ? '45%' : 90 / item.options.setting.length + '%'}">
                                                <a-select  v-if="inp.type === 'select'" style="width: 100%" size="small" v-model="item.options[inp.valueKey]">
                                                    <a-select-option  :value="op.value" v-for="(op, o) in inp.options" :key="o">{{op.label}}</a-select-option>
                                                </a-select>
                                                <a-input size="small" v-else  v-model="item.options[inp.valueKey]" :placeholder="inp.label" :disabled="inp.disabled"></a-input>
                                                <a-icon style="cursor: pointer;position: absolute;top: 10px" type="edit" @click="editArg(item, k)" v-show="item.options.isEdit" />
                                                <q-modal class="modal-box" width="30%" okText="保存" title="参数编辑" v-if="editArgModal" @ok="confirmEditArg" @cancel="cancleCustom" :visible.sync="editArgModal">
                                                <template slot="modalBody">
                                                    <div class="transform-editArg" :style="{'border': (!editArgErrMsg) ? 'none' : '1px solid #f5222d !important'}">
                                                    <div id="transform-editArg" class="transform-editArg"></div>
                                                    </div>
                                                    <div v-if="editArgErrMsg" style="color: #f5222d">{{editArgErrMsg}}</div>
                                                </template>
                                                </q-modal>
                                            </div>
                                            <div>
                                             
                                              <a-icon style="cursor: pointer;" type="delete" @click="delTransSelected(item, i)" />
                                            </div>
                                        </div>
                                  </div>
            
                                </div>
                                <div class="selected-des" :class="{'hide-selected-des': selectedDesClass}" v-show="transfSelDes">
                                    <div class="selected-des-title"><a-icon type="close" class="selected-des-title-icon" @click="selectedDesClick('close')"/><a-icon class="selected-des-title-icon"  :type="!selectedDesClass ? 'down' : 'up'" @click="selectedDesClick('hideAndShow')" /></div>
                                    <div class="selected-des-content" v-html="transfSelDes" v-show="!selectedDesClass"></div>
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-row>
                <a-row>
                    <div class="transform-output-wrapper">
                        <div class="transform-output-title">转换结果： <div style="flex-direction: row-reverse;width:140px;display: flex; justify-content: space-between;
                        align-items: center;">
                            <a-button size="small" style="padding 0 5px" @click="preview" v-if="transfromData.transfSelArr.length">预览</a-button>
                            <a-select  style="width:100px" @change="showDataChange" size="small"  :maxTagCount="1" :value="showDataListVal">
                             <a-select-option  :value="key.value"  v-for="(key,i) in showDataList" :key="i">{{key.label}}</a-select-option>
                            </a-select>
                            </div>
                            </div>
                       
                        <div id="transform-output-wrapper"></div>
                    </div>
                </a-row>
            </template>
          </q-modal>
          <q-modal class="modal-box" width="30%" okText="保存" :title="customModalTitle" v-if="customModal" @ok="confirmCustom" @cancel="cancleCustom" :visible.sync="customModal">
          <template slot="modalBody">
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-form-item v-for="(form,f) in formData"
                :key="f"
                :label="form.label"
                >
              <a-input   :disabled="form.disabled"  v-decorator="form.decorator || []"/>
            </a-form-item>
            <a-form-item  label="实现函数">
                <div id="transform-customEdit" class="transform-customEdit"></div>
            </a-form-item>
            </a-form>
          </template>
          </q-modal>
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
      // options: this.data.options || {},
      transfromData: {
        transfSelValue: "this",
        transfSelArr: [],
        receiver: [],
        originData: [],
        sender: "",
        customFunData: {},
      },
      style: this.data.style,
      showEditModal: false,
      inDataSelList: [],
      inDataSeled: "",
      outDataSelList: [],
      expandedKeys: [],
      pipeExpandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      tabsSelValue: 1,
      pipeTreeData: [],
      pipeTreeList: [],
      funTreeList: [],
      funTreeData: [],
      customTreeList: [],
      customTreeData: [
        {
          selectable: false,
          title: "自定义",
          key: "自定义",
          scopedSlots: { title: "key" },
          slots: { title: "key" },
          belongto: "custom",
          children: [],
        },
      ],
      selectedDesClass: false,
      transfSelDes: "",
      editorAce: null,
      inputEditorAce: null,
      aceBeautify: null,
      dv: null,
      optionsObservable: null,
      customModal: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      formData: [
        {
          label: "方法名称",
          validateStatus: "",
          help: "",
          decorator: ["methodName", { rules: [{ required: true, message: "请输入方法名称!" }] }],
        },
        {
          label: "方法标识",
          validateStatus: "",
          help: "",
          decorator: ["methodCode", { rules: [{ required: true, message: "请输入方法标识!" }] }],
          disabled: false,
        },
        { label: "方法描述", validateStatus: "", help: "", decorator: ["methodDes"] },
      ],
      customEdit: null,
      customModalTitle: "",
      CustomDataSet: null,
      customtype: "add",
      isLoading: false,
      sourceData: [],
      showDataList: [
        {
          label: "10条",
          value: 10,
        },
        {
          label: "20条",
          value: 20,
        },
        {
          label: "30条",
          value: 30,
        },
        {
          label: "全部",
          value: "all",
        },
      ],
      showDataListVal: 10,
      noFieterOriginData: [],
      editArgModal: false,
      editArgEditor: null,
      // editArgHasErr: false,
      editArgErrMsg: "",
      editArgCurData: null,
    };
  },
  mixins: [componentsMixin],
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style, options } = newValue;
          this.style = style;
          // this.sender = sender;
        } catch (error) {}
      },
      deep: true,
    },
    "transfromData.transfSelArr": {
      handler(newValue, oldValue) {
        try {
          this.transfromData.transfSelValue = "this";
          if (newValue.length) {
            newValue.map((it) => {
              if (it.belongto === "fun") {
                this.transfromData.transfSelValue += `['${it.options.funName}'](${JSON.stringify(it.options)})`;
              } else if (it.belongto === "custom") {
                this.transfromData.transfSelValue += `['${it.options.funName}'](${JSON.stringify(this.sourceData)})`;
              } else {
                let tempObj = _.cloneDeep(it);
                if (tempObj.options.handleObj) {
                  tempObj.options.handleObj = JSON.parse(tempObj.options.handleObj);
                }

                this.transfromData.transfSelValue += `['${tempObj.options.funName}']('${JSON.stringify(tempObj)}')`;
                // this.transfromData.transfSelValue += `['${tempObj.options.funName}'](${JSON.stringify(
                //   this.sourceData
                // )}, '${JSON.stringify(tempObj)}')`;
              }
            });
          } else {
            this.selectedDesClick("close");
            this.transfromData.originData = JSON.parse(JSON.stringify(this.sourceData));
            // this.setEditData(this.transfromData.originData);
            // this.transfromData();
          }
        } catch (error) {}
      },
      deep: true,
    },
    curMenu(val) {
      if (this.data.id !== this.$root.curComponent.id) {
        return;
      }
      this.handleMenuClick(val);
    },

    "transfromData.originData": {
      handler(newValue, oldValue) {
        if (!this.editorAce) return;
        try {
          let tempData = _.cloneDeep(newValue);
          // let tempData = typeof newValue === "object" ? JSON.stringify(newValue) : newValue;
          if (typeof this.showDataListVal === "number" && Array.isArray(newValue)) {
            tempData = newValue.filter((it, i) => i < this.showDataListVal);
          }
          this.editorAce.setValue(JSON.stringify(tempData));
          this.aceBeautify.beautify(this.editorAce.getSession(), {
            indent_size: 2,
          });
          this.editorAce.setReadOnly(true);
          this.editorAce.getSession().setUseWrapMode(true);
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },

    editorAce(edit) {
      this.transformPreview().subscribe((x) => {
        rxjs.timer(500).subscribe(() => {
          this.transfromData.originData = x;
        });
      });
    },
  },
  methods: {
    parseOptions(data) {
      if (typeof data === `string`) {
        return JSON.parse(data);
      }
      return data;
    },
    handleMenuClick(e) {
      this.resetData();
      this.data.transfromData = delTransf(this.data.transfromData);
      this.$set(this, "transfromData", _.cloneDeep(this.data.transfromData));
      this.sourceData = JSON.parse(JSON.stringify(this.data.transfromData.originData));

      switch (e.key) {
        case "数据流转":
          if (this.transfromData.receiver.length === 0) {
            return new Promise((resolve, reject) => {
              this.$message.warning("请先绑定输出组件！");
              reslove();
              return;
            });
          }
          this.showDataListVal = "all";
          this.transformPreview().subscribe((x) => {
            this.transfromData.originData = x;
          });

          return this.dataFlow();
          break;
        case "1":
          this.startEdit();

          break;
      }
    },
    startEdit() {
      const filterArr = ["API接口数据", "数据库表数据", "数据转换"];
      this.outDataSelList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
        .filter((i) => i.id !== this.$el.id)
        .filter((i) => !filterArr.includes(JSON.parse(i.dataset.data).name));
      this.showEditModal = true;
      this.$nextTick(() => {
        rxjs.timer(500).subscribe(() => {
          this.editorAce = this.initAceEdit("transform-output-wrapper");
          this.dv = new DataSet(this.sourceData);

          /* 有自定义方法则回显方法 */
          if (this.transfromData.customFunData.length) {
            this.customTreeData = this.transfromData.customFunData;
            this.CustomDataSet = class CustomDataSet extends DataSet {};
            this.customTreeData[0].children.map((it) => {
              this.CustomDataSet.prototype[it.options.funName] = new Function(
                `return function (data) {${it.options.fun}}`
              )();
            });
            this.dv = new this.CustomDataSet(this.sourceData);
          }
        });
      });
    },

    /* 输出组件 */
    outDataChange(value) {
      this.transfromData.receiver = value;
    },
    /* 保存 */
    confirmFun() {
      try {
        if (!!this.dv.errs) throw "未能成功转换数据，请检查";
        if (this.transfromData.sender && this.transfromData.receiver.length) {
          // 将数据保存至 该组件data
          this.$set(this.data, "transfromData", {
            transfSelValue: this.transfromData.transfSelValue,
            transfSelArr: this.transfromData.transfSelArr,
            sender: this.transfromData.sender,
            receiver: this.transfromData.receiver,
            originData: this.sourceData,
            customFunData: this.customTreeData,
          });
        } else {
          throw "请绑定输出组件！";
        }
      } catch (error) {
        this.$message.warning(error);
        this.showEditModal = true;
      }
    },
    cancleFun() {
      this.resetData();
    },
    methodChange() {},
    tabsChange(key) {
      this.tabsSelValue = key;
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const treeList = this.tabsSelValue === 1 ? this.pipeTreeList : this.funTreeList;
      const treeData = this.tabsSelValue === 1 ? this.pipeTreeData : this.funTreeData;
      const value = e.target.value;
      const expandedKeys = treeList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    /* 方法选中 */
    pipeTreeSelect(option) {
      if (!this.sourceData.length) {
        this.$message.warning("请先传入转换数据！");
        return;
      }
      this.selectedDesClass = false;
      this.transfSelDes = option.des;
      const deepCopy = _.cloneDeep(option);
      if (this.dv) {
        this.transfromData.transfSelArr.push(deepCopy);
      }
    },
    /* 方法删除 */
    delTransSelected(data, index) {
      console.log(index);
      // const key = data.belongto === "pipe" ? "name" : "type";
      this.$confirm({
        title: "删除",
        content: "确定要删除该方法?",
        okText: "确定",
        // okButtonProps: {
        //   props: { disabled: true },
        // },
        cancelText: "取消",
        onOk: () => {
          this.$set(
            this.transfromData,
            "transfSelArr",
            _.remove(this.transfromData.transfSelArr, (it, i) => {
              return index !== i;
            })
          );
        },
        onCancel() {
          // console.log('Cancel');
        },
      });
    },
    selectedDesClick(type) {
      type === "close" ? (this.transfSelDes = "") : (this.selectedDesClass = !this.selectedDesClass);
    },
    getTransfTreeData(data) {
      let treeArr = [];
      let parentArr = [];
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          if (!parentArr.includes(data[key].parent)) {
            parentArr.push(data[key].parent);
            treeArr.push({
              selectable: false,
              title: data[key].parent,
              key,
              scopedSlots: {
                title: "key",
              },
              belongto: data[key].belongto,
              children: [],
            });
          }
          treeArr.map((it) => {
            const tempData = {
              ...data[key],
              ...{
                belongto: data[key].belongto,
                title: key,
                key,
                scopedSlots: { title: "title", selfData: "selfData" },
              },
            };
            if (it.title === data[key].parent) it.children.push({ ...tempData, selfData: tempData });
          });
        }
      }
      treeArr.map((it) => {
        switch (it.belongto) {
          case "fun":
            this.funTreeData.push(it);
            break;
          case "pipe":
            this.pipeTreeData.push(it);
        }
      });
      this.getTreeList(this.pipeTreeData, this.pipeTreeList);
      this.getTreeList(this.funTreeData, this.funTreeList);
    },
    getTreeList(data, treeList) {
      data.map((it) => {
        treeList.push(it);
        if (it.children && it.children.length) {
          this.getTreeList(it.children, treeList);
        }
      });
    },
    initAceEdit(el) {
      let editor = null;
      ace.require("ace/ext/language_tools");

      // 解决控制台 worker-javascript.js 404问题
      ace.config.set("workerPath", "/ui-builder/js/lay-module/ace");
      editor = ace.edit(el);
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        autoScrollEditorIntoView: true, //启用滚动
        enableLiveAutocompletion: true, //只能补全
      });

      // Automatically scrolling cursor into view after selection change this will be disabled in the next version
      // set editor.$blockScrolling = Infinity to disable this message

      editor.$blockScrolling = Infinity; // 去除控制台警告

      editor.setTheme("ace/theme/monokai"); //monokai模式是自动显示补全提示
      editor.getSession().setMode("ace/mode/javascript"); //语言
      editor.setFontSize(16);
      this.aceBeautify = ace.require("ace/ext/beautify");
      return editor;
    },
    resetData() {
      this.$set(this, "transfromData", {
        transfSelValue: "this",
        transfSelArr: [],
        receiver: [],
        originData: [],
        sender: "",
      });
      this.showDataListVal = 10;
    },
    receiveInfo() {
      const { id, name } = this.data;
      obEvents.currentSelectedPoint(id).subscribe(async (data) => {
        const { body = {}, sender, type } = data;
        const { select = [] } = body;
        if (type === "info") {
          if (Array.isArray(body)) {
            this.data.transfromData = delTransf(this.data.transfromData);
            this.$set(this.data.transfromData, "originData", body || []);
            this.$set(this.data.transfromData, "sender", sender);
          } else {
            this.$message.warn(`${name}:接收数据与当前组件不匹配!`);
          }
        } else if (type === "event") {
          for (let element of select) {
            if (element === "handleMenuClick") {
              await this[element]({ key: "数据流转" });
              return;
            }
            await this[element]();
          }
        }
      });
    },
    /* 定义方法 */
    handleCustomFun(options, type) {
      this.customtype = type;
      switch (type) {
        case "add":
          this.loadCustomEdit("新增自定义方法");
          this.formData[1].disabled = false;
          break;
        case "del":
          this.$confirm({
            title: "删除",
            content: "确定要删除该方法?",
            okText: "确定",
            okType: "primary",
            // okButtonProps: {
            //   props: { disabled: true },
            // },
            cancelText: "取消",
            onOk: () => {
              this.CustomDataSet.prototype[options.key] = undefined;
              this.customTreeData[0].children = _.remove(this.customTreeData[0].children, (it) => {
                return it.key !== options.key;
              });
              this.selectedDesClick("close");
            },
            onCancel() {
              // console.log('Cancel');
            },
          });

          break;
        case "edit":
          this.loadCustomEdit(`修改自定义方法-${options.key}`);
          this.formData[1].disabled = true;
          let temp = {
            methodCode: options.key,
            methodName: options.type,
            methodDes: options.des,
            editData: options.options.fun,
          };
          rxjs.timer(600).subscribe(() => {
            this.customEdit.setValue(temp["editData"]);
            delete temp["editData"];
            this.form.setFieldsValue(temp);
          });
          break;
      }
    },
    loadCustomEdit(title) {
      this.customModalTitle = title;
      this.customModal = !this.customModal;
      rxjs.timer(500).subscribe(() => {
        this.customEdit = this.initAceEdit("transform-customEdit");
        this.customEdit.setValue(`/* @params data 为当前组件绑定数据 \n this.row 用于输出数据 */   \n
                try {
                  // 自定义处理方法
                   this.rows = data
                   return this
                } catch (error) {
                    this.errs = error.message;
                }`);
        this.aceBeautify.beautify(this.customEdit.getSession());
      });
    },
    /* 展示数据条数 */
    showDataChange(e) {
      this.showDataListVal = e;
      this.transformPreview().subscribe((x) => {
        this.transfromData.originData = x;
      });
    },
    showCusHandel() {},
    /* 自定义方法保存 */
    confirmCustom(e) {
      this.form.validateFields(["methodName", "methodCode", "methodDes"], (errors, values) => {
        if (!errors) {
          this.dv = this.dv
            ? this.dv
            : this.CustomDataSet
            ? new this.CustomDataSet(this.sourceData)
            : new DataSet(this.sourceData);
          if (values.methodCode) {
            const source = rxjs.Observable.create((observer) => {
              if (this.dv[values.methodCode] !== undefined && this.customtype === "add") {
                this.form.setFields({
                  methodCode: {
                    value: values.methodCode,
                    errors: [
                      {
                        message: "存在相同方法！",
                        field: "methodCode",
                      },
                    ],
                  },
                });
                observer.error("存在相同方法！");
              }

              if (!/[a-zA-Z]+/.test(values.methodCode)) {
                this.form.setFields({
                  methodCode: {
                    value: values.methodCode,
                    errors: [
                      {
                        message: "方法标识只支持字母！",
                        field: "methodCode",
                      },
                    ],
                  },
                });
                observer.error("方法标识只支持字母！");
              }
              observer.next();
            });
            source.subscribe({
              next: (v) => {
                //TODO 校验edit是否存在错误
                //TODO 预执行
                const saveObj = {
                  methodCode: values.methodCode,
                  methodName: values.methodName,
                  methodDes: values.methodDes || "",
                  editData: this.customEdit.getValue(),
                };
                if (this.customModalTitle === "新增自定义方法") {
                  const obj = this.getCustomChildren(saveObj);
                  this.customTreeData[0].children.push({ ...obj, selfData: obj });
                  // 用于回显
                } else {
                  const funCode = this.customModalTitle.split("-")[1];
                  const obj = this.getCustomChildren(saveObj);
                  this.customTreeData[0].children.map((it) => {
                    if (it.key === funCode) {
                      for (const keys in obj) {
                        if (Object.hasOwnProperty.call(obj, keys)) {
                          it[keys] = obj[keys];
                        }
                      }
                      it.selfData = obj;
                    }
                  });
                }

                if (!this.CustomDataSet) this.CustomDataSet = class CustomDataSet extends DataSet {};
                this.customTreeData[0].children.map((it) => {
                  this.CustomDataSet.prototype[it.options.funName] = new Function(
                    `return function (data) {${it.options.fun}}`
                  )();
                });
                this.dv = new this.CustomDataSet(this.sourceData);

                this.customModal = false;
              },
              error: (err) => {
                this.customModal = true;
                console.error(err);
              },
              complete: () => {},
            });
          }
        } else {
          this.customModal = true;
        }
      });
    },
    getCustomChildren(values) {
      return {
        name: values.methodName,
        options: {
          funName: values.methodCode,
          fun: values.editData,
          setting: [],
        },
        des: values.methodDes,
        parent: "自定义",
        belongto: "custom",
        title: values.methodName,
        key: values.methodCode,
        scopedSlots: { title: "title", selfData: "selfData" },
      };
    },
    cancleCustom() {},
    /* 预览 */
    transformPreview() {
      this.isLoading = true;
      let nextData;
      return rxjs.Observable.create((ovserve) => {
        this.dv = this.CustomDataSet ? new this.CustomDataSet(this.sourceData) : new DataSet(this.sourceData);
        this.dv.runeval(this.transfromData.transfSelValue);
        rxjs.timer(500).subscribe((x) => {
          // let tempSourceData = [];
          // let tempRowData = [];
          // if (typeof this.showDataListVal === "number" && Array.isArray(this.dv.rows)) {
          //   tempRowData = this.dv.rows.filter((it, i) => i < this.showDataListVal);
          //   tempSourceData = this.sourceData.filter((it, i) => i < this.showDataListVal);
          // } else {
          //   tempSourceData = this.sourceData;
          //   tempRowData = this.dv.rows;
          // }
          if (this.transfromData.transfSelValue === "this") nextData = _.cloneDeep(this.sourceData);
          if (this.dv.errs) {
            nextData = this.dv.errs;
          } else {
            nextData = this.dv.rows;
          }
          ovserve.next(nextData);
          // this.setEditData(nextData);
          this.isLoading = false;
        });
      });
    },
    setEditData(data) {
      if (this.editorAce) {
        this.editorAce.setValue(JSON.stringify(data));
        this.aceBeautify.beautify(this.editorAce.getSession());
      }
    },
    preview() {
      this.transformPreview().subscribe((x) => {
        this.transfromData.originData = x;
      });
    },
    showDes(e, node, other) {
      this.selectedDesClass = false;
      this.transfSelDes = other ? other.des : node.selectedNodes[0].data.props.des;
    },
    dataFlow() {
      let promiseArr = [];
      this.transfromData.receiver.map((it) => {
        promiseArr.push(
          new Promise((resolve, reject) => {
            rxjs.timer(550).subscribe(() => {
              obEvents.setSelectedPoint({ receiver: it, sender: this.data.id }, this.transfromData.originData);
              resolve();
            });
          })
        );
      });
      return Promise.all(promiseArr);
    },
    editArg(data, index) {
      this.editArgErrMsg = "";
      this.editArgModal = true;
      data.index = index;
      this.editArgCurData = data;
      rxjs.timer(500).subscribe(() => {
        this.editArgEditor = this.initAceEdit("transform-editArg");
        if (data.options[data.options.setting[index].valueKey]) {
          this.editArgEditor.setValue(data.options[data.options.setting[index].valueKey]);
        }
      });

      console.log(data);
    },
    confirmEditArg() {
      let tempData = this.editArgEditor.getValue();
      try {
        switch (this.editArgCurData.key) {
          case "push":
          case "unshift":
            // const regex = /\{(.+?)\}/g;
            // let result = tempData.match(regex);
            if (Object.prototype.toString.call(JSON.parse(tempData)) !== "[object Object]") {
              throw new Error();
            } else {
              // this.editArgCurData.options.setting[this.editArgCurData.index]["puppet"] = tempData;
              this.editArgCurData.options[this.editArgCurData.options.setting[this.editArgCurData.index]["valueKey"]] =
                tempData;
            }
            break;
        }
      } catch (error) {
        this.editArgModal = true;
        this.editArgErrMsg = this.editArgCurData.options.errorMsg[this.editArgCurData.index];
      }
    },
  },
  created() {},
  destroyed() {},
  updated() {
    // this.$set(this, "transfromData", delTransf(this.data.transfromData));
  },
  mounted() {
    this.$nextTick(() => {
      this.getTransfTreeData(DataSet.transfMapping);
    });

    this.receiveInfo();
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
