import { expect, describe, test } from "vitest";
import { IMessage, ISchema } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { IQinputOptions } from "./IQInput";
import { JSDOM } from "jsdom";
import { html } from "lit";
import { cloneDeep } from "lodash-es";

// render函数测试 是否获取data数据

const data: IQinputOptions = { text: "文本输入测试" };
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
    expect(initModel()).toEqual({
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
  });
});

// clickFont函数测试 是否发送消息
const dom = new JSDOM(`<input>测试文本</input>`);
let messages: null = null;
dom.window.document
  .querySelector("input")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "text");
  });

function onSendMessage(e: Event, node: any, index: number | string) {
  // dom.window.document.querySelector("p")?.click();
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
    dom.window.document.querySelector("input")?.click();
    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: { text: "文本输入测试" },
    });
  });
});
