import { obEvents } from "../util/rx";
import { message } from "ant-design-vue";

let globalData = {
  form: {},
  form2: {},
  upload: {},
  current: 0,
  search: "",
  dataKey: "",
};

function sendMessage(eventBus) {
  eventBus.forEach((item) => {
    obEvents.obSubject.next({
      sender: "drag-1f4qb6md6zms",
      receiver: item.receiver,
      header: { dst: item.dst },
      eventData: [],
      replyStatus: false,
      reply: [],
      body: item.body ? item.body : {},
    });
  });
}

function init() {
  const eventBus = [
    { receiver: "drag-qaum3hl75hay", dst: ["resetForm"] },
    { receiver: "drag-mbj3tow1sl7t", dst: ["resetForm"] },
    { receiver: "drag-tgi67v1gtfsy", dst: ["clearOptions"] },
    {
      receiver: "drag-qammlu475hay",
      dst: ["changeCurrent"],
      body: { current: 0 },
    },
    {
      receiver: "drag-c32qheh3evp6",
      dst: ["changeDisable"],
      body: { disabled: true },
    },
    {
      receiver: "drag-vwzbynxadx9w",
      dst: ["changeDisable"],
      body: { disabled: false },
    },
  ];
  sendMessage(eventBus);
  globalData.form = {};
  globalData.form2 = {};
  globalData.upload = {};
  globalData.current = 0;
  globalData.dataKey = "";
  window.location.replace("#/form");
}

function getTableData() {
  let tableData = localStorage.getItem("tableData");
  let eventBus = [];
  try {
    if (typeof tableData === "string") {
      tableData = JSON.parse(tableData);
    }
    if (globalData.search !== "") {
      tableData = tableData.filter(
        (item) =>
          item.username == globalData.search || item.age == globalData.search
      );
    }
  } catch (error) {
    tableData = [];
  }
  eventBus = [
    {
      receiver: "drag-30r9wx1pmdtl",
      dst: ["changeOptions"],
      body: { tableData },
    },
  ];
  sendMessage(eventBus);
  window.location.replace("#/table");
}

function nextBtn() {
  let eventBus = [];
  switch (globalData.current) {
    case 0:
      eventBus = [{ receiver: "drag-qaum3hl75hay", dst: ["submit"] }];
      sendMessage(eventBus);
      break;
    case 1:
      eventBus = [{ receiver: "drag-mbj3tow1sl7t", dst: ["submit"] }];
      sendMessage(eventBus);
      break;
  }
}

function prevBtn() {
  let eventBus = [];
  switch (globalData.current) {
    case 1:
      eventBus = [
        {
          receiver: "drag-qammlu475hay",
          dst: ["changeCurrent"],
          body: { current: 0 },
        },
      ];
      sendMessage(eventBus);
      break;
    case 2:
      eventBus = [
        {
          receiver: "drag-qammlu475hay",
          dst: ["changeCurrent"],
          body: { current: 1 },
        },
      ];
      sendMessage(eventBus);
      break;
  }
}

function formSubmit(eventInfo) {
  let eventBus = [];
  globalData.form = eventInfo.options;
  eventBus = [
    {
      receiver: "drag-qammlu475hay",
      dst: ["changeCurrent"],
      body: { current: 1 },
    },
  ];
  sendMessage(eventBus);
}

function form2Submit(eventInfo) {
  let eventBus = [];
  globalData.form2 = eventInfo.options;
  eventBus = [
    {
      receiver: "drag-qammlu475hay",
      dst: ["changeCurrent"],
      body: { current: 2 },
    },
  ];
  sendMessage(eventBus);
}

function stepChange(eventInfo) {
  let eventBus = [];
  globalData.current = eventInfo.options.current;
  switch (globalData.current) {
    case 0:
      eventBus = [
        {
          receiver: "drag-c32qheh3evp6",
          dst: ["changeDisable"],
          body: { disabled: true },
        },
        {
          receiver: "drag-vwzbynxadx9w",
          dst: ["changeDisable"],
          body: { disabled: false },
        },
      ];
      sendMessage(eventBus);
      window.location.replace("#/form");
      break;
    case 1:
      eventBus = [
        {
          receiver: "drag-c32qheh3evp6",
          dst: ["changeDisable"],
          body: { disabled: false },
        },
        {
          receiver: "drag-vwzbynxadx9w",
          dst: ["changeDisable"],
          body: { disabled: false },
        },
      ];
      sendMessage(eventBus);
      window.location.replace("#/form2");
      break;
    case 2:
      eventBus = [
        {
          receiver: "drag-c32qheh3evp6",
          dst: ["changeDisable"],
          body: { disabled: false },
        },
        {
          receiver: "drag-vwzbynxadx9w",
          dst: ["changeDisable"],
          body: { disabled: true },
        },
      ];
      sendMessage(eventBus);
      window.location.replace("#/upload");
      break;
  }
}

function upload(eventInfo) {
  globalData.upload = eventInfo.options;
}

function cancelBtn() {
  window.location.replace("#/table");
}

function finishBtn() {
  if (!globalData.upload.avatar) {
    message.error("请上传头像!");
    return;
  }
  if (
    Object.keys(globalData.form).length === 0 ||
    Object.keys(globalData.form2).length === 0
  ) {
    message.error("信息缺失,请重新添加!");
    return;
  }
  if (globalData.dataKey === "") {
    const data = {
      key: guid(),
      ...globalData.form,
      ...globalData.form2,
      ...globalData.upload,
    };
    let tableData = localStorage.getItem("tableData");
    try {
      if (typeof tableData === "string") {
        tableData = JSON.parse(tableData);
      }
      tableData.unshift(data);
      localStorage.setItem("tableData", JSON.stringify(tableData));
    } catch (error) {
      tableData = [];
      tableData.unshift(data);
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  } else {
    const data = {
      key: globalData.dataKey,
      ...globalData.form,
      ...globalData.form2,
      ...globalData.upload,
    };
    let tableData = localStorage.getItem("tableData");
    try {
      if (typeof tableData === "string") {
        tableData = JSON.parse(tableData);
      }
      tableData = tableData.map((item) => {
        if (item.key === globalData.dataKey) {
          item = data;
        }
        return item;
      });
      localStorage.setItem("tableData", JSON.stringify(tableData));
    } catch (error) {
      tableData = [];
      tableData.unshift(data);
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  }
  getTableData();
}

function search(eventInfo) {
  globalData.search = eventInfo.options.text;
  getTableData();
}

function tableEvent(eventName, eventInfo) {
  switch (eventName.type) {
    case "delete":
      try {
        let tableData = localStorage.getItem("tableData");
        if (typeof tableData === "string") {
          tableData = JSON.parse(tableData);
        }

        tableData = tableData.filter((item) => item.key !== eventName.data.key);
        localStorage.setItem("tableData", JSON.stringify(tableData));
        getTableData();
      } catch (error) {}
      break;
    case "change":
      const {
        key,
        username,
        pass,
        checkPass,
        age,
        province,
        admin,
        group,
        tags,
        rate,
        avatar,
      } = eventName.data;
      const eventBus = [
        {
          receiver: "drag-qaum3hl75hay",
          dst: ["resetForm", "changeOptions"],
          body: { username, pass, checkPass, age },
        },
        {
          receiver: "drag-mbj3tow1sl7t",
          dst: ["resetForm", "changeOptions"],
          body: { province, admin, group, tags, rate },
        },
        {
          receiver: "drag-tgi67v1gtfsy",
          dst: ["changeOptions"],
          body: { avatar },
        },
        {
          receiver: "drag-qammlu475hay",
          dst: ["changeCurrent"],
          body: { current: 0 },
        },
        {
          receiver: "drag-c32qheh3evp6",
          dst: ["changeDisable"],
          body: { disabled: true },
        },
        {
          receiver: "drag-vwzbynxadx9w",
          dst: ["changeDisable"],
          body: { disabled: false },
        },
      ];
      sendMessage(eventBus);
      globalData.form = {};
      globalData.form2 = {};
      globalData.upload = { avatar };
      globalData.current = 0;
      globalData.dataKey = eventName.data.key;
      break;
  }
}

function pageScript(eventName, eventInfo) {
  // console.log(eventName, eventInfo);
  switch (eventInfo.id) {
    case "drag-vwzbynxadx9w":
      // 下一步按钮，发送消息校验表单
      nextBtn();
      break;
    case "drag-c32qheh3evp6":
      // 上一步按钮，改变step
      prevBtn();
      break;
    case "drag-1f4qb6md6zms":
      // 新增时初始化step流程所有组件
      init();
      break;
    case "drag-qaum3hl75hay":
      // 表单1，校验完成后改变step
      formSubmit(eventInfo);
      break;
    case "drag-mbj3tow1sl7t":
      // 表单2，校验完成后改变step
      form2Submit(eventInfo);
      break;
    case "drag-qammlu475hay":
      // step，切换current后去改变上一步、下一步按钮状态，并切换路由
      stepChange(eventInfo);
      break;
    case "drag-tgi67v1gtfsy":
      // 图片选择，将数据保存到全局变量上
      upload(eventInfo);
      break;
    case "drag-8iv4dcr4hkcd":
      // 取消按钮
      cancelBtn();
      break;
    case "drag-2v2e2ryqw18z":
      // 完成按钮
      finishBtn();
      break;
    case "drag-mhpa3phtwnb9":
      // 搜索
      search(eventInfo);
      break;
    case "drag-30r9wx1pmdtl":
      // 表格，修改、删除信息
      tableEvent(eventName, eventInfo);
      break;
  }
}

function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export { pageScript, getTableData };
