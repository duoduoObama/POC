import { expect, describe, test } from "vitest";
import { IMessage, ISchema, Ischemas } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { IQbuttonOptions } from "./IQButton";
import { JSDOM } from "jsdom";
import { cloneDeep } from "lodash-es";

// render函数测试 是否获取data数据
const data: IQbuttonOptions = { text: "按钮测试" };
const render = () => {
  const { text } = data;
  return text;
};
describe("测试brender函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual("按钮测试");
  });
});

// handleChange函数测试 是否发送消息
const dom = new JSDOM(`<button>${data.text}</button>`);
let messages: any = null;
dom.window.document
  .querySelector("button")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "text");
  });

dom.window.document.querySelector("button")?.click();
function onSendMessage(e: Event, node: any, index: number | string) {
  const message: IMessage = {
    header: {
      src: "",
      dst: "",
      srcType: e.type,
      dstType: "",
    },
    body: cloneDeep(data),
  };
  messages = message;
  return message;
}

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-text",
    type: "按钮",
    text: "按钮",
    group: ["按钮"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "按钮组件,可以记录写按钮信息",
    options: {
      text: "按钮框测试",
    },
    schema: {
      eventSpecification: {
        inputEvent: [
          {
            text: "更改组件数据",
            eventType: "changeInfo",
            messageSchema: "",
            messageDemo: "",
          },
        ],
        outputEvent: [
          {
            text: "组件点击数据",
            eventType: "change",
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
    },
    _eventSpecification: {
      inputEvent: [
        {
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        },
      ],
      inputCustomEvent: [
        {
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        },
      ],
      outputEvent: [
        {
          text: "组件点击数据",
          eventType: "click",
          messageSchema: "",
          messageDemo: "文本数据1",
        },
      ],
    },
    eventSpecification: {
      inputEvent: [
        {
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        },
      ],
      inputCustomEvent: [
        {
          text: "更改组件数据",
          eventType: "changeInfo",
          messageSchema: "",
          messageDemo: "",
        },
      ],
      outputEvent: [
        {
          text: "组件点击数据",
          eventType: "click",
          messageSchema: "",
          messageDemo: "文本数据1",
        },
      ],
    },
    _onMessageMeta: {},
    _onDOMEvent: {},
    _onWatchSetting: {},
    onMessageMeta: {},
    onDOMEvent: {},
    onWatchSetting: {},
  });
  return model;
};
describe("测试Model初始化", () => {
  test("对initModel函数进行测试", () => {
    initModel();
    Object.keys(Ischemas).forEach((item) => {
      expect(model).toHaveProperty(item);
    });
  });
});

// 进行click的事件监听
describe("测试dom点击事件传递Messge", () => {
  test("对handleChange dom点击事件进行测试", () => {
    dom.window.document.querySelector("button")?.click();
    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: { text: "按钮测试" },
    });
  });
});
