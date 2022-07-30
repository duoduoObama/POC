/**
 * form 表单 多选框
 */
Vue.component("q-checkBox", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;border-radius: 4px;display: flex;justify-content: center;align-items: center;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
                <a-checkbox-group
                v-model="options.value"
                name="options.name"
                :options="options.optionsList"
                :default-value="[options.defaultValue]"
                @change="onChange"
                >
                <span slot="label" slot-scope="{ lable }" :style="options.lableStyle" style="max-width: 100px;display: table-cell;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;" :title="lable">{{ lable }}</span>
                </a-checkbox-group>
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
        value: [],
        optionsList: [
          { value: "1", lable: "多选1", disabled: false, style: "color: red" },
          { value: "2", lable: "多选2", disabled: false },
          { value: "3", lable: "多选3", disabled: false },
        ],
        defaultValue: "1",
        lableStyle: "color: red",
      },
      style: this.data.style,
      test: "",
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
