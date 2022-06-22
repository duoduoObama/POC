import { css, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { IQRouterOptions } from './IQRouter'
import { createRouter, createWebHashHistory } from "vue-router"
import { createApp, nextTick, reactive, ref } from "vue" 

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-router')
export class QRouter extends LitElement {
    static styles = css`
    :host {
      display: block; 
      height: 100%;
      width: 100%;
    }
    p{
        margin:0;
    }
  `

    /**
     * The name to say "Hello" to.
     */
    @property({ type: Object, attribute: "data-data" })
    data: IQRouterOptions = { path: [] }

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
        const div = document.createElement("div");
        div.id = "container";
        return div;
    }

    /**
 * vue组件实例定义(可在component实现vue的方法)
 * @param {*} data 传入组件data-data数据
 * @param {*} root 挂载到当前webcomponent节点
 */
    async createVueComponent() {
        const { whetherToShowTab, path = [] } = this.data;
        const component = {
            template: ` 
                <div class="container" ref="container" id="app">  
                <p> 
                    <template v-if="whetherToShowTab" v-for="{url} in path">
                    <router-link :to="url">Go to {{url}}</router-link> |
                    </template> 
                </p>
                <!-- 路由出口 -->
                <!-- 路由匹配到的普通组件将渲染在这里 -->
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component
                            :key="$route.path"
                            :is="Component"
                            v-if="$route.meta.keepAlive && !$route.meta.isIframe"
                        />
                    </keep-alive>
                </router-view>
                
                <!-- 路由匹配到的iframe类型组件将渲染在这里 -->
                <div
                    v-for="{ meta:{ component,isIframe }, path } in path.filter( c=> c.isIframe )" 
                    v-show="$route.meta.keepAlive && $route.meta.isIframe && $route.path === path"
                >
                    <component :key="path" :is="component" />
                </div>   
                </div>    
            `,
            setup() {
                const isShow = ref(whetherToShowTab);
                const pathArr = reactive(path); 

                return {
                    whetherToShowTab: isShow,
                    path: pathArr
                }
            }
        };

        // 1. 定义路由组件.
        // 也可以从其他文件导入
        const slotComponent = (slotName: string) => ({
            template: `<div></div>`,
            data() {
                return {
                    name: this.name,
                };
            },

            methods: {
                appendSlot() {
                    if (Array.isArray(slotName)) {
                        slotName.forEach((item) => {
                            const slot = document.createElement("slot");
                            slot.name = item;
                            this.$el.appendChild(slot);
                        });
                    } else {
                        const slot = document.createElement("slot");
                        slot.name = slotName;
                        this.$el.appendChild(slot);
                    }
                },
            } as { [key: string]: any },
            mounted() {
                nextTick(() => {
                    this.appendSlot();
                });
            },
        } as any);
        path.forEach((element: any) => {
            const { url, keepAlive, isIframe, slotName } = element;
            const component = slotComponent(slotName);
            Object.assign(element, {
                path: url,
                component,
                meta: {
                    keepAlive,
                    isIframe,
                    component,
                },
            });
        });
        // 2. 定义一些路由
        // 每个路由都需要映射到一个组件。
        const routes = path as [];
        const router = createRouter({
            history: createWebHashHistory(),
            routes,
        });
        const app = createApp(component);
        //确保 _use_ 路由实例使
        //整个应用支持路由。
        app.use(router);
        app.mount(this.container);

        this.componentInstance = app;
    }

    disconnectedCallback(): void {
        this.componentInstance.unmount();
    }

    protected updated(): void {
        this.createVueComponent();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'q-router': QRouter
    }
}
