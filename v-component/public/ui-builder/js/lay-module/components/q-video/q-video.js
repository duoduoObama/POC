/**
 * 视频容器
 */
Vue.component("q-video", {
  template: ` 
          <div class="draggable2" :id="data.id" :index="index" :style="data.style"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-video/q-video.css" rel="stylesheet"> 
            <div style="width:100%;height:100%;background-color:#000000">
              <video ref="videoRef" controlslist="nodownload noremoteplayback" disablePictureInPicture="true" :src="options" controls="controls"
               style="width:100%;height:100%;object-fit: fill;padding:2px">
              你的浏览器暂不支持video标签
              </video> 
            </div>
          </div> 
        `,
  props: {
    data: Object,
    index: Number,
  },
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
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || "",
      style: this.data.style,
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
          rxjs.timer(500).subscribe(() => {
            this.$refs.videoRef.play();
          });
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
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
    this.receiveInfo();
  },
});
