import { html, css, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isString } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { IComponent } from "../../types/runtime/IComponent";
import { IMessage } from "../../types/runtime/IMessage";
import {
  ISchema,
  IEventSpecificationEvent,
} from "../../types/runtime/IModelSchema";
import { deepWatchModelProxy, mergeModel } from "../../util/utils";
import { IQMarqueeTextOptions } from "./IQMarqueeText";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("q-marquee-text")
export class QMarqueeText extends Component {
  static styles = css`
    :host {
      display: block;
    }
    p {
      margin: 0;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQMarqueeTextOptions = { text: "走马灯文本数据1" };

  /**
   * The number of times the button has been clicked.
   */
  @query("marquee")
  container!: HTMLMarqueeElement;

  model: Record<keyof IComponent, any> & ISchema = {} as never;

  constructor() {
    super();
    this.initModel();
    this.receiveInfo(this.model.eventSpecification);
  }

  render() {
    const { text = "" } = this.data;
    return html`
      <marquee
        >${text}
        <slot></slot>
      </marquee>
    `;
  }

  runMarquee() {
    navigation.addEventListener("navigate", () => {
      this.container.stop();
      this.container.start();
    });
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.runMarquee();
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

  clickFont(e: Event) {
    this.onSendMessage(e, this.data, "text");
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

    this.model = deepWatchModelProxy(
      mergeModel(this.model, {
        get id() {
          return self.id;
        },
        get componentName() {
          return "q-marquee-text";
        },
        get type() {
          return "文本";
        },
        get text() {
          return "走马灯文字";
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
          return this._initStyle;
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
              text: "组件点击数据",
              eventType: "click",
              messageSchema: "",
              messageDemo: "文本数据1",
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
        get data() {
          return cloneDeep(self.data);
        },
        set data(value) {
          self.data = value;
        },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-marquee-text": QMarqueeText;
  }
}

declare const navigation: any;
