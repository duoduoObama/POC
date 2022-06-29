import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { isArray, isString } from 'lodash-es'
import { Component } from '../../types/Component'
import { IEventSpecificationEvent, IMessage, ISchema } from '../../types/IComponent'
import { domAssemblyCustomEvents } from '../../util/base-method'
import { IQtextOptions } from './IQText'

/**
 * 文本组件
 * 
 */
@customElement('q-text')
export class QText extends Component {
  static styles = css`
    :host {
      display: block; 
    }
    p {
        margin:0;
    }
  `

  /**
   * 绑定data数据
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQtextOptions = { text: "文本数据1" };

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
    const { text } = this.data;
    return html`
      <p @click=${this.clickFont}>${text}</p> 
    `
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
    })
  }

  clickFont(e: Event) {
    this.onSendMessage(e, this.data, "text");
  }

  onSendMessage(e: Event, node: any, index: number | string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: '',
        srcType: e.type,
        dstType: '',
      },
      body: {
        ...e,
        node,
        index
      },
    };
    this.sendMessage(message);
  }

  initModel(): void {
    const self = this;

    this.model = {
      get id() {
        return self.id
      },
      get componentName() {
        return "q-text"
      },
      get type() {
        return "文本"
      },
      get text() {
        return "文本"
      },
      get group() {
        return ["文本"]
      },
      get createTime() {
        return new Date()
      },
      get image() {
        return ""
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
        return this.data;
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
                type: 'input',
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
                rules: [{ required: false, message: "必填项", trigger: ["blur"] }],
              },
            ],
          }
        }
      },
      _eventSpecification: {
        inputEvent: [{
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        }],
        inputCustomEvent: [{
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        }],
        outputEvent: [{
          text: "组件点击数据",
          eventType: "click",
          messageSchema: "",
          messageDemo: "文本数据1"
        }],
      },

      get eventSpecification() {
        return this._eventSpecification;
      },
      set eventSpecification(value) {
        this._eventSpecification = value;
        self.receiveInfo(value);
      },
      _onMessageMeta: [
        {
          'changeInfo': (e: IMessage) => {
            console.log(this, e, 88888);
          }
        }
      ],
      _onDOMEvent: [{
        'onclick': (e: Event) => {
          console.log(e);
        }
      }],
      get onMessageMeta() {
        return this._onMessageMeta;
      },
      set onMessageMeta(value) {
        if (!isArray(value)) {
          return;
        }
        this._onMessageMeta = value;
      },
      get onDOMEvent() {
        return this._onDOMEvent;
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
        return self.data;
      },
      set data(value) {
        self.data = value;
      }
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-text': QText
  }
}
