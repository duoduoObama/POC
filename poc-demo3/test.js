(function () {
  let contextmenuData = null;
  // 固定按钮
  const executeButton = [
    "偏离",
    "通联",
    "越界",
    "折返",
    "扫海",
    "停留",
    "盘旋",
    "相遇",
  ];

  // 添加JMQ消息订阅
  function addSubscribe() {
    setTimeout(() => {
      subscribeFunc();
    }, 3000);
    clearTimeout(contextmenuTimer);
    if (window.subscribe) {
      window.subscribe("selectedDataChange", subscribeFunc);
    } else {
      var contextmenuTimer = setTimeout(function () {
        addSubscribe();
      }, 1000);
    }
  }
  // 消息订阅函数，接收订阅消息
  function subscribeFunc(e) {
    contextmenuData = "盘旋,扫海" || e.tables[0].datas;
    processingLogic();
    return false;
  }
  addSubscribe();

  const getParamListData = (paramList = []) => {
    return paramList.reduce((pre, cur) => {
      const { key, default: value } = cur;
      pre[key] = value;
      return pre;
    }, {});
  };

  const processingLogic = () => {
    const target = (contextmenuData || "")
      .split(",")
      .filter((current) => current);
    const element = $("#drag-gzawh60ndtcd"); // 右键菜单
    const data = JSON.parse(element.attr("data-data"));
    let { paramList = [] } = data;
    if (_.isString(paramList)) {
      paramList = JSON.parse(paramList);
    }
    const allParamList = getParamListData(paramList);
    const { contextmenu = "[]" } = allParamList; 
    const contextmenuList = JSON.parse(contextmenu).map(({ title, id }) => ({
      title,
      id,
      isShow: target.includes(title) || executeButton.includes(title),
    }));
    const targetContext = paramList.find(({ key }) => key === "contextmenu");
    targetContext.default = JSON.stringify(contextmenuList);

    data.paramList = paramList;
    element.attr("data-data", JSON.stringify(data)).trigger("contextmenu");
  };
})();

[
  { title: "MB详情", id: "drag-e1id4ef9mxjw" },
  { title: "GJ回放", id: "drag-7rayu1ypolmy", isShow: false },
  { title: "YC详情", id: "drag-qnttak5e56oa", isShow: false },
  { title: "单MB频繁", id: "drag-r8ftg0vb6onj", isShow: false },
  { title: "单MB频繁2", id: "drag-r8ftg0vb6onj2", isShow: false },
];
