import { expect, describe, test } from "vitest";
import { IMessage, ISchema } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import gl from "./q-echarts-gl.json";

import { JSDOM } from "jsdom";
import { html } from "lit";
import { cloneDeep } from "lodash-es";

// render函数测试 是否获取data echarts图像数据数据
const data: any = Object.freeze(gl);
const render = () => {
  return data;
};
describe("测试render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual(gl);
  });
});

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-echarts-gl",
    type: "图元",
    text: "图元",
    group: ["gl图元"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "文本组件,可以编写文字信息",
    options: {
      text: "文本输入框测试",
    },
    iovSchema: {
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
            rules: [{ required: false, message: "必填项", trigger: ["blur"] }],
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

describe("测试Echart Model初始化", () => {
  test("对Echart initModel函数进行测试", () => {
    expect(initModel()).toEqual({
      id: "",
      componentName: "q-echarts-gl",
      type: "图元",
      text: "图元",
      group: ["gl图元"],
      createTime: "2022-07-14T05:48:36.830Z",
      image: "",
      _initStyle: "",
      initStyle: "",
      description: "文本组件,可以编写文字信息",
      options: {
        text: "文本输入框测试",
      },
      iovSchema: {
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
                { required: false, message: "必填项", trigger: ["blur"] },
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
