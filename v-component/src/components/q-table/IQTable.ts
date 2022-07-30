import { IComponent } from "../../types/IComponent";

export interface IQTable extends IComponent {
  options: IQTableOptions;
  optionsView: {
    // 利用动态表单机制描述的options的设置设定
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
        model: "columns";
        key: "columns";
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
        model: "dataSource";
        key: "dataSource";
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
        model: "operation";
        key: "operation";
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
        model: "pagination";
        key: "pagination";
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
        model: "scroll";
        key: "scroll";
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
  eventSpecification: {
    inputEvent: [
      {
        text: "更改组件数据";
        eventType: "changeInfo";
        messageSchema: "";
        messageDemo: "";
      }
    ];
    outputEvent: [
      { text: "编辑"; eventType: "edit"; messageSchema: ""; messageDemo: "" },
      { text: "删除"; eventType: "delete"; messageSchema: ""; messageDemo: "" }
    ];
  };
}

export interface IQTableOptions {
  columns: Array<{ [key: string]: any }>;
  dataSource: Array<{ [key: string]: any }>;
  operation?: { [key: string]: any };
  pagination?: IPagination;
  scroll?: {
    x: number;
    y: number;
  };
}

export interface IPagination {
  current: number;
  pageSize: number;
  total: number;
  [key: string]: number | string;
}
