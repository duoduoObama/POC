import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IQtextOptions } from './IQText'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
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
     * The name to say "Hello" to.
     */
    @property({ type: Object, attribute: "data-data" })
    data: IQtextOptions = { text: "文本数据1" }

    /**
     * The number of times the button has been clicked.
     */
    @property({ type: Number })
    count = 0

    render() {
        const { text } = this.data;
        return html`
      <p>${text}</p> 
    `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'q-text': QText
    }
}
