import { IComponent } from "../../types/IComponent";

export interface IQTable extends IComponent {
    options: IQTableOptions,
    optionsView: {
        //利用动态表单机制描述的options的设置设定
        // 动态表单
        "list": [
            {
                "type": "input",
                "label": "输入框",
                "options": {
                    "type": "text",
                    "width": "100%",
                    "defaultValue": "",
                    "placeholder": "请输入",
                    "clearable": false,
                    "maxLength": 0,
                    "prepend": "",
                    "append": "",
                    "tooptip": "",
                    "hidden": false,
                    "disabled": false,
                    "dynamicHide": false,
                    "dynamicHideValue": ""
                },
                "model": "input_1645156477415",
                "key": "input_1645156477415",
                "rules": [
                    {
                        "required": false,
                        "message": "必填项",
                        "trigger": ["blur"]
                    }
                ]
            },
            {
                "type": "textarea",
                "label": "文本框",
                "options": {
                    "width": "100%",
                    "maxLength": 0,
                    "defaultValue": "",
                    "rows": 4,
                    "clearable": false,
                    "tooptip": "",
                    "hidden": false,
                    "disabled": false,
                    "placeholder": "请输入",
                    "dynamicHide": false,
                    "dynamicHideValue": ""
                },
                "model": "textarea_1645156477415",
                "key": "textarea_1645156477415",
                "rules": [
                    {
                        "required": false,
                        "message": "必填项",
                        "trigger": ["blur"]
                    }
                ]
            }
        ]
    },
}

export interface IQTableOptions {
    columns: [],
    dataSource: Array<{ [key: string]: any }>,
    operation?: [],
    pagination?: boolean,
    scroll?: {
        x: number,
        y: number
    }
} 