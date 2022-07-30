import { expect, describe, test } from "vitest";
import { IMessage, ISchema, Ischemas } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { IQCheckboxOptions } from "./IQChecklbox";
import { JSDOM } from "jsdom";
import { cloneDeep } from "lodash-es";

// render函数测试，是否获取data数据
const data: IQCheckboxOptions = {
  list: [
    { id: 1, value: "check1", name: "check" },
    { id: 2, value: "check2", name: "check" },
    { id: 3, value: "check3", name: "check" },
  ],
};

const render = () => {
  const { list } = data;
  return list;
};

// render函数测试 是否获取data数据
describe("测试checkbox render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual([
      { id: 1, value: "check1", name: "check" },
      { id: 2, value: "check2", name: "check" },
      { id: 3, value: "check3", name: "check" },
    ]);
  });
});
// initModel函數测试 深度监听
let model: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-checkbox",
    type: "复选框",
    text: "复选框",
    group: ["复选框"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "复选框组件,可以编写文字信息",
    options: {
      text: "复选框输入框测试",
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
            label: "颜色选择输入框",
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

// change函数测试 是否发送dom消息
const dom =
  new JSDOM(`<input type="checkbox" name="check" value="check1">选项一</input>
             <input type="checkbox" name="check" value="check1">选项一</input>
             <input type="checkbox" name="check" value="check1">选项一</input>`);
let messages: any = null;
dom.window.document
  .querySelector("input")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "checkbox");
  });

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
describe("测试dom点击事件传递Messge", () => {
  test("对clickFont dom点击事件进行测试", () => {
    dom.window.document.querySelector("input")?.click();

    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: {
        list: [
          { id: 1, value: "check1", name: "check" },
          { id: 2, value: "check2", name: "check" },
          { id: 3, value: "check3", name: "check" },
        ],
      },
    });
  });
});
