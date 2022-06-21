import { IComponent } from "../../types/IComponent";

export interface IQDataSource extends IComponent {
  options: IQDataSourceOptions;
  optionsView: {
    //利用动态表单机制描述的options的设置设定
    // 动态表单
    list: [
      {
        type: "input";
        label: "输入框";
        options: {
          type: "text";
          width: "100%";
          defaultValue: "";
          placeholder: "请输入";
          clearable: false;
          maxLength: 0;
          prepend: "";
          append: "";
          tooptip: "";
          hidden: false;
          disabled: false;
          dynamicHide: false;
          dynamicHideValue: "";
        };
        model: "input_1645156477415";
        key: "input_1645156477415";
        rules: [
          {
            required: false;
            message: "必填项";
            trigger: ["blur"];
          }
        ];
      },
      {
        type: "textarea";
        label: "文本框";
        options: {
          width: "100%";
          maxLength: 0;
          defaultValue: "";
          rows: 4;
          clearable: false;
          tooptip: "";
          hidden: false;
          disabled: false;
          placeholder: "请输入";
          dynamicHide: false;
          dynamicHideValue: "";
        };
        model: "textarea_1645156477415";
        key: "textarea_1645156477415";
        rules: [
          {
            required: false;
            message: "必填项";
            trigger: ["blur"];
          }
        ];
      }
    ];
  };
}

export interface IQDataSourceOptions {
  dataSource: IQDataItem[];
}

interface IQDataItem {
  requestType: string;
  sourceId: string;
  autoRequest: { value: any; type: string };
  requestUrl: { value: any; type: string };
  requestParam: {
    value: Array<{ key: string; value: any; type: string }> | string;
    type: string;
  };
  requestMethod: { value: string; type: string };
  crossDomain: { value: any; type: string };
  timeout: { value: any; type: string };
  requestHeader: {
    value: Array<{ key: string; value: any; type: string }> | string;
    type: string;
  };
  eventHandler: Array<{ key: string; title: string; value: string }>;
}
