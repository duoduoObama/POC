var l = {
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
  model: "router",
  key: "router",
  rules: [{ required: false, message: "必填项", trigger: ["blur"] }],
};
