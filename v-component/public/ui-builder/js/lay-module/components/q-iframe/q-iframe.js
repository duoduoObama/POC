/**
 * iframe
 */
Vue.component("q-iframe", {
  template: `
            <div
            class="draggable2 q-iframe"
            :id="data.id"
            :index="index"
            data-elemnet-type="iframe"
            style="
              background-color: #fff;
              color: #000;
              text-align: center;
              border-radius: 4px;
            "
            :style="data.style"
            :data-data="JSON.stringify(data)"
            :data-x="data.x"
            :data-y="data.y"
          >
            <link
              href="${location.origin}/ui-builder/js/lay-module/components/q-iframe/q-iframe.css"
              rel="stylesheet"
            />
            <div class="page-tab" v-show="isShowHeader === 'show'">
              <button class="tab-btn page-prev"></button>
              <nav class="page-tab-content">
                <div class="menu-content">
                  <div class="menu-list" style="display: inline-block;"></div>
                </div>
              </nav>
              <button class="tab-btn page-next"></button>
              <div class="page-operation">
                <div class="menu-all" style="display: none">
                  <ul class="menu-all-ul"></ul>
                </div>
              </div>
            </div>

            <div class="page-content" style="height: calc(100%)" :style="{padding}"></div>
            <script class="q-iframe-external" :data="data.id" src="${location.origin}/ui-builder/js/lay-module/components/q-iframe/q-iframe-external.js" type="application/javascript"></script>
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
      oldOptions: this.data.options || null,
      options: this.data.options || [],
      style: this.data.style,
      paramList: this.data.paramList || [],
      isShowHeader: "show",
      padding: "0 10px 36px 10px",
      defaultSel: null,
    };
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style, options, paramList } = newValue;
          this.style = style;

          if (typeof paramList === "string") {
            this.paramList = JSON.parse(paramList);
          } else {
            this.paramList = paramList;
          }
          for (const iterator of this.paramList) {
            this[iterator.key] = iterator.default;
          }

          if (this.oldOptions !== options) {
            this.oldOptions = _.cloneDeep(options);
            if (typeof options === "string") {
              this.options = JSON.parse(options);
            } else {
              this.options = options;
            }
            this.updatePanel();
          }
        } catch (error) {
          this.paramList = [
            { key: "padding", title: "padding", default: "0px 10px 36px 10px" },
            { key: "isShowHeader", title: "显示顶部", default: "show" },
          ];
        }
      },
      deep: true,
    },
  },
  // updated() {
  //   try {
  //     this.options = this.data.options;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  methods: {
    updatePanel() {
      try {
        if (!this.options) return;
        if (typeof this.options === "string") {
          this.options = JSON.parse(this.options);
        }
        $().initWrap(this.id);
        for (const it of this.options) {
          $().creatIframe(it, this.id);
          if (it.defaultSel) this.defaultSel = it;
        }
        if (this.defaultSel) {
          $().creatIframe(this.defaultSel, this.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    fetch(`${location.origin}/ui-builder/js/lay-module/components/q-iframe/q-iframe-external.js`)
      .then((res) => res.text())
      .then((script) => eval(script))
      .then(async () => {
        this.$nextTick(() => {
          this.updatePanel();
          $().tab(this.id);
          // 事件委托，防止jquery动态生成DOM时事件挂载失败
          $().eventDelegation(this.id);
        });
      });
  },
});
