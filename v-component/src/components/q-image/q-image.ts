import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { isString, cloneDeep, isArray, isObject } from "lodash-es"; 
import { Component } from "../../types/runtime/Component";
import { IMessage } from "../../types/runtime/IMessage";
import { ISchema, IEventSpecificationEvent } from "../../types/runtime/IModelSchema";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { deepWatchModelProxy, mergeModel } from "../../util/utils";
import { IQImageOptions } from "./IQImage";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("q-image")
export class QImage extends Component {
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
  ];

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQImageOptions = {
    src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
    imageType: "fill",
  };

  /**
   * 数据模型
   */
  model!: ISchema;

  constructor() {
    super();
    this.initModel();
    this.receiveInfo(this.model.eventSpecification);
  }

  render() {
    const { src, imageType } = this.data;
    return html`
      <img
        src="${src}"
        @click=${this.clickImage}
        style="object-fit:${imageType}"
      />
    `;
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
          this.data = { ...this.data, src: body };
          return;
        }
        this.data = { ...this.data, src: JSON.stringify(body) };
      });
    });
  }

  clickImage(e: Event) {
    this.onSendMessage(e, this.data, "image");
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

    this.model = deepWatchModelProxy(mergeModel(this.model, {
      get id() {
        return cloneDeep(self.id);
      },
      get componentName() {
        return "q-image";
      },
      get type() {
        return "媒体";
      },
      get text() {
        return "图片";
      },
      get group() {
        return ["媒体"];
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
        return "图片组件,可以显示图片信息";
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
                messageDemo: "图片数据1",
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
                model: "src",
                key: "src",
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
            messageDemo: "图片数据1",
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
      _onMessageMeta: {
        changeInfo: [(e: IMessage) => {
          console.log(e);
        }],
      },
      _onDOMEvent: {
        onclick: [(e: Event) => {
          console.log(e);
        }],
      },
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
        domAssemblyCustomEvents(self, value as any);
        this._onDOMEvent = value;
      },
      get data() {
        return cloneDeep(self.data);
      },
      set data(value) {
        self.data = value;
      },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-image": QImage;
  }
}
