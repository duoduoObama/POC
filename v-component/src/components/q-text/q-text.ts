import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cloneDeep } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { IMessage } from "../../types/runtime/IMessage";
import { ISchema } from "../../types/runtime/IModelSchema";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { deepWatchModelProxy, mergeModel } from "../../util/utils";
import { IQtextOptions } from "./IQText";

/**
 * 文本组件
 *
 */
@customElement("q-text")
export class QText extends Component {
	static styles = css`
		:host {
			display: block;
		}
		p {
			margin: 0;
		}
	`;

	/**
	 * 绑定data数据
	 */
	@property({ type: Object, attribute: "data-data" })
	text: string = "文本数据1";

	/**
	 * 数据模型
	 */
	model!: ISchema;

	constructor() {
		super();
		this.initModel();
		domAssemblyCustomEvents(this, this.model.onDOMEvent);
	}

	render() {
		return html` <p @click=${this.clickFont}>${this.text}</p> `;
	}

	clickFont(e: Event) {
		const message: IMessage = {
			header: {
				src: this.id,
				dst: "",
				srcType: e.type,
				dstType: "",
			},
			body: this.text,
		};
		this.sendMessage(message);
	}

	initModel(): void {
		const self = this;

		this.model = deepWatchModelProxy(
			mergeModel(this.model, {
				get componentName() {
					return "q-text";
				},
				get type() {
					return "文本";
				},
				get text() {
					return "文本";
				},
				get group() {
					return ["文本"];
				},
				get image() {
					return "";
				},
				get description() {
					return "文本组件,可以编写文字信息";
				},
				get schema() {
					return {
						eventSpecification: {
							inputMessage: [
								{
									text: "更改组件数据",
									eventType: "changeInfo",
									messageSchema: "",
									messageDemo: "",
								},
							],
							outputMessage: [
								{
									text: "组件点击数据",
									eventType: "click",
									messageSchema: "",
									messageDemo: "文本数据1",
								},
							],
						},
						optionsView: {
							list: [
								{
									type: "input",
									label: "输入框",
									options: {
										type: "text",
										width: "100%",
										defaultValue: "",
										placeholder: "请输入",
										clearable: false,
										maxLength: 0,
										prepend: "",
										append: "",
										tooptip: "",
										hidden: false,
										disabled: false,
										dynamicHide: false,
										dynamicHideValue: "",
									},
									model: "text",
									key: "text",
									rules: [
										{
											required: false,
											message: "必填项",
											trigger: ["blur"],
										},
									],
								},
							],
						},
					};
				},
				_onMessageMeta: {
					changeInfo: [
						function (e: IMessage) {
							console.log(e, self);
							self.text = String(e.body);
						},
					],
				},
				_onDOMEvent: {
					onclick: [self.clickFont],
				},
				_onWatchSetting: {
					data: [
						function (newVal: any, oldVal: any, context: any) {
							console.log(newVal, oldVal, context);
						},
					],
				},
				get data() {
					return self.text;
				},
				set data(value) {
					self.text = value;
				},
			})
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-text": QText;
	}
}
