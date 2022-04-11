// import styles from "element-plus/dist/index.css";
import styles from "../../plugins/ant-design-vue@3.1.1/antd.css";
import Ajv from "ajv";
import { obEvents } from "../../util/rx";

/**
 * 创建webComponent组件类
 */
export class QStep extends HTMLElement {
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
      .swiper{
        --swiper-pagination-color: skyblue;
      }
      .swiper {
        height:100%;
      }
      .swiper-wrapper{
        height:100%;
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
    const sheet = new CSSStyleSheet();
    sheet.replace(styles);
    this.shadow.adoptedStyleSheets = [sheet];
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
            <a-steps :percent="" :current="data.options.current">
              <a-step v-for="(item,index) in data.options.data" :key="index" :title="item.title" :sub-title="item.subTitle" :description="item.description" />
            </a-steps>
          </div>
          `,
      watch: {
        data: {
          handler(newValue, oldValue) {
            try {
              console.log(newValue);
            } catch (error) {
              console.log(error);
            }
          },
          deep: true,
        },
      },
      created() {
        this.data = selfComponent.data;
      },
      data() {
        return {
          data: {},
        };
      },
      methods: {
        receiveInfo() {
          const { id, text } = this.data;
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
            const { body } = JSON.parse(JSON.stringify(data));
            if (
              data.replyStatus &&
              Array.isArray(data.reply) &&
              data.reply.length
            ) {
              const temp = JSON.parse(JSON.stringify(data));
              temp.eventData = { type: "reply" };
              temp.sender = data.receiver;
              temp.receiver = "eventBus";
              obEvents.setSelectedPoint(temp, JSON.parse(JSON.stringify(body)));
            }
            if (check(body)) {
              if (this.swiper.destroy) {
                this.swiper.destroy();
              }

              this.data.options = body;
              selfComponent.dataset.data = JSON.stringify(this.data);
              return;
            }
            antd.message.warn(`${text}:接收数据与当前组件不匹配!`);
          });
        },
        sendMessage(e, node, index) {
          const { type } = e;
          const message = {
            sender: this.data.id,
            node: { ...node, index },
            receiver: "eventBus",
            type,
            eventData: e,
          };
          obEvents.setSelectedPoint(
            message,
            JSON.parse(JSON.stringify(this.data))
          );
        },
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

    const app = Vue.createApp(component);
    app.use(ElementPlus);
    app.use(antd);
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
      this.componentInstance.data = this.data;
    }

    // this.componentInit();
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
customElements.define("q-step", QStep);
