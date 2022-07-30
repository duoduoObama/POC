/*!
 * metismenu https://github.com/onokumus/metismenu#readme
 * A collapsible jQuery menu plugin
 * @version 3.0.7
 * @author Osman Nuri Okumus <onokumus@gmail.com> (https://github.com/onokumus)
 * @license: MIT
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory(require("jquery")))
    : typeof define === "function" && define.amd
    ? define(["jquery"], factory)
    : ((global = typeof globalThis !== "undefined" ? globalThis : global || self),
      (global.metisMenu = factory(global.$)));
})(this, function ($) {
  "use strict";

  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
  }

  var $__default = /*#__PURE__*/ _interopDefaultLegacy($);

  const Util = (($) => {
    // eslint-disable-line no-shadow
    const TRANSITION_END = "transitionend";

    const Util = {
      // eslint-disable-line no-shadow
      TRANSITION_END: "mmTransitionEnd",

      triggerTransitionEnd(element) {
        $(element).trigger(TRANSITION_END);
      },

      supportsTransitionEnd() {
        return Boolean(TRANSITION_END);
      },
    };

    function getSpecialTransitionEndEvent() {
      return {
        bindType: TRANSITION_END,
        delegateType: TRANSITION_END,
        handle(event) {
          if ($(event.target).is(this)) {
            return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
          }
          return undefined;
        },
      };
    }

    function transitionEndEmulator(duration) {
      let called = false;

      $(this).one(Util.TRANSITION_END, () => {
        called = true;
      });

      setTimeout(() => {
        if (!called) {
          Util.triggerTransitionEnd(this);
        }
      }, duration);

      return this;
    }

    function setTransitionEndSupport() {
      $.fn.mmEmulateTransitionEnd = transitionEndEmulator; // eslint-disable-line no-param-reassign
      // eslint-disable-next-line no-param-reassign
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }

    setTransitionEndSupport();

    return Util;
  })($__default["default"]);

  const NAME = "metisMenu";
  const DATA_KEY = "metisMenu";
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = ".data-api";
  const JQUERY_NO_CONFLICT = $__default["default"].fn[NAME];
  const TRANSITION_DURATION = 350;

  const Default = {
    toggle: true,
    preventDefault: true,
    triggerElement: "a",
    parentTrigger: "li",
    subMenu: "ul",
  };

  const Event = {
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
  };

  const ClassName = {
    METIS: "metismenu",
    ACTIVE: "mm-active",
    SHOW: "mm-show",
    COLLAPSE: "mm-collapse",
    COLLAPSING: "mm-collapsing",
    COLLAPSED: "mm-collapsed",
  };

  class MetisMenu {
    // eslint-disable-line no-shadow
    constructor(element, config) {
      this.element = element;
      this.config = {
        ...Default,
        ...config,
      };
      this.transitioning = null;

      this.init();
    }

    init() {
      const self = this;
      const conf = this.config;
      const el = $__default["default"](this.element);

      el.addClass(ClassName.METIS); // add metismenu class to element

      el.find(`${conf.parentTrigger}.${ClassName.ACTIVE}`).children(conf.triggerElement).attr("aria-expanded", "true"); // add attribute aria-expanded=true the trigger element

      el.find(`${conf.parentTrigger}.${ClassName.ACTIVE}`).parents(conf.parentTrigger).addClass(ClassName.ACTIVE);

      el.find(`${conf.parentTrigger}.${ClassName.ACTIVE}`)
        .parents(conf.parentTrigger)
        .children(conf.triggerElement)
        .attr("aria-expanded", "true"); // add attribute aria-expanded=true the triggers of all parents

      el.find(`${conf.parentTrigger}.${ClassName.ACTIVE}`)
        .has(conf.subMenu)
        .children(conf.subMenu)
        .addClass(`${ClassName.COLLAPSE} ${ClassName.SHOW}`);

      el.find(conf.parentTrigger)
        .not(`.${ClassName.ACTIVE}`)
        .has(conf.subMenu)
        .children(conf.subMenu)
        .addClass(ClassName.COLLAPSE);

      el.find(conf.parentTrigger)
        // .has(conf.subMenu)
        .children(conf.triggerElement)
        .on(Event.CLICK_DATA_API, function (e) {
          // eslint-disable-line func-names
          const eTar = $__default["default"](this);

          if (eTar.attr("aria-disabled") === "true") {
            return;
          }

          if (conf.preventDefault && eTar.attr("href") === "#") {
            e.preventDefault();
          }

          const paRent = eTar.parent(conf.parentTrigger);
          const sibLi = paRent.siblings(conf.parentTrigger);
          const sibTrigger = sibLi.children(conf.triggerElement);

          if (paRent.hasClass(ClassName.ACTIVE)) {
            eTar.attr("aria-expanded", "false");
            self.removeActive(paRent);
          } else {
            eTar.attr("aria-expanded", "true");
            self.setActive(paRent);
            if (conf.toggle) {
              self.removeActive(sibLi);
              sibTrigger.attr("aria-expanded", "false");
            }
          }

          if (conf.onTransitionStart) {
            conf.onTransitionStart(e);
          }
        });
    }

    setActive(li) {
      $__default["default"](li).addClass(ClassName.ACTIVE);
      const ul = $__default["default"](li).children(this.config.subMenu);
      if (ul.length > 0 && !ul.hasClass(ClassName.SHOW)) {
        this.show(ul);
      }
    }

    removeActive(li) {
      $__default["default"](li).removeClass(ClassName.ACTIVE);
      const ul = $__default["default"](li).children(`${this.config.subMenu}.${ClassName.SHOW}`);
      if (ul.length > 0) {
        this.hide(ul);
      }
    }

    show(element) {
      // 用于清除存储的点选信息  ----------start
      $(element.prevObject)
        .find("li")
        .each((i, it) => {
          $(it).removeClass("mm-active");
        });
      //---------------------------------end
      if (this.transitioning || $__default["default"](element).hasClass(ClassName.COLLAPSING)) {
        return;
      }
      const elem = $__default["default"](element);

      const startEvent = $__default["default"].Event(Event.SHOW);
      elem.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      elem.parent(this.config.parentTrigger).addClass(ClassName.ACTIVE);

      if (this.config.toggle) {
        const toggleElem = elem
          .parent(this.config.parentTrigger)
          .siblings()
          .children(`${this.config.subMenu}.${ClassName.SHOW}`);
        this.hide(toggleElem);
      }

      elem.removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING).height(0);

      this.setTransitioning(true);

      const complete = () => {
        // check if disposed
        if (!this.config || !this.element) {
          return;
        }
        elem.removeClass(ClassName.COLLAPSING).addClass(`${ClassName.COLLAPSE} ${ClassName.SHOW}`).height("");

        this.setTransitioning(false);

        elem.trigger(Event.SHOWN);
      };

      elem
        .height(element[0].scrollHeight)
        .one(Util.TRANSITION_END, complete)
        .mmEmulateTransitionEnd(TRANSITION_DURATION);
    }

    hide(element) {
      if (this.transitioning || !$__default["default"](element).hasClass(ClassName.SHOW)) {
        return;
      }

      const elem = $__default["default"](element);

      const startEvent = $__default["default"].Event(Event.HIDE);
      elem.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      elem.parent(this.config.parentTrigger).removeClass(ClassName.ACTIVE);
      // eslint-disable-next-line no-unused-expressions
      elem.height(elem.height())[0].offsetHeight;

      elem.addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

      this.setTransitioning(true);

      const complete = () => {
        // check if disposed
        if (!this.config || !this.element) {
          return;
        }
        if (this.transitioning && this.config.onTransitionEnd) {
          this.config.onTransitionEnd();
        }

        this.setTransitioning(false);
        elem.trigger(Event.HIDDEN);

        elem.removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE);
      };

      if (elem.height() === 0 || elem.css("display") === "none") {
        complete();
      } else {
        elem.height(0).one(Util.TRANSITION_END, complete).mmEmulateTransitionEnd(TRANSITION_DURATION);
      }
    }

    setTransitioning(isTransitioning) {
      this.transitioning = isTransitioning;
    }

    dispose() {
      $__default["default"].removeData(this.element, DATA_KEY);

      $__default["default"](this.element)
        .find(this.config.parentTrigger)
        // .has(this.config.subMenu)
        .children(this.config.triggerElement)
        .off(Event.CLICK_DATA_API);

      this.transitioning = null;
      this.config = null;
      this.element = null;
    }

    static jQueryInterface(config) {
      // eslint-disable-next-line func-names
      return this.each(function () {
        const $this = $__default["default"](this);
        let data = $this.data(DATA_KEY);
        const conf = {
          ...Default,
          ...$this.data(),
          ...(typeof config === "object" && config ? config : {}),
        };

        if (!data) {
          data = new MetisMenu(this, conf);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === "string") {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default["default"].fn[NAME] = MetisMenu.jQueryInterface; // eslint-disable-line no-param-reassign
  $__default["default"].fn[NAME].Constructor = MetisMenu; // eslint-disable-line no-param-reassign
  $__default["default"].fn[NAME].noConflict = () => {
    // eslint-disable-line no-param-reassign
    $__default["default"].fn[NAME] = JQUERY_NO_CONFLICT; // eslint-disable-line no-param-reassign
    return MetisMenu.jQueryInterface;
  };
  window.MetisMenu = MetisMenu;
  return MetisMenu;
});
//# sourceMappingURL=metisMenu.js.map

/**
 * 递归subMenu组件
 */
const SubMenu2 = {
  template: `
        <ul class="mm-collapse" v-if="menuInfo&&typeof menuInfo==='object'" :key="menuInfo.key" v-bind="$props" v-on="$listeners">
          <template v-for="subitem in menuInfo.children">
            <li :key="subitem.key" @dblclick.stop.prevent=bindDomSub(subitem)> 
              <a href="javascript:void(0);" data-element-type="container" v-bind:class="{ 'more layui-icon has-arrow mm-collapsed child-bg': subitem.children && subitem.children.length > 0 }" v-if="subitem.dom" v-html="subitem.dom" :id="subitem.id"></a>
              <a href="javascript:void(0);" data-element-type="container" v-bind:class="{ 'more layui-icon has-arrow mm-collapsed child-bg': subitem.children && subitem.children.length > 0 }" v-else :id="subitem.id">{{subitem.title}}</a>
              <sub-menu-child :key="subitem.key" :menu-info="subitem" @subMenuClick="bindDomSub" :sub-menu-style="subMenuStyle"/>
            </li>
          </template>
        </ul>
      `,
  name: "SubMenuChild",
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
  mounted() {
    // debugger;
  },
};

/**
 * 折叠菜单
 */
Vue.component("q-collapse-menu", {
  template: `
    <div class="draggable2" :id="data.id" :index="index" style="background-color: rgb(1, 15, 41);color: rgb(0, 114, 255);" :style="data.style" :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0" ref="contentBody">
    <link href="${location.origin}/ui-builder/js/lay-module/components/q-collapse-menu/q-collapse-menu.css" rel="stylesheet"> 
    <nav class="sidebar-nav">
        <ul class="metismenu" ref="menu">
            <template v-for="item in options">
          <li
            :key="item.key"
            @dblclick.stop.prevent="bindDom(item)" 
          >
            <a
              href="javascript:void(0);"
              :id="item.id"
              v-if="item.dom"
              v-html="item.dom"
              :class="{ 'has-arrow mm-collapsed': item.children && item.children.length > 0 }"
              style="font-size: inherit !important; "
              data-element-type="container" 
            ></a>
            <a
              href="javascript:void(0);"
              :id="item.id"
              v-else
              data-element-type="container"
              :class="{ 'has-arrow mm-collapsed': item.children && item.children.length > 0 }"
              style="font-size: inherit !important; "
              >{{item.title}}</a
            >
            <sub-menu-child
              :key="item.key"
              :menu-info="item"
              @subMenuClick="bindDom"
              :sub-menu-style="subMenuStyle"
            />
          </li>
        </template> 
            </li>
        </ul>
    </nav>  
    <span class="layui-event-btn" v-if="$root.editMode === 'edit'">
    <a-button @click="showMenuModal=true;selectedMenu=null;">
      <a-icon type="setting"
    /></a-button>
    <q-modal
      class="modal-box"
      title="菜单编辑"
      v-if="showMenuModal"
      :visible.sync="showMenuModal"
      @ok="updateTree"
      @cancel="recoverNode"
    >
      <template slot="modalBody">
        <a-button @click="addMenu"> <a-icon type="plus" />添加 </a-button>
        <a-button @click="delMenu">
          <a-icon type="delete" />删除
        </a-button>
        <a-button @click="editMenu">
          <a-icon type="edit" />修改
        </a-button>
        <a-tree
          @select="selectMenu"
          :tree-data="tempNodes"
          :default-expand-all="true"
        />
      </template>
    </q-modal>
    <q-modal
      class="modal-box"
      title="绑定组件"
      v-if="showBindModal"
      :visible.sync="showBindModal"
      @ok="updateNode"
    >
      <template slot="modalBody">
        <a-select style="width: 100%" v-model="selectedDom">
          <a-select-option
            v-for="dom in domList"
            :labelInValue="true"
            :title="dom.title"
            :key="dom.id"
            :value="dom.id"
            @mouseenter="focusSelectCom"
            @mouseleave="blurSelectCom"
          >
            <strong>{{dom.name}}</strong>:{{dom.id}}
          </a-select-option>
        </a-select>
      </template>
    </q-modal>
    <q-modal
      class="modal-box"
      title="修改菜单名"
      v-if="showEditModal"
      :visible.sync="showEditModal"
      @ok="updateNodeName"
    >
      <template slot="modalBody">
        <a-input v-model="tempName" placeholder="输入菜单名"> </a-input>
      </template>
    </q-modal>
  </span>
    <script src="${location.origin}/ui-builder/js/lay-module/components/q-collapse-menu/q-collapse-menu-external.js" type="application/javascript"></script>
</div>
 `,
  props: {
    data: Object,
    index: Number,
  },
  mixins: [componentsMixin],
  data() {
    return {
      options: [],
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
      left:0;top:0;
      color:#999999;
      line-height:${offsetHeight}px;
      transform: translate(0, 0);`;
      this.$root.componentsArr.forEach((target, index) => {
        if (target.id === this.selectedDom) {
          this.$set(target.data, "parent", id);
          this.$set(target.data, "parentId", id);
          this.$set(target.data, "style", style);
          this.$set(this.$root.componentsArr, index, { ...target });
          this.$set(this.$root.attrObject, "style", style);
        }
      });
      this.$root.componentsHideArr.forEach((target, index) => {
        if (target.id === this.selectedDom) {
          this.$set(target.data, "parent", id);
          this.$set(target.data, "parentId", id);
          this.$set(target.data, "style", style);
          this.$set(this.$root.componentsHideArr, index, { ...target });
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
      this.options = _.cloneDeep(this.tempNodes);
      $(this.$refs.menu).metisMenu("dispose");
      rxjs.timer(500).subscribe(() => {
        $(this.$refs.menu).metisMenu();
      });
    },
    recoverNode() {
      this.tempNodes = _.cloneDeep(this.options);
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
      console.log(node);
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
    this.subMenuStyle = `color:${color};backgroundColor:${backgroundColor};fontSize:${fontSize}`;
    this.tempNodes = _.cloneDeep(this.options);
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
    rxjs.timer(500).subscribe(() => {
      $(this.$refs.menu).metisMenu();
    });
  },
  components: {
    "sub-menu-child": SubMenu2,
  },
});
