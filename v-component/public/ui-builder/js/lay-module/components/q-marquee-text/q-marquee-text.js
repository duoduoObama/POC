/**
 * 跑马灯文本
 */
Vue.component("q-marquee-text", {
  template: ` 
          <div class="draggable2" :id="data.id" :index="index" 
           style="background-color:#fff;color:#000;text-align:center;"  
           :style="data.style"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
          <link href="${location.origin}/ui-builder/js/lay-module/components/q-marquee-text/q-marquee-text.css" rel="stylesheet"> 
            <div class="mdc-card mdc-card-h100">
              <marquee class='marquee_text' :behavior="behavior" ref="marquee">
                <p style="border:none;" class="marquee_text">{{data.options}}</p>
              </marquee> 
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
    "data.style": function (newValue, oldValue) { 
      if (newValue === oldValue) return;
      const tempNode = document.createElement("div");
      tempNode.setAttribute("style", newValue);
      this.$refs.marquee.stop();
      this.$refs.marquee.start();
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || [],
      style: this.data.style,
      behavior: "side",
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
