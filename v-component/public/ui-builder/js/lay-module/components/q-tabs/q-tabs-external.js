// di和ui-builder脱离组件控制折叠代码
(function () {
  const getParamListData = (paramList = []) => {
    return paramList.reduce((pre, cur) => {
      const { key, default: value } = cur;
      pre[key] = value;
      return pre;
    }, {});
  };
  window.setTimeout(function () {
    $(".q-tabs-toogle-direction")
      .off()
      .on("click", function (e) {
        const content = e.target.parentElement.parentElement.parentElement.parentElement;
        const header = e.target.parentElement.parentElement;
        let { paramList = [] } = JSON.parse(content.dataset.data);

        try {
          if (typeof paramList === `string`) {
            paramList = JSON.parse(paramList);
          }
        } catch (error) {
          paramList = [];
        }
        const paramListData = getParamListData(paramList);
        const { position: bakPosition, isShow: bakIsShow } = paramListData;
        if (!bakPosition || !bakIsShow) {
          paramList = [
            ...paramList,
            ...[
              {
                key: "position",
                title: "(UIB)收缩方向",
                default: "top",
              },
              {
                key: "oldValue",
                title: "(UIB)高宽,宽度",
                default: 0,
              },
              {
                key: "isShow",
                title: "(UIB)默认显示",
                default: "open",
              },
            ],
          ];
        }
        const { position, oldValue, isShow } = getParamListData(paramList);
        const isOpen = isShow === "open";
        console.log({ position, oldValue, isShow });
        switch (position) {
          case "top":
            if (isOpen) {
              Object.assign(paramList.find((c) => c.key === "oldValue") || {}, { default: $(content).height() });
              $(content).height($(header).height());
            } else {
              $(content).height(oldValue);
            }
            break;
          case "left":
            if (isOpen) {
              Object.assign(paramList.find((c) => c.key === "oldValue") || {}, { default: $(content).width() });
              $(content).width($(header).width());
            } else {
              $(content).width(oldValue);
            }
            break;
        }
        Object.assign(paramList.find((c) => c.key === "isShow") || {}, {
          default: isOpen ? "close" : "open",
        });
        const dataRef = JSON.parse(content.dataset.data);
        dataRef.paramList = paramList;
        content.dataset.data = JSON.stringify(dataRef);
      });
  }, 2000);
})();
