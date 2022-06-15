import { createApp, nextTick } from "vue";
import { Table, Tag, Avatar, Popconfirm, Divider } from "ant-design-vue";
import styles from "ant-design-vue/dist/antd.css";
import Ajv from "ajv";
import { obEvents } from "../../util/rx";

/**
 * 创建webComponent组件类
 */
export class QTable extends HTMLElement {
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
    if (this.componentInstance) {
      this.componentInstance.unmount();
    }
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
            <a-table :columns="columns" :data-source="data.options" :scroll="{ x: 1500, y: 600 }">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'tags'">
                  <span v-for="item in record.tags">
                    <a-tag v-if="item === '地域'" color="pink">{{item}}</a-tag>
                    <a-tag v-else-if="item === '购物类型'" color="red">{{item}}</a-tag>
                    <a-tag v-else-if="item === '教育程度'" color="orange">{{item}}</a-tag>
                    <a-tag v-else-if="item === '活跃程度'" color="green">{{item}}</a-tag>
                    <a-tag v-else-if="item === '品牌偏好'" color="cyan">{{item}}</a-tag>
                    <a-tag v-else-if="item === '购买力'" color="blue">{{item}}</a-tag>
                  </span>
                </template>
                <template v-else-if="column.key === 'avatar'">
                  <a-avatar :src="record.avatar" :size="45" />
                </template>
                <template v-else-if="column.key === 'admin'">
                  <span>{{record.admin ? "是" : "否"}}</span>
                </template>
                <template v-else-if="column.key === 'operation'">
                  <a @click="action(record,'change')">修改</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    v-if="data.options.length"
                    title="确定删除吗?"
                    @confirm="action(record,'delete')"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </template>
            </a-table>
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
          columns: [
            {
              title: "头像",
              width: 100,
              dataIndex: "avatar",
              key: "avatar",
              fixed: "left",
            },
            {
              title: "用户名",
              width: 100,
              dataIndex: "username",
              key: "username",
              fixed: "left",
            },
            {
              title: "年龄",
              width: 100,
              dataIndex: "age",
              key: "age",
              fixed: "left",
            },
            {
              title: "地区",
              dataIndex: "province",
              key: "province",
              width: 150,
            },
            { title: "组别", dataIndex: "group", key: "group", width: 150 },
            { title: "标签", dataIndex: "tags", key: "tags", width: 150 },
            { title: "用户星级", dataIndex: "rate", key: "rate", width: 150 },
            { title: "管理员", dataIndex: "admin", key: "admin", width: 150 },
            {
              title: "操作",
              key: "operation",
              fixed: "right",
              width: 120,
            },
          ],
        };
      },
      methods: {
        receiveInfo() {
          const { id, text } = this.data;
          obEvents.currentSelectedPoint(id).subscribe((data) => {
            this.bindEvent(data);
          });
        },
        action(record, type) {
          const message = {
            sender: this.data.id,
            receiver: "eventBus",
            type: type,
            data: record,
          };
          obEvents.setSelectedPoint(
            message,
            JSON.parse(JSON.stringify(this.data))
          );
        },
        bindEvent(data) {
          const { header = {}, body } = data;
          const { dst = [] } = header;
          const ajv = new Ajv();
          const shchema = {
            type: "array",
            items: {
              type: "object",
              properties: {
                username: { type: "string" },
                age: { type: "number" },
                group: { type: "string" },
              },
              required: ["username", "age", "group"],
            },
          };
          const check = ajv.compile(shchema);
          dst.forEach((item, index) => {
            switch (item) {
              case "changeOptions":
                if (check(body.tableData)) {
                  this.data.options = body.tableData;
                } else {
                  this.data.options = [];
                }
                selfComponent.dataset.data = JSON.stringify(this.data);
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
        nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          root.appendChild(style);
        });
      },
    };

    const app = createApp(component);
    app.use(Table).use(Tag).use(Avatar).use(Popconfirm).use(Divider);
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
customElements.define("q-table", QTable);
console.log(22222);