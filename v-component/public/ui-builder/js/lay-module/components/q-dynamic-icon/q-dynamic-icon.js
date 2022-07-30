/**
 * 静态图片
 */
Vue.component("q-dynamic-icon", {
  template: ` 
          <div class="draggable2" :id="data.id" ref="imgbody" :index="index" :style="data.style" :data-tag="dragClass==='draggable'?'bottom':''"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0">
                <div style="width: 100%;height: 100%; display: flex;align-items: center;">  
                    <svg style="font-size: 18px;margin: 0 8px;" class="icon" aria-hidden="true">
                        <use :xlink:href="svgObj[data.type]"></use>
                     </svg>
                     <label style="font-size: 14px;color: rgba(0, 0, 0, 0.85);">{{data.name}}</label>
                </div>
<!--              <img style="height:100%;width:100%!important" :src="dragClass === 'draggable' ? data.image : (data.options || data.image)" :alt="data.alt" ref="img">-->
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
      svgObj: {
        数据源: "#icon-shujuyuan",
        基础组件: "#icon-wenben",
        文本: "#icon-wenben",
        容器: "#icon-rongqi0",
        deepCharts: "#icon-deepchart",
        媒体组件: "#icon-tupian",
        图片: "#icon-tupian",
        tab: "#icon-tab",
        DI组件: "#icon-Icon-pingtaizujian",
      },
    };
  },
  methods: {},
  updated() {
    try {
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.dragClass = this.$refs.imgbody.parentNode.id !== "bottomcontent" ? "draggable2" : "draggable";
  },
});
