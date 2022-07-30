/**
 * 按钮容器
 */
Vue.component("q-button-container", {
  template: `  
          <div class="draggable2" ref="buttonContainerRef" :id="data.id" :index="index" style="background-color:#278EFF;color:#fff;text-align:center;cursor:pointer;line-height:40px;" :style="data.style"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-button-container/mdc.button.css" rel="stylesheet"> 
            <span class="q-button-container">{{data.options || data.text}}</span>
            <q-modal class="modal-box" title="编辑按钮容器" v-if="showEditModal" @ok="updateTree" @cancel="recoverNode" :visible.sync="showEditModal">
              <template slot="modalBody">
              <a-select style="width: 100%" :filterOption="filterOption" placeholder="请选择绑定组件" mode="multiple" :default-value="selectedDom" @change="selectChange">
                <a-select-option v-for="dom in domList" :labelInValue="true" :title="dom.title" :key="dom.id" :value="dom.id" @mouseenter="focusSelectCom" @mouseleave="blurSelectCom">
                <strong>{{dom.name}}</strong>:{{dom.id}}</a-select-option>
              </a-select>
              </template>
            </q-modal>
            <script src="${location.origin}/ui-builder/js/lay-module/components/q-button-container/q-button-container-assist.js" type="application/javascript"></script>
          </div>   
        `,
  props: {
    data: Object,
    index: Number,
  },
  mixins: [componentsMixin],
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style } = newValue;
          this.style = style;
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
    curMenu(val) {
      if (this.data.id !== this.$root.curComponent.id) {
        return;
      }
      this.handleMenuClick(val);
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      domList: [],
      options: this.data.options || [],
      style: this.data.style,
      trigger: ["contextmenu"],
      showEditModal: false,
      selectedDom: [],
    };
  },
  methods: {
    filterOption(val, option) {
      // label搜索
      return option.componentOptions.propsData.title.indexOf(val) > -1;
    },
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.startEdit();
          break;
      }
    },
    startEdit() {
      this.showEditModal = true;
      this.bindDom(this.$refs.buttonContainerRef);
    },
    bindDom(node) {
      if (this.$root.editMode !== "edit") return;
      if (this.data.paramList) {
        try {
          const paramList =
            typeof this.data.paramList === "string" ? JSON.parse(this.data.paramList) : this.data.paramList;
          let bindObj = {};
          if (paramList.length) {
            bindObj = paramList.find(function (c) {
              return c.key === "bindId";
            });
          }
          this.selectedDom = (bindObj.default || "").split(",").filter((c) => c);
        } catch (error) {
          console.log(error);
        }
      }
      this.domList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
        .filter((i) => i.id !== this.$refs.buttonContainerRef.id)
        .map((current) => ({
          id: current.id,
          name: JSON.parse(current.dataset.data).name,
          title: `${current.id}:${JSON.parse(current.dataset.data).name}`,
        }));
      this.showBindModal = true;
    },
    selectChange(val) {
      this.selectedDom = val;
    },
    updateTree() {
      try {
        const paramList =
          typeof this.data.paramList === "string" ? JSON.parse(this.data.paramList) : this.data.paramList;
        let bindObj = {};
        let bindIndex = 0;
        if (paramList.length) {
          bindObj = paramList.find(function (c) {
            return c.key === "bindId";
          });
          bindIndex = paramList.findIndex(function (c) {
            return c.key === "bindId";
          });
        }
        if (paramList[bindIndex]) {
          bindObj.default = this.selectedDom.join(",");
          paramList[bindIndex] = bindObj;
          this.data.paramList = JSON.stringify(paramList);
          console.log(this.data.paramList);
        }
      } catch (error) {
        console.log(error);
      }
    },
    recoverNode() {
      this.tempNodes = JSON.parse(JSON.stringify(this.options));
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            default: { type: "string" },
          },
          required: ["default"],
        },
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        console.log(body);
        if (check(body)) {
          const key = "bindId";
          const title = "绑定id(多个用逗号隔开)";
          if (!this.data.paramList.length) {
            this.data.paramList = [{}];
          }
          Object.assign(body[0], { key, title });

          this.data.paramList = [body[0]];
          // this.options = this.data.options;
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
  },
  mounted() {
    this.receiveInfo();
  },
  updated() {
    try {
      this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
