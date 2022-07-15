import { css, html } from "lit";

import { Component } from "../../types/Component";
import { IQinputOptions } from "./IQInput";
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
 * 文本组件
 *
 */
@customElement("q-input")
export class QInput extends Component {
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
    this.receiveInfo(this.model.eventSpecification);
    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }

  /**
   * 绑定data数据
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQinputOptions = { text: "文本输入框测试" };
  render() {
    const { text } = this.data;

    return html` <input @change=${this.handleChange}>${text}</input> `;
  }
  handleChange(e: Event) {
    console.log("e", e);
    this.onSendMessage(e, this.data, "input");
  }
  onSendMessage(e: Event, node: any, index: number | string) {
    console.log("e.type", e.type);

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
          this.data = { ...this.data, text: body };
          return;
        }
        this.data = { ...this.data, text: JSON.stringify(body) };
      });
    });
  }
  initModel(): void {
    const self = this;
    this.model = {
      get id() {
        return cloneDeep(self.id);
      },
      get componentName() {
        return "q-text";
      },
      get type() {
        return "文本";
      },
      get text() {
        return "文本";
      },
      get group() {
        return ["文本"];
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
        return "文本组件,可以编写文字信息";
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
            text: "组件点击数据",
            eventType: "click",
            messageSchema: "",
            messageDemo: "文本数据1",
          },
        ],
      },
      get eventSpecification() {
        console.log(
          ` cloneDeep(this._eventSpecification);`,
          cloneDeep(this._eventSpecification)
        );

        return cloneDeep(this._eventSpecification);
      },

      set eventSpecification(value) {
        this._eventSpecification = value;
        self.receiveInfo(value);
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
    console.log("this", this);

    console.log("this.model", this.model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-input": QInput;
  }
}
