/**
 * 浮动菜单
 */
Vue.component("q-float-menu", {
  template: `
  <div class="draggable2" :id="data.id" :index="index" style="background-color:#fff;" :style="data.style"
   :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">  
    <div id="fl_menu" style="background-color:inherit !important;">
      <div class="ub-label" @mouseenter="showMenu" style="font-size:inherit !important;color:inherit !important;background-color:inherit !important;">
        <a href="javascript:void(0);" :id="options[0].id" :data-key="options[0].id" @dblclick.stop.prevent=bindDom(options[0]) v-if="options[0].dom" v-html="options[0].dom"></a>
        <a href="javascript:void(0);" :id="options[0].id" :data-key="options[0].id" @dblclick.stop.prevent=bindDom(options[0]) v-else style="font-size:inherit !important;color:inherit !important;">{{options[0].title}}</a>
      </div>
      <div class="ub-menu" style="font-size:inherit !important;color:inherit !important;background-color:inherit !important;">
        <template v-for="item in options.slice(1)">
          <a href="javascript:void(0);" :id="item.id" :data-key="item.id" class="ub-menu-item" @dblclick.stop.prevent=bindDom(item) v-if="item.dom" v-html="item.dom" :style="data.style.height"></a>
          <a href="javascript:void(0);" :id="item.id" :data-key="item.id" class="ub-menu-item" @dblclick.stop.prevent=bindDom(item) v-else style="font-size:inherit !important;color:inherit !important;" :style="data.style.height">{{item.title}}</a>
        </template>
      </div>
      <span class="layui-event-btn ub-float-menu" v-if="$root && $root.editMode === 'edit'"> 
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
              <strong>{{dom.name}}</strong>:{{dom.id}}</a-select-option>
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
    </div>
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
      tempNodes: [],
      tempName: "",
    };
  },
  methods: {
    showMenu() {
      this.$el.style.overflow = "initial";
    },
    filterOption(val, option) {
      // label搜索
      return option.componentOptions.propsData.title.indexOf(val) > -1;
    },
    updateNode() {
      if (document.querySelector("#" + this.bindNode.id).childElementCount > 0) {
        antd.message.warn("已绑定组件，若要绑定，请先删除已绑定组件");
        return;
      }
      const targetNode = document.querySelector("#" + this.selectedDom);
      const targetNodeInfo = JSON.parse(targetNode.dataset.data);
      targetNode.style.cssText = "width: 100%; height: 100%;position:absolute;";
      targetNode.className = "draggable-grid";
      targetNodeInfo.parentId = this.bindNode.id;
      targetNodeInfo.style = targetNode.style.cssText;
      targetNode.dataset.x = 0;
      targetNode.dataset.y = 0;
      this.bindNode.parentName = this.data.name;
      targetNode.dataset.data = JSON.stringify(targetNodeInfo);
      document.querySelector("#" + this.bindNode.id).innerHTML = "";
      document.querySelector("#" + this.bindNode.id).append(targetNode);
    },
    updateTree() {
      this.options = JSON.parse(JSON.stringify(this.tempNodes));
    },
    recoverNode() {
      this.tempNodes = JSON.parse(JSON.stringify(this.options));
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
      this.tempNodes.push({
        title: "未命名",
        children: [],
        id: hashId,
        key: hashId,
      });
    },
    delMenu() {
      if (!this.selectedMenu) {
        antd.message.warn(`请选中所需要删除的菜单！`);
        return;
      }
      let len = this.tempNodes.indexOf(this.selectedMenu);
      this.tempNodes.splice(len, 1);
      this.selectedMenu = null;
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
    hoverChangeFixed() {
      if (!document.querySelector(`.headers-content`)) {
        setTimeout(() => {
          this.$el.style.position = `fixed`;
        }, 500);
      } else {
        this.$el.style.position = `absolute`;
        return;
      }
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            id: { type: "string" },
          },
          required: ["title", "id"],
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
        this.data.options = JSON.stringify(val);
        return;
      }
      this.data.options = this.options;
    }, 500),
    data: {
      handler: _.throttle(function (newValue, oldValue) {
        try {
          const { options } = newValue;
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
    this.hoverChangeFixed();
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
        if (Object.prototype.toString.call(element) === `[object HTMLAnchorElement]`) {
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
    try {
      if (typeof this.data.options === "string") {
        this.options = JSON.parse(this.data.options);
      } else {
        this.options = this.data.options;
      }
    } catch (error) {
      this.options = [];
      console.log(error);
    }
    this.tempNodes = _.cloneDeep(this.options);
  },
});
