// import styles from "element-plus/dist/index.css";
import styles from "../../plugins/ant-design-vue@3.1.1/antd.css";
import Ajv from "ajv";

/**
 * 创建webComponent组件类
 */
export class QUpload extends HTMLElement {
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
            <a-upload-dragger
              :before-upload="beforeUpload"
            >
              <p class="ant-upload-drag-icon">
                <a-avatar :src="data.options.avatar" :size="80" />
              </p>
              <p class="ant-upload-text">点击或将文件拖拽到此处以上传头像</p>
            </a-upload-dragger>
          </div>
          `,
      watch: {
        data: {
          handler(newValue, oldValue) {
            try {
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
            this.bindEvent(data);
          });
        },
        beforeUpload(file, fileList) {
          const isImg = file.type === "image/png" || file.type === "image/jpeg";
          if (!isImg) {
            antd.message.error(`${file.name} 不是jpeg/png文件`);
          }
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) => {
            this.data.options.avatar = e.target.result;
            selfComponent.dataset.data = JSON.stringify(this.data);
            this.sendMessage();
          };
          return false;
        },
        bindEvent(data) {
          const { header = {}, body } = data;
          const { dst = [] } = header;
          const ajv = new Ajv();
          const shchema = {
            type: "object",
            properties: {
              avatar: { type: "string" },
            },
            required: ["avatar"],
          };
          const check = ajv.compile(shchema);
          dst.forEach((item, index) => {
            switch (item) {
              case "clearOptions":
                this.data.options.avatar = "";
                selfComponent.dataset.data = JSON.stringify(this.data);
                break;
              case "changeOptions":
                if (check(body)) {
                  this.data.options = body;
                  selfComponent.dataset.data = JSON.stringify(this.data);
                }
                break;
            }
          });
        },
        sendMessage(e, node, index) {
          const message = {
            sender: this.data.id,
            receiver: "eventBus",
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
customElements.define("q-upload", QUpload);
