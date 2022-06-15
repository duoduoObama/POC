import { createApp, nextTick } from "vue";
import antd from "ant-design-vue/dist/antd";
import styles from "ant-design-vue/dist/antd.css";
import Ajv from "ajv";
import { obEvents } from "../../util/rx";

/**
 * 创建webComponent组件类
 */
export class QForm extends HTMLElement {
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
        <a-form
          ref="formRef"
          name="custom-validation"
          :model="data.options"
          :rules="rules"
          v-bind="layout"
          @finish="handleFinish"
          @finishFailed="handleFinishFailed"
        >
          <a-form-item has-feedback label="UserName" name="username">
            <a-input v-model:value="data.options.username" type="text" autocomplete="off" />
          </a-form-item>
          <a-form-item has-feedback label="Password" name="pass">
            <a-input v-model:value="data.options.pass" type="password" autocomplete="off" />
          </a-form-item>
          <a-form-item has-feedback label="Confirm" name="checkPass">
            <a-input v-model:value="data.options.checkPass" type="password" autocomplete="off" />
          </a-form-item>
          <a-form-item has-feedback label="Age" name="age">
            <a-input-number v-model:value="data.options.age" style="width: 50%" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="display: none" >
            <a-button id="submit" type="primary" html-type="submit">提交</a-button>
          </a-form-item>
        </a-form>
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
          rules: {
            username: [
              {
                required: true,
                validator: this.validateUsername,
                trigger: "change",
              },
            ],
            pass: [
              {
                required: true,
                validator: this.validatePass,
                trigger: "change",
              },
            ],
            checkPass: [
              {
                required: true,
                validator: this.validatePass2,
                trigger: "change",
              },
            ],
            age: [
              { required: true, validator: this.checkAge, trigger: "change" },
            ],
          },
          layout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          },
        };
      },
      methods: {
        receiveInfo() {
          const { id, text } = this.data;
          const ajv = new Ajv();
          const shchema = {
            type: "object",
            properties: {
              username: { type: "string" },
              pass: { type: "string" },
              checkPass: { type: "string" },
              age: { type: "number" },
            },
            required: ["username", "pass", "checkPass", "age"],
          };
          const check = ajv.compile(shchema);
          obEvents.currentSelectedPoint(id).subscribe((data) => {
            this.bindEvent(data);
          });
        },
        async checkAge(rule, value) {
          if (!value) {
            return Promise.reject("请输入年龄");
          }
          if (!Number.isInteger(value)) {
            return Promise.reject("请输入整数");
          } else {
            if (value < 18) {
              return Promise.reject("年龄应该大于18岁");
            } else {
              return Promise.resolve();
            }
          }
        },
        async validateUsername(rule, value) {
          const reg = new RegExp("^[A-Za-z0-9_]+$");
          if (value === "") {
            return Promise.reject("请输入用户名");
          } else if (!reg.test(value)) {
            return Promise.reject("请输入字母、数字、下划线组合");
          } else if (value.length > 16) {
            return Promise.reject("字符最多为16位");
          } else {
            return Promise.resolve();
          }
        },
        async validatePass(rule, value) {
          if (value === "") {
            return Promise.reject("请输入密码");
          } else {
            if (this.data.options.checkPass !== "") {
              this.$refs.formRef.validateFields("checkPass");
            }
            return Promise.resolve();
          }
        },
        async validatePass2(rule, value) {
          if (value === "") {
            return Promise.reject("请输入密码");
          } else if (value !== this.data.options.pass) {
            return Promise.reject("两次密码不一致!");
          } else {
            return Promise.resolve();
          }
        },
        handleFinish(values) {
          // console.log(values, this.data.options);
          selfComponent.dataset.data = JSON.stringify(this.data);
          this.sendMessage();
        },
        handleFinishFailed(errors) {
          this.$message.error("请输入正确的信息");
        },
        handleSubmit() {
          root.querySelector("#submit").click();
        },
        resetForm() {
          this.$refs.formRef.resetFields();
          selfComponent.dataset.data = JSON.stringify(this.data);
        },
        bindEvent(data) {
          const { header = {}, body } = data;
          const { dst = [] } = header;
          const ajv = new Ajv();
          const shchema = {
            type: "object",
            properties: {
              username: { type: "string" },
              pass: { type: "string" },
              checkPass: { type: "string" },
              age: { type: "number" },
            },
            required: ["username", "pass", "checkPass", "age"],
          };
          const check = ajv.compile(shchema);
          dst.forEach((item, index) => {
            switch (item) {
              case "resetForm":
                this.resetForm();
                break;
              case "submit":
                this.handleSubmit();
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
        sendMessage() {
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
        nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          root.appendChild(style);
        });
      },
    };

    const app = createApp(component);
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
customElements.define("q-form", QForm);
