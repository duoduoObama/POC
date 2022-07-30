/**
 * 高亮
 * @param {*}
 * {
 *  element 高亮元素
 * }
 */
function sendFocusMsg(element) {
  let { data } = element.dataset;
  data = JSON.parse(data);
  if (data.name.includes("jz") && data.type === "chart") {
    let paramList;
    const { write_info = "{}", result_info = "{}" } = $("html").data("pageInfo");
    ({ wid, url, returnAddress, workflowId, workflowName } = JSON.parse(write_info));
    paramList = typeof data.paramList === "string" ? JSON.parse(data.paramList) : data.paramList;
    const nodeId = paramList.filter((it) => it.key === "nodeid")[0].default;
    const isParent = openWindow.isExist("parent");
    if (!isParent && returnAddress) {
      openWindow.openNewWindow(returnAddress, {
        Single: true,
        workflowId: workflowId,
        showMenuTag: nodeId,
      });
    }
    openWindow.sendMessage("parent", {
      Single: true,
      workflowId: workflowId,
      showMenuTag: nodeId,
    });
    if (isParent) window.opener.focus();
  }
}

/**
 * 高亮
 * @param {*}
 * {
 *  Single: true,
 *  flowId: 分析流ID,
 *  showMenuTag: 高亮节点ID,
 * }
 */
function getFocusMsg(data = {}) {
  const { showMenuTag } = data;
  if (!showMenuTag) return;
  const allcoms = vm.$data.componentsArr;
  let result = [];
  allcoms.length &&
    (result = allcoms
      .filter((it) => it.data.name.includes("jz"))
      .filter((it) => {
        typeof it.data.paramList === "string" && (it.data.paramList = JSON.parse(it.data.paramList));
        const result = it.data.paramList.length && it.data.paramList.filter((it) => it.key === "nodeid");
        return result.length && result[0].default === showMenuTag;
      }));
  if (result && result.length) {
    let count = 0,
      timer = setInterval(() => {
        if (count > 1) clearInterval(timer);
        $(`#${result[0].id}`)[0].style.outline = "red solid 5px";

        setTimeout(() => {
          $(`#${result[0].id}`)[0].style.outline = "#d9d9d9 solid 1px";
        }, 300);
        count++;
      }, 500);
  } else {
    // antd.message.warning("选中组件未在画布中");
  }
}
if (store.state.editMode === "edit") {
  openWindow.readyComplete(true);
  openWindow.receiveFn(getFocusMsg);
}
