/**
 * trigger
 */
Vue.component("q-menu-trigger", {
  template: ` 
            <a-dropdown :trigger="trigger" :visible="visible">
                <slot ref="bodys"></slot>
                <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item v-for="item in menuTarget" :key="item.key" v-show="!item.isShow">
                      {{item.title}}
                    </a-menu-item> 
                </a-menu>
            </a-dropdown> 
          `,
  props: {
    data: Object,
    index: Number,
  },
  data() {
    return {
      trigger: ["contextmenu"],
      visible: false,
      menuData: {
        "q-grid-box": [
          { key: "1", title: "编辑" },
          { key: "2", title: "退出编辑" },
        ],
        "q-deep-chart": [{ key: "2", title: "编辑" }],
        "q-button-container": [{ key: "1", title: "编辑" }],
        "q-api-button": [
          { key: "1", title: "执行" },
          {
            key: "2",
            title: "编辑",
            isShow: this.$root.editMode !== "edit",
          },
        ],
        "q-database-button": [
          { key: "1", title: "执行" },
          { key: "2", title: "编辑" },
        ],
        "q-rich-text": [{ key: "1", title: "编辑" }],
        "q-state-button": [{ key: "1", title: "编辑" }],
        "q-data-transform": [{ key: "1", title: "编辑" }],
      },
      menuCommon: [
        { key: "数据流转", title: "数据流转" },
        { key: "复制", title: "复制" },
      ],
      menuTarget: [],
      menuName: "",
    };
  },
  methods: {
    onMenu() {
      // 关闭menu
      $(document).on("contextmenu click", (e) => {
        this.visible = false;
      });
      $(this.$el).on("contextmenu", "[data-data]", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.visible = true;
        this.$root.$store.commit("setCurComponent", {
          component: $(e.currentTarget).data("data"),
        });
        const { id } = $(e.currentTarget).data("data");
        const { name } = [...this.$root.componentsArr, ...this.$root.componentsHideArr].find(
          (current) => current.id === id
        );
        this.menuName = name;
        this.menuData[name] = this.menuData[name] ? this.menuData[name] : [];
        this.menuTarget = [...this.menuData[name], ...this.menuCommon];
      });
      $(this.$el).on("contextmenu", (e) => {
        this.visible = false;
      });
    },
    handleMenuClick(e) {
      const { key } = e;
      this.commonMenu(key);
      this.visible = false;
      this.$root.$store.commit("setCurMenu", { menu: e });
    },
    commonMenu(eventName) {
      switch (eventName) {
        case "复制":
          menuTools.copy(`#${vm.curComponent.id}`);
          rxjs.timer(100).subscribe(() => {
            vm.getParentElement(vm.componentsArr);
            vm.getParentElement(vm.componentsHideArr);
            vm.$store.commit("recordSnapshot");
          });
          break;
      }
    },
  },
  mounted() {
    this.onMenu();
  },
});
