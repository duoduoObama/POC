import { css, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { IQDataSourceOptions } from "./IQDataSource";
import { createApp, defineComponent, onMounted, ref } from "vue";
import { cloneDeep, pullAllBy, isString, isArray, isObject } from "lodash-es";
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
import fetchJsonp from "fetch-jsonp";
import { Component } from "../../types/Component";
import {
  IComponent,
  IEventSpecificationEvent,
  IMessage,
  ISchema,
} from "../../types/IComponent";
import { domAssemblyCustomEvents } from "../../util/base-method";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("q-data-source")
export class QDataSource extends Component {
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
  data: IQDataSourceOptions = {
    dataSource: [],
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
    const { dataSource: data = [] } = this.data;
    const self = this;
    const component = defineComponent({
      template: `
            <a-config-provider :locale="zhCN">
                <div style="width: 400px; margin: 20px 0 0 20px; border: 1px solid #E1E4E8; padding: 20px; position: relative">
                    <div style="font-size: 16px; font-weight: 600">数据源</div>
                    <div style="display: flex; align-items: center; margin-top: 6px">
                        <a-select
                            ref="select"
                            v-model:value="searchSelect"
                            style="width: 120px"
                            @change="selectChange"
                        >
                            <a-select-option value="all">全部</a-select-option>
                            <a-select-option value="fetch">fetch</a-select-option>
                            <a-select-option value="jsonp">jsonp</a-select-option>
                        </a-select>
                        <a-input-search
                            v-model:value="searchText"
                            placeholder="请输入"
                            enter-button
                            @search="onSearch"
                        />
                    </div>
                    <div style="display: flex; align-items: center; margin-top: 10px">
                        <a-dropdown :trigger="['click']">
                            <template #overlay>
                                <a-menu @click="openDrawer">
                                    <a-menu-item key="fetch">fetch</a-menu-item>
                                    <a-menu-item key="jsonp">jsonp</a-menu-item>
                                </a-menu>
                            </template>
                            <a-button style="width : 90px">
                                新建
                                <down-outlined />
                            </a-button>
                        </a-dropdown>
                        <div style="cursor: pointer; margin-left: 20px" @click="importExport('import')">导入</div>
                        <div style="cursor: pointer; margin-left: 10px" @click="importExport('export')">导出</div>
                    </div>
                    <div v-for="(item, index) in tempDataSource" style="display: flex; align-items: center; margin-top: 10px; padding: 10px; border: 1px solid #E1E4E8; border-radius: 4px">
                        <div>
                            <div style="font-weight: 600; color: #666666">{{ item.sourceId }}</div>
                            <div style="padding: 0 6px; margin-top: 4px; border-radius: 2px; background-color: #EAEBEF">{{ item.requestType }}</div>
                        </div>
                        <a-tooltip placement="bottom">
                            <template #title>
                            <span>查看</span>
                            </template>
                            <eye-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }" @click="openDrawer('see',item.sourceId)" />
                        </a-tooltip>
                        <a-tooltip placement="bottom">
                            <template #title>
                            <span>编辑</span>
                            </template>
                            <form-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openDrawer('edit',item.sourceId)" />
                        </a-tooltip>
                        <a-tooltip placement="bottom">
                            <template #title>
                            <span>删除</span>
                            </template>
                            <delete-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openDrawer('delete',item.sourceId)" />
                        </a-tooltip>
                        <a-tooltip placement="bottom">
                            <template #title>
                            <span>复制</span>
                            </template>
                            <copy-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openDrawer('copy',item.sourceId)" />
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
                    <div v-show="drawerVisible" style="width: 600px; position: absolute; border: 1px solid #DEDEDE; right: -600px; top: -1px">
                      <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #DEDEDE">
                          <div style="font-size: 15px; font-weight: 600; color: #666666">{{ drawerTitle }}</div>
                          <div v-if="drawerType === 'add'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('add')">创建</div>
                          <div v-if="drawerType === 'edit'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('edit')">确定</div>
                          <div v-if="drawerType === 'copy'" style="margin-left: auto; color: #4274F8; cursor: pointer" @click="handleDataInfo('copy')">确定</div>
                          <div v-if="drawerType === 'add' || drawerType === 'edit' || drawerType === 'copy'" style="margin-left: 10px; cursor: pointer" @click="drawerVisible = false">取消</div>
                          <div v-if="drawerType === 'see'" style="margin-left: auto; cursor: pointer" @click="drawerVisible = false">关闭</div>
                      </div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                            <div style="width: 150px; text-align: right">类型: </div>
                            <div style="width: 350px; margin-left: 10px">
                                <a-input v-model:value="tempDataInfo.requestType" placeholder="请求类型" disabled />
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                            <div style="width: 150px; text-align: right"><span style="color: red">*</span>数据源ID: </div>
                            <div style="width: 350px; margin-left: 10px">
                                <a-input v-model:value="tempDataInfo.sourceId" placeholder="请输入数据源ID" />
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px; min-height: 32px">
                            <div style="width: 150px; text-align: right">是否自动请求: </div>
                            <div style="width: 350px; margin-left: 10px">
                                <a-switch v-if="tempDataInfo.autoRequest.type === 'default'" v-model:checked="tempDataInfo.autoRequest.value" />
                                <a-input v-if="tempDataInfo.autoRequest.type === 'js'" v-model:value="tempDataInfo.autoRequest.value" placeholder="请输入js表达式">
                                  <template #prefix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                  </template>
                                  <template #suffix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                  </template>
                                </a-input>
                            </div>
                            <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeAutoRequest">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                          <div style="width: 150px; text-align: right"><span style="color: red">*</span>请求地址: </div>
                          <div style="width: 350px; margin-left: 10px">
                            <a-input v-if="tempDataInfo.requestUrl.type === 'default'" v-model:value="tempDataInfo.requestUrl.value" placeholder="请输入请求地址" />
                            <a-input v-if="tempDataInfo.requestUrl.type === 'js'" v-model:value="tempDataInfo.requestUrl.value" placeholder="请输入js表达式">
                              <template #prefix>
                                <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                              </template>
                              <template #suffix>
                                <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                              </template>
                            </a-input>
                          </div>
                          <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestUrl">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: top; margin-top: 20px">
                          <div style="width: 150px; text-align: right; margin-top: 4px">请求参数: </div>
                          <div style="width: 350px; margin-left: 10px">
                            <div v-if="tempDataInfo.requestParam.type === 'default'" v-for="(item,index) in tempDataInfo.requestParam.value" style="display: flex; align-items: center; margin-bottom: 10px">
                              <a-input v-model:value="item.key" placeholder="name" style="width: 80px; min-width: 80px" />
                              <div style="padding: 0 10px; color: #BFBFBF; font-size: 18px">:</div>
                              <div style="width: 246px; min-width: 246px">
                                <a-input v-if="item.type==='default'" v-model:value="item.value" placeholder="name" style="width: 246px" />
                                <a-switch v-if="item.type==='boolean'" v-model:checked="item.value" />
                                <a-input v-if="item.type==='js'" v-model:value="item.value" placeholder="请输入js表达式" style="width: 246px" >
                                  <template #prefix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                  </template>
                                  <template #suffix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                  </template>
                                </a-input>
                              </div>
                              <a-dropdown :trigger="['click']">
                                <template #overlay>
                                    <a-menu @click="handleRequestParam($event,index)">
                                        <a-menu-item key="default">字符串</a-menu-item>
                                        <a-menu-item key="boolean">布尔</a-menu-item>
                                        <a-menu-item key="js">表达式</a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button style="padding: 4px 6px; height: 20px; line-height: 0.5; margin-left: 6px">
                                    <down-outlined />
                                </a-button>
                              </a-dropdown>
                              <delete-outlined :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }" @click="deleteRequestParam(index)" />
                            </div>
                            <a-button v-if="tempDataInfo.requestParam.type === 'default'" @click="addRequestParam">
                                <template #icon><plus-outlined /></template>
                                添加
                            </a-button>
                            <a-input v-if="tempDataInfo.requestParam.type === 'js'" v-model:value="tempDataInfo.requestParam.value" placeholder="请输入js表达式">
                              <template #prefix>
                                <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                              </template>
                              <template #suffix>
                                <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                              </template>
                            </a-input>
                          </div>
                          <div v-if="tempDataInfo.requestParam.type === 'js' || (tempDataInfo.requestParam.type === 'default' && tempDataInfo.requestParam.value.length === 0)" style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestParam">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                            <div style="width: 150px; text-align: right"><span style="color: red">*</span>请求方法: </div>
                            <div style="width: 350px; margin-left: 10px">
                              <a-select v-if="tempDataInfo.requestMethod.type === 'default'" v-model:value="tempDataInfo.requestMethod.value" style="width: 350px;" >
                                <a-select-option value="GET">GET</a-select-option>
                                <a-select-option value="POST">POST</a-select-option>
                                <a-select-option value="PUT">PUT</a-select-option>
                                <a-select-option value="PATCH">PATCH</a-select-option>
                                <a-select-option value="DELETE">DELETE</a-select-option>
                              </a-select>
                              <a-input v-if="tempDataInfo.requestMethod.type === 'js'" v-model:value="tempDataInfo.requestMethod.value" placeholder="请输入js表达式" style="width: 350px;">
                                <template #prefix>
                                  <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                </template>
                                <template #suffix>
                                  <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                </template>
                              </a-input>
                            </div>
                            <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestMethod">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px; min-height: 32px">
                            <div style="width: 150px; text-align: right"><span style="color: red">*</span>是否支持跨域: </div>
                            <div style="width: 350px; margin-left: 10px">
                                <a-switch v-if="tempDataInfo.crossDomain.type === 'default'" v-model:checked="tempDataInfo.crossDomain.value" />
                                <a-input v-if="tempDataInfo.crossDomain.type === 'js'" v-model:value="tempDataInfo.crossDomain.value" placeholder="请输入js表达式">
                                  <template #prefix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                  </template>
                                  <template #suffix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                  </template>
                                </a-input>
                            </div>
                            <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeCrossDomain">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 20px">
                            <div style="width: 150px; text-align: right">超时时长(毫秒): </div>
                            <div style="width: 350px; margin-left: 10px">
                              <a-input-number v-if="tempDataInfo.timeout.type === 'default'" v-model:value="tempDataInfo.timeout.value" :min="5000" style="width: 350px;" />
                              <a-input v-if="tempDataInfo.timeout.type === 'js'" v-model:value="tempDataInfo.timeout.value" placeholder="请输入js表达式">
                                  <template #prefix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                  </template>
                                  <template #suffix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                  </template>
                                </a-input>
                            </div>
                            <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px" @click="changeOvertime">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: top; margin-top: 20px">
                          <div style="width: 150px; text-align: right; margin-top: 4px">请求头信息: </div>
                          <div style="width: 350px; margin-left: 10px">
                            <div v-if="tempDataInfo.requestHeader.type === 'default'" v-for="(item,index) in tempDataInfo.requestHeader.value" style="display: flex; align-items: center; margin-bottom: 10px">
                              <a-input v-model:value="item.key" placeholder="name" style="width: 80px; min-width: 80px" />
                              <div style="padding: 0 10px; color: #BFBFBF; font-size: 18px">:</div>
                              <div style="width: 246px; min-width: 246px">
                                <a-input v-if="item.type==='default'" v-model:value="item.value" placeholder="name" style="width: 246px" />
                                <a-switch v-if="item.type==='boolean'" v-model:checked="item.value" />
                                <a-input v-if="item.type==='js'" v-model:value="item.value" placeholder="请输入js表达式" style="width: 246px" >
                                  <template #prefix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                                  </template>
                                  <template #suffix>
                                    <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                                  </template>
                                </a-input>
                              </div>
                              <a-dropdown :trigger="['click']">
                                <template #overlay>
                                    <a-menu @click="handleRequestHeader($event,index)">
                                        <a-menu-item key="default">字符串</a-menu-item>
                                        <a-menu-item key="boolean">布尔</a-menu-item>
                                        <a-menu-item key="js">表达式</a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button style="padding: 4px 6px; height: 20px; line-height: 0.5; margin-left: 6px">
                                    <down-outlined />
                                </a-button>
                              </a-dropdown>
                              <delete-outlined :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }" @click="deleteRequestHeader(index)" />
                            </div>
                            <a-button v-if="tempDataInfo.requestHeader.type === 'default'" @click="addRequestHeader">
                                <template #icon><plus-outlined /></template>
                                添加
                            </a-button>
                            <a-input v-if="tempDataInfo.requestHeader.type === 'js'" v-model:value="tempDataInfo.requestHeader.value" placeholder="请输入js表达式">
                              <template #prefix>
                                <span style="color: #BFBFBF;user-select: none;">{{ leftBrackets }}</span>
                              </template>
                              <template #suffix>
                                <span style="color: #BFBFBF;user-select: none;">{{ rightBrackets }}</span>
                              </template>
                            </a-input>
                          </div>
                          <div v-if="tempDataInfo.requestHeader.type === 'js' || (tempDataInfo.requestHeader.type === 'default' && tempDataInfo.requestHeader.value.length === 0)" style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestHeader">{ / }</div>
                        </div>
                        <div style="display: flex; align-items: top; margin: 20px 0">
                            <div style="width: 150px; text-align: right; margin-top: 6px">添加数据处理函数: </div>
                            <div style="width: 350px; margin-left: 10px">
                              <a-dropdown :trigger="['click']">
                                <template #overlay>
                                    <a-menu @click="handleEvent">
                                        <a-menu-item v-for="item in tempEventList" :key="item.key">{{item.title}}</a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button>
                                  选择添加
                                  <down-outlined />
                                </a-button>
                              </a-dropdown>
                              <div v-for="item in tempDataInfo.eventHandler" :key="item.key" style="margin-top: 6px">
                                <div>{{ item.title }}</div>
                                <div style="display: flex; align-items: center;">
                                  <a-textarea v-model:value="item.value" style="width: 350px; min-width: 350px; height: 150px" />
                                  <close-circle-outlined :style="{ fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }" @click="deleteEvent(item.key)" />
                                </div>
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
          requestType: "fetch",
          sourceId: "",
          autoRequest: { value: <boolean | string>false, type: "default" },
          requestUrl: { value: "", type: "default" },
          requestParam: { value: <any>[], type: "default" },
          requestMethod: { value: "GET", type: "default" },
          crossDomain: { value: <boolean | string>false, type: "default" },
          timeout: { value: <number | string>5000, type: "default" },
          requestHeader: { value: <any>[], type: "default" },
          eventHandler: <any>[],
        };
        let tempDataInfo = ref(cloneDeep(defaultInfo));

        const searchSelect = ref("all");
        const searchText = ref("");
        let tempDataSource = ref(cloneDeep(data));
        const selectChange = (value: string) => {
          if (value === "all") {
            tempDataSource.value = data.filter((item) =>
              item.sourceId.includes(searchText.value)
            );
          } else {
            tempDataSource.value = data.filter(
              (item) =>
                item.sourceId.includes(searchText.value) &&
                item.requestType.includes(value)
            );
          }
        };
        const onSearch = (value: string) => {
          console.log(data);
          if (searchSelect.value === "all") {
            tempDataSource.value = data.filter((item) =>
              item.sourceId.includes(value)
            );
          } else {
            tempDataSource.value = data.filter(
              (item) =>
                item.sourceId.includes(value) &&
                item.requestType.includes(searchSelect.value)
            );
          }
        };

        const sourceStatus = ref("");
        const drawerVisible = ref(false);
        const drawerType = ref("");
        const drawerTitle = ref("");
        const handleSourceIndex = ref(0);
        const openDrawer = (e: any, id: string) => {
          const type = e.key || e;
          handleSourceIndex.value = data.findIndex(
            (item) => item.sourceId === id
          );
          switch (type) {
            case "fetch":
              tempDataInfo.value = defaultInfo;
              tempDataInfo.value.requestType = "fetch";
              drawerType.value = "add";
              drawerTitle.value =
                "创建数据源 " + tempDataInfo.value.requestType;
              drawerVisible.value = true;
              changeEventList();
              break;
            case "jsonp":
              tempDataInfo.value = defaultInfo;
              tempDataInfo.value.requestType = "jsonp";
              drawerType.value = "add";
              drawerTitle.value =
                "创建数据源 " + tempDataInfo.value.requestType;
              drawerVisible.value = true;
              changeEventList();
              break;
            case "see":
              tempDataInfo.value = cloneDeep(data[handleSourceIndex.value]);
              drawerType.value = "see";
              drawerTitle.value = "查看数据源";
              drawerVisible.value = true;
              changeEventList();
              break;
            case "edit":
              tempDataInfo.value = cloneDeep(data[handleSourceIndex.value]);
              drawerType.value = "edit";
              drawerTitle.value =
                "编辑数据源 " + tempDataInfo.value.requestType;
              drawerVisible.value = true;
              changeEventList();
              break;
            case "delete":
              Modal.confirm({
                title: "确定要删除吗?",
                okText: "确定",
                cancelText: "取消",
                onOk() {
                  if (
                    data[handleSourceIndex.value].sourceId ===
                    tempDataInfo.value.sourceId
                  ) {
                    drawerVisible.value = false;
                  }
                  if (handleSourceIndex.value !== -1) {
                    data.splice(handleSourceIndex.value, 1);
                  }
                  onSearch(searchText.value);
                },
              });
              break;
            case "copy":
              tempDataInfo.value = cloneDeep(data[handleSourceIndex.value]);
              drawerType.value = "copy";
              drawerTitle.value = "复制数据源";
              drawerVisible.value = true;
              changeEventList();
              break;
          }
        };

        const changeAutoRequest = () => {
          if (tempDataInfo.value.autoRequest.type === "default") {
            tempDataInfo.value.autoRequest.type = "js";
            tempDataInfo.value.autoRequest.value = String(
              tempDataInfo.value.autoRequest.value
            );
          } else {
            tempDataInfo.value.autoRequest.type = "default";
            tempDataInfo.value.autoRequest.value = false;
          }
        };

        const changeRequestUrl = () => {
          tempDataInfo.value.requestUrl.type === "default"
            ? (tempDataInfo.value.requestUrl.type = "js")
            : (tempDataInfo.value.requestUrl.type = "default");
        };

        const changeRequestParam = () => {
          if (tempDataInfo.value.requestParam.type === "default") {
            tempDataInfo.value.requestParam.type = "js";
            tempDataInfo.value.requestParam.value = "";
          } else {
            tempDataInfo.value.requestParam.type = "default";
            tempDataInfo.value.requestParam.value = <any>[];
          }
        };

        const addRequestParam = () => {
          tempDataInfo.value.requestParam.value.push({
            key: "",
            value: "",
            type: "default",
          });
        };

        const handleRequestParam = (e: any, index: number) => {
          tempDataInfo.value.requestParam.value[index].type = e.key;
          switch (e.key) {
            case "string":
              tempDataInfo.value.requestParam.value[index].value = String(
                tempDataInfo.value.requestParam.value[index].value
              );
              break;
            case "boolean":
              tempDataInfo.value.requestParam.value[index].value = false;
              break;
            case "js":
              tempDataInfo.value.requestParam.value[index].value = String(
                tempDataInfo.value.requestParam.value[index].value
              );
              break;
          }
        };

        const deleteRequestParam = (index: number) => {
          tempDataInfo.value.requestParam.value.splice(index, 1);
        };

        const changeRequestMethod = () => {
          tempDataInfo.value.requestMethod.type === "default"
            ? (tempDataInfo.value.requestMethod.type = "js")
            : (tempDataInfo.value.requestMethod.type = "default");
        };

        const changeCrossDomain = () => {
          if (tempDataInfo.value.crossDomain.type === "default") {
            tempDataInfo.value.crossDomain.type = "js";
            tempDataInfo.value.crossDomain.value = String(
              tempDataInfo.value.crossDomain.value
            );
          } else {
            tempDataInfo.value.crossDomain.type = "default";
            tempDataInfo.value.crossDomain.value = false;
          }
        };

        const changeOvertime = () => {
          if (tempDataInfo.value.timeout.type === "default") {
            tempDataInfo.value.timeout.type = "js";
            tempDataInfo.value.timeout.value = String(
              tempDataInfo.value.timeout.value
            );
          } else {
            tempDataInfo.value.timeout.type = "default";
            tempDataInfo.value.timeout.value = 5000;
          }
        };

        const changeRequestHeader = () => {
          if (tempDataInfo.value.requestHeader.type === "default") {
            tempDataInfo.value.requestHeader.type = "js";
            tempDataInfo.value.requestHeader.value = "";
          } else {
            tempDataInfo.value.requestHeader.type = "default";
            tempDataInfo.value.requestHeader.value = <any>[];
          }
        };

        const addRequestHeader = () => {
          tempDataInfo.value.requestHeader.value.push({
            key: "",
            value: "",
            type: "default",
          });
        };

        const handleRequestHeader = (e: any, index: number) => {
          tempDataInfo.value.requestHeader.value[index].type = e.key;
          switch (e.key) {
            case "string":
              tempDataInfo.value.requestHeader.value[index].value = String(
                tempDataInfo.value.requestHeader.value[index].value
              );
              break;
            case "boolean":
              tempDataInfo.value.requestHeader.value[index].value = false;
              break;
            case "js":
              tempDataInfo.value.requestHeader.value[index].value = String(
                tempDataInfo.value.requestHeader.value[index].value
              );
              break;
          }
        };

        const deleteRequestHeader = (index: number) => {
          tempDataInfo.value.requestHeader.value.splice(index, 1);
        };

        const eventList = [
          {
            key: "isRequest",
            title: "是否发起请求的计算函数",
            value: "function() { return true; }",
          },
          {
            key: "handleParam",
            title: "请求前对参数的处理函数",
            value: "function() { return true; }",
          },
          {
            key: "handleSuccess",
            title: "请求成功对结果的处理函数",
            value: "function() { return true; }",
          },
          {
            key: "handleError",
            title: "请求失败对异常的处理函数",
            value: "function() { return true; }",
          },
        ];
        let tempEventList = ref(cloneDeep(eventList));
        const changeEventList = () => {
          tempEventList.value = cloneDeep(eventList);
          pullAllBy(
            tempEventList.value,
            tempDataInfo.value.eventHandler,
            "key"
          );
        };
        const handleEvent = (e: any) => {
          const eventIndex = tempEventList.value.findIndex(
            (item) => item.key === e.key
          );
          if (eventIndex !== -1) {
            tempDataInfo.value.eventHandler.push(
              tempEventList.value[eventIndex]
            );
          }
          changeEventList();
        };
        const deleteEvent = (key: string) => {
          const eventIndex = tempDataInfo.value.eventHandler.findIndex(
            (item: { key: string }) => item.key === key
          );
          if (eventIndex !== -1) {
            tempDataInfo.value.eventHandler.splice(eventIndex, 1);
            changeEventList();
          }
        };

        const handleDataInfo = (type: string) => {
          if (
            tempDataInfo.value.sourceId === "" ||
            tempDataInfo.value.requestUrl.value === "" ||
            tempDataInfo.value.requestMethod.value === "" ||
            tempDataInfo.value.crossDomain.value === ""
          ) {
            message.error("缺少必填参数");
            return;
          }
          let repeatId = false;
          switch (type) {
            case "add":
            case "copy":
              repeatId = false;
              data.forEach((item) => {
                if (item.sourceId === tempDataInfo.value.sourceId)
                  repeatId = true;
              });
              if (repeatId) {
                message.error("数据源ID重复");
                return;
              }
              data.push(tempDataInfo.value);
              onSearch(searchText.value);
              drawerVisible.value = false;
              break;
            case "edit":
              repeatId = false;
              const tempdataList = cloneDeep(data);
              tempdataList.splice(handleSourceIndex.value, 1);
              tempdataList.forEach((item) => {
                if (item.sourceId === tempDataInfo.value.sourceId)
                  repeatId = true;
              });
              if (repeatId) {
                message.error("数据源ID重复");
                return;
              }
              data[handleSourceIndex.value] = tempDataInfo.value;
              onSearch(searchText.value);
              drawerVisible.value = false;
              break;
          }
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
            dataSchema.value = JSON.stringify(cloneDeep(data));
          }
          schemaType.value = type;
          schemaVisible.value = true;
        };
        const importData = () => {
          try {
            const tempData = JSON.parse(dataSchema.value);
            if (Array.isArray(tempData)) {
              data.push.apply(data, tempData);
              onSearch(searchText.value);
              schemaVisible.value = false;
            } else {
              message.error("schema信息有误");
            }
          } catch (error) {
            message.error("schema信息有误");
          }
        };

        const httpRequest = () => {
          data.forEach((item, index) => {
            const autoRequest =
              item.autoRequest.type === "default"
                ? item.autoRequest.value
                : eval(item.autoRequest.value);
            if (item.requestType === "fetch" && autoRequest) {
              const config = <any>{};
              // let headers = <any>{};
              // if (Array.isArray(item.requestHeader.value)) {
              //   item.requestHeader.value.forEach((header) => {
              //     headers[header.key] = header.value;
              //   });
              // } else if (item.requestHeader.value !== "") {
              //   headers["headers"] = eval(item.requestHeader.value);
              // }
              let data = <any>{};
              if (Array.isArray(item.requestParam.value)) {
                item.requestParam.value.forEach((param) => {
                  data[param.key] =
                    param.type === "default" ? param.value : eval(param.value);
                });
              } else {
                data = eval(item.requestParam.value);
              }
              config.url =
                item.requestUrl.type === "default"
                  ? item.requestUrl.value
                  : eval(item.requestUrl.value);
              config.method =
                item.requestMethod.type === "default"
                  ? item.requestMethod.value
                  : eval(item.requestMethod.value);
              item.requestMethod.value === "PUT" ||
                item.requestMethod.value === "POST"
                ? (config.data = data)
                : (config.params = data);
              config.timeout =
                item.timeout.type === "default"
                  ? item.timeout.value
                  : eval(item.timeout.value);
              // console.log(config);
              axios(config)
                .then((res) => {
                  console.log(`${item.requestMethod.value} result`, res);
                  self.onSendMessage({ type: "request" } as any, res, index);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else if (item.requestType === "jsonp" && autoRequest) {
              fetchJsonp(item.requestUrl.value, {
                timeout: item.timeout.value,
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (json) {
                  console.log("jsonp result", json);
                  self.onSendMessage({ type: "request" } as any, json, index);
                })
                .catch(function (ex) {
                  console.log("parsing failed", ex);
                });
            }
          });
        };

        onMounted(() => {
          httpRequest();
        });

        return {
          searchSelect,
          searchText,
          tempDataSource,
          sourceStatus,
          drawerVisible,
          drawerType,
          drawerTitle,
          tempDataInfo,
          leftBrackets,
          rightBrackets,
          tempEventList,
          schemaType,
          schemaVisible,
          schemaTitle,
          dataSchema,
          zhCN,
          selectChange,
          onSearch,
          openDrawer,
          changeAutoRequest,
          changeRequestUrl,
          changeRequestParam,
          handleRequestParam,
          deleteRequestParam,
          addRequestParam,
          changeRequestMethod,
          changeCrossDomain,
          changeOvertime,
          changeRequestHeader,
          addRequestHeader,
          handleRequestHeader,
          deleteRequestHeader,
          handleEvent,
          deleteEvent,
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
    this.componentInstance.use("fetchJsonp", fetchJsonp);
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
        return "q-data-source";
      },
      get type() {
        return "数据源";
      },
      get text() {
        return "dataSource";
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
        return "dataSource组件,可以配置页面数据请求";
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
                text: "数据请求",
                eventType: "request",
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
            text: "数据请求",
            eventType: "request",
            messageSchema: "",
            messageDemo: "",
          },
        ],
      },

      get eventSpecification() {
        return this._eventSpecification;
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
    "q-data-source": QDataSource;
  }
}
