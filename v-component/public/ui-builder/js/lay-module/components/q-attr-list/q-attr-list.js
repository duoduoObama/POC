/**
 * 样式属性
 */
Vue.component("q-attr-list", {
  template: ` 
      <div @click="showFontColorPicker=false;showBgColorPicker=false;">
        <a-form-model :model="form"  :label-col="labelCol" :wrapper-col="wrapperCol">
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
            <a-input v-model="styleAttrs[index]" onfocus="this.blur();" v-else-if="index == 'color'" @change="changeAttr" style="width: 100%;" @click.stop="showFontColorPicker=true;fontColor=styleAttrs[index]" />
            <div v-if="index == 'color' && showFontColorPicker===true" @click.stop="" style="position:relative;">
              <span style="position: absolute;
                          left: 0;
                          bottom: -21px;
                          z-index: 1;
                          cursor: pointer;
                          height: 20px;
                          width: 20px;
                          font-size: 18px;
                          font-weight: 600;
                          background-color: #fff;
                          line-height: 20px;
                          text-align: center;
                          box-shadow: 0 2px 10px rgb(0 0 0 / 12%), 0 2px 5px rgb(0 0 0 / 16%);" @click="showFontColorPicker=false;">x</span>
                                    <sketch-picker v-model="fontColor" @input="changeFontColor" style="line-height: 20px" />
            </div>
            <a-input v-model="styleAttrs[index]" onfocus="this.blur();" v-else-if="index == 'backgroundColor'" @change="changeAttr" style="width: 100%;" @click.stop="showBgColorPicker=true;bgColor=styleAttrs[index]"/>
            <div v-if="index == 'backgroundColor' && showBgColorPicker===true" @click.stop="" style="position:relative;">
              <span style="position: absolute;
                          left: 0;
                          bottom: -21px;
                          z-index: 1;
                          cursor: pointer;
                          height: 20px;
                          width: 20px;
                          font-size: 18px;
                          font-weight: 600;
                          background-color: #fff;
                          line-height: 20px;
                          text-align: center;
                          box-shadow: 0 2px 10px rgb(0 0 0 / 12%), 0 2px 5px rgb(0 0 0 / 16%);" @click="showBgColorPicker=false;">x</span>
                                    <sketch-picker v-model="bgColor" :abandon='[ 
                                      "rgb(77, 77, 77,1)", "rgb(153, 153, 153,1)", "rgb(244, 78, 59,1)", "rgb(254, 146, 0,1)", "rgb(252, 220, 0,1)", "rgb(219, 223, 0,1)", "rgb(164, 221, 0,1)", "rgb(104, 204, 202,1)", "rgb(115, 216, 255,1)", "rgb(174, 161, 255,1)", "rgb(253, 161, 255,1)", "rgb(128, 128, 128,1)", "rgb(204, 204, 204,1)", "rgb(211, 49, 21,1)", "rgb(226, 115, 0,1)", "rgb(252, 196, 0,1)", "rgb(176, 188, 0,1)", "rgb(104, 188, 0,1)", "rgb(22, 165, 165,1)", "rgb(0, 156, 224,1)", "rgb(123, 100, 255,1)", "rgb(250, 40, 255,1)", "rgb(0, 0, 0,1)", "rgb(102, 102, 102,1)", "rgb(179, 179, 179,1)", "rgb(159, 5, 0,1)", "rgb(196, 81, 0,1)", "rgb(251, 158, 0,1)", "rgb(128, 137, 0,1)", "rgb(25, 77, 51,1)", "rgb(12, 121, 125,1)", "rgb(0, 98, 177,1)", "rgb(101, 50, 148,1)", "rgb(171, 20, 158,1)", "rgb(255, 255, 255,1)", "rgba(0, 0, 0, 0)"
                                    ]' :disableFields="true" @input="changeBgColor" style="line-height: 20px" />
            </div>
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'opacity'" :min="0" :max="1" :step="0.1" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'fontWeight'" :min="0" :max="1000" :step="100" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'lineHeight'" :min="0" :max="999" :step="1" @change="changeAttr" style="width: 100%;" />
            <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='percent' && (index == 'width' || index == 'height')" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
            <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && (index == 'width' || index == 'height')" :min="-9999" :max="9999" @change="changeAttr" style="width: 100%;"/>
            <a-input-number v-model="styleAttrs[index]" v-else-if="index == 'zIndex' || index == 'fontSize' || index == 'letterSpacing' || index == 'borderRadius'" :min="0" :max="9999" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && index == 'x'" :min="0" :max="maxX" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]" v-else-if="percentOrabsolute=='absolute' && index == 'y'" :min="0" :max="maxY" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]"  v-else-if="percentOrabsolute=='percent' && index == 'x'" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
             <a-input-number v-model="styleAttrs[index]"  v-else-if="percentOrabsolute=='percent' && index == 'y'" :min="0" :max="100" @change="changeAttr" style="width: 100%;"/>
          </a-form-model-item>
        </a-form-model>
      </div>
        `,
  props: {
    styleString: String,
  },
  components: {
    SketchPicker: VueColor.Sketch,
  },
  watch: {
    styleString: function (newVal, oldVal) {
      if (!newVal || typeof newVal !== "string") {
        return;
      }
      this.oldTargetKey = this.targetKey;
      rxjs.timer(100).subscribe(() => {
        const isStyleIsSame = this.checkStyle(this.oldStryle) === this.checkStyle(this.styleString);
        const isTarget = this.oldTargetKey === this.targetKey;

        if (isTarget && isStyleIsSame) {
          return;
        }
        this.oldStryle = this.checkStyle(this.styleString);
        this.changeStyleString();
      });
    },
    percentOrabsolute: function () {
      this.changeInfo();
      this.changeAttr();
    },
  },
  data() {
    return {
      oldTargetKey: "",
      oldStryle: "",
      labelCol: { span: 23 },
      wrapperCol: { span: 24 },
      form: {},
      maxX: 0,
      maxy: 0,
      showFontColorPicker: false,
      showBgColorPicker: false,
      bgColor: "",
      fontColor: "",
      styleAttrs: {},
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
    checkStyle(cssText) {
      const divElement = document.createElement("div");
      divElement.style.cssText = cssText;
      return divElement.style.cssText;
    },
    jsToCss(str) {
      var reg = /([A-Z])/g;
      str = str.replace(reg, function (match) {
        return "-" + match.toLowerCase();
      });
      return str;
    },
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
    cssToJs(css) {
      var re = /(-)(\w)/g;
      if (css) {
        var str = css.replace(re, function ($0, $1, $2) {
          return $2.toUpperCase();
        });
      }
      return str;
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
    changeAttr(e) {
      let style = this.objToStyle();
      this.oldStryle = this.checkStyle(this.jsToCss(style));
      this.$emit("style-change", style);
    },
    changeInfo() {
      const focusElement = $(".focus")[0];
      const { clientHeight, clientWidth } = focusElement;
      const x = focusElement.getBoundingClientRect().left - focusElement.parentElement.getBoundingClientRect().left;
      const y = focusElement.getBoundingClientRect().top - focusElement.parentElement.getBoundingClientRect().top;

      if (this.percentOrabsolute === "absolute") {
        this.styleAttrs.height = clientHeight + 2;
        this.styleAttrs.width = clientWidth + 2;
        this.styleAttrs.x = x;
        this.styleAttrs.y = y;
      } else if (this.percentOrabsolute === "percent") {
        this.styleAttrs.width = (clientWidth / (focusElement.parentElement.clientWidth - 2)) * 100;
        this.styleAttrs.height = (clientHeight / (focusElement.parentElement.clientHeight - 2)) * 100;
        this.styleAttrs.left = this.styleAttrs.x = (x / focusElement.parentElement.clientWidth) * 100;
        this.styleAttrs.top = this.styleAttrs.y = (y / focusElement.parentElement.clientHeight) * 100;
      }
    },
    // 样式转对象
    styleToObj(style) {
      if (!style || style == "") {
        return;
      }
      var Arr = style.split(";");
      Arr = Arr.map((item) => this.trim(item)).filter((item) => {
        return item != "" && item != "undefined";
      });
      let str = "";
      Arr.forEach((item) => {
        let test = "";
        this.trim(item)
          .split(":")
          .forEach((item2) => {
            test += '"' + this.trim(item2) + '":';
          });
        str += test + ",";
      });
      str = str.replace(/:,/g, ",");
      str = str.substring(0, str.lastIndexOf(","));
      str = "{" + str + "}";
      return JSON.parse(str);
    },
    objToStyle() {
      const styleArr = [];
      let { x, y, width, height } = this.styleAttrs;
      [x, y] = [Number(x), Number(y)];
      if (this.percentOrabsolute === "absolute") {
        const focusElement = $(".focus")[0];
        const disabledAttrs = ["container"];
        const { elementType } = focusElement.parentElement.dataset;

        this.styleAttrs.transform = `translate(${x}px, ${y}px)`;
        if (!disabledAttrs.includes(elementType)) {
          this.$delete(this.styleAttrs, "top");
          this.$delete(this.styleAttrs, "left");
        }
      } else if (this.percentOrabsolute === "percent") {
        this.$delete(this.styleAttrs, "transform");
        this.$delete(this.styleAttrs, "top");
        this.$delete(this.styleAttrs, "left");
        styleArr.push(`left:${x}%`);
        styleArr.push(`top:${y}%`);
        styleArr.push(`width:${width}%`);
        styleArr.push(`height:${height}%`);
      }

      for (const key in this.styleAttrs) {
        if (Object.hasOwnProperty.call(this.styleAttrs, key)) {
          if (key !== "x" && key !== "y") {
            if (
              this.percentOrabsolute === "absolute" &&
              (key === "width" ||
                key === "height" ||
                key === "fontSize" ||
                key === "lineHeight" ||
                key === "letterSpacing" ||
                key === "borderRadius")
            ) {
              styleArr.push(`${key}:${this.styleAttrs[key]}px`);
            } else if (
              this.percentOrabsolute === "percent" &&
              (key === "fontSize" || key === "lineHeight" || key === "letterSpacing" || key === "borderRadius")
            ) {
              styleArr.push(`${key}:${this.styleAttrs[key]}px`);
            } else {
              styleArr.push(`${key}:${this.styleAttrs[key]}`);
            }
          }
        }
      }
      return styleArr.join(";");
    },
    changeStyleString() {
      let style = this.cssToJs(this.styleString);
      if (this.styleString && typeof this.styleString === "string" && this.styleString.includes("-")) {
        style = cssStyle2DomStyle(this.styleString);
      }
      style = this.styleToObj(style);
      style = {
        ...{
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "",
          letterSpacing: "0px",
          textAlign: "left",
          color: "#000",
          width: "150px",
          height: "150px",
          opacity: 1,
          backgroundColor: "",
          transform: "translate(0px, 0px)",
          left: "0",
          top: "0",
        },
        ...style,
      };
      const [x, y] = style.transform
        .replace("translate", "")
        .replace(/px/gi, "")
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "")
        .split(",");
      let width = style.width.replace("px", "").replace("%", "");
      let height = style.height.replace("px", "").replace("%", "");
      let fontSize = style.fontSize.replace("px", "");
      let letterSpacing = style.letterSpacing.replace("px", "");
      let left = style.left.replace("px", "").replace("%", "");
      let top = style.top.replace("px", "").replace("%", "");
      let lineHeight = style.lineHeight.replace("px", "");
      style.x = Number(x) || Number(left).toFixed(2) || 0;
      style.y = Number(y) || Number(top).toFixed(2) || 0;
      style.width = width;
      style.height = height;
      style.fontSize = fontSize;
      style.letterSpacing = letterSpacing;
      style.lineHeight = lineHeight;
      this.maxX = this.$root.canvasStyleData.width - width;
      this.maxY = this.$root.canvasStyleData.height - height;
      this.styleAttrs = style;
    },
    /**
     * 去掉字符串前后所有空格
     */
    trim(str, isglobal) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (isglobal && isglobal.toLowerCase() === "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    },
  },
  updated() {},
  mounted() {
    this.changeStyleString();
  },
  computed: {
    ...mapState(["percentOrabsolute"]),
  },
});
