import { createApp, nextTick } from "vue";
import { obEvents } from "../../util/rx";
import { cloneDeep } from "lodash-es";
/**
 * 路由配置表
 */
/**
 * 创建webComponent组件类
 */
export class QRouterConfig extends HTMLElement {
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
  createComponentInstance(root) {
    const selfComponent = this;
    const component = {
      template: ` 
        <div class="container">
          <div class="mdc-card mdc-card-h100">
          路由配置表
          </div>
        </div> 
        `,
      created() {
        this.data = selfComponent.data;
      },
      data() {
        return {
          data: {},
          eventType: ["事件", "数据"],
        };
      },
      methods: {
        receiveInfo() {
          const { id, text } = this.data;
          obEvents.currentSelectedPoint(id).subscribe((data) => {
            const { body } = cloneDeep(data);
            if (typeof body === `string` || typeof body === `number`) {
              this.data.options = body;
              selfComponent.dataset.data = JSON.stringify(this.data);
              return;
            } else if (typeof body === `object`) {
              this.data.options = JSON.stringify(body);
              return;
            }
            antd.message.warn(`${text}:接收数据与当前组件不匹配!`);
          });
        },
        runRoutingConfiguration() {
          const { currentPlatform = true, options } = this.data;
          // 如果为false表示为运行时
          if (!currentPlatform) {
            options.forEach((current) => {
              const {
                eventType,
                target,
                applyTime,
                whetherToRepeat,
                triggerEvent = [],
                source,
              } = current;
              if (eventType === this.eventType[1]) {
                customEvents.triggerEvent(
                  {
                    applyTime,
                    whetherToRepeat,
                    select: triggerEvent,
                    receiver: source,
                  },
                  target
                );
              }
            });
          }
        },
      },
      async mounted() {
        this.receiveInfo();
        this.runRoutingConfiguration();
        nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          root.appendChild(style);
        });
      },
    };
    const app = createApp(component).mount(root);
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
      this.componentInstance.data = this.data;
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
customElements.define("q-router-config", QRouterConfig);
