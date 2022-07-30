/**
 * 图元组件
 */
Vue.component("q-deep-chart", {
  template: `  
      <div class="draggable2" :id="id" :index="index" style="background-color:#fff;" :style="style" :data-data="JSON.stringify(data)" :data-x="x" :data-y="y">
        <link href="${location.origin}/ui-builder/js/lay-module/components/q-text/mdc.card.css" rel="stylesheet"> 
        <div class="mdc-card mdc-card-h100">
          <img :src="data.options||data.image" :alt="data.alt" ref="img" onerror="src='../../ui-builder/images/empty.png'">
        </div>
        <q-modal class="modal-box" title="编辑输出参数" v-if="showEditModal"  :visible.sync="showEditModal" @ok="setOutTarget">
        <template slot="modalBody">
          <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-form-item :required="true" label="输出图元目标">
              <a-select style="width: 300px;" v-model="selectedDom" @select="selectComp">
                <a-select-option v-for="dom in domList" :key="dom.id" :value="dom.id" @mouseenter="focusSelectCom" @mouseleave="blurSelectCom">{{dom.id}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="自定义数据">
              <a-switch @change="isCustom = !isCustom" />
            </a-form-item>
            <template v-if="isCustom">
              <a-form-item :required="true" :label="key" v-for="(key, index) of Object.keys(formData)" :key="index">
                <a-textarea  placeholder="请输入组件描述" v-model="JSON.stringify(formData[key])"
                  :auto-size="{ minRows: 3, maxRows: 5 }" v-if="typeof formData[key] === 'object'" />
                <a-textarea  placeholder="请输入组件描述" v-model="formData[key]"
                  :auto-size="{ minRows: 3, maxRows: 5 }" v-else />
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
      trigger: ["contextmenu"],
      isLoading: false,
      showEditModal: false,
      selectedDom: null,
      isCustom: false,
      domList: [],
      db: null,
      formData: [],
      selDomId: "",
    };
  },
  methods: {
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          break;
        case "2":
          this.showEditModal = true;
          this.domList = Array.from(document.querySelectorAll("#inner-dropzone .draggable2"))
            .filter((i) => i.id !== this.$el.id)
            .filter((i) => JSON.parse(i.dataset.data).legend !== undefined);
          break;
      }
    },
    setOutTarget() {
      let paramList = JSON.parse(this.data.paramList);
      paramList.map((i) => {
        if (i.key === "out_chart") {
          i.default = `["${this.selDomId}"]`;
        }
      });
      this.data.paramList = JSON.stringify(paramList);
    },
    selectComp(e) {
      this.selDomId = e;
      let formData = JSON.parse(document.querySelector("#" + e).dataset.data);
      if (typeof formData.inputData === "string") {
        this.formData = JSON.parse(formData.inputData);
      } else {
        this.formData = formData.inputData || [];
      }
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
    if (!document.querySelector(`.headers-content`)) {
      this.trigger = [];
    }
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
