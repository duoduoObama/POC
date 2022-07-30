import { expect, describe, test } from "vitest";
import { IMessage, ISchema, Ischemas } from "../../types/IComponent";
import { deepWatchModelProxy } from "../../util/utils";
import { JSDOM } from "jsdom";
import { cloneDeep } from "lodash-es";
import { IQvideoOptions } from "./IQVideo";

// render函数测试 是否获取data数据
const data: IQvideoOptions = {
  src: "https://www.runoob.com/try/demo_source/movie.mp4",
};
const render = () => {
  const { src } = data;
  return src;
};
describe("测试render函数", () => {
  test("对render函数进行测试", () => {
    expect(render()).toEqual(
      "https://www.runoob.com/try/demo_source/movie.mp4"
    );
  });
});

// initModel函数测试 深度监听
let model!: ISchema;
const initModel = function (this: any) {
  model = deepWatchModelProxy({
    id: "",
    componentName: "q-radio",
    type: "视频",
    text: "视频",
    group: ["视频"],
    createTime: "2022-07-14T05:48:36.830Z",
    image: "",
    _initStyle: "",
    initStyle: "",
    description: "视频组件,可以编写文字信息",
    options: {
      text: "视频测试",
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
  `
     <video src=${data.src}>您的浏览器不支持</video>
    `
);
let messages: any = null;

dom.window.document
  .querySelector("video")
  ?.addEventListener("click", function (e) {
    return onSendMessage(e, data, "text");
  });

dom.window.document.querySelector("video")?.click();
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
    dom.window.document.querySelector("video")?.click();
    expect(messages).toEqual({
      header: { src: "", dst: "", srcType: "click", dstType: "" },
      body: {
        src: "https://www.runoob.com/try/demo_source/movie.mp4",
      },
    });
  });
});
