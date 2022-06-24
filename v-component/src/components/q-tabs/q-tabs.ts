import { html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { IMessage } from '../../types/IComponent'
import { EVENTBUS_NAME } from '../constent'
import { IQTabsOptions } from './IQTabs'
import { styles } from './styles'

/**
 * 选项卡组件.
 *
 * @slot - slot 为选项卡提供内容 
 */
@customElement('q-tabs')
export class QTabs extends LitElement {
    static styles = styles

    /**
     * The name to say "Hello" to.
     */
    @property({ type: Object, attribute: "data-data" })
    data: IQTabsOptions = {
        tabs: [{ title: "功能一", id: "test1" }, { title: "功能二", id: "test2" }]
    }

    /**
     * The number of times the button has been clicked.
     */
    @query(".container")
    root!: HTMLDivElement

    render() {
        const { tabs = [] } = this.data;
        return html`
        <div class="container">
            <ul id="tabs"> 
            ${tabs.map((item, index) => {
            const { title } = item;
            return html`
                <li>
                    <a href="javascript:void(0);" @click="${(e: Event) => { this.clickTitle(e, index) }}">
                    ${title}
                    </a>
                </li>`})
            } 
            </ul>
            <div id="content">  
            ${tabs.map(({ id }) =>
                html`<div class="content-panel" id="${id}"><slot name="${id}"></slot></div>`
            )}
            </div>
        </div>
    `
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

    clickTitle(e: Event, index: number) {
        const { tabs = [] } = this.data;
        if (!tabs[index]) return;
        const clickTab =
            this.root.querySelector("#tabs")?.children[index].children[0] as HTMLElement;
        const resetTabs = () => {
            this.root.querySelectorAll("#tabs a").forEach((el) => {
                el.id = "";
            });
            this.root.querySelectorAll(".content-panel").forEach((el) => {
                const element = el as HTMLElement;
                element.style.display = "none";
            });
        }
        resetTabs();
        const targetDOM = this.root.querySelector(`#${tabs[index].id}`) as HTMLElement;
        if (targetDOM) {
            targetDOM.style.display =
                "block";
        }

        clickTab.id = "current";
        this.sendMessage(e, tabs[index], index);
    }

    receiveInfo() {
        const { id, data } = this;
        this.addEventListener(id, (message) => {
            console.log(message);
        });
    }

    sendMessage(e: Event, node: any, index: number) {
        const message: IMessage = {
            header: {
                src: this.id,
                dst: '',
                srcType: "object",
                dstType: '',
            },
            body: {
                ...e,
                ...node,
                index
            },
        };
        const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: message });
        window.dispatchEvent(customEvent);
    }

    protected updated(): void {
        this.receiveInfo();
        this.menuStart(this.root);
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'q-tabs': QTabs
    }
}
