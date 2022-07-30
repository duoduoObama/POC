const MenuList = {
  template: `
    <ul class="com-menu-ul">
      <li
        class="com-menu-li"
        v-for="(item, index) of treeList"
        style="position: relative"
        draggable="true"
        :id="item.id"
        :data-data="JSON.stringify(item)"
        @dragstart="$root.drag($event)"
        @dblclick="$root.comsdbclick"
      >
        <a-tooltip placement="topLeft" slot="extra">
          <template slot="title">
            <span v-if="(item.datatype===1||!item.enName) && item.description">
              {{item.description}}
            </span>
            <img
              style="height: 200px; width: 200px"
              v-else-if="item.enName"
              :src="item.image"
              :alt="item.enName"
            />
          </template>
          <div class="com-menu-item">
            <img v-if="item.image" class="com-menu-item-icon" draggable="false" :src="item.image" loading="lazy" />
            <svg v-else class="com-menu-item-icon" draggable="false">
              <use xlink:href="#icon-a-huaban2fuben5"></use>
            </svg>
            <span
              v-html="item.highlights || (item.datatype===1||item.enName?item.name:item.text)"
              class="com-menu-name"
              style="margin-top: auto !important"
            ></span>
          </div>
        </a-tooltip>
        <a-icon
          type="warning"
          class="com-menu-tag-num"
          style="color: red; font-size: 18px"
          v-if="comNum&&comNum[item.wfName+item.text]&&comNum[item.wfName+item.text].num==='change'"
        ></a-icon>
        <a-tag
          v-if="item.wfName&&comNum&&comNum[item.wfName+item.text]&&comNum[item.wfName+item.text].wfName&&item.wfName===comNum[item.wfName+item.text].wfName&&typeof comNum[item.wfName+item.text].num ==='number'&&comNum[item.wfName+item.text].num>0"
          color="green"
          class="com-menu-tag-num"
          style="color: #52c41a;"
        >
          {{comNum[item.wfName+item.text]&&comNum[item.wfName+item.text].num?comNum[item.wfName+item.text].num:0}}
        </a-tag>
        <a-tag
          v-else-if="!item.wfName&&comNum&&comNum[item.text]&&comNum[item.text].num&&typeof comNum[item.text].num ==='number'&&comNum[item.text].num>0"
          color="green"
          class="com-menu-tag-num"
          style="color: #52c41a"
        >
          {{comNum[item.text]&&comNum[item.text].num?comNum[item.text].num:0}}
        </a-tag>
      </li>
    </ul>
      `,
  name: "MenuList",
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    // Cannot overlap with properties within Menu.SubMenu.props
    treeList: {
      type: Array,
      default: () => [],
    },
    comNum: {
      type: Object,
      default: () => {},
    },
    wfName: {
      type: String,
      default: () => "",
    },
  },
  watch: {},
  methods: {},
};

const TitleInfo = {
  template: `
    <div>
      <ul class="di-menu-ul" v-for="(item, index) of Object.keys(treeInfo)" :key="index">
        <li
          style="width: 100%; overflow: hidden;"
        >
          <a-tooltip placement="top" slot="extra">
            <template slot="title">
              <span v-if="treeInfo[item].title">
                {{treeInfo[item].title}}
              </span>
            </template>
            <div
              v-html="treeInfo[item].title || ''"
              class="di-menu-title2 user-select-none"
            ></div>
          </a-tooltip>
          <div v-if="wfName">
            <menu-list v-if="Array.isArray(treeInfo[item].list)" :tree-list="treeInfo[item].list" :com-num="comNum" :wf-name="wfName" />
            <title-info v-else :tree-info="treeInfo[item].list" :com-num="comNum" :wf-name="wfName" />
          </div>
          <div v-else>
            <menu-list v-if="Array.isArray(treeInfo[item].list)" :tree-list="treeInfo[item].list" :com-num="comNum" :wf-name="item" />
            <title-info v-else :tree-info="treeInfo[item].list" :com-num="comNum" :wf-name="item" />
          </div>
        </li>
      </ul>
    </div>
      `,
  name: "TitleInfo",
  // must add isSubMenu: true
  isSubMenu: true,
  components: {
    "menu-list": MenuList,
  },
  props: {
    // Cannot overlap with properties within Menu.SubMenu.props
    treeInfo: {
      type: Object,
      default: () => {},
    },
    comNum: {
      type: Object,
      default: () => {},
    },
    wfName: {
      type: String,
      default: () => "",
    },
  },
  watch: {},
  methods: {},
};

const MenuInfo = {
  template: `
    <div>
      <ul class="di-menu-ul" v-for="(item, index) of Object.keys(treeInfo)" :key="index">
        <li
          style="width: 100%; background-color: #fff; overflow: hidden;"
        >
          <a-tooltip placement="top" slot="extra">
            <template slot="title">
              <span v-if="treeInfo[item].title">
                {{treeInfo[item].title}}
              </span>
            </template>
            <div
              v-html="treeInfo[item].title || ''"
              class="di-menu-title1 user-select-none"
            ></div>
          </a-tooltip>
          <div v-if="wfName">
            <menu-list v-if="Array.isArray(treeInfo[item].list)" :tree-list="treeInfo[item].list" :com-num="comNum" :wf-name="wfName" />
            <title-info v-else :tree-info="treeInfo[item].list" :com-num="comNum" :wf-name="wfName" />
          </div>
          <div v-else>
            <menu-list v-if="Array.isArray(treeInfo[item].list)" :tree-list="treeInfo[item].list" :com-num="comNum" :wf-name="item" />
            <title-info v-else :tree-info="treeInfo[item].list" :com-num="comNum" :wf-name="item" />
          </div>
        </li>
      </ul>
    </div>
      `,
  name: "MenuInfo",
  // must add isSubMenu: true
  isSubMenu: true,
  components: {
    "menu-list": MenuList,
    "title-info": TitleInfo,
  },
  props: {
    // Cannot overlap with properties within Menu.SubMenu.props
    treeInfo: {
      type: Object,
      default: () => {},
    },
    comNum: {
      type: Object,
      default: () => {},
    },
    wfName: {
      type: String,
      default: () => "",
    },
  },
  watch: {},
  methods: {},
};

/**
 * 组件菜单DI组件分类列表
 */
Vue.component("q-com-di-list", {
  template: ` 
      <div> 
        <div style="display: flex;margin: 10px 0">
          <a-radio-group v-model="classification" @change="onChange" style="margin: 0px auto;" >
            <a-radio-button value="flow">
              侧重分析流
            </a-radio-button>
            <a-radio-button value="node">
              侧重执行节点
            </a-radio-button>
          </a-radio-group>
        </div>
        <menu-info :tree-info="tree" :com-num="comNum" class="ant-collapse" />
      </div> 
    `,
  props: {
    comTree: {
      type: Array,
      default: () => [],
    },
    comNum: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    "menu-info": MenuInfo,
  },
  watch: {
    comTree: {
      handler(newValue, oldValue) {
        this.treeFormat(newValue);
      },
      deep: true,
    },
  },
  data() {
    return {
      tree: {},
      classification: "flow", // 分类侧重点:flow/node
    };
  },
  methods: {
    treeFormat(comTree) {
      this.tree = {};
      comTree.forEach((item) => {
        if (item.wfName) {
          this.tree[item.wfName] && this.tree[item.wfName].list
            ? void 0
            : (this.tree[item.wfName] = { title: "", list: {} });
          this.tree[item.wfName].title = item.wfName;
          const temp = _.cloneDeep(this.tree[item.wfName].list);
          switch (this.classification) {
            case "flow":
              temp[item.name] && Array.isArray(temp[item.name].list)
                ? void 0
                : (temp[item.name] = { title: "", list: [] });
              temp[item.name].title = item.name;
              temp[item.name].list.push(item);
              break;
            case "node":
              temp[item.nodeName] && Array.isArray(temp[item.nodeName].list)
                ? void 0
                : (temp[item.nodeName] = { title: "", list: [] });
              temp[item.nodeName].title = item.nodeName;
              temp[item.nodeName].list.push(item);
              break;
          }
          this.tree[item.wfName].list = temp;
        } else {
          this.tree["basicCom"] && Array.isArray(this.tree["basicCom"].list)
            ? void 0
            : (this.tree["basicCom"] = { title: "基础组件", list: [] });
          this.tree["basicCom"].list.push(item);
        }
      });
    },
    onChange() {
      this.treeFormat(this.comTree);
    },
  },
  mounted() {
    this.treeFormat(this.comTree);
  },
});
