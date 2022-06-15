/**
 * 样式属性
 */
Vue.component("q-swiper-pic-set", {
  template: ` 
        <a-form-model id="q-swiper-pic-set" :model="form"  :label-col="labelCol" :wrapper-col="wrapperCol" @click="showFontColorPicker=false;showBgColorPicker=false;">
          <div class="split">
            <div class="split-line"></div>
            <div class="split-text">组件数据</div>
            <div class="split-line"></div>
          </div>
          <a-form-model-item
            style="margin-bottom: 0"
            :label="'图片路径'"
          >
            <div v-for="(item,index) in optionsAttrs" :key="index" class="options">
              <a-input
                v-model="optionsAttrs[index].image"
                @change="changeAttrObject('options')"
                type="textarea"
              />
              <div class="options-menu" @click="showMenu(index)" @mouseleave="hideMenu(index)">
                <a-icon type="more" style="fontSize: 18px" />
                <div ref="iconMenu" class="options-menu-content">
                  <div @click.stop="copyOptions(index)" class="options-menu-content-item">
                    <a-icon type="copy" />
                    <span>复制</span>
                  </div>
                  <div @click.stop="deleteOptions(index)" class="options-menu-content-item">
                    <a-icon type="delete" />
                    <span>删除</span>
                  </div>
                  <div @click.stop="addLastOptions(index)" class="options-menu-content-item">
                    <a-icon type="plus-circle" />
                    <span>在下方增加项</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="addBtn" @click="addOptions">新建项</div>
          </a-form-model-item>
          <div class="split">
            <div class="split-line"></div>
            <div class="split-text">组件信息</div>
            <div class="split-line"></div>
          </div>
          <a-form-model-item
            v-for="(item,index) in attrObjectCopy"
            v-if="ignoreMethod(index) && index !== 'options' && index !== 'style' && index !== 'width'&& index !== 'height'&& index !== 'x'&& index !== 'y'&& index !== 'datatype'&& index !== 'description' && typeof item !=='object'"
            style="margin-bottom: 0"
            :label="index"
            :key="index"
          >
            <a-input
              v-model="attrObjectCopy[index]"
              :disabled="disabledAttrs(index)"
              @change="changeAttrObject(index)"
              type="textarea"
            />
          </a-form-model-item>
          <div class="split">
            <div class="split-line"></div>
            <div class="split-text">组件样式</div>
            <div class="split-line"></div>
          </div>
          <a-form-model-item v-for="(item,index) in styleAttrs" v-if="Object.keys(map).includes(index)"
            :label="map[index]" :key="index" style="margin-bottom: 0">
            <a-radio-group v-model="styleAttrs[index]" v-if="index==='textAlign'" @change="changeAttr">
              <a-radio-button value="left">
                Left
              </a-radio-button>
              <a-radio-button value="center">
                Center
              </a-radio-button>
              <a-radio-button value="right">
                Right
              </a-radio-button>
            </a-radio-group>
            <a-input v-model="styleAttrs[index]" v-else-if="index == 'color'" @change="changeAttr" style="width: 100%;" @click="showFontColorPicker=true;fontColor=styleAttrs[index]" />
            <div v-if="index == 'color' && showFontColorPicker===true" style="position:relative;">
              <span class="color-select" @click="showFontColorPicker=false;">x</span>
              <compact-picker v-model="fontColor" :disableFields="true" @input="changeFontColor" />
            </div>
            <a-input v-model="styleAttrs[index]" v-else-if="index == 'backgroundColor'" @change="changeAttr" style="width: 100%;" @click="showBgColorPicker=true;bgColor=styleAttrs[index]"/>
            <div v-if="index == 'backgroundColor' && showBgColorPicker===true" style="position:relative;">
              <span class="color-select" @click="showBgColorPicker=false;">x</span>
              <compact-picker v-model="bgColor" :palette='palette' :disableFields="true" @input="changeBgColor" style="background:none;"/>
            </div>
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'opacity'" :min="0" :max="1" :step="0.1" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'fontWeight'" :min="0" :max="1000" :step="100" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'lineHeight'" :min="0" :max="999" :step="1" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='percent' && (index == 'width' || index == 'height')" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
            <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && (index == 'width' || index == 'height')" :min="-9999" :max="9999" @change="changeAttr" style="width: 100%;"/>
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'zIndex' || index == 'fontSize' || index == 'letterSpacing' || index == 'borderRadius'" :min="-9999" :max="9999" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && index == 'x'" :min="0" :max="maxX" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && index == 'y'" :min="0" :max="maxY" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]"  v-else-if="percentOrabsolute=='percent' && index == 'x'" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]"  v-else-if="percentOrabsolute=='percent' && index == 'y'" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
          </a-form-model-item>
        </a-form-model>
        `,
  props: {
    attrObject: Object,
  },
  mixins: [window.componentsMinxin],
  components: {
    CompactPicker: VueColor.Compact,
  },
  watch: {
    attrObject: {
      handler(newValue, oldValue) {
        try {
          this.attrObjectCopy = JSON.parse(JSON.stringify(newValue));
          this.changeStyleString();
          this.changeOptionsStr();
        } catch (error) {}
      },
      deep: true,
    },
    percentOrabsolute: function () {
      this.setLengthUnit();
    },
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 24 },
      form: {},
      maxX: 0,
      maxy: 0,
      showFontColorPicker: false,
      showBgColorPicker: false,
      bgColor: "",
      fontColor: "",
      attrObjectCopy: {},
      styleAttrs: {},
      optionsAttrs: [],
      colorsPostion: null,
      colorArr: ["#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321", "#417505", "#BD10E0", "#9013FE"],
      map: {
        x: "x 坐标(px)",
        y: "y 坐标(px)",
        height: "高(px)",
        width: "宽(px)",
        color: "字体颜色",
        backgroundColor: "背景色",
        borderWidth: "边框宽度",
        borderColor: "边框颜色",
        borderRadius: "边框半径(px)",
        fontSize: "字体大小(px)",
        fontWeight: "字体粗细",
        lineHeight: "行高",
        letterSpacing: "字间距(px)",
        textAlign: "对齐方式",
        opacity: "透明度",
        rotate: "旋转角度",
        zIndex: "层级",
      },
    };
  },
  methods: {
    getColorPosition(target) {
      const { clientX, clientY } = target;
      const { innerHeight, innerWidth } = window;
      let pX = clientX;
      let pY = clientY;
      if (clientX + 220 >= innerWidth) {
        pX = innerWidth - 220;
      }
      if (clientY + 301 >= innerHeight) {
        pY = innerWidth - 301;
      }
      this.colorsPostion = `position:absolute;left:${pX}px;top:${pY}px;z-index:99999`;
    },
    setLengthUnit() {
      const unit = this.percentOrabsolute === "absolute" ? "px" : "%";
      this.map.x = `x 坐标(${unit})`;
      this.map.y = `y 坐标(${unit})`;
      this.map.height = `高度(${unit})`;
      this.map.width = `宽度(${unit})`;
      this.map = Object.assign({}, this.map);
    },
    changeBgColor(value) {
      const { r, g, b, a } = value.rgba;
      a === 1
        ? (this.styleAttrs.backgroundColor = `rgb(${r}, ${g}, ${b})`)
        : (this.styleAttrs.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`);
      this.changeAttr();
      this.showColorPicker = false;
    },
    changeFontColor(value) {
      const { r, g, b, a } = value.rgba;
      a === 1
        ? (this.styleAttrs.color = `rgb(${r}, ${g}, ${b})`)
        : (this.styleAttrs.color = `rgba(${r}, ${g}, ${b}, ${a})`);
      this.changeAttr();
      this.showColorPicker = false;
    },
    changeAttrObject(index) {
      this.attrObjectCopy.options = this.optionsAttrs;
      this.$emit("attr-change", index, this.attrObjectCopy);
    },
    changeAttr(e) {
      let style = this.objToStyle(this.styleAttrs);
      this.$emit("style-change", style);
    },
    changeOptionsStr() {
      if (typeof this.attrObjectCopy.options === "string") {
        this.optionsAttrs = JSON.parse(this.attrObjectCopy.options);
      } else {
        this.optionsAttrs = JSON.parse(JSON.stringify(this.attrObjectCopy.options));
      }
    },
    changeStyleString() {
      let style = this.cssToJs(this.attrObjectCopy.style);
      if (
        this.attrObjectCopy.style &&
        typeof this.attrObjectCopy.style === "string" &&
        this.attrObjectCopy.style.includes("-")
      ) {
        style = cssStyle2DomStyle(this.attrObjectCopy.style);
      }
      style = this.styleToObj(style);
      style = {
        ...{
          width: "150px",
          height: "150px",
          opacity: 1,
          backgroundColor: "",
          left: "0",
          top: "0",
        },
        ...style,
      };
      let width = style.width.replace("px", "").replace("%", "");
      let height = style.height.replace("px", "").replace("%", "");
      let left = style.left.replace("px", "").replace("%", "");
      let top = style.top.replace("px", "").replace("%", "");
      style.x = Number(left).toFixed(2) || 0;
      style.y = Number(top).toFixed(2) || 0;
      style.width = width;
      style.height = height;
      this.maxX = this.$root.canvasStyleData.width - width;
      this.maxY = this.$root.canvasStyleData.height - height;
      this.styleAttrs = style;
    },

    // options操作
    showMenu(index) {
      this.$refs.iconMenu[index].style.display = "block";
    },
    hideMenu(index) {
      this.$refs.iconMenu[index].style.display = "none";
    },
    addOptions() {
      this.optionsAttrs.push({
        image:
          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
      });
      this.changeAttrObject("options");
    },
    copyOptions(index) {
      this.optionsAttrs.splice(index + 1, 0, {
        image: this.optionsAttrs[index].image,
      });
      this.changeAttrObject("options");
      this.hideMenu(index);
    },
    deleteOptions(index) {
      if (this.optionsAttrs.length <= 1) {
        antd.message.warning("轮播图至少保留一张图片");
        this.hideMenu(index);
        return;
      }
      this.optionsAttrs.splice(index, 1);
      this.changeAttrObject("options");
      this.hideMenu(index);
    },
    addLastOptions(index) {
      this.optionsAttrs.splice(index + 1, 0, {
        image:
          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
      });
      this.changeAttrObject("options");
      this.hideMenu(index);
    },
  },
  mounted() {
    this.setLengthUnit();
    this.attrObjectCopy = JSON.parse(JSON.stringify(this.attrObject));
    this.changeOptionsStr();
    this.changeStyleString();
  },
  computed: {
    ...mapState(["percentOrabsolute"]),
  },
});
