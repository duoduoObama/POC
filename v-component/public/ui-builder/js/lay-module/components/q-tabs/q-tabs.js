/**
 * tabs
 */
Vue.component("q-tabs", {
  template: `
  <div class="draggable2 can-drop":id="id" :index="index" :style="data.style" :data-data="JSON.stringify(data)" 
  :data-x="data.x||0" :data-y="data.y||0" :data-element-type="data.elementType" ref="tabsRef">
  <link href="${location.origin}/ui-builder/js/lay-module/components/q-tabs/q-tabs.css" rel="stylesheet"> 
      <div :class="toogleDirection.container">
        <ul :class="toogleDirection.header "> 
          <li v-for="(item,index) in options" :key="index">{{item.title}}</li>  
            <span class="layui-event-btn">
            <a-button class="q-tabs-toogle-direction" :data-toogle-width="data.toogleWidth||500" data-toogle="open" :data-tag="direction" icon="pic-left"> 
            </a-button> 
            <a-button style="top: -2px;" @click="showMenuModal = true">
              <a-icon type="setting" />
            </a-button>   
            <q-modal class="modal-box" title="菜单编辑" v-if="showMenuModal" :visible.sync="showMenuModal" @ok="updateTree" @cancel="recoverNode">
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
              <a-button @click="switchMethod"  icon="shake">
                {{direction==='top'?'纵向':'横向'}}
              </a-button>
              <a-tree
                @select="selectMenu"
                :tree-data="tempNodes"
                :default-expand-all="true"
              />
            </template>
          </q-modal>
            </span> 
        </ul>
        <div :class="toogleDirection.content" ref="tabContent">
          <div v-for="(item,index) in options" :key="index" :id="item.tabsId || createHashId()" :name="item.title" class="layui-tab-item dropzone layui-show" :data-element-type="data.elementType"></div> 
        </div>
    </div>
    <q-modal class="modal-box" title="修改菜单名" v-if="showEditModal"  :visible.sync="showEditModal" @ok="updateNodeName">
      <template slot="modalBody">
        <a-input v-model="tempName" placeholder="输入菜单名">
        </a-input>
      </template>
    </q-modal>
    <script src="${location.origin}/ui-builder/js/lay-module/components/q-tabs/q-tabs-external.js" type="application/javascript"></script>
    <script src="${location.origin}/ui-builder/lib/layui-v2.5.5/layui.all.js" defer type="application/javascript"></script>
 </div>
 `,
  props: {
    data: Object,
    index: Number,
  },
  watch: {
    options(val) {
      this.data.options = JSON.stringify(this.options);
    },
    data: {
      handler(newValue, oldValue) {
        try {
          const { options, paramList = [] } = newValue;
          if (typeof paramList === `string`) {
            this.paramList = JSON.parse(paramList);
          } else {
            this.paramList = paramList;
          }
          const direction = (this.paramList.find((c) => c.key === "position") || { default: "top" }).default;
          if (typeof options === `string`) {
            this.options = JSON.parse(options);
          } else if (!options) {
            this.options = [...this.options];
          } else {
            this.options = options;
          }
          if (this.direction != direction) {
            this.direction = direction;
            this.setWitchDeirection();
          }
        } catch (error) {
          this.options = [];
          console.log(error);
        }
      },
      deep: true,
    },
    "data.options": function () {
      this.data.childList = _.cloneDeep(this.options);
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || [{ title: "功能一", tabsId: this.createHashId() }],
      paramList: this.data.paramList || [
        {
          key: "position",
          title: "收缩方向",
          default: "top",
        },
        {
          key: "oldValue",
          title: "高宽",
          default: 0,
        },
        {
          key: "isShow",
          title: "默认显示",
          default: "open",
        },
      ],
      style: this.data.style,
      childList: this.data.childList ? this.data.childList : [{ name: "功能一", tabsId: this.createHashId() }],
      showEditModal: false,
      showdeleteModal: false,
      selectedMenu: "",
      showMenuModal: false,
      tempNodes: [],
      tempName: "",
      direction: "top",
      toogleDirection: {
        container: "layui-tab layui-tab-brief tabs-container-horizontal",
        header: "layui-tab-title bg-white tabs-header-horizontal",
        content: "layui-tab-content tabs-content-horizontal",
      },
    };
  },
  methods: {
    createHashId() {
      return createHashId();
    },
    openModal(title = ``, index = 1) {
      switch (index) {
        case 1:
          this.showEditModal = true;
          break;
        case 2:
          this.showdeleteModal = true;
          break;
      }
      this.selectedMenu = ``;
      this.activeName = title;
    },
    successAction() {
      if (!this.data.childList || Array.isArray(this.data.childList)) {
        this.$set(this.data, "childList", []);
      }
      this.childList = [
        ...this.childList,
        {
          name: this.selectedMenu,
          tabsId: this.createHashId(),
        },
      ];
      this.data.childList = this.childList;
    },
    deleteAction() {
      this.childList = this.childList.filter((current) => current.title !== this.selectedMenu);
      this.data.childList = this.childList;
    },
    handelChange(ev) {
      const { key } = ev;
      this.selectedMenu = key;
    },
    checkValue() {
      if (!this.selectedMenu || this.childList.map((cur) => cur.title).includes(this.selectedMenu)) {
        return true;
      }
      return false;
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
        tabsId: hashId,
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
    updateTree() {
      this.options = JSON.parse(JSON.stringify(this.tempNodes));
      Object.assign(
        this.paramList.find((c) => c.key === "position"),
        { default: this.direction }
      );
      this.data.paramList = this.paramList;
      this.data.direction = this.direction;
      this.data.options = this.options;
      this.data.childList = this.options;
      this.setWitchDeirection();
    },
    recoverNode() {
      this.tempNodes = JSON.parse(JSON.stringify(this.options));
    },
    setWitchDeirection() {
      switch (this.direction) {
        case "top":
          this.toogleDirection = {
            container: "layui-tab layui-tab-brief tabs-container-horizontal",
            header: "layui-tab-title bg-white tabs-header-horizontal",
            content: "layui-tab-content tabs-content-horizontal",
          };
          break;
        case "left":
          this.toogleDirection = {
            container: "layui-tab layui-tab-brief tabs-container-vertical",
            header: "layui-tab-title bg-white tabs-header-vertical",
            content: "layui-tab-content tabs-content-vertical",
          };
          break;
      }
    },
    switchMethod() {
      this.direction = this.direction === "top" ? "left" : "top";
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
            tabsId: { type: "string" },
          },
          required: ["title", "tabsId"],
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
  mounted() {
    this.receiveInfo();
    this.$refs.tabsRef.querySelector(".layui-tab-title li").classList.add("layui-this");
    if (!this.options[0].tabsId) {
      this.options[0] = {
        title: this.options[0].title || "功能一",
        tabsId: this.createHashId(),
      };
    }
    this.data.childList = _.cloneDeep(this.options);
    this.data.toogleWidth = this.data.toogleWidth || 500;
    if (typeof this.paramList === `string`) {
      this.paramList = JSON.parse(this.paramList);
    }
    this.direction = (this.paramList.find((c) => c.key === "position") || { default: "top" }).default;
    this.setWitchDeirection();
    this.tempNodes = JSON.parse(JSON.stringify(this.options));
    if (typeof this.options === "string") {
      this.options = JSON.parse(this.options);
    }
  },
});
