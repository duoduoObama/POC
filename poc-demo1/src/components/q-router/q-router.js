/**
 * 创建webComponent组件类
 */
export class QRouter extends HTMLElement {
  /**
   * 定义组件暴露参数为用户进行修改
   */
  static get observedAttributes() {
    return ["data-data"];
  }

  /**
   * 设置组件实例 属性为只读
   */
  set #componentInstance(instance) {
    this._instance = instance;
  }

  get componentInstance() {
    return this._instance;
  }

  /**
   * 隔离样式
   */
  styleText = `
        .container {
          width: 100%;
          height: 100%;
        } 
        `;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    // 组件内部隔离样式
    const style = document.createElement("style");
    const div = document.createElement("div");
    style.textContent = this.styleText;
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }

  /**
   * 元素首次被插入文档调用(创建)
   */
  connectedCallback() {
    console.log("Custom square element added to page.");
    this.componentInit();
  }

  /**
   * 元素从文档中被移除调用(组件销毁)
   */
  disconnectedCallback() {
    console.log("Custom square element removed from page.");
  }

  /**
   * 自定义元素被移动到新的文档中时调用
   */
  adoptedCallback() {
    console.log("Custom square element moved to new page.");
  }

  /**
   * 元素属性发生变化时调用
   * @param {*} name 属性
   * @param {*} oldValue 老数据
   * @param {*} newValue 新数据
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("Custom square element attributes changed.");
    this.loadInfo(this);
  }

  /**
   * vue组件实例定义(可在component实现vue的方法)
   * @param {*} data 传入组件data-data数据
   * @param {*} root 挂载到当前webcomponent节点
   */
  async createComponentInstance(root) {
    const selfComponent = this;
    const component = {
      template: ` 
          <div class="container" ref="container" id="app">
            <!-- 路由出口 -->
            <!-- 路由匹配到的普通组件将渲染在这里 -->
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component
                  :key="$route.path"
                  :is="Component"
                  v-if="$route.meta.keepAlive&&!$route.meta.isIframe"
                />
              </keep-alive>
            </router-view>
          
            <!-- 路由匹配到的iframe类型组件将渲染在这里 -->
            <div
              v-for="{meta:{component,isIframe},path} in data.options.path.filter(c=>c.isIframe)" 
              v-show="$route.meta.keepAlive&&$route.meta.isIframe&&$route.path===path"
            >
              <component :key="path" :is="component" />
            </div>  
          </div>    
            `,
      created() {
        this.data = selfComponent.data || {};
      },
      data() {
        return {
          data: {},
        };
      },
      methods: {
        receiveInfo() {},
        sendMessage(e) {},
      },
      mounted() {
        this.receiveInfo();
        Vue.nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          root.appendChild(style);
        });
      },
    };

    const {
      options: { path = [] },
    } = this.data;
    // 1. 定义路由组件.
    // 也可以从其他文件导入
    const slotComponent = (slotName) => ({
      template: `<div></div>`,
      data() {
        return {
          name: this.name,
        };
      },
      methods: {
        appendSlot() {
          slotName.forEach((item) => {
            const slot = document.createElement("slot");
            slot.name = item;
            this.$el.appendChild(slot);
          });
        },
      },
      mounted() {
        this.$nextTick(() => {
          this.appendSlot();
        });
      },
    });
    path.forEach((element) => {
      const { url, keepAlive, isIframe, slotName } = element;
      const component = slotComponent(slotName);
      Object.assign(element, {
        path: url,
        component,
        meta: {
          keepAlive,
          isIframe,
          component,
        },
      });
    });
    // 2. 定义一些路由
    // 每个路由都需要映射到一个组件。
    const routes = path;
    const router = VueRouter.createRouter({
      history: VueRouter.createWebHashHistory(),
      routes, // `routes: routes` 的缩写
    });
    const app = Vue.createApp(component);
    //确保 _use_ 路由实例使
    //整个应用支持路由。
    app.use(router);
    app.mount(root);
    this.#componentInstance = app;
  }

  /**
   * 加载组件数据
   * @param {*} elem 组件对象
   */
  loadInfo(elem) {
    this.shadow = elem.shadowRoot;
    this.data = JSON.parse(elem.dataset.data);

    if (this.componentInstance) {
      this.componentInstance._instance.data.data = this.data;
    }
  }

  /**
   * 组件初始化
   */
  componentInit() {
    this.createComponentInstance(this.shadow);
  }
}

/**
 * 注册组件
 */
customElements.define("q-router", QRouter);
