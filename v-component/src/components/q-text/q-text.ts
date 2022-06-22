import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IMessage } from '../../types/IComponent'
import { EVENTBUS_NAME } from '../constent'
import { IQtextOptions } from './IQText'

/**
 * 文本组件
 * 
 */
@customElement('q-text')
export class QText extends LitElement {
  static styles = css`
    :host {
      display: block; 
    }
    p{
        margin:0;
    }
  `

  /**
   * 绑定data数据
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQtextOptions = { text: "文本数据1" }



  render() {
    const { text } = this.data;
    return html`
      <p @click=${this.clickFont}>${text}</p> 
    `
  }

  receiveInfo() {
    const { id, data } = this;
    window.addEventListener(id, (message) => {
      const { detail } = message as never;
      const { body, header } = detail as IMessage;
      const { dstType } = header || {};

      console.log(dstType);

      if (dstType === "changeData") {
        if (typeof body === "object") {
          this.data = { ...this.data, text: JSON.stringify(body) };
          return;
        }
        this.data = { ...this.data, text: body as never as string };
      }
    });
  }

  clickFont(e: Event) {
    this.sendMessage(e, this.data, "text");
  }

  sendMessage(e: Event, node: any, index: number | string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: EVENTBUS_NAME,
        srcType: e.type,
        dstType: "object",
      },
      body: {
        ...e,
        node,
        index
      },
    };
    const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: message });
    window.dispatchEvent(customEvent);
  }

  protected updated(): void {
    this.receiveInfo();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-text': QText
  }
}
