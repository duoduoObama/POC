import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IQListTextOptions } from './IQListText'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-list-text')
export class QListText extends LitElement {
  static styles = css`
    :host {
      display: block; 
    }
    p {
      margin:0;
    }
  `

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQListTextOptions = { list: ["文本数据1", "文本数据2", "文本数据3", "文本数据4", "文本数据5", "文本数据6"] }

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    const { list = [] } = this.data;
    return html`
      ${list.map((item) => {
      return html`<p>${item}</p>`
    })}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-list-text': QListText
  }
}
