import { html, css, LitElement, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { IQTableOptions } from './IQTable'
import { createApp, defineComponent, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import Table from 'ant-design-vue/lib/table'
import Divider from 'ant-design-vue/lib/divider'
import TypographyLink from 'ant-design-vue/lib/typography'
import Popconfirm from 'ant-design-vue/lib/popconfirm'
import Input from 'ant-design-vue/lib/input'
import ConfigProvider from 'ant-design-vue/lib/config-provider'
import antdCss from 'ant-design-vue/dist/antd.min.css'
import zhCN from 'ant-design-vue/es/locale/zh_CN';

interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-table')
export class QTable extends LitElement {
    static styles = [
        css`
            :host {
            display: block;
            height: 100%;
            width: 100%; 
            }
            img {
            height: 100%;
            width: 100%; 
            }
        `,
        css`${unsafeCSS(antdCss)}`];

    /**
     * The name to say "Hello" to.
     */
    @property({ type: Object, attribute: "data-data" })
    data: IQTableOptions = { columns: [], dataSource: [], scroll: { x: 1500, y: 700 } };

    /**
     * The number of times the button has been clicked.
     */
    @query("#container")
    container!: HTMLElement

    /**
     * 组件实例
     */
    componentInstance: any = null

    render() {
        return html`<div id="container"></div>`;
    }

    createVueComponent = () => {
        const { columns = [], dataSource: data = [], operation } = this.data;

        const component = defineComponent({
            template: `
            <a-config-provider :locale="zhCN">
                <a-table :columns="columns" :data-source="dataSource" bordered>
                <template #bodyCell="{ column, text, record }">
                <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
                    <div>
                    <a-input
                        v-if="editableData[record.key]"
                        v-model:value="editableData[record.key][column.dataIndex]"
                        style="margin: -5px 0"
                    />
                    <template v-else>
                        {{ text }}
                    </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                        <a-typography-link @click="save(record.key)">保存</a-typography-link>
                            <a-divider type="vertical" />
                        <a-popconfirm title="是否取消?" @confirm="cancel(record.key)">
                        <a>取消</a>
                        </a-popconfirm>
                    </span>
                    <span v-else>
                        <a @click="edit(record.key)">编辑</a>
                            <a-divider type="vertical" />
                        <a-popconfirm title="是否删除?" @confirm="remove(record.key)">
                            <a>删除</a>
                        </a-popconfirm> 
                    </span>
                    </div>
                </template>
                </template>
            </a-table>
            </a-config-provider>
            `,
            setup() {

                const eventHandler = (eventName: string, record: any, index: number) => {
                    const event = new CustomEvent(eventName, { detail: { record: cloneDeep(record), index } });
                    window.dispatchEvent(event);
                }

                const tempData = data.map((item: any, index) => ({ ...item, key: index }));
                const dataSource = ref(tempData);
                const editableData: { [key: string]: any } = reactive({});

                const edit = (key: string) => {
                    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
                };
                const save = (key: string) => {
                    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
                    delete editableData[key];
                };
                const cancel = (key: string) => {
                    delete editableData[key];
                };
                const remove = (key: string) => {
                    dataSource.value = dataSource.value.filter(item => key !== item.key);
                }

                return {
                    zhCN,
                    dataSource,
                    columns,
                    editingKey: '',
                    editableData,
                    edit,
                    save,
                    cancel,
                    remove
                };
            },
        })

        this.componentInstance = createApp(component);
        this.componentInstance.use(ConfigProvider);
        this.componentInstance.use(Table);
        this.componentInstance.use(Divider);
        this.componentInstance.use(TypographyLink);
        this.componentInstance.use(Popconfirm);
        this.componentInstance.use(Input);
        this.componentInstance.mount(this.container);
    }

    disconnectedCallback(): void {
        this.componentInstance.destroy();
    }

    protected updated(): void {
        this.createVueComponent();

    }
}

declare global {
    interface HTMLElementTagNameMap {
        'q-table': QTable
    }
} 