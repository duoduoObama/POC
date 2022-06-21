import { IQImage } from "./IQImage";

export const component: IQImage = {
    id: "",
    componentName: "q-image",
    type: "媒体",
    text: "图片",
    group: ["媒体"],
    createTime: new Date(),
    image: "",
    initStyle: "",
    description: "",
    eventSpecification: {
        inputEvent: [
            { text: "更改组件数据", eventType: "changeInfo", messageSchema: "", messageDemo: "" }
        ],
        outputEvent: [
            { text: "编辑", eventType: "edit", messageSchema: "", messageDemo: "" },
            { text: "删除", eventType: "delete", messageSchema: "", messageDemo: "" }
        ]
    },
    options: {
        src: "",
        imageType: "fill",
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
                model: "input_1645156477415",
                key: "src",
                rules: [
                    {
                        required: false,
                        message: "必填项",
                        trigger: ["blur"],
                    },
                ],
            },
            {
                type: "textarea",
                label: "文本框",
                options: {
                    width: "100%",
                    maxLength: 0,
                    defaultValue: "",
                    rows: 4,
                    clearable: false,
                    tooptip: "",
                    hidden: false,
                    disabled: false,
                    placeholder: "请输入",
                    dynamicHide: false,
                    dynamicHideValue: "",
                },
                model: "textarea_1645156477415",
                key: "imageType",
                rules: [
                    {
                        required: false,
                        message: "必填项",
                        trigger: ["blur"],
                    },
                ],
            },
        ]
    }
}