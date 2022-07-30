/**
 * list文本
 */
Vue.component("q-list-text", {
  template: ` 
         <div class="draggable2" :id="data.id" :index="index" 
          style="background-color:#fff;color:#000;text-align:center;" 
          :style="data.style"
          :data-data="JSON.stringify(data)" :data-x="data.x" :data-y="data.y">
         <link href="${location.origin}/ui-builder/js/lay-module/components/q-list-text/mdc.list.css" rel="stylesheet">    
         <ul class="only-key" style="overflow:auto;height:97%;margin:0px 3px -3px 3px;margin-right: 5px;overflow: auto;">
          <li class="mdc-list-item" tabindex="0" v-for="(item,index) in options">
              <span class="mdc-list-item__ripple"></span>
              <span class="mdc-list-item__text" style="width:100%;">{{item.text}}</span>
          </li> 
          </ul> 
          <div style="height: 100%;position: absolute;top: 0;z-index: -1;width: 100%;">   
          </div>
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
      options: this.data.options || [],
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
    bindScrollEvents() {
      // 文字列表监听滚动条
      $("#inner-dropzone,#bottomcontent").on("mouseover mousemove", ".only-key", (event) => {
        if ($(event.currentTarget).parent().hasClass("draggable-grid") || this.$root.editMode === `read`) return;
        const { left, top } = $(event.currentTarget).offset();
        const { clientX, clientY } = event;
        const width = $(event.currentTarget).width();
        const height = $(event.currentTarget).height();
        if (clientX > left + width - 10 || clientY > top + height - 10) {
          $(event.currentTarget).parent().removeClass("draggable2").addClass("draggable-disable");
          return;
        }
        $(event.currentTarget).parent().removeClass("draggable-disable").addClass("draggable2");
      });

      $("#inner-dropzone,#bottomcontent").on("mouseleave", ".only-key", (event) => {
        if ($(event.currentTarget).parent().hasClass("draggable-grid") || this.$root.editMode === `read`) return;
        $(event.currentTarget).parent().removeClass("draggable-disable").addClass("draggable2");
      });
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: { anyOf: [{ maximum: 3 }, { type: "integer" }, { type: "string" }] },
          },
          required: ["text"],
        },
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
  mounted() {
    this.bindScrollEvents();
    this.receiveInfo();
  },
});
