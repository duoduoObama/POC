import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IQrouterConfigOptions } from './IQrouterConfig'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-router-config')
export class QrouterConfig extends LitElement {
    static styles = css`
    :host {
      display: block; 
    } 
    `

    /**
     * The name to say "Hello" to.
     */
    @property({ type: Object, attribute: "data-data" })
    data: IQrouterConfigOptions = { router: [] }

    render() {
        const { router = [] } = this.data;
        return html`
      <p>${router}</p> 
    `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'q-router-config': QrouterConfig
    }
}
