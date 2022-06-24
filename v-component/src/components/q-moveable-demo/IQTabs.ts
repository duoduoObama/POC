import { IComponent } from "../../types/IComponent";

export interface IQTabs extends IComponent {
    options: IQTabsOptions,
    optionsView: {
        //利用动态表单机制描述的options的设置设定
        // 动态表单
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
            }
        ]
    },
}

export interface IQTabsOptions {
    tabs: IQTabsTab[],
}

interface IQTabsTab {
    title: string,
    id: string,
}