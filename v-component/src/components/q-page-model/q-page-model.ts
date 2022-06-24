import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { IQPageModelOptions } from "./IQPageModel";
import { createApp, defineComponent, onMounted } from "vue";
import { cloneDeep, throttle } from "lodash-es";
import Vuex from "vuex";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("q-page-model")
export class QPageModel extends LitElement {
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
  data: IQPageModelOptions = { pageModel: [] };

  /**
   * The number of times the button has been clicked.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  render() {
    const div = document.createElement("div");
    div.id = "container";
    return div;
  }

  createVueComponent = () => {
    const { pageModel: data = [] } = this.data;
    const _this = this;
    const component = defineComponent({
      template: `
            <div style="width: 200px; height: 200px; background-color: #3794FF; font-size: 20px">pageModel</div>
            `,
      setup() {
        const getPage = () => {
          const elements = document.querySelectorAll(".draggable2");
          const dataArr = <any>[];
          elements.forEach((ele: any) => {
            try {
              const data = JSON.parse(ele.dataset.data);
              if (
                Object.keys(data).length > 0 &&
                ele.tagName !== "Q-PAGE-MODEL"
              ) {
                dataArr.push(data);
              }
            } catch (error) {}
          });
          changeElementData(dataArr);
          return [];
        };

        const observation = () => {
          const config = {
            attributes: true,
            childList: true,
            subtree: true,
          };
          const callBackDebounce = throttle((e) => {
            let isChange = false;
            let isPageModel = false;
            e.forEach((item: any) => {
              item.target.tagName === "Q-PAGE-MODEL"
                ? (isPageModel = true)
                : (isChange = true);
            });
            if (isChange && !isPageModel) {
              getPage();
            }
          }, 800);
          const observer = new MutationObserver(callBackDebounce);
          if (!observer || !observer.observe) return;
          observer.observe(document.body, config);
        };

        // var store = new Vuex.Store({
        //   state: {
        //     pageModel: <any>[],
        //   },
        //   mutations: {
        //     updatePageModel(state) {
        //       state.pageModel = getPage();
        //     },
        //   },
        // });
        const changeElementData = (dataArr: Array<any>) => {
          const elementData = JSON.parse(<any>_this.dataset.data);
          elementData.pageModel = cloneDeep(dataArr);
          _this.dataset.data = JSON.stringify(elementData);
        };

        onMounted(() => {
          observation();
        });

        return {};
      },
    });

    this.componentInstance = createApp(component);
    // this.componentInstance.use("Vuex", vuex);
    this.componentInstance.mount(this.container);
  };

  disconnectedCallback(): void {
    this.componentInstance.destroy();
  }

  protected updated(): void {
    this.createVueComponent();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-page-model": QPageModel;
  }
}
