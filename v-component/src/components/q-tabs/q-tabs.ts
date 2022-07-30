import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./styles";
import { isString, cloneDeep, isArray, isObject } from "lodash-es";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { IQTabsOptions } from "./IQTabs";
import { deepWatchModelProxy, mergeModel } from "../../util/utils";
import { Component } from "../../types/runtime/Component";
import { IMessage } from "../../types/runtime/IMessage";
import {
  ISchema,
  IEventSpecificationEvent,
} from "../../types/runtime/IModelSchema";

/**
 * 选项卡组件.
 *
 * @slot - slot 为选项卡提供内容
 */
@customElement("q-tabs")
export class QTabs extends Component {
  static styles = styles;

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQTabsOptions = {
    tabs: [
      { title: "功能一", id: "test1" },
      { title: "功能二", id: "test2" },
    ],
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
  render() {
    const { tabs = [] } = this.data;
    return html`
      <div class="container">
        <ul id="tabs">
          ${tabs.map((item, index) => {
            const { title } = item;

            return html` <li>
              <a
                href="javascript:void(0);"
                id="${index === 0 ? "current" : ""}"
                @click="${(e: Event) => {
                  this.clickTitle(e, index);
                }}"
              >
                ${title}
              </a>
            </li>`;
          })}
        </ul>
        <div id="content">
          ${tabs.map(
            ({ id }, index) =>
              html`<div
                class="content-panel"
                id="${id}"
                style="display: ${index === 0 ? "block" : "none"}"
              >
                <slot name="${id}"></slot>
              </div>`
          )}
        </div>
      </div>
    `;
  }

  menuStart(shadowDom: HTMLElement = document.body) {
    const content = shadowDom.querySelector("#content") as HTMLElement;

    const contentDIV = content.children as never as Array<HTMLElement>;
    [...contentDIV].forEach((el) => {
      el.style.display = "none";
    });
    const tabsA = shadowDom.querySelector("#tabs li>a") as HTMLElement;
    const tabsDIV = shadowDom.querySelector("#content > div") as HTMLElement;
    tabsA.id = "current";
    tabsDIV.style.display = "block";
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
          this.data = { ...this.data, tabs: JSON.parse(body) };
          return;
        }
        this.data = { ...this.data, tabs: body as [] };
      });
    });
  }

  clickTitle(e: Event, index: number) {
    const { tabs = [] } = this.data;
    if (!tabs[index]) return;
    const clickTab = this?.shadowRoot?.querySelector("#tabs")?.children[index]
      .children[0] as HTMLElement;
    const resetTabs = () => {
      this?.shadowRoot?.querySelectorAll("#tabs a").forEach((el) => {
        el.id = "";
      });
      this?.shadowRoot?.querySelectorAll(".content-panel").forEach((el) => {
        const element = el as HTMLElement;
        element.style.display = "none";
      });
    };
    resetTabs();
    const targetDOM = this?.shadowRoot?.querySelector(
      `#${tabs[index].id}`
    ) as HTMLElement;
    if (targetDOM) {
      targetDOM.style.display = "block";
    }
    console.log("index", index);

    clickTab.id = "current";
    this.onSendMessage(e, this.data, index);
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
                  model: "tabs",
                  key: "tabs",
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
          self.receiveInfo(value);
        },
        _onMessageMeta: {
          changeInfo: [
            (e: IMessage) => {
              console.log(e);
            },
          ],
        },
        _onDOMEvent: {
          onclick: [
            (e: Event) => {
              console.log(e);
            },
          ],
        },
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
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-tabs": QTabs;
  }
}
