import { css, unsafeCSS, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createRouter, createWebHashHistory } from "vue-router";
import { createApp, nextTick, reactive, ref, markRaw } from "vue";
import { Menu } from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.min.css";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("website-construction")
export class WebsiteConstruction extends LitElement {
	static styles = [
		css`
			#container {
				width: 100%;
				height: 100%;
			}
			.container {
				width: 100%;
				height: 100%;
				display: flex;
			}
		`,
		css`
			${unsafeCSS(antdCss)}
		`,
	];

	/**
	 * The name to say "Hello" to.
	 */
	@property({ type: Object, attribute: "data-data" })
	data = { path: [] };

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

	/**
	 * vue组件实例定义(可在component实现vue的方法)
	 * @param {*} data 传入组件data-data数据
	 * @param {*} root 挂载到当前webcomponent节点
	 */
	async createVueComponent() {
		const { path = [] } = this.data;
		const SubMenu = {
			name: "SubMenu",
			props: {
				menuInfo: {
					type: Object,
					default: () => ({}),
				},
			},
			template: `
				<a-sub-menu :key="menuInfo.key" @titleClick="titleClick($event,menuInfo)">
				<template #title>{{ menuInfo.title }}</template>
				<template v-for="item in menuInfo.children" :key="item.key">
					<template v-if="!item.children.length">
					<a-menu-item :key="item.key">
						<router-link :to="item.routerName">{{ item.title }}</router-link>
					</a-menu-item>
					</template>
					<template v-else>
					<sub-menu :menu-info="item" :key="item.key" />
					</template>
				</template>
				</a-sub-menu>
			`,
			setup() {
				const titleClick = (e: any, info: any) => {
					if (info.routerName) {
						router.push(info.routerName);
					}
				};

				return {
					titleClick,
				};
			},
		};

		const component = {
			template: `
	      <div class="container" ref="container">
	          <div style="width: 220px; height: 100%">
	              <a-menu
	                v-model:openKeys="openKeys"
	                v-model:selectedKeys="selectedKeys"
	                mode="inline"
	                theme="dark"
	                :inline-collapsed="collapsed"
	              >
	                <template v-for="item in path" :key="item.key">
	                  <template v-if="!item.children.length">
	                    <a-menu-item :key="item.key">
	                      <router-link :to="item.routerName">{{ item.title }}</router-link>
	                    </a-menu-item>
	                  </template>
	                  <template v-else>
	                    <sub-menu :key="item.key" :menu-info="item" />
	                  </template>
	                </template>
	              </a-menu>
	          </div>
	          <div style="flex: 1; height: 100%;">
	              <!-- 路由出口 -->
	              <!-- 路由匹配到的普通组件将渲染在这里 -->
	              <div
	                v-for="{ meta:{ component,isIframe }, path } in route.filter( c=> !c.isIframe )"
	                v-show="$route.meta.keepAlive && !$route.meta.isIframe && $route.path === path"
	              >
	                <router-view v-if="path" v-slot="path">
	                  <keep-alive>
	                    <component :key="$route.path" :is="component" />
	                  </keep-alive>
	                </router-view>
	              </div>

	              <!-- 路由匹配到的iframe类型组件将渲染在这里 -->
	              <div
	                v-for="{ meta:{ component,isIframe }, path } in route.filter( c=> c.isIframe )"
	                v-show="$route.meta.keepAlive && $route.meta.isIframe && $route.path === path"
	                style="width: 100%; height: 100%"
	              >
	                <component v-if="path" :key="$route.path" :is="component" />
	              </div>
	          </div>
	      </div>
	        `,
			components: {
				"sub-menu": SubMenu,
			},
			setup() {
				const pathArr = reactive(path);
				const routeArr = reactive(routes);
				const openKeys = ref([]);
				const selectedKeys = ref([]);
				const collapsed = ref<boolean>(false);

				return {
					path: pathArr,
					route: routeArr,
					openKeys: openKeys,
					selectedKeys: selectedKeys,
					collapsed: collapsed,
				};
			},
		};

		// 1. 定义路由组件.
		// 也可以从其他文件导入
		const slotComponent = (slotName: string) =>
			({
				template: `<div style="width: 100%; height: 100%"></div>`,
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
		const routes = [] as any;
		const handlerPath = (path: any) => {
			path.forEach((element: any) => {
				const { routerName, keepAlive, isIframe, slotName } = element;
				const component = markRaw(slotComponent(slotName));
				Object.assign(element, {
					path: routerName,
					component,
					meta: {
						keepAlive,
						isIframe,
						component,
					},
				});
				routes.push(element);
				if (element.children && element.children.length) {
					handlerPath(element.children);
				}
			});
		};
		handlerPath(path);
		// 2. 定义一些路由
		// 每个路由都需要映射到一个组件。
		const router = createRouter({
			history: createWebHashHistory(),
			routes,
		});
		const app = createApp(component);
		//确保 _use_ 路由实例使
		//整个应用支持路由。
		app.use(router);
		// app.mount(this.container);

		this.componentInstance = app;
		this.componentInstance.use(Menu);
		this.componentInstance.mount(this.container);
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
		"website-construction": WebsiteConstruction;
	}
}
