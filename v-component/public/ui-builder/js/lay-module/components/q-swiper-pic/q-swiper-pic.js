/**
 * 轮播图片
 */
Vue.component("q-swiper-pic", {
  template: ` 
          <div class="draggable2" :id="data.id" :index="index" style="background-color:#fff;" :style="data.style" :data-data="JSON.stringify(data)"
           :data-x="data.x" :data-y="data.y">
            <div style="height:100%;width:100%!important" :id="data.id+'-swiper'" v-if="options.length" class="swiper-container">
              <div style="height:100%;width:100%!important" class="swiper-wrapper">
                <div class="swiper-slide swiper-no-swiping" style="height:100%;width:100%!important" :tabindex="index" v-for="(item,index) in options">
                  <img height="100%" width="100%" :src="item.image">
                </div>
              </div>
              <!-- Add Pagination -->
              <div class="swiper-pagination"></div>
              <script src="${location.origin}/ui-builder/js/lay-module/components/q-swiper-pic/swiper-object.js" type="application/javascript"></script>
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
          const { style, options } = newValue;
          this.style = style;
          if (typeof options === `string`) {
            this.options = JSON.parse(options);
          } else {
            this.options = options;
          }
        } catch (error) {
          this.options = [];
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
    };
  },
  methods: {
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            image: { type: "string" },
          },
          required: ["image"],
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
    this.receiveInfo();
    comSwiper();
    const swiper = new Swiper(`#${this.data.id}-swiper`, {
      noSwiping: true, // 关闭手动切换
      paginationClickable: true,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
      autoplay: {
        delay: 2000, //2秒切换一次
        disableOnInteraction: false,
      },
      pagination: {
        el: `#${this.data.id}-swiper .swiper-pagination`,
      },
    });
  },
});
