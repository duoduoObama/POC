/**
 * 静态图片
 */
Vue.component("q-static-pic", {
  template: ` 
          <div class="draggable2" :id="data.id" ref="imgbody" :index="index" style="background-color:#fff;" :style="data.style" :data-tag="dragClass==='draggable'?'bottom':''"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
              <img style="height:100%;width:100%!important"
               :src="setHttpHeader(dragClass === 'draggable' ? data.image : (data.options || data.image))"
               :alt="data.alt"
               ref="img"
               onerror="src='data:image/png;base64,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'"
                >
          </div>
        `,
  props: {
    data: Object,
    index: Number,
    isBottom: Boolean,
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style, options, image, id } = newValue;
          this.options = options || image;
          // 此行代码兼容切换容器后找不到元素
          const imgElement = document.querySelector(`#${id} > div > img`);
          const contentElement = document.querySelector(`#${id}`);
          imgElement && imgElement.setAttribute("src", this.options);
          contentElement && contentElement.setAttribute("data-data", JSON.stringify(newValue));
          this.style = style;
        } catch (error) {
          console.log(error);
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
      options: this.data.options || this.data.image,
      style: this.data.style,
      dragClass: "",
    };
  },
  methods: {
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "string",
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        if (check(body)) {
          this.data.options = body;
          this.options = this.data.options;
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
    setHttpHeader(url = "") {
      if (!url) return url;
      const [ip] = url.split(":");
      const regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;

      if (regexIP.test(ip) && !url.includes("http://") && !url.includes("https://")) {
        return `http://${url}`;
      }
      return url;
    },
  },
  updated() {
    try {
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.receiveInfo();
    if (this.$refs.imgbody && this.$refs.imgbody.parentNode) {
      this.dragClass = this.$refs.imgbody.parentNode.id !== "bottomcontent" ? "draggable2" : "draggable";
    }
  },
});
