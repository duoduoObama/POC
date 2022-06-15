import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IQMarqueeTextOptions } from './IQMarqueeText'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-marquee-text')
export class QMarqueeText extends LitElement {
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
    data: IQMarqueeTextOptions = { text: "走马灯文本数据1" }

    /**
     * The number of times the button has been clicked.
     */
    @property({ type: Number })
    count = 0

    render() {
        const { text = '' } = this.data;
        return html`
      <marquee>${text}
        <slot></slot>
      </marquee> 
    `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'q-marquee-text': QMarqueeText
    }
}
