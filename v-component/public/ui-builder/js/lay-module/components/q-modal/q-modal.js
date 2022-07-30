/**
 * 可拖拽modal
 */
Vue.component("q-modal", {
  template: `
        <a-modal
            v-if="footer"
            :class="[modalClass, simpleClass]"
            :visible="showModal" 
            @ok="handleOk"
            @cancel="handleCancel"
            :maskClosable="false"
            :width="width == '100%' ? '50%' : width"
            :ok-text="okText"
            :cancel-text="cancelText" 
            :closable="false"
            :ok-button-props="{ props: { disabled: okButtonProps } }"
            :z-index="zIndex"
            :dialog-style="dialogStyle"
        >
            <template slot="title"> 
            <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;">
              {{title}}  
              <span style="cursor:pointer"> 
                <a-icon :type="this.fullscreen" ref="fullscreen" @click="handleFullscreen()"/> 
                <a-icon type="close" @click="handleCancel()" />
              </span>
            </div></template>  
            <slot name="modalBody" style="minheight: 600px"></slot>
        </a-modal>
        <a-modal
            v-else
            :class="[modalClass, simpleClass]"
            :visible="showModal"
            @ok="handleOk"
            @cancel="handleCancel"
            :maskClosable="false"
            :width="width == '100%' ? '50%' : width"
            :footer="null"
            :ok-text="okText"
            :cancel-text="cancelText"
            :closable="false"
            :z-index="zIndex"
            :dialog-style="dialogStyle"
        > 
            <template slot="title"> 
            <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;">
              {{title}}  
              <span style="cursor:pointer"> 
                <a-icon :type="this.fullscreen" ref="fullscreen" @click="handleFullscreen()"/> 
                <a-icon type="close" @click="handleCancel()" />
              </span>
            </div></template>  
            <slot name="modalBody"></slot>
        </a-modal> 
        `,
  props: {
    data: Object,
    index: Number,
    // 容器的类名
    modalClass: {
      type: String,
      default: () => {
        return "modal-box";
      },
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    width: {
      type: String,
      default: () => {
        return "30%";
      },
    },
    footer: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    okText: {
      type: String,
      default: () => {
        return "确定";
      },
    },
    cancelText: {
      type: String,
      default: () => {
        return "取消";
      },
    },
    okButtonProps: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    zIndex: {
      type: Number,
      default: () => {
        return 1000;
      },
    },
    dialogStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      showModal: this.visible,
      fullscreen: "fullscreen",
      backUpObj: {},
      // 鼠标按下的值
      m_x: 0,
      m_y: 0,
      // 物体在视窗的位置
      drag_top: 0,
      drag_left: 0,
      // 鼠标在元素内的位置
      diff_x: 0,
      diff_: 0,
      domObserve: null,
    };
  },
  computed: {
    simpleClass() {
      return Math.random().toString(36).substring(2);
    },
  },
  mounted() {
    this.initialEvent(this.visible);
    this.bindDom();
  },
  created() {},
  beforeDestroy() {
    this.domObserve.disconnect();
  },
  methods: {
    handleOk() {
      this.$emit("update:visible", false);
      this.$emit("ok");
    },
    handleCancel() {
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },
    handleFullscreen() {
      const { innerHeight, innerWidth } = window;
      const { fullscreen } = this;
      const isFullscreen = fullscreen === `fullscreen`;
      // console.log(this.$refs.fullscreen.$el);
      const targetNode =
        this.$refs.fullscreen.$el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      const content = this.$refs.fullscreen.$el.parentElement.parentElement.parentElement.parentElement.parentElement;
      if (isFullscreen) {
        this.backUpObj = {
          height: content.getBoundingClientRect().height,
          width: content.getBoundingClientRect().width,
          x: targetNode.dataset.x,
          y: targetNode.dataset.y,
          transform: targetNode.style.transform,
          marginLeft: targetNode.style.marginLeft,
        };
        content.style.height = `${innerHeight}px`;
        content.style.width = `${innerWidth}px`;
        targetNode.dataset.y = 0;
        targetNode.dataset.x = 0;
        targetNode.style.transform = "translate(0, -100px)";
        targetNode.style.marginLeft = 0;
      } else {
        if (!Object.keys(this.backUpObj).length) {
          return;
        }
        const { height, width, x, y, transform, marginLeft } = this.backUpObj;
        content.style.height = `${height}px`;
        content.style.width = `${width}px`;
        targetNode.dataset.y = y;
        targetNode.dataset.x = x;
        targetNode.style.transform = transform;
        targetNode.style.marginLeft = marginLeft;
      }

      this.fullscreen = isFullscreen ? "fullscreen-exit" : "fullscreen";
    },
    initialEvent(visible) {
      if (visible) {
        this.$nextTick(() => {
          this.contain = document.getElementsByClassName(this.simpleClass)[0];
          this.content = this.contain.getElementsByClassName("ant-modal-content")[0];
          this.contentBody = this.contain.getElementsByClassName("ant-modal-body")[0];
          this.content.style.overflow = "hidden";
          this.content.style.resize = "auto";
          this.contentBody.style.height = "calc(100% - 104px)";
          this.contentBody.style.overflow = "auto";
          const interactEvent = () => {
            const targetEvent = interact(".ant-modal").draggable({
              inertia: true,
              modifiers: [
                interact.modifiers.restrictRect({
                  restriction: "parent",
                  endOnly: false,
                }),
              ],
              autoScroll: false,
              listeners: {
                move: function dragMoveListener(event) {
                  const target = event.target;
                  // keep the dragged position in the data-x/data-y attributes
                  const x = Number((parseFloat(target.getAttribute("data-x")) || 0) + event.dx).toFixed(0);
                  const y = Number((parseFloat(target.getAttribute("data-y")) || 0) + event.dy).toFixed(0);

                  // translate the element
                  target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)";

                  // update the posiion attributes
                  target.setAttribute("data-x", x);
                  target.setAttribute("data-y", y);
                },
              },
            });
            return targetEvent;
          };
          let inheritAttrs = interactEvent();
          [...document.querySelectorAll(".ant-modal-content")].forEach((element) => {
            element.addEventListener("mouseover", function (e) {
              inheritAttrs.target = null;
            });
          });
          [...document.querySelectorAll(".ant-modal-header")].forEach((element) => {
            element.addEventListener("mouseover", function (e) {
              e.stopPropagation();
              inheritAttrs.target = ".ant-modal";
            });
          });
        });
      }
    },
    bindDom() {
      let firstChange = true;
      this.$nextTick(() => {
        // 选择需要观察变动的节点
        const targetNode = this.contain.children[1].children[0];

        // 观察器的配置（需要观察什么变动）
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };
        // 当观察到变动时执行的回调函数
        const callback = (e, q) => {
          const content = this.contain.children[1].children[0].children[1];
          if (content && Object.keys(content).length && content.style.width.includes("px")) {
            targetNode.style.width = content.style.width;
            targetNode.style.height = content.style.height;
          } else {
            const { width } = content.getBoundingClientRect();
            if (firstChange) {
              targetNode.style.marginLeft = `calc(100% - 50% - ${width / 2}px )`;
              firstChange = false;
            }
          }
        };
        this.domObserve = new MutationObserver(callback);
        this.domObserve && this.domObserve.observe(targetNode, config);
      });
    },
  },
});
