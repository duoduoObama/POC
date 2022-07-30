import { expect, describe, test } from "vitest";
import { IMessage, ISchema, Ischemas } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { IQtextOptions } from "./IQText";
import { JSDOM } from "jsdom";
import { cloneDeep } from "lodash-es";

// render函数测试 是否获取data数据
const data: IQtextOptions = { text: "文本测试" };
const render = () => {
  const { text } = data;
  return text;
};
describe.skip("测试render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual("文本测试");
  });
});

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-text",
    type: "文本",
    text: "文本",
    group: ["文本"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "文本组件,可以编写文字信息",
    options: {
      text: "文本输入框测试",
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
describe.skip("测试Model初始化", () => {
  test("对initModel函数进行测试", () => {
    initModel();
    Object.keys(Ischemas).forEach((item) => {
      expect(model).toHaveProperty(item);
    });
  });
});

// clickFont函数测试 是否发送消息
const dom = new JSDOM(`<p>测试文本</p>`);
let messages: any = null;
dom.window.document.querySelector("p")?.addEventListener("click", function (e) {
  return onSendMessage(e, data, "text");
});

dom.window.document.querySelector("p")?.click();
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

// 进行click的事件监听
describe.skip("测试dom点击事件传递Messge", () => {
  test("对clickFont dom点击事件进行测试", () => {
    dom.window.document.querySelector("p")?.click();

    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: { text: "文本测试" },
    });
  });
});

// 测试类型
describe.skip("测试model是否属于", () => {
  test("对属性测试进行", () => {
    const obj = {
      componentName: "曹義伟",
      id: 123,
      type: "123",
      text: "123",
    };
    // 用于判断是否满足key列表
    let flag = true;

    Object.keys(Ischemas).length
      ? Object.keys(Ischemas).forEach((item) => {
          if (!Object.keys(obj).includes(item)) flag = false;
        })
      : null;
    expect(flag).toEqual(true);
  });
});

// 判断属性
const johnInvoice = {
  isActive: true,
  customer: {
    first_name: "John",
    last_name: "Doe",
    location: "China",
  },
  total_amount: 5000,
  items: [
    {
      type: "apples",
      quantity: 10,
    },
    {
      type: "oranges",
      quantity: 5,
    },
  ],
};

const obj = {
  componentName: "曹義伟",
  id: 123,
  type: "123",
  text: "123",
  group: "string",
  createTime: "Date",
  image: "string",
  initStyle: "string",
  description: "string",
  options: "any",
  schema: "ICustomSchema",
  onMessageMeta: "IMessageMeta",
  onDOMEvent: "IDOMEventMeta",
  onWatchSetting: "IWatchSetting",
};
test.skip("测试是否满足属性设置", () => {
  Object.keys(Ischemas).forEach((item) => {
    expect(obj).toHaveProperty(item);
  });
});
