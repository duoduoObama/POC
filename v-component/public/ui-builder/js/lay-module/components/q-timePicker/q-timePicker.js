/**
 * form 表单 时间选择
 */
Vue.component("q-timePicker", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;border-radius: 4px;display: flex;justify-content: center;align-items: center;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-timePicker/q-timePicker.css" rel="stylesheet"> 
            <a-time-picker use12-hours @change="onChange" :placeholder="options.placeholder" class="q-timePicker" style="width: 100%" />
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
      options: this.data.options || { placeholder: "请选择时间" },
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
