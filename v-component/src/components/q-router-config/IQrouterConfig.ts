import { IComponent } from "../../types/IComponent";

export interface IQrouterConfig extends IComponent {
  options: IQRouterConfigOptions[];
  optionsView: {
    // 利用动态表单机制描述的options的设置设定
    // 动态表单
    list: [
      {
        type: "textarea";
        label: "文本框";
        options: {
          width: "100%";
          maxLength: number;
          defaultValue: string;
          rows: number;
          clearable: boolean;
          tooptip: string;
          hidden: boolean;
          disabled: boolean;
          placeholder: "请输入";
          dynamicHide: boolean;
          dynamicHideValue: string;
        };
        model: "router";
        key: "router";
        rules: [{ required: boolean; message: "必填项"; trigger: ["blur"] }];
      }
    ];
  };
}

export interface IQRouterConfigOptions {
  router: { [key: string]: any };
}

interface IConfig {
  title: string;
  target: string;
  trigger: any[];
  receive: IConfigReceive[];
}

interface IConfigReceive {
  source: string;
  event: any[];
  script: string;
  replyStatus: boolean;
  reply: any[];
}
