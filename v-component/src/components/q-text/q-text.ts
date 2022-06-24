import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { isString } from 'lodash-es'
import { Component } from '../../types/Component'
import { IEventSpecificationEvent, IMessage, ISchema } from '../../types/IComponent'
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

  model: ISchema & { [key: string]: any } = {
    _eventSpecification: {
      inputEvent: [{
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
      this.receiveInfo(value);
    },
    get mdata() {
      return this.data;
    },
    set mdata(value) {
      this.data = value;
    }
  }

  constructor() {
    super();
    this.receiveInfo(this.model.eventSpecification);
  }

  render() {
    const { text } = this.data;
    return html`
      <p @click=${this.clickFont}>${text}</p> 
    `
  }

  receiveInfo(value: { [key: string]: IEventSpecificationEvent[] }) {
    value.inputEvent.forEach((item: IEventSpecificationEvent) => {
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
}

declare global {
  interface HTMLElementTagNameMap {
    'q-text': QText
  }
}
