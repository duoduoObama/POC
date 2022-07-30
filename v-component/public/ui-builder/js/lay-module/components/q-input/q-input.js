/**
 * form 表单 输入框
 */
Vue.component("q-input", {
  template: `
           <div class="draggable2" :id="data.id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;border-radius: 4px;"
            :style="data.style"
            :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-input/q-input.css" rel="stylesheet"> 
            
                <a-input :placeholder="options.placeholder" v-model:value="options.value" class="q-input">

                <a-tooltip slot="prefix" :title="options.prefixTooltip" v-if="options.prefixHtml !== ''" v-html="options.prefixHtml">
                    <a-icon :type="options.prefixType" :style="options.prefixStyle" v-if="options.prefixType" />
                </a-tooltip>
                <a-tooltip slot="prefix" :title="options.prefixTooltip" v-else>
                    <a-icon :type="options.prefixType" :style="options.prefixStyle" v-if="options.prefixType" />
                </a-tooltip>

                <a-tooltip slot="suffix" :title="options.suffixTooltip" v-if="options.suffixHtml !== ''" v-html="options.suffixHtml">
                    <a-icon :type="options.suffixType" :style="options.suffixStyle" v-if="options.suffixStyle" />
                </a-tooltip>
                <a-tooltip slot="suffix" :title="options.suffixTooltip" v-else>
                    <a-icon :type="options.suffixType" :style="options.suffixStyle" v-if="options.suffixStyle"  />
                </a-tooltip>
                </a-input>
                 
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
      options: {
        placeholder: "请输入",
        value: "",
        prefixType: "user",
        prefixTooltip: "提示",
        prefixStyle: "color: rgba(0,0,0,.45)",
        prefixHtml: "",
        suffixType: "info-circle",
        suffixTooltip: "提示",
        suffixStyle: "color: rgba(0,0,0,.45)",
        suffixHtml: "",
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
  },
  mounted() {
    this.$set(this, "options", this.data.options);
  },
});
