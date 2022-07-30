/**
 * 按钮
 */
Vue.component("q-database-button", {
  template: `  
    <div class="draggable2" :id="id" ref="apiDom" :index="index" style="background-color:#fff;padding:5px" :style="style" :data-data="JSON.stringify(data)" :data-x="x" :data-y="y">
      <link href="${location.origin}/ui-builder/js/lay-module/components/q-database-button/q-database-button.css" rel="stylesheet"> 
      <button class="q-database-button">
        <span class="default-font"><a-icon type="sync" v-if="isLoading" style="position: absolute;right: 5px;top: 5px;font-size: 18px;animation: fa-spin 2s infinite linear;"/>{{data.options}}</span>
      </button>
      <q-modal class="modal-box" width="30%" okText="保存" title="编辑" v-if="showEditModal" @ok="confirmFun" @cancel="cancleFun" :visible.sync="showEditModal">
      <template slot="modalBody">
      <a-row>
        <a-col :span="24">
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
    </template>
      </q-modal>
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
      options: this.data.options || [],
      style: this.data.style,
      chartData: this.data.chartData || null,
      transfromData: {
        originData: [],
        receiver: [],
      },
      isLoading: false,
      trigger: ["contextmenu"],
      db: null,
      showEditModal: false,
      outDataSelList: [],
    };
  },
  methods: {
    async handleMenuClick(e) {
      this.data.transfromData = delTransf(this.data.transfromData);
      this.transfromData = _.cloneDeep(this.data.transfromData);
      return new Promise((reslove, reject) => {
        switch (e.key) {
          case "1":
            this.query();
            reslove();
            break;
          case "2":
            this.edit();
            reslove();
            break;
          case "数据流转":
            /* 发送数据 */
            if (!this.transfromData.receiver.length) {
              this.$message.warning("请先绑定输出组件！");
              return;
            }
            this.transfromData.receiver.map((it) => {
              obEvents.setSelectedPoint({ sender: this.data.id, receiver: it }, this.transfromData.originData);
            });
            reslove();
            break;
        }
      });
    },
    async query() {
      return new Promise(async (reslove, reject) => {
        this.isLoading = true;
        let reqParam = {};
        if (typeof this.data.paramList === "string") {
          this.data.paramList = JSON.parse(this.data.paramList);
        }
        this.data.paramList.map((ele) => {
          reqParam[ele.key] = ele.default;
        });
        try {
          let res = await fetch("../../ui-builder/query-database-data", {
            method: "POST",
            body: JSON.stringify(reqParam),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => response.json());
          this.isLoading = false;
          if (res.info.msg === "success") {
            let comp = await this.$root.dexie.deepCharts.get(getQueryVariable("id"));
            if (comp) {
              comp.data = comp.data || {};
            } else {
              comp = {
                id: "",
                data: {},
              };
            }
            comp.data[this.data.id] = res.results;
            this.$root.dexie.deepCharts.put({
              id: getQueryVariable("id"),
              data: comp.data,
            });
            console.log(res.results);
            this.$set(this.transfromData, "originData", res.results);
            this.$set(this.data.transfromData, "originData", res.results);

            antd.message.success("数据获取成功");
            reslove();
          } else {
            antd.message.error("数据获取失败，请检查接口地址");
            reject();
          }
        } catch (error) {
          antd.message.error("数据获取失败，请检查接口地址");
          reject();
        }
      });
    },
    edit() {
      const filterArr = ["API接口数据", "数据库表数据"];
      this.outDataSelList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
        .filter((i) => i.id !== this.$el.id)
        .filter((i) => !filterArr.includes(JSON.parse(i.dataset.data).name));
      this.showEditModal = true;
      // this.transfromData = delTransf(this.transfromData);
    },
    /* 输出组件 */
    outDataChange(value) {
      this.transfromData.receiver = value;
    },
    confirmFun() {
      if (this.transfromData.receiver.length) {
        this.$set(this.data, "transfromData", _.cloneDeep(this.transfromData));
      } else {
        this.$message.warning("请先绑定输出组件！");
        this.showEditModal = true;
      }
    },
    cancleFun() {
      this.transfromData = {
        originData: [],
        receiver: [],
      };
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
          }
          antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
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
    /* 下拉聚焦 */
    focusSelectCom(e) {
      document.querySelector("#" + e.key).classList.add("focusBind");
    },
    /* 下拉失焦 */
    blurSelectCom(e) {
      document.querySelector("#" + e.key).classList.remove("focusBind");
    },
  },
  updated() {
    try {
      this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.receiveInfo();
    // this.transfromData = delTransf(this.transfromData);
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
