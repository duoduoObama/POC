import { html, css, LitElement, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isString } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { IComponent } from "../../types/runtime/IComponent";

import { IMessage, ISchema, Ischemas } from "../../types/IComponent";

import { deepWatchModelProxy, mergeModel } from "../../util/utils";
import { expect, describe, test } from "vitest";

import { IQPageModelOptions } from "./IQPageModel";
import { JSDOM } from "jsdom";

// render函数测试 是否获取data数据
const data: IQPageModelOptions = {
  pageModel: [],
};
const render = () => {
  const { pageModel } = data;
  return pageModel;
};
describe("测试render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual([]);
  });
});

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-text",
    type: "页面模型",
    text: "页面模型",
    group: ["页面模型"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "页面模型，用于配置页面",
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
describe("测试Model初始化", () => {
  test("对initModel函数进行测试", () => {
    initModel();
    Object.keys(Ischemas).forEach((item) => {
      expect(model).toHaveProperty(item);
    });
  });
});

// clickFont函数测试 是否发送消息
const dom = new JSDOM(
  `<div style="width: 200px; height: 200px; background-color: #3794FF; font-size: 20px">pageModel</div>`
);
let messages: any = null;
dom.window.document
  .querySelector("div")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "pageModel");
  });

dom.window.document.querySelector("p")?.click();
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

// 进行点击事件的监听
describe("测试dom点击事件传递Message", () => {
  test("对dom点击事件传递Message进行测试", () => {
    dom.window.document.querySelector("div")?.click();
    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: { pageModel: [] },
    });
  });
});
