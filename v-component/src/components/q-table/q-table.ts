import { css, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { IPagination, IQTableOptions } from "./IQTable";
import { createApp, defineComponent, reactive, ref } from "vue";
import { cloneDeep, isString, isArray } from "lodash-es";
import Table from "ant-design-vue/lib/table";
import Divider from "ant-design-vue/lib/divider";
import TypographyLink from "ant-design-vue/lib/typography";
import Popconfirm from "ant-design-vue/lib/popconfirm";
import Input from "ant-design-vue/lib/input";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import antdCss from "ant-design-vue/dist/antd.min.css";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { Component } from "../../types/Component";
import {
  IComponent,
  IEventSpecificationEvent,
  IMessage,
  ISchema,
} from "../../types/IComponent";
import { domAssemblyCustomEvents } from "../../util/base-method";

/**
 * 可编辑表格组件
 */
@customElement("q-table")
export class QTable extends Component {
  static styles = [
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      img {
        height: 100%;
        width: 100%;
      }
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQTableOptions = {
    columns: [],
    dataSource: [],
    scroll: { x: 1500, y: 700 },
  };

  /**
   * 数据模型
   */
  model!: ISchema;

  constructor() {
    super();
    this.initModel();
    this.receiveInfo(this.model.eventSpecification);
    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }

  /**
   * The number of times the button has been clicked.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 组件历史实例
   */
  componentOldInstance: any = null;

  render() {
    const div = document.createElement("div");
    div.id = "container";
    return div;
  }

  createVueComponent = () => {
    const self = this;
    const {
      columns = [],
      dataSource: data = [],
      operation = [],
      pagination: page = {},
    } = this.data;
    if (!Object.keys(page).length && this.componentInstance?._instance) {
      const { pagination } = this.componentInstance._instance.proxy;
      Object.assign(page, pagination);
    }

    const component = defineComponent({
      template: `
            <a-config-provider :locale="zhCN">
                <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" @change="tableChange" bordered>
                <template #bodyCell="{ column, text, record }">
                <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
                    <div>
                    <a-input
                        v-if="editableData[record.key]"
                        v-model:value="editableData[record.key][column.dataIndex]"
                        style="margin: -5px 0"
                    />
                    <template v-else>
                        {{ text }}
                    </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                        <a-typography-link @click="save(record.key)">保存</a-typography-link>
                            <a-divider type="vertical" />
                        <a-popconfirm title="是否取消?" @confirm="cancel(record.key)">
                        <a>取消</a>
                        </a-popconfirm>
                    </span>
                    <span v-else>
                        <a @click="edit(record.key)">{{operation[0]?.title || '编辑'}}</a>
                            <a-divider type="vertical" />
                        <a-popconfirm title="是否删除?" @confirm="remove(record.key)">
                            <a>{{operation[1]?.title || '删除'}}</a>
                        </a-popconfirm> 
                    </span>
                    </div>
                </template>
                </template>
            </a-table>
            </a-config-provider>
            `,
      setup() {
        const tempData = data.map((item: any, index) => ({
          ...item,
          key: index,
        }));
        const dataSource = ref(tempData);
        const editableData: { [key: string]: any } = reactive({});
        const pagination = reactive(page);

        const tableChange = (page: IPagination) => {
          Object.assign(pagination, page);
        };

        const edit = (key: string) => {
          editableData[key] = cloneDeep(
            dataSource.value.filter((item) => key === item.key)[0]
          );
        };
        const save = (key: string) => {
          self.onSendMessage({ type: "edit" } as any, editableData[key], key);

          Object.assign(
            dataSource.value.filter((item) => key === item.key)[0],
            editableData[key]
          );
          delete editableData[key];
        };
        const cancel = (key: string) => {
          delete editableData[key];
        };
        const remove = (key: string) => {
          self.onSendMessage(
            { type: "delete" } as any,
            dataSource.value.find((item) => key === item.key),
            key
          );

          dataSource.value = dataSource.value.filter(
            (item) => key !== item.key
          );
        };

        return {
          zhCN,
          dataSource,
          columns,
          editingKey: "",
          editableData,
          operation,
          pagination,
          edit,
          save,
          cancel,
          remove,
          tableChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(ConfigProvider);
    this.componentInstance.use(Table);
    this.componentInstance.use(Divider);
    this.componentInstance.use(TypographyLink);
    this.componentInstance.use(Popconfirm);
    this.componentInstance.use(Input);
    this.componentInstance.mount(this.container);
  };

  disconnectedCallback(): void {
    this.componentInstance.unmount();
  }

  protected updated(): void {
    this.createVueComponent();
  }

  receiveInfo(value: { [key: string]: IEventSpecificationEvent[] }) {
    value.inputEvent.forEach((item: IEventSpecificationEvent) => {
      const allListener = this.getListener();
      Object.keys(allListener).forEach((eventName: string) => {
        if (allListener[item.eventType]) {
          this.removeListener(item.eventType);
        }
      });

      this.removeListener(item.eventType);
      this.addListener(item.eventType, (listener: IMessage) => {
        const { body } = listener;

        if (isString(body)) {
          this.data = { ...this.data, dataSource: JSON.parse(body) };
          return;
        }
        this.data = { ...this.data, dataSource: body as [] };
      });
    });
  }

  onSendMessage(e: Event, node: any, index: number | string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: e.type,
        dstType: "",
      },
      body: {
        ...e,
        node,
        index,
      },
    };
    this.sendMessage(message);
  }

  initModel(): void {
    const self = this;

    this.model = {
      get id() {
        return cloneDeep(self.id);
      },
      get componentName() {
        return "q-table";
      },
      get type() {
        return "表格";
      },
      get text() {
        return "table";
      },
      get group() {
        return ["容器"];
      },
      get createTime() {
        return new Date();
      },
      get image() {
        return "";
      },
      _initStyle: "",
      get initStyle() {
        return cloneDeep(this._initStyle);
      },
      set initStyle(value) {
        this.initStyle = value;
      },
      get description() {
        return "table组件,可以对单行数据进行编辑";
      },
      get options() {
        return cloneDeep(self.data);
      },
      get schema() {
        return {
          eventSpecification: {
            inputEvent: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputEvent: [
              {
                text: "编辑数据",
                eventType: "edit",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "删除数据",
                eventType: "delete",
                messageSchema: "",
                messageDemo: "",
              },
            ],
          },
          optionsView: {
            list: [],
          },
        };
      },
      _eventSpecification: {
        inputEvent: [
          {
            text: "更改组件数据",
            eventType: "changeInfo",
            messageSchema: "",
            messageDemo: "",
          },
        ],
        inputCustomEvent: [
          {
            text: "更改组件数据",
            eventType: "changeInfo",
            messageSchema: "",
            messageDemo: "",
          },
        ],
        outputEvent: [
          {
            text: "编辑",
            eventType: "edit",
            messageSchema: "",
            messageDemo: "",
          },
          {
            text: "删除",
            eventType: "delete",
            messageSchema: "",
            messageDemo: "",
          },
        ],
      },

      get eventSpecification() {
        return cloneDeep(this._eventSpecification);
      },
      set eventSpecification(value) {
        this._eventSpecification = value;
        self.receiveInfo(value);
      },
      _onMessageMeta: [
        {
          changeInfo: (e: IMessage) => {
            console.log(e);
          },
        },
      ],
      _onDOMEvent: [
        {
          onEdit: (e: any) => {
            console.log(e);
          },
        },
        {
          onDelete: (e: any) => {
            console.log(e);
          },
        },
      ],
      get onMessageMeta() {
        return cloneDeep(this._onMessageMeta);
      },
      set onMessageMeta(value) {
        if (!isArray(value)) {
          return;
        }
        this._onMessageMeta = value;
      },
      get onDOMEvent() {
        return cloneDeep(this._onDOMEvent);
      },
      set onDOMEvent(value) {
        if (!isArray(value)) {
          return;
        }
        // , this._onDOMEvent
        domAssemblyCustomEvents(self, value);
        this._onDOMEvent = value;
      },
      get data() {
        return cloneDeep(self.data);
      },
      set data(value) {
        self.data = value;
      },
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-table": QTable;
  }
}
