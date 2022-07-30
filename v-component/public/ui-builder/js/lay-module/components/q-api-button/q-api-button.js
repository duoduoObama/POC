/**
 * api按钮
 */
Vue.component("q-api-button", {
  template: ` 
      <div :class="dragClass" :id="id" ref="apiDom" :index="index" style="background-color:#fff;padding:5px" :style="style" :data-data="JSON.stringify(data)" :data-x="x" :data-y="y">
        <link href="${location.origin}/ui-builder/js/lay-module/components/q-api-button/q-api-button.css" rel="stylesheet"> 
        <button class="q-api-button">
          <span class="default-font"><a-icon type="sync" v-if="isLoading" style="position: absolute;right: 5px;top: 5px;font-size: 18px;animation: fa-spin 2s infinite linear;"/>{{data.options}}</span>
        </button>
      
    <q-modal class="modal-box" title="编辑输出配置" v-if="showEditModal"  :visible.sync="showEditModal" @ok="updateIndexDB" @cancel="cancleFun">
      <template slot="modalBody">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-form-item :required="true" label="输出组件">
       
            <a-select style="width: 100%;" v-model="transfromData.receiver" @change="selectComp"  mode="multiple" :maxTagCount="1">
              <a-select-option v-for="dom in domList" :key="dom.id" :value="dom.id" @mouseenter="focusSelectCom" @mouseleave="blurSelectCom"><strong>{{JSON.parse(dom.dataset.data).name}}：</strong>{{dom.id}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="自定义数据" v-show="false">
            <a-switch @change="isCustom = !isCustom" :checked="isCustom"/>
          </a-form-item>
          <template v-if="isCustom">
            <a-form-item :required="true" :label="key" v-for="(key, index) of Object.keys(formData)" :key="index">
              <a-textarea  placeholder="请输入组件描述" v-model="formData[key]"
                :auto-size="{ minRows: 3, maxRows: 5 }"/>
            </a-form-item>
          </template>
        </a-form>
      </template>
    </q-modal> 
      </div>   
        `,
  props: {
    data: Object,
    index: Number,
    position: String,
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
      options: this.data.options || [],
      style: this.data.style,
      chartData: this.data.chartData || null,
      trigger: ["contextmenu"],
      isLoading: false,
      showEditModal: false,
      selectedDom: [],
      domList: [],
      db: null,
      formData: [],
      showEditMenu: true,
      isCustom: false,
      selDomId: "",
      dragClass: "",
      tag: "",
      paramList: [],
      renderTime: 0,
      transfromData: {
        originData: [],
        receiver: [],
      },
    };
  },
  methods: {
    async handleMenuClick(e) {
      return new Promise((reslove, reject) => {
        this.transfromData = this.data.transfromData;
        switch (e.key) {
          case "1":
            this.query();
            reslove();
            break;
          case "2":
            this.showEditModal = true;
            const filterArr = ["API接口数据", "数据库表数据"];
            this.domList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
              .filter((i) => i.id !== this.$el.id)
              .filter((i) => !filterArr.includes(JSON.parse(i.dataset.data).name));
            reslove();
            break;
          case "数据流转":
            if (this.transfromData.receiver.length) {
              obEvents.setSelectedPoint(
                { sender: this.data.id, receiver: this.transfromData.receiver },
                this.transfromData.originData
              );
            } else {
              this.$message.warning("请先绑定输出组件！");
            }
            reslove();
            break;
        }
      });
    },
    selectComp(e) {
      this.transfromData.receiver = e;
    },
    focusSelectCom(e) {
      document.querySelector("#" + e.key).classList.add("focusBind");
    },
    blurSelectCom(e) {
      document.querySelector("#" + e.key).classList.remove("focusBind");
    },
    async updateIndexDB() {
      this.$set(this.data.transfromData, "receiver", this.transfromData.receiver);
    },
    async query() {
      this.isLoading = true;
      let reqParam = {};
      if (typeof this.data.paramList === "string") {
        this.data.paramList = JSON.parse(this.data.paramList);
      }
      this.data.paramList.map((ele) => {
        reqParam[ele.key] = ele.default;
      });
      try {
        let res = await fetch("../../ui-builder/query-chart-data", {
          method: "POST",
          body: JSON.stringify(reqParam),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => response.json());
        this.isLoading = false;
        if (res.info.msg === "success") {
          if (document.querySelector(`.headers-content`)) {
            antd.message.success("数据获取成功");
            this.$set(this.data, "transfromData", {
              originData: res.results || [],
              receiver: this.transfromData.receiver || [],
            });
            if (document.querySelector(`.headers-content`)) {
              antd.message.success("数据获取成功");
              this.$set(this.data, "transfromData", {
                originData: res.results || [],
                receiver: this.selectedDom || [],
              });
            }
          } else {
            if (document.querySelector(`.headers-content`)) {
              antd.message.success("数据获取失败，请检查接口地址");
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              key: { type: "string" },
              title: { type: "string" },
              default: { type: "string" },
            },
            required: ["key", "title", "default"],
          },
        ],
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe(async (data) => {
        const { body = {}, type } = data;
        const { select = [] } = body;
        if (type === "info") {
          if (check(body)) {
            this.data.paramList = body;
            return;
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
    cancleFun() {
      this.transfromData = {
        originData: [],
        receiver: [],
      };
    },
  },

  updated() {
    try {
      this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  created() {
    this.data.paramList = this.data.paramList.length > 0 ? this.data.paramList : this.paramList;
  },
  async mounted() {
    this.receiveInfo();
    if (!document.querySelector(`.headers-content`)) {
      this.showEditMenu = false;
    }
    this.dragClass = this.$refs.apiDom.parentNode.parentNode.id !== "bottomcontent" ? "draggable2" : "draggable";
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
