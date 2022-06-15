import { createApp, nextTick } from "vue";
import antd from "ant-design-vue/dist/antd";
import styles from "ant-design-vue/dist/antd.css";
import Ajv from "ajv";
import { obEvents } from "../../util/rx";

/**
 * 静态图片
 */
/**
 * 创建webComponent组件类
 */
export class QStaticPic extends HTMLElement {
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
  createComponentInstance(root) {
    const selfComponent = this;
    const component = {
      template: ` 
        <div class="container" ref="imgbody">
            <div :style="{width: '100%',height: '100%',background: bgImg}" @click.stop="sendMessage" 
              @dblclick.stop="sendMessage" @mouseenter="sendMessage" @mouseleave="sendMessage"></div>
            <div v-if="data.invalid" style="width:100%;border-top:1px solid rgb(205,92,92);border-bottom:1px solid rgb(205,92,92);color:rgb(205,92,92);position: absolute;bottom: 0;text-align: center;background-color: antiquewhite;opacity: 0.9;">已失效</div>
        </div> 
        `,
      watch: {
        data: {
          handler(newValue, oldValue) {
            try {
              this.changeBgImg();
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
          bgImg: "",
        };
      },
      methods: {
        receiveInfo() {
          const { id, text } = this.data;
          const ajv = new Ajv();
          const shchema = {
            type: "string",
          };
          const check = ajv.compile(shchema);
          obEvents.currentSelectedPoint(id).subscribe((data) => {
            const { body } = _.cloneDeep(data);
            if (
              data.replyStatus &&
              Array.isArray(data.reply) &&
              data.reply.length
            ) {
              const temp = _.cloneDeep(data);
              temp.eventData = { type: "reply" };
              temp.sender = data.receiver;
              temp.receiver = "eventBus";
              obEvents.setSelectedPoint(temp, JSON.parse(JSON.stringify(body)));
            }
            if (check(body)) {
              this.data.options = body;
              selfComponent.dataset.data = JSON.stringify(this.data);
              return;
            }
            antd.message.warn(`${text}:接收数据与当前组件不匹配!`);
          });
        },
        setHttpHeader(url) {
          const [ip] = url.split(":");
          const regexIP =
            /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;

          if (
            regexIP.test(ip) &&
            !url.includes("http://") &&
            !url.includes("https://")
          ) {
            return `http://${url}`;
          }
          return url;
        },
        changeBgImg() {
          this.bgImg =
            this.data.options.displayMode === "自适应"
              ? "url(" +
                this.data.options.url +
                ") no-repeat center center/contain"
              : "url(" +
                this.data.options.url +
                ") no-repeat center center/100% 100%";
        },
        sendMessage(e) {
          const { type } = e;
          const message = {
            sender: this.data.id,
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
        this.changeBgImg();
        nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          root.appendChild(style);
        });
      },
    };
    const app = createApp(component).mount(root);
    console.log(app);
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
customElements.define("q-static-pic", QStaticPic);
