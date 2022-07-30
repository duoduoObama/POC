/**
 * 状态绑定
 */

Vue.component("q-state-button", {
  template: `  
    <div class="draggable2" :id="id" ref="apiDom" :index="index" style="background-color:#fff;padding:5px" :style="style" :data-data="JSON.stringify(data)" :data-x="x" :data-y="y">
      <link href="${location.origin}/ui-builder/js/lay-module/components/q-state-button/q-state-button.css" rel="stylesheet"> 
      <button class="q-state-button">
        <span class="default-font">
            <a-icon type="sync" v-if="isLoading" style="position: absolute;right: 5px;top: 5px;font-size: 18px;animation: fa-spin 2s infinite linear;"/>
            <a-icon type="block" style="font-size:18px"/>
            状态绑定
        </span>
      </button>
      <q-modal class="modal-box" width="50%" okText="保存" title="编辑状态绑定" v-if="showEditModal" @ok="confirmFun" @cancel="cancleFun" :visible.sync="showEditModal">
      <template slot="modalBody">
      <a-row>
          <a-col :span="11">
              <a-row type="flex" align="middle">
                  <a-col flex="80px">输入组件：</a-col>
                  <a-col flex="auto">
                    <a-input placeholder="" disabled v-model="transfromData.sender || ''" />
                  </a-col>
              </a-row>
          </a-col>
          <a-col :span="11" :push="2">
              <a-row type="flex" align="middle">
                  <a-col flex="80px">输出组件：</a-col>
                  <a-col flex="auto">
                      <a-select  style="width:100%" @change="outDataChange"  mode="multiple" :maxTagCount="1" :default-value="transfromData.receiver || []">
                      <a-select-option  @mouseenter="focusSelectCom" @mouseleave="blurSelectCom" :value="key.id"  v-for="(key,i) in outDataSelList" :key="key.id"><strong>{{JSON.parse(key.dataset.data).name}}：</strong>{{key.id}}</a-select-option>
                      </a-select>
                  </a-col>
              </a-row>
          </a-col>
      </a-row>
      <a-row :gutter="[0, 20]">
      <a-col :span="24">
        <div class="dataset-exhibition-wrapper">
        <a-table :columns="columns" :data-source="transfromData.originData" v-if="transfromData.originData.length" :rowKey="(record,index)=> index" :y="true" :scroll="{y: 500}" size="middle" :locale="{emptyText:'暂无数据源'}"></a-table>
        <div class="empty-wrapper" v-else>暂无数据源</div>
        </div>
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
          const { style, options } = newValue;
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
    "transfromData.originData": {
      handler(data) {
        this.columns = [];
        for (const key in data[0]) {
          if (Object.hasOwnProperty.call(data[0], key)) {
            this.columns.push({
              dataIndex: key,
              key,
              title: key,
              ellipsis: true,
            });
          }
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      transfromData: {
        receiver: [],
        originData: [],
        sender: "",
      },
      style: this.data.style,
      chartData: this.data.chartData || null,
      isLoading: false,
      trigger: ["contextmenu"],
      db: null,
      showEditModal: false,
      columns: [],
      tableData: [],
      inDataSelList: [],
      inDataSeled: "",
      outDataSelList: [],
      sourceData: [],
    };
  },
  methods: {
    handleMenuClick(e) {
      this.data.transfromData = delTransf(this.data.transfromData);
      this.transfromData = _.cloneDeep(this.data.transfromData);
      switch (e.key) {
        case "数据流转":
          return this.dataFlow();
          break;
        case "1":
          this.startEdit();
          break;
      }
    },
    dataFlow() {
      this.isLoading = true;
      let promiseArr = [];
      if (this.data.transfromData.receiver.length) {
        this.transfromData.receiver.map((it) => {
          promiseArr.push(
            new Promise((resolve, reject) => {
              obEvents.setSelectedPoint({ receiver: it, sender: this.data.id }, this.transfromData.originData);
              resolve();
            })
          );
        });
      } else {
        promiseArr.push(
          new Promise((reslove, reject) => {
            this.$message.warning("请先绑定输出组件!");
            reject();
          })
        );
      }
      rxjs.timer(500).subscribe((x) => {
        this.isLoading = false;
      });
      return Promise.all(promiseArr);
    },
    confirmFun() {
      try {
        if (this.transfromData.sender && this.transfromData.receiver.length) {
          this.$set(this.data, "transfromData", {
            sender: this.transfromData.sender,
            receiver: this.transfromData.receiver,
            originData: this.transfromData.originData,
          });
        } else {
          throw "请绑定输入、输出组件";
        }
      } catch (error) {
        this.$message.warning(error);
        this.showEditModal = true;
      }
    },
    cancleFun() {},
    startEdit() {
      this.showEditModal = true;
      const filterArr = ["API接口数据", "数据库表数据"];
      this.outDataSelList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
        .filter((i) => i.id !== this.$el.id)
        .filter((i) => !filterArr.includes(JSON.parse(i.dataset.data).name));
    },
    getColumns(data) {
      return new Promise((resolve, reject) => {
        try {
          let tempArr = [];
          if (data.length) {
            for (const key in data[0]) {
              if (Object.hasOwnProperty.call(data[0], key)) {
                tempArr.push({
                  dataIndex: key,
                  key,
                  title: key,
                  ellipsis: true,
                });
              }
            }
          }
          resolve(tempArr);
        } catch (error) {
          reject(error);
        }
      });
    },
    outDataChange(value) {
      this.transfromData.receiver = value;
    },
    receiveInfo() {
      const { id, name } = this.data;
      obEvents.currentSelectedPoint(id).subscribe(async (data) => {
        const { body, sender, type } = data;
        const { select = [] } = body;
        if (type === "info") {
          if (Array.isArray(body)) {
            this.data.transfromData = delTransf(this.data.transfromData);
            this.$set(this.data.transfromData, "originData", body || []);
            this.$set(this.data.transfromData, "sender", sender);
            this.getColumns(body || []).then((res) => {
              this.columns = res;
            });
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
  },
  mounted() {
    this.receiveInfo();
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
