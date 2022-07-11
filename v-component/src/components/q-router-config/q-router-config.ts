import { css, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { IQRouterConfigOptions } from "./IQrouterConfig";
import { createApp, defineComponent, ref } from "vue";
import { cloneDeep, isString, isArray, isObject } from "lodash-es";
import Divider from "ant-design-vue/lib/divider";
import {
  Input,
  Select,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Switch,
  InputNumber,
  Textarea,
  message,
  Modal,
} from "ant-design-vue";
import {
  DownOutlined,
  EyeOutlined,
  CopyOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import TypographyLink from "ant-design-vue/lib/typography";
import Popconfirm from "ant-design-vue/lib/popconfirm";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import antdCss from "ant-design-vue/dist/antd.min.css";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import axios from "axios";
import { Component } from "../../types/Component";
import {
  IComponent,
  IEventSpecificationEvent,
  IMessage,
  ISchema,
} from "../../types/IComponent";
import { domAssemblyCustomEvents } from "../../util/base-method";

/**
 * 路由配置组件
 */
// @customElement("q-router-config")
export class QRouterConfig extends Component {
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
  data: IQRouterConfigOptions = {
    router: {},
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

  render() {
    const div = document.createElement("div");
    div.id = "container";
    return div;
  }

  createVueComponent = () => {
    const { router: data = {} } = this.data;
    const self = this;
    const component = defineComponent({
      template: `
            <a-config-provider :locale="zhCN">
              <div style="width: 400px; margin: 20px 0 0 20px; border: 1px solid #E1E4E8; padding: 20px; position: relative">
                <div style="font-size: 16px; font-weight: 600">路由配置</div>
                <div style="display: flex; align-items: center; margin-top: 6px">
                  <a-input-search
                    v-model:value="searchText"
                    placeholder="请输入查询关键字"
                    enter-button
                    @search="onSearch"
                  />
                </div>
                <div style="display: flex; align-items: center; margin-top: 10px">
                  <a-button style="width : 90px" @click="openRouterDrawer('new')">
                    新建
                    <plus-outlined />
                  </a-button>
                  <div style="cursor: pointer; margin-left: 20px" @click="importExport('import')">导入</div>
                  <div style="cursor: pointer; margin-left: 10px" @click="importExport('export')">导出</div>
                </div>
                <div v-for="(item, index) in Object.keys(tempRouterConfig)" style="display: flex; align-items: center; margin-top: 10px; padding: 10px; border: 1px solid #E1E4E8; border-radius: 4px">
                  <div>
                    <div style="font-weight: 600; color: #666666">{{ tempRouterConfig[item].title }}</div>
                    <div style="padding: 0 6px; margin-top: 4px; border-radius: 2px; background-color: #EAEBEF">{{ tempRouterConfig[item].target }}</div>
                  </div>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>查看</span>
                    </template>
                    <eye-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }" @click="openRouterDrawer('see',tempRouterConfig[item].target)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>编辑</span>
                    </template>
                    <form-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openRouterDrawer('edit',tempRouterConfig[item].target)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>删除</span>
                    </template>
                    <delete-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openRouterDrawer('delete',tempRouterConfig[item].target)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>复制</span>
                    </template>
                    <copy-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openRouterDrawer('copy',tempRouterConfig[item].target)" />
                  </a-tooltip>
                </div>
                <div v-show="schemaVisible" style="width: 600px; position: absolute; border: 1px solid #DEDEDE; right: -600px; top: -1px">
                  <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #DEDEDE">
                    <div style="font-size: 15px; font-weight: 600; color: #666666">{{ schemaTitle }}</div>
                    <div v-if="schemaType === 'import'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="importData">确定</div>
                    <div v-if="schemaType === 'import' || drawerType === 'edit' || drawerType === 'copy'" style="margin-left: 10px; cursor: pointer" @click="schemaVisible = false">取消</div>
                    <div v-if="schemaType === 'export'" style="margin-left: auto; cursor: pointer" @click="schemaVisible = false">关闭</div>
                  </div>
                  <div style="width: 100%; padding: 10px">
                    <a-textarea v-model:value="dataSchema" style="width: 100%; height: 400px" />
                  </div>
                </div>
                <div v-show="drawerVisible" style="width: 700px; position: absolute; border: 1px solid #DEDEDE; right: -700px; top: -1px">
                  <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #DEDEDE">
                    <div style="font-size: 15px; font-weight: 600; color: #666666">{{ drawerTitle }}</div>
                    <div v-if="drawerType === 'add'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('add')">创建</div>
                    <div v-if="drawerType === 'edit'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('edit')">确定</div>
                    <div v-if="drawerType === 'copy'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('copy')">确定</div>
                    <div v-if="drawerType === 'add' || drawerType === 'edit' || drawerType === 'copy'" style="margin-left: 10px; cursor: pointer" @click="drawerVisible = false">取消</div>
                    <div v-if="drawerType === 'see'" style="margin-left: auto; cursor: pointer" @click="drawerVisible = false">关闭</div>
                  </div>
                  <div style="max-height: 800px; overflow: auto;background: white;">
                    <div style="display: flex; align-items: center; margin-top: 20px">
                      <div style="width: 100px; text-align: right"><span style="color: red">*</span>配置项名称: </div>
                      <div style="width: 350px; margin-left: 10px">
                        <a-input v-model:value="tempDataInfo.title" placeholder="请输入名称" />
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; margin-top: 20px">
                      <div style="width: 100px; text-align: right"><span style="color: red">*</span>发起源: </div>
                      <div style="width: 350px; margin-left: 10px">
                        <a-input v-model:value="tempDataInfo.target" placeholder="请输入发起源" />
                      </div>
                    </div>
                    <div style="display: flex; align-items: top; margin-top: 20px">
                      <div style="width: 100px; text-align: right; margin-top: 4px">发起方式: </div>
                      <div style="width: 350px; margin-left: 10px">
                        <div v-for="(trigger,triggerIndex) in tempDataInfo.trigger" style="display: flex; align-items: center; margin-bottom: 10px">
                          <a-input v-model:value="tempDataInfo.trigger[triggerIndex]" placeholder="发起方式" style="width: 350px" />
                          <delete-outlined :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }" @click="deleteTrigger(triggerIndex)" />
                        </div>
                        <a-button @click="addTrigger">
                          <template #icon><plus-outlined /></template>
                          添加
                        </a-button>
                      </div>
                    </div>
                    <div style="display: flex; align-items: top; margin: 20px 0">
                      <div style="width: 100px; min-width: 100px; text-align: right; margin-top: 4px">接收源: </div>
                      <div style="width: 550px; margin-left: 10px">
                        <div v-for="(receive, receiveIndex) in tempDataInfo.receive" style="display: flex; align-items: center;">
                          <div style="width: 500px; padding: 10px; border: 1px solid #E1E4E8; border-radius: 4px; margin-bottom: 10px">
                            <div style="display: flex; align-items: center; margin-top: 20px">
                              <div style="width: 100px; text-align: right"><span style="color: red">*</span>接收点: </div>
                              <div style="width: 350px; margin-left: 10px">
                                <a-input v-model:value="receive.source" placeholder="请输入名称" />
                              </div>
                            </div>
                            <div style="display: flex; align-items: top; margin-top: 20px">
                              <div style="width: 100px; text-align: right; margin-top: 4px">接收方式: </div>
                              <div style="width: 350px; margin-left: 10px">
                                <div v-for="(event,eventIndex) in receive.event" style="display: flex; align-items: center; margin-bottom: 10px">
                                  <a-input v-model:value="receive.event[eventIndex]" placeholder="接收方式" style="width: 350px" />
                                  <delete-outlined :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }" @click="deleteReceiveEvent(receiveIndex,eventIndex)" />
                                </div>
                                <a-button @click="addReceiveEvent(receiveIndex)">
                                  <template #icon><plus-outlined /></template>
                                  添加
                                </a-button>
                              </div>
                            </div>
                            <div style="display: flex; align-items: top; margin-top: 20px">
                              <div style="width: 100px; text-align: right; margin-top: 4px">数据处理函数: </div>
                              <div style="width: 350px; margin-left: 10px">
                                <a-textarea v-model:value="receive.script" style="width: 350px; min-width: 350px; height: 150px" />
                              </div>
                            </div>
                            <div style="display: flex; align-items: top; margin-top: 20px">
                              <div style="width: 100px; text-align: right; margin-top: 4px">是否开启回流: </div>
                              <div style="width: 350px; margin-left: 10px">
                                <a-switch v-model:checked="receive.replyStatus" />
                              </div>
                            </div>
                            <div v-if="receive.replyStatus" style="display: flex; align-items: top; margin: 20px 0">
                              <div style="width: 100px; text-align: right; margin-top: 4px">回流点: </div>
                              <div style="width: 350px; margin-left: 10px">
                                <div v-for="(reply, replyIndex) in receive.reply" style="display: flex; align-items: center; margin-bottom: 10px">
                                  <a-input v-model:value="receive.reply[replyIndex]" placeholder="回流点" style="width: 350px" />
                                  <delete-outlined :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }" @click="deleteReply(receiveIndex,replyIndex)" />
                                </div>
                                <a-button @click="addReply(receiveIndex)">
                                  <template #icon><plus-outlined /></template>
                                  添加
                                </a-button>
                              </div>
                            </div>
                          </div>
                          <close-circle-outlined :style="{ fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }" @click="deleteReceive(receiveIndex)" />
                        </div>
                        <a-button @click="addReceive">
                          <template #icon><plus-outlined /></template>
                          添加
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-config-provider>
            `,
      setup() {
        const leftBrackets = "{{";
        const rightBrackets = "}}";

        const defaultInfo = {
          title: "",
          target: "",
          trigger: <any>[],
          receive: <any>[],
        };
        let tempDataInfo = ref(cloneDeep(defaultInfo));

        const searchText = ref("");
        let tempRouterConfig = ref(cloneDeep(data));
        const onSearch = (value: string) => {
          console.log(data);
          tempRouterConfig.value = {};
          Object.keys(data).forEach((key) => {
            if (data[key].title.includes(value)) {
              tempRouterConfig.value[key] = data[key];
            }
          });
        };

        const drawerVisible = ref(false);
        const drawerType = ref("");
        const drawerTitle = ref("");
        const handleRouterKey = ref("");
        const openRouterDrawer = (e: any, target: string) => {
          const type = e.key || e;
          handleRouterKey.value = target;
          switch (type) {
            case "new":
              tempDataInfo.value = cloneDeep(defaultInfo);
              drawerType.value = "add";
              drawerTitle.value = "创建路由配置项";
              drawerVisible.value = true;
              schemaVisible.value = false;
              break;
            case "see":
              tempDataInfo.value = cloneDeep(data[handleRouterKey.value]);
              drawerType.value = "see";
              drawerTitle.value = "查看路由配置项 " + tempDataInfo.value.title;
              drawerVisible.value = true;
              schemaVisible.value = false;
              break;
            case "edit":
              tempDataInfo.value = cloneDeep(data[handleRouterKey.value]);
              drawerType.value = "edit";
              drawerTitle.value = "编辑路由配置项 " + tempDataInfo.value.title;
              drawerVisible.value = true;
              schemaVisible.value = false;
              break;
            case "delete":
              Modal.confirm({
                title: "确定要删除吗?",
                okText: "确定",
                cancelText: "取消",
                onOk() {
                  if (
                    tempDataInfo.value.title &&
                    data[handleRouterKey.value].title ===
                    tempDataInfo.value.title
                  ) {
                    drawerVisible.value = false;
                  }
                  if (handleRouterKey.value !== "") {
                    Reflect.deleteProperty(data, handleRouterKey.value);
                  }
                  onSearch(searchText.value);
                  changeElementData();
                },
              });
              break;
            case "copy":
              tempDataInfo.value = cloneDeep(data[handleRouterKey.value]);
              drawerType.value = "copy";
              drawerTitle.value = "复制路由配置项 " + tempDataInfo.value.title;
              drawerVisible.value = true;
              schemaVisible.value = false;
              break;
          }
        };

        const addTrigger = () => {
          tempDataInfo.value.trigger.push("");
        };
        const deleteTrigger = (index: number) => {
          tempDataInfo.value.trigger.splice(index, 1);
        };

        const addReceive = () => {
          tempDataInfo.value.receive.push({
            source: "",
            event: <any>[],
            script: "function(data) { return data; }",
            replyStatus: false,
            reply: <any>[],
          });
        };

        const addReceiveEvent = (receiveIndex: number) => {
          tempDataInfo.value.receive[receiveIndex].event.push("");
        };
        const deleteReceiveEvent = (
          receiveIndex: number,
          eventIndex: number
        ) => {
          tempDataInfo.value.receive[receiveIndex].event.splice(eventIndex, 1);
        };

        const addReply = (receiveIndex: number) => {
          tempDataInfo.value.receive[receiveIndex].reply.push("");
        };
        const deleteReply = (receiveIndex: number, eventIndex: number) => {
          tempDataInfo.value.receive[receiveIndex].reply.splice(eventIndex, 1);
        };

        const deleteReceive = (receiveIndex: number) => {
          tempDataInfo.value.receive.splice(receiveIndex, 1);
        };

        const handleDataInfo = (type: string) => {
          let paramErr = false;
          tempDataInfo.value.receive.forEach((item: any) => {
            if (item.source === "") paramErr = true;
          });
          if (
            tempDataInfo.value.title === "" ||
            tempDataInfo.value.target === "" ||
            paramErr
          ) {
            message.error("缺少必填参数");
            return;
          }
          let repeatTitle = false;
          let repeatKey = false;
          switch (type) {
            case "add":
            case "copy":
              repeatTitle = false;
              repeatKey = false;
              Object.keys(data).forEach((key) => {
                if (data[key].title === tempDataInfo.value.title)
                  repeatTitle = true;
                if (data[key].target === tempDataInfo.value.target)
                  repeatKey = true;
              });
              if (repeatTitle) {
                message.destroy();
                message.error("配置项名称重复");
                return;
              }
              if (repeatKey) {
                message.destroy();
                message.error("已存在该发起源");
                return;
              }
              data[tempDataInfo.value.target] = tempDataInfo.value;
              onSearch(searchText.value);
              drawerVisible.value = false;
              break;
            case "edit":
              repeatTitle = false;
              repeatKey = false;
              const tempDataList = cloneDeep(data);
              Reflect.deleteProperty(tempDataList, handleRouterKey.value);
              Object.keys(tempDataList).forEach((key) => {
                if (tempDataList[key].title === tempDataInfo.value.title)
                  repeatTitle = true;
                if (tempDataList[key].target === tempDataInfo.value.target)
                  repeatKey = true;
              });
              if (repeatTitle) {
                message.destroy();
                message.error("配置项名称重复");
                return;
              }
              if (repeatKey) {
                message.destroy();
                message.error("已存在该发起源");
                return;
              }
              data[handleRouterKey.value] = tempDataInfo.value;
              onSearch(searchText.value);
              drawerVisible.value = false;
              break;
          }
          changeElementData();
        };

        const schemaType = ref("");
        const schemaVisible = ref(false);
        const schemaTitle = ref("");
        const dataSchema = ref("");
        const importExport = (type: string) => {
          if (type === "import") {
            schemaTitle.value = "导入";
            dataSchema.value = "[ ]";
          } else {
            schemaTitle.value = "导出";
            const tempDataSchema = <any>[];
            Object.keys(data).forEach((key) => {
              tempDataSchema.push(data[key]);
            });
            dataSchema.value = JSON.stringify(tempDataSchema);
          }
          schemaType.value = type;
          schemaVisible.value = true;
          drawerVisible.value = false;
        };
        const importData = () => {
          try {
            const tempData = JSON.parse(dataSchema.value);
            if (Array.isArray(tempData)) {
              let repeatTitle = false;
              let repeatKey = false;
              tempData.forEach((item) => {
                Object.keys(data).forEach((key) => {
                  if (item.title === data[key].title) repeatTitle = true;
                  if (item.target === data[key].target) repeatKey = true;
                });
              });
              if (repeatTitle) {
                message.destroy();
                message.error("配置项名称(title)重复");
                return;
              }
              if (repeatKey) {
                message.destroy();
                message.error("已存在该发起源(target)");
                return;
              }
              tempData.forEach((item: any) => {
                data[item.target] = item;
              });
              onSearch(searchText.value);
              schemaVisible.value = false;
              changeElementData();
            } else {
              message.destroy();
              message.error("schema信息有误");
            }
          } catch (error) {
            message.destroy();
            message.error("schema信息有误");
          }
        };

        const changeElementData = () => {
          const elementData = JSON.parse(<any>self.dataset.data);
          elementData.router = cloneDeep(data);
          self.dataset.data = JSON.stringify(elementData);
        };

        return {
          searchText,
          tempRouterConfig,
          drawerVisible,
          drawerType,
          drawerTitle,
          tempDataInfo,
          leftBrackets,
          rightBrackets,
          schemaType,
          schemaVisible,
          schemaTitle,
          dataSchema,
          zhCN,
          onSearch,
          openRouterDrawer,
          addTrigger,
          deleteTrigger,
          addReceive,
          addReceiveEvent,
          deleteReceiveEvent,
          addReply,
          deleteReply,
          deleteReceive,
          handleDataInfo,
          importExport,
          importData,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(ConfigProvider);
    this.componentInstance.use(Select);
    this.componentInstance.use(Divider);
    this.componentInstance.use(TypographyLink);
    this.componentInstance.use(Popconfirm);
    this.componentInstance.use(Input);
    this.componentInstance.use(Dropdown);
    this.componentInstance.use(Menu);
    this.componentInstance.use(Button);
    this.componentInstance.use(Tooltip);
    this.componentInstance.use(Switch);
    this.componentInstance.use(InputNumber);
    this.componentInstance.use(Textarea);
    this.componentInstance.use(Modal);
    this.componentInstance.use(message);
    this.componentInstance.use("axios", axios);
    this.componentInstance.component("DownOutlined", DownOutlined);
    this.componentInstance.component("EyeOutlined", EyeOutlined);
    this.componentInstance.component("CopyOutlined", CopyOutlined);
    this.componentInstance.component("FormOutlined", FormOutlined);
    this.componentInstance.component("DeleteOutlined", DeleteOutlined);
    this.componentInstance.component("PlusOutlined", PlusOutlined);
    this.componentInstance.component(
      "CloseCircleOutlined",
      CloseCircleOutlined
    );
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
          this.data = { ...this.data, router: JSON.parse(body) };
          return;
        }
        this.data = { ...this.data, router: body };
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
        return "q-router-config";
      },
      get type() {
        return "数据源";
      },
      get text() {
        return "路由配置";
      },
      get group() {
        return ["数据源"];
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
        return "路由配置组件,可以配置组件之间的定向流动";
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
            outputEvent: [],
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
        outputEvent: [],
      },

      get eventSpecification() {
        return cloneDeep(this._eventSpecification);
      },
      set eventSpecification(value) {
        this._eventSpecification = value;
        self.receiveInfo(value);
      },
      _onMessageMeta: {
        changeInfo: [(e: IMessage) => {
          console.log(e);
        }],
      },
      _onDOMEvent: {},
      get onMessageMeta() {
        return cloneDeep(this._onMessageMeta);
      },
      set onMessageMeta(value) {
        if (!isObject(value)) {
          return;
        }
        this._onMessageMeta = value;
      },
      get onDOMEvent() {
        return cloneDeep(this._onDOMEvent);
      },
      set onDOMEvent(value) {
        if (!isObject(value)) {
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
    "q-router-config": QRouterConfig;
  }
}
