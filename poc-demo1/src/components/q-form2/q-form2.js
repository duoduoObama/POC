// import styles from "element-plus/dist/index.css";
import styles from "../../plugins/ant-design-vue@3.1.1/antd.css";
import Ajv from "ajv";

/**
 * 创建webComponent组件类
 */
export class QForm2 extends HTMLElement {
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
          :model="data.options"
          name="validate_other"
          v-bind="layout"
          :rules="rules"
          @finish="handleFinish"
          @finishFailed="handleFinishFailed"
        >
          <a-form-item
            name="province"
            label="用户地区"
            has-feedback
          >
            <a-select v-model:value="data.options.province" placeholder="请选择省份">
              <a-select-option v-for="item in provinces" :value="item">{{item}}</a-select-option>
            </a-select>
          </a-form-item>
      
          <a-form-item name="admin" label="管理员权限">
            <a-switch v-model:checked="data.options.admin" />
          </a-form-item>
      
          <a-form-item name="group" label="用户组别">
            <a-radio-group v-model:value="data.options.group">
              <a-radio value="研发">研发</a-radio>
              <a-radio value="运营">运营</a-radio>
              <a-radio value="产品">产品</a-radio>
              <a-radio value="行政">行政</a-radio>
            </a-radio-group>
          </a-form-item>
      
          <a-form-item name="tags" label="用户标签">
            <a-checkbox-group v-model:value="data.options.tags">
              <a-row>
                <a-col :span="8">
                  <a-checkbox value="地域" style="line-height: 32px">地域</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="购物类型" style="line-height: 32px">购物类型</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="教育程度" style="line-height: 32px">教育程度</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="活跃程度" style="line-height: 32px">活跃程度</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="品牌偏好" style="line-height: 32px">品牌偏好</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="购买力" style="line-height: 32px">购买力</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
      
          <a-form-item name="rate" label="用户星级">
            <a-rate v-model:value="data.options.rate" />
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
            province: [
              {
                required: true,
                validator: this.validateProvince,
                trigger: "change",
              },
            ],
            group: [
              {
                required: true,
                validator: this.validateGroup,
                trigger: "change",
              },
            ],
            tags: [
              {
                required: true,
                validator: this.validateTags,
                trigger: "change",
              },
            ],
            rate: [
              {
                required: true,
                validator: this.validateRate,
                trigger: "change",
              },
            ],
          },
          layout: {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          },
          provinces: [
            "河北省",
            "山西省",
            "内蒙古自治区",
            "辽宁省",
            "吉林省",
            "黑龙江省",
            "江苏省",
            "浙江省",
            "安徽省",
            "福建省",
            "江西省",
            "山东省",
            "河南省",
            "湖北省",
            "湖南省",
            "广东省",
            "广西壮族自治区",
            "海南省",
            "四川省",
            "贵州省",
            "云南省",
            "陕西省",
            "甘肃省",
            "青海省",
            "西藏自治区",
            "宁夏回族自治区",
            "台湾省",
            "北京市",
            "天津市",
            "上海市",
            "重庆市",
            "香港",
            "澳门",
            "新疆维吾尔自治区",
          ],
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
        async validateProvince(rule, value) {
          if (value === "") {
            return Promise.reject("请选择地区");
          } else {
            return Promise.resolve();
          }
        },
        async validateGroup(rule, value) {
          if (value === "") {
            return Promise.reject("请选择组别");
          } else {
            return Promise.resolve();
          }
        },
        async validateTags(rule, value) {
          if (value.length === 0) {
            return Promise.reject("请选择标签");
          } else {
            return Promise.resolve();
          }
        },
        async validateRate(rule, value) {
          if (value === 0) {
            return Promise.reject("请选择星级");
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
          console.log(errors);
          antd.message.error("请输入正确的信息");
        },
        handleSubmit() {
          root.querySelector("#submit").click();
          // this.$refs.formRef.submit();
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
              province: { type: "string" },
              admin: { type: "boolean" },
              group: { type: "string" },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              rate: { type: "number" },
            },
            required: ["province", "group", "tags", "rate"],
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
customElements.define("q-form2", QForm2);
