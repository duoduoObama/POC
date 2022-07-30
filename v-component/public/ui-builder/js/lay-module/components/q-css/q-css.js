/**
 * text文本
 */
Vue.component("q-css", {
  template: ` 
          <div class="draggable2" :id="id" :index="index"
            style="background-color:#fff;color:#000;text-align:center;" 
           :style="data.style" :data-data="JSON.stringify(data)"
           :data-x="data.x||0" :data-y="data.y||0">
            <link href="${location.origin}/ui-builder/js/lay-module/components/q-css/mdc.card.css" rel="stylesheet"> 
            <div ref="cssScript" class="mdc-card mdc-card-h100">
              {{data.text}}
            </div>
            <div v-html="css"></div>
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
          const { style, options } = newValue;
          this.style = style;
          const tempStyle = `<style type='text/css'> ${options} </style>`;
          this.css = tempStyle;
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
      options: this.data.options || [],
      style: this.data.style,
      css: `<style type='text/css'> ${this.data.options} </style>`,
    };
  },
  methods: {
    receiveInfo() {
      const { id, name } = this.data;
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        if (typeof body === `string` || typeof body === `number`) {
          this.data.options = body;
          return;
        } else if (typeof body === `object`) {
          this.data.options = JSON.stringify(body);
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
