/**
 * style样式
 */
Vue.component("q-style", {
  template: ` 
    <a-popover  placement="leftTop" title="自定义 CSS" trigger="click" :visible="clicked" @visibleChange="handleClickChange">
        <template slot="content">
            <a-textarea placeholder="自定义 CSS" @change="changeStyleText" v-model="styleText" style="width:260px" :rows="25" />
        </template>
       <slot name="style"></slot>
    </a-popover>
          `,
  props: {
    styleString: String,
    targetKey: String,
  },
  components: {
    CompactPicker: VueColor.Compact,
  },
  watch: {
    targetKey: (newVal, oldVal) => {},
    styleString(newVal, oldVal) {
      if (!this.styleString || typeof this.styleString !== "string") {
        return;
      }
      this.oldTargetKey = this.targetKey;
      //等待key变换
      rxjs.timer(500).subscribe(() => {
        const isStyleIsSame = this.styleString === this.checkStyle(this.styleText);
        const isTarget = this.oldTargetKey === this.targetKey;
        if ((isTarget && isStyleIsSame) || !this.styleString) {
          return;
        }
        const newStyle = this.styleString.split(";").join(";\n");

        const copyStyleArr = newStyle.split(";\n");
        this.styleString
          .split(";")
          .filter((c) => c)
          .forEach((style) => {
            const [changePropertie, changeValue] = style.split(":");
            copyStyleArr.forEach((current, index) => {
              const [targetPropertie] = current.split(":");
              if (_.trim(changePropertie) === _.trim(targetPropertie)) {
                copyStyleArr[index] = `${changePropertie}:${changeValue}`;
              }
            });
          });
        this.styleText = copyStyleArr.map((c) => _.trim(c)).join(";\n");
      });
    },
  },
  data() {
    return {
      clicked: false,
      styleText: "",
      oldTargetKey: false,
    };
  },
  methods: {
    handleClickChange(visible) {
      this.clicked = visible;
      this.hovered = false;
    },
    changeStyleText: _.throttle(function (newVal) {
      this.$emit("style-change", this.checkStyle(newVal.target.value.replace(/\n/g, "")));
    }, 500),
    checkStyle(cssText) {
      const divElement = document.createElement("div");
      divElement.style.cssText = cssText;
      return divElement.style.cssText;
    },
  },
  mounted() {
    if (this.styleString && typeof this.styleString === "string") {
      this.styleText = this.styleString.split(";").join(";\n");
    }
  },
});
