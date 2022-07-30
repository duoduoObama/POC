/**
 * form 表单 单选框
 */
Vue.component("q-radio", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;border-radius: 4px;display: flex;justify-content: center;align-items: center;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
                <a-radio-group :default-value="options.defaultValue" @change="onChange" v-model="options.value" v-if="!options.isButton">
                    <a-radio :value="item.value"  v-for="(item, i) in options.optionsList" :key="i" :disabled="item.disabled" style="max-width: 100px;display: table-cell;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;" :title="item.lable">
                    {{item.lable}}
                    </a-radio>
                </a-radio-group>
                <a-radio-group :default-value="options.defaultValue" v-else @change="onChange" v-model="options.value">
                    <a-radio-button :value="item.value"  v-for="(item, i) in options.optionsList" :key="i" :disabled="item.disabled" style="max-width: 100px;display: table-cell;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;" :title="item.lable">
                    {{item.lable}}
                </a-radio-button>
          </a-radio-group>
            </div>
          `,
  props: {
    data: Object,
    index: Number,
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || {
        isButton: true,
        value: "1",
        optionsList: [
          { value: "1", lable: "单选1", disabled: false },
          { value: "2", lable: "单选2", disabled: false },
          { value: "3", lable: "单选3", disabled: false },
        ],
        defaultValue: "1",
      },
      style: this.data.style,
    };
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style } = newValue;
          this.style = style;
          if (typeof newValue.options === `string`) {
            this.$set(this, "options", JSON.parse(newValue.options));
          }
        } catch (error) {}
      },
      deep: true,
    },
  },
  methods: {
    parseOptions(data) {
      if (typeof data === `string`) {
        return JSON.parse(data);
      }
      return data;
    },
    onChange() {},
  },
  mounted() {
    this.$set(this, "options", this.data.options);
  },
});
