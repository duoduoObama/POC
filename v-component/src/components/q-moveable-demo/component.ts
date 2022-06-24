import { IQTabs } from "./IQTabs";

export const component: IQTabs = {
    id: "",
    componentName: "q-table",
    type: "容器",
    text: "选项卡",
    group: ["容器"],
    createTime: new Date(),
    image: "",
    initStyle: "",
    description: "",
    eventSpecification: {
        inputEvent: [
            { text: "更改组件数据", eventType: "changeInfo", messageSchema: "", messageDemo: "" }
        ],
        outputEvent: [
            { text: "切换选项卡", eventType: "switchTAB", messageSchema: "", messageDemo: "" },
        ]
    },
    options: {
        tabs: [
            { title: "功能一", id: "tab1" }
        ]
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
                model: "title",
                key: "title",
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
                model: "id",
                key: "id",
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