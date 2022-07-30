(function () {
  // 转化为 key value
  const getParamListData = (paramList = []) => {
    return paramList.reduce((pre, cur) => {
      const { key, default: value } = cur;
      pre[key] = value;
      return pre;
    }, {});
  };

  /**
   * 组件初始化
   */
  const inputItems = $.makeArray($("[data-element-type='q-input']"));
  inputItems.map((element) => {
    const inputEle = element.querySelector(".q-input-text");
    const data = JSON.parse(element.dataset.data);
    if (inputEle) {
      inputEle.value = data.options;
    }
    if (vm && vm.editMode === "edit") {
      inputEle.disabled = true;
    } else {
      inputEle.disabled = false;
    }

    element.getComponentData ? void 0 : (element.getComponentData = getQInput);
    element.setComponentData ? void 0 : (element.setComponentData = setQInput);
    element.resetComponentData ? void 0 : (element.resetComponentData = resetQInput);
  });

  /**
   * 监听input框change事
   */
  let inputTimeout = null;
  const inputItemChange = function () {
    const inputItems = $.makeArray($(".q-input-text"));
    clearTimeout(inputTimeout);
    if (inputItems.length) {
      $(".q-input-text")
        .off("input")
        .on("input", function (e) {
          const parentInput = $(e.currentTarget).parents("[data-element-type='q-input']")[0];
          console.log("parentInput", parentInput);
          const data = JSON.parse(parentInput.dataset.data);

          data.options = e.currentTarget.value;

          $(parentInput).attr("data-data", JSON.stringify(data));

          // 分发自定义change事件
          const event = new CustomEvent("onvaluechange", { detail: parentInput.getComponentData() });
          parentInput.addEventListener("onvaluechange", function (e) {
            console.log("e", e);
          });
          parentInput.dispatchEvent(event);
        });
    } else {
      inputTimeout = setTimeout(() => {
        inputItemChange();
      }, 1000);
    }
  };
  inputItemChange();

  /**
   * 重置input数据
   * @param this 组件DOM节点
   */
  function resetQInput() {
    const data = JSON.parse(this.dataset.data);
    const inputEle = this.querySelector(".q-input-text");
    if (inputEle) {
      inputEle.value = "";
    }
    data.options = "";
    $(this).attr("data-data", JSON.stringify(data));
  }

  /**
   * 获取input数据
   * @param this 组件DOM节点
   */
  function getQInput() {
    const data = JSON.parse(this.dataset.data);
    let paramList = data.paramList;
    if (typeof paramList === "string") {
      paramList = JSON.parse(paramList);
    }
    const tempParamList = getParamListData(paramList);
    const temp = {};
    if (tempParamList.key) {
      temp[tempParamList.key] = data.options;
    } else {
      temp["QInput"] = data.options;
    }
    return temp;
  }

  /**
   * 设置input数据
   * @param this 组件DOM节点
   */
  function setQInput(value) {
    if (typeof value !== "string") {
      console.error("QInput-Error: 请传入正确的数据结构");
      return;
    }
    const data = JSON.parse(this.dataset.data);
    const inputEle = this.querySelector(".q-input-text");
    if (inputEle) {
      inputEle.value = String(value);
    }
    data.options = String(value);
    $(this).attr("data-data", JSON.stringify(data));
  }
})();
