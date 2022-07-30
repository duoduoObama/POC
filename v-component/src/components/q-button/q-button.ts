import { css, html } from "lit";
import { Component } from "../../types/Component";
import { IQbuttonOptions } from "./IQButton";
import { customElement, property } from "lit/decorators.js";
import {
  IEventSpecificationEvent,
  IMessage,
  ISchema,
  IDOMEventMeta,
  IWatchSetting,
} from "../../types/IComponent";

import { cloneDeep, isArray, isObject, isString } from "lodash-es";
import { domAssemblyCustomEvents } from "../../util/base-method";

/**
 * 颜色组件
 *
 */
@customElement("q-button")
export class QButton extends Component {
  static styles = css`
    :host {
      display: block;
    }
    p {
      margin: 0;
    }
  `;

  /**
   * 数据模型
   */
  model!: ISchema;
  constructor() {
    super();
    this.initModel();
    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }

  /**
   * 绑定data数据
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQbuttonOptions = { text: "按钮测试" };
  render() {
    const { text } = this.data;
    return html`<button @click=${this.handleChange}>${text}</button>`;
  }
  handleChange(e: Event) {
    console.log("e", e);
    this.onSendMessage(e, this.data, "button");
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
        return "q-button";
      },
      get type() {
        return "按钮";
      },
      get text() {
        return "按钮测试";
      },
      get group() {
        return ["按钮"];
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
        return "按钮组件,可以进行按钮测试";
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
                eventType: "change",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
            ],
          },
          optionsView: {
            list: [
              {
                type: "input",
                label: "按钮",
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
            text: "组件点击数据",
            eventType: "click",
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
        if (!isArray(value)) {
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
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-button": QButton;
  }
}
