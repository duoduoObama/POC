import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { isArray, isString, cloneDeep, isObject } from "lodash-es";
import { Component } from "../../types/Component";
import {
  IMessage,
  ISchema,
  IDOMEventMeta,
  IWatchSetting,
} from "../../types/IComponent";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { deepWatchModelProxy } from "../../util/utils";
import { IQselectOptions } from "./IQSelect";

/**
 * 多选框组件
 *
 */
@customElement("q-select")
export class QSelect extends Component {
  static styles = css`
    :host {
      display: block;
    }
    p {
      margin: 0;
    }
  `;

  /**
   * 绑定data数据
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQselectOptions = {
    list: [
      {
        id: 1,
        value: "选项一",
      },
      {
        id: 2,
        value: "选项二",
      },
      {
        id: 3,
        value: "选项三",
      },
    ],
  };

  /**
   * 数据模型
   */
  model!: ISchema;

  constructor() {
    super();
    this.initModel();

    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }

  render() {
    const { list = [] } = this.data;

    return html`
      <select
        @change="${(e: Event) => {
          this.handleChange(e);
        }}"
      >
        ${list.map((item) => {
          const { value, id } = item;
          return html`<option value="${id}">${value}</option>`;
        })}
      </select>
    `;
  }

  handleChange(e: Event) {
    this.onSendMessage(e, this.data, "select");
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
    this.model = deepWatchModelProxy({
      get id() {
        return cloneDeep(self.id);
      },
      get componentName() {
        return "q-select";
      },
      get type() {
        return "选择框";
      },
      get text() {
        return "选择框";
      },
      get group() {
        return ["选择框"];
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
        this._initStyle = value;
      },
      get description() {
        return "选择框组件,可以进行选择列表选择";
      },
      get iovSchema() {
        return {
          eventSpecification: {
            inputMessage: {
              text: "",
              eventType: "",
              messageSchema: "",
              messageDemo: "",
            },
            outputMessage: {
              text: "",
              eventType: "",
              messageSchema: "",
              messageDemo: "",
            },
          },
          optionsView: {
            list: [
              {
                type: "string",
                label: "string",
                options: {
                  type: "string",
                  width: "",
                  defaultValue: "",
                  placeholder: "",
                  clearable: "",
                  maxLength: "",
                  prepend: "",
                  append: "",
                  tooptip: "",
                  hidden: false,
                  disabled: false,
                  dynamicHide: false,
                  dynamicHideValue: "",
                },
                model: "",
                key: "",
                rules: [
                  {
                    required: true,
                    message: "",
                    trigger: [],
                  },
                ],
              },
            ],
          },
        };
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
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
            ],
          },
          optionsView: {
            list: [
              {
                type: "input",
                label: "输入框",
                options: {
                  type: "text",
                  width: "100%",
                  defaultValue: "",
                  placeholder: "请输入",
                  clearable: false,
                  maxLength: 0,
                  prepend: "",
                  append: "",
                  tooptip: "",
                  hidden: false,
                  disabled: false,
                  dynamicHide: false,
                  dynamicHideValue: "",
                },
                model: "text",
                key: "text",
                rules: [
                  { required: false, message: "必填项", trigger: ["blur"] },
                ],
              },
            ],
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
            text: "组件切换数据",
            eventType: "change",
            messageSchema: "",
            messageDemo: "文本数据1",
          },
        ],
      },

      get eventSpecification() {
        return cloneDeep(this._eventSpecification);
      },
      set eventSpecification(value) {
        this._eventSpecification = value;
      },
      _onMessageMeta: {},
      _onDOMEvent: {},
      _onWatchSetting: {},
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
        domAssemblyCustomEvents(self, value as IDOMEventMeta);
        this._onDOMEvent = value;
      },
      get onWatchSetting() {
        return cloneDeep(this._onWatchSetting);
      },
      set onWatchSetting(value: IWatchSetting) {
        if (!isObject(value)) {
          return;
        }
        this._onWatchSetting = value;
      },
      get data() {
        return cloneDeep(self.data);
      },
      set data(value) {
        self.data = value;
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-select": QSelect;
  }
}
