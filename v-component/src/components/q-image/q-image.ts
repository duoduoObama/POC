import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IQImageOptions } from './IQImage'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-image')
export class QImage extends LitElement {
  static styles = [css`
    :host {
      display: block;
      height: 100%;
      width: 100%; 
    }
    img {
      height: 100%;
      width: 100%; 
    }
  `]

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: IQImageOptions = {
    src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
    imageType: 'fill'
  }

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    const { src } = this.data;
    return html`
      <img src="${src}">
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-image': QImage
  }
}
