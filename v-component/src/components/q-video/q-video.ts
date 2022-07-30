import { css, html } from "lit";

import { Component } from "../../types/Component";
import { IQvideoOptions } from "./IQVideo";
import { customElement, property } from "lit/decorators.js";
import {
  ISchema,
  IDOMEventMeta,
  IWatchSetting,
  IMessage,
} from "../../types/IComponent";
import { cloneDeep, extend, isArray, isObject, isString } from "lodash-es";
import { domAssemblyCustomEvents } from "../../util/base-method";

/**
 * 视频组件
 *
 */
@customElement("q-video")
export class QVideo extends Component {
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

  @property({ type: Object, attribute: "data-data" })
  data: IQvideoOptions = {
    src: "https://www.runoob.com/try/demo_source/movie.mp4",
  };
  render() {
    const { src } = this.data;
    return html`<video controls autoplay src=${src}>您的浏览器不支持</video>`;
  }
  handleChange(e: Event) {
    this.onSendMessage(e, this.data, "video");
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
        return "q-video";
      },
      get type() {
        return "视频";
      },
      get text() {
        return "视频";
      },
      get group() {
        return ["视频"];
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
        return "视频组件,可以观看视频信息";
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
    "q-video": QVideo;
  }
}
