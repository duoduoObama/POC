/**
 * 递归subMenu组件
 */
const SubMenu = {
  template: `
        <ul v-if="menuInfo&&typeof menuInfo==='object'" :key="menuInfo.key" v-bind="$props" v-on="$listeners">
          <template v-for="subitem in menuInfo.children">
            <li :key="subitem.key" @dblclick.stop=bindDomSub(subitem)> 
              <a href="javascript:void(0);" v-bind:class="{ 'more layui-icon': subitem.children && subitem.children.length > 0 }" v-if="subitem.dom" v-html="subitem.dom" :id="subitem.id" :style="subMenuStyle"></a>
              <a href="javascript:void(0);" v-bind:class="{ 'more layui-icon': subitem.children && subitem.children.length > 0 }" v-else :id="subitem.id" :style="subMenuStyle">{{subitem.title}}</a>
              <sub-menu :key="subitem.key" :menu-info="subitem" @subMenuClick="bindDomSub" :sub-menu-style="subMenuStyle"/>
            </li>
          </template>
        </ul>
      `,
  name: "SubMenu",
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    subMenuStyle: String,
  },
  watch: {
    subMenuStyle(val) {
      this.subMenuStyle = val;
    },
  },
  methods: {
    bindDomSub(node) {
      this.$emit("subMenuClick", node);
    },
  },
};

/**
 * 菜单导航
 */
Vue.component("q-menu2", {
  template: `
  <div class="draggable2" :id="data.id" :index="index" style="background-color:#fff;" :style="data.style"
   :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0" ref="contentBody">  
    <ul class="yyui_menu1">
      <template v-for="item in options">
        <li :key="item.key" @dblclick.stop.prevent=bindDom(item) style="background-color:inherit !important;"> 
          <a href="javascript:void(0);" :id="item.id" v-if="item.dom" v-html="item.dom" style="font-size:inherit !important;color:inherit !important;"></a>
          <a href="javascript:void(0);" :id="item.id" v-else style="font-size:inherit !important;color:inherit !important;">{{item.title}}</a>
          <sub-menu :key="item.key" :menu-info="item" @subMenuClick="bindDom" :sub-menu-style="subMenuStyle"/>
        </li>
      </template>
      <span class="layui-event-btn" v-if="$root.editMode === 'edit'"> 
        <a-button @click="showMenuModal=true;selectedMenu=null;">
        <a-icon type="setting" /></a-button>
        <q-modal class="modal-box" title="菜单编辑" v-if="showMenuModal"  :visible.sync="showMenuModal" @ok="updateTree" @cancel="recoverNode">
          <template slot="modalBody">
            <a-button 
              @click="addMenu">
              <a-icon type="plus" />添加
            </a-button>
            <a-button 
              @click="delMenu">
              <a-icon type="delete" />删除
            </a-button>
            <a-button 
              @click="editMenu">
              <a-icon type="edit" />修改
            </a-button>
            <a-tree
              @select="selectMenu"
              :tree-data="tempNodes"
              :default-expand-all="true"
            />
          </template>
        </q-modal>
        <q-modal class="modal-box" title="绑定组件" v-if="showBindModal"  :visible.sync="showBindModal" @ok="updateNode">
          <template slot="modalBody">
            <a-select style="width: 100%;" v-model="selectedDom">
              <a-select-option v-for="dom in domList" :labelInValue="true" :title="dom.title" :key="dom.id" :value="dom.id" @mouseenter="focusSelectCom" @mouseleave="blurSelectCom">
              <strong>{{dom.name}}</strong>:{{dom.id}}
              </a-select-option>
            </a-select>
          </template>
        </q-modal>
        <q-modal class="modal-box" title="修改菜单名" v-if="showEditModal"  :visible.sync="showEditModal" @ok="updateNodeName">
          <template slot="modalBody">
            <a-input v-model="tempName" placeholder="输入菜单名">
            </a-input>
          </template>
        </q-modal>
      </span> 
    </ul>
  </div>
 `,
  props: {
    data: Object,
    index: Number,
  },
  mixins: [componentsMixin],
  data() {
    return {
      options: this.data.options || [],
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      showMenuModal: false,
      showBindModal: false,
      showEditModal: false,
      domList: [],
      selectedMenu: null,
      selectedDom: null,
      style: this.data.style,
      subMenuStyle: "",
      tempNodes: [],
      tempName: "",
      targetNode: {},
    };
  },
  methods: {
    updateNode() {
      if (document.querySelector("#" + this.bindNode.id).childElementCount > 0) {
        antd.message.warn("已绑定组件，若要绑定，请先删除已绑定组件");
        return;
      }
      const targetNode = document.querySelector("#" + this.selectedDom);
      const targetNodeInfo = JSON.parse(targetNode.dataset.data);
      const { offsetWidth, offsetHeight, id } = this.targetNode;
      const style = `
      width: ${offsetWidth}px;
      height: ${offsetHeight}px;
      position:absolute;
      background-color:#fff;
      color:#999999;
      line-height:${offsetHeight}px;`;
      this.$root.componentsArr.forEach((target, index) => {
        if (target.id === this.selectedDom) {
          this.$set(target.data, "parent", id);
          this.$set(target.data, "parentId", id);
          this.$set(target.data, "style", style);
          this.$set(this.$root.componentsArr, index, { ...target });
          this.$set(this.$root.attrObject, "style", style);
        }
      });
      targetNode.style.cssText = style;
      targetNode.className = "draggable-grid";
      targetNodeInfo.parentId = this.bindNode.id;
      targetNodeInfo.style = targetNode.style.cssText;
      targetNode.dataset.x = 0;
      targetNode.dataset.y = 0;
      targetNode.dataset.data = JSON.stringify(targetNodeInfo);
      document.querySelector("#" + this.bindNode.id).append(targetNode);
    },
    updateTree() {
      this.options = JSON.parse(JSON.stringify(this.tempNodes));
    },
    recoverNode() {
      this.tempNodes = JSON.parse(JSON.stringify(this.options));
    },
    filterOption(val, option) {
      // label搜索
      return option.componentOptions.propsData.title.indexOf(val) > -1;
    },
    selectMenu(selectedKeys, $event) {
      if ($event.selected) {
        this.selectedMenu = $event.node.dataRef;
      } else {
        this.selectedMenu = null;
      }
    },
    addMenu() {
      let hashId = createHashId();
      if (!this.selectedMenu) {
        this.tempNodes.push({
          title: "未命名",
          children: [],
          id: hashId,
          key: hashId,
        });
      } else {
        let _this = this;
        function insertNode(data) {
          for (var i = 0; i < data.length; i++) {
            if (_this.selectedMenu.id === data[i].id) {
              let node = {
                title: "未命名",
                children: [],
                id: hashId,
                key: hashId,
              };
              if (!data[i].children) {
                data[i].children = [];
              }
              data[i].children.push(node);
              return;
            } else {
              insertNode(data[i].children);
            }
          }
        }
        insertNode(_this.tempNodes);
      }
    },
    delMenu() {
      if (!this.selectedMenu) {
        antd.message.warn(`请选中所需要删除的菜单！`);
        return;
      }
      let _this = this;
      function deleteTree(tree, sel) {
        let treeData = JSON.parse(JSON.stringify(tree));
        const deleteParentNode = (data) => {
          const ret = [];
          for (let i = 0, l = data.length; i < l; i++) {
            const node = data[i];
            if (node.id !== sel) {
              ret.push(node);
            } else {
              if (_this.selectedMenu.id === sel) {
                _this.selectedMenu = null;
              }
            }
            if (!!node.children) {
              node.children = deleteParentNode(node.children);
            }
          }
          return ret;
        };
        return deleteParentNode(treeData);
      }
      this.tempNodes = deleteTree(this.tempNodes, this.selectedMenu.id);
    },
    editMenu() {
      if (!this.selectedMenu) {
        antd.message.warn(`请选中所需要修改的菜单！`);
        return;
      }
      this.showEditModal = true;
      this.tempName = this.selectedMenu.title;
    },
    updateNodeName() {
      this.selectedMenu.title = this.tempName;
    },
    bindDom(node) {
      const { id } = node;
      const { offsetWidth, offsetHeight } = document.querySelector(`#${id}`);
      this.targetNode = { offsetWidth, offsetHeight, id };
      if (this.$root.editMode !== "edit") return;
      this.selectedDom = null;
      this.domList = Array.from(document.querySelectorAll(".draggable2"))
        .filter((i) => i.id !== this.$el.id)
        .map((current) => ({
          id: current.id,
          name: JSON.parse(current.dataset.data).name,
          title: `${current.id}:${JSON.parse(current.dataset.data).name}`,
        }));
      this.bindNode = node;
      this.showBindModal = true;
    },
    deleteTreeDom(key) {
      function deleteTree(tree, sel) {
        let treeData = JSON.parse(JSON.stringify(tree));
        const deleteParentNode = (data) => {
          const ret = [];
          for (let i = 0, l = data.length; i < l; i++) {
            const node = data[i];
            if (node.dom && node.dom.includes(key)) {
              delete node.dom;
            }
            ret.push(node);
            if (!!node.children) {
              node.children = deleteParentNode(node.children);
            }
          }
          return ret;
        };
        return deleteParentNode(treeData);
      }
      this.options = deleteTree(this.options, key);
    },
    trim(str, isglobal) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (isglobal && isglobal.toLowerCase() === "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    },
    // 样式转对象
    styleToObj(style) {
      if (!style || style == "") {
        return;
      }
      var Arr = style.split(";");
      Arr = Arr.map((item) => this.trim(item)).filter((item) => {
        return item != "" && item != "undefined";
      });
      let str = "";
      Arr.forEach((item) => {
        let test = "";
        this.trim(item)
          .split(":")
          .forEach((item2) => {
            test += '"' + this.trim(item2) + '":';
          });
        str += test + ",";
      });
      str = str.replace(/:,/g, ",");
      str = str.substring(0, str.lastIndexOf(","));
      str = "{" + str + "}";
      return JSON.parse(str);
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            key: { type: "string" },
            title: { type: "string" },
            children: { anyOf: [{ maximum: 3 }, { type: "array" }, { type: "string" }] },
            id: { type: "string" },
          },
          required: ["key", "title", "id"],
        },
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        if (check(body)) {
          this.data.options = body;
          this.options = this.data.options;
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
  },
  watch: {
    options: _.throttle(function (val) {
      if (typeof this.options === "object") {
        this.data.options = JSON.stringify(this.options);
        return;
      }
      this.data.options = this.options;
    }, 500),
    data: {
      handler: _.throttle(function (newValue, oldValue) {
        try {
          const { options } = newValue;
          let styleObj = this.styleToObj(newValue.style.replace("undefined", ""));
          let color = styleObj["color"];
          let backgroundColor = styleObj["backgroundColor"];
          let fontSize = styleObj["fontSize"];
          this.subMenuStyle = `color:${color || "rgba(0, 0, 0, 0.65)"};backgroundColor:${
            backgroundColor || "#fff"
          };fontSize:${fontSize || "14px"}`;
          if (typeof options === `string`) {
            this.options = JSON.parse(options);
          } else {
            this.options = options;
          }
          this.tempNodes = _.cloneDeep(this.options);
        } catch (error) {
          this.options = [];
          console.log(error);
        }
      }, 500),
      deep: true,
    },
  },
  mounted() {
    this.receiveInfo();
    let color = this.$refs.contentBody.style["color"];
    let backgroundColor = this.$refs.contentBody.style["backgroundColor"];
    let fontSize = this.$refs.contentBody.style["fontSize"];
    this.subMenuStyle = `color:${color};backgroundColor:${backgroundColor};fontSize:${fontSize}`;
    this.tempNodes = JSON.parse(JSON.stringify(this.options));
    startMenu(`#${this.data.id} .yyui_menu1`);
    const targetNode = this.$el;
    // 观察器的配置（需要观察什么变动）
    const config = {
      // attributes: true,
      childList: true,
      subtree: true,
    };
    // 当观察到变动时执行的回调函数
    const callback = (e, q) => {
      const [{ removedNodes = [{}], addedNodes = [{}] }] = e;
      addedNodes.forEach((element) => {
        // 如果是添加的菜单不添加样式
        if (Object.prototype.toString.call(element) === `[object HTMLLIElement]`) {
          return;
        }
        element.className = "draggable-grid";
      });
      if (removedNodes[0] && removedNodes[0].id) {
        this.deleteTreeDom(removedNodes[0].id);
      }
    };
    const observer = new MutationObserver(callback);
    observer && observer.observe(targetNode, config);
  },
  updated() {
    try {
      // this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  components: {
    "sub-menu": SubMenu,
  },
});
