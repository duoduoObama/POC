import { JSDOM } from "jsdom";
import { cloneDeep } from "lodash-es";
import { expect, describe, test } from "vitest";
import { IMessage, ISchema, Ischemas } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { IQImageOptions } from "./IQImage";
import gl from "./q-echarts-gl.json";

// render函数测试 是否获取data数据
const data: IQImageOptions = {
  src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
  imageType: "fill",
};
const render = () => {
  const { src, imageType } = data;
  return { src, imageType };
};
describe.skip("测试render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual({
      src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
      imageType: "fill",
    });
  });
});

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-image",
    type: "媒体",
    text: "图片",
    group: ["媒体"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "文本组件,可以编写文字信息",
    options: {
      src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
      imageType: "fill",
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
describe("测试Image Model初始化", () => {
  test("对Image initModel函数进行测试", () => {
    initModel();
    Object.keys(Ischemas).forEach((item) => {
      expect(model).toHaveProperty(item);
    });
  });
});

// clickImage函数测试 是否发送消息
const dom = new JSDOM(`<img src="${data.src}">`);
let messages: any = null;
dom.window.document
  .querySelector("img")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "image");
  });
dom.window.document.querySelector("img")?.click();

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
describe("测试image dom点击事件传递Messge", () => {
  test("对clickFont dom点击事件进行测试", () => {
    dom.window.document.querySelector("p")?.click();
    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: {
        src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR 0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+",
        imageType: "fill",
      },
    });
  });
});
