/**
 * form 表单 下拉框
 */
Vue.component("q-select", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;border-radius: 4px;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-select/q-select.css" rel="stylesheet"> 
            <a-select v-model="options.value"  @change="handleChange" style="width: 100%;height:100%" class="q-select">
                <a-select-option :value="item.value" v-for="(item, i) in options.option" :key="i" :disabled="item.disabled">
                    {{item.name}}
                </a-select-option>
            </a-select>
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
        option: [
          { value: "1", name: "下拉1", disabled: false },
          { value: "2", name: "下拉2", disabled: false },
          { value: "3", name: "下拉3", disabled: false },
        ],
        value: "1",
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
    handleChange() {},
  },
  mounted() {
    this.$set(this, "options", this.data.options);
  },
});
