/**
 * 选择图例胶水代码
 * @param {*} param0
 */
function switchLocalComponent({ nodes } = {}) {
  const { id, componentName, targetRoot } = nodes;
  const convert = componentsConvert[componentName];
  // 是否存在转换逻辑
  if (convert) {
    const convertInfo = convert(nodes);
    Object.assign(nodes, convertInfo);
  }
  const targetComponentArr = targetRoot === "#inner-dropzone" ? vm.componentsArr : vm.componentsHideArr;
  targetComponentArr.push({
    name: componentName,
    data: nodes,
    id,
    targetId: nodes.targetId,
  });
  return id;
}

function switchLocalBottomComponent({ element, name, nodes } = {}) {
  const { id, targetRoot } = nodes;
  const targetComponentArr = targetRoot === "#inner-dropzone" ? vm.componentsArr : vm.componentsHideArr;
  switch (name) {
    case `API接口数据`:
      targetComponentArr.push({
        name: `q-api-button`,
        data: nodes,
        style: element.style,
        id,
        targetId: nodes.targetId,
      });
      return id;
    case `数据库表数据`:
      targetComponentArr.push({
        name: `q-database-button`,
        data: nodes,
        style: element.style,
        id,
        targetId: nodes.targetId,
      });
      return id;
    default:
      targetComponentArr.push({
        name: `q-dynamic-icon`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
  }
}
/**
 * 选择元件胶水代码
 * @param {*} param0
 */
function switchNgComponent({ element, nodes, name, childList } = {}) {
  const { id, targetRoot } = nodes;
  const targetComponentArr = targetRoot === "#inner-dropzone" ? vm.componentsArr : vm.componentsHideArr;

  switch (name) {
    case `jz-option-panel`:
      nodes.elementType = `jz-option-panel`;
      nodes.classList = childList;
      targetComponentArr.push({
        name: `q-tabs`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
    case `jz-tab-panel`:
      nodes.elementType = `jz-tab-panel`;
      nodes.classList = childList;
      targetComponentArr.push({
        name: `q-tabs`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
    case `jz-panel`:
      targetComponentArr.push({
        name: `q-panel`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
    case `jz-pop-panel`:
      nodes.childrenElement = [];
      targetComponentArr.push({
        name: `q-pop-panel`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
    case `jz-step`:
    case `jz-button`:
      targetComponentArr.push({
        name: `q-button`,
        data: nodes,
        id,
        targetId: nodes.targetId,
      });
      return id;
    default:
      if (nodes.legend) {
        targetComponentArr.push({
          name: `q-deep-chart`,
          data: nodes,
          id,
          targetId: nodes.targetId,
        });
        return id;
      } else {
        targetComponentArr.push({
          name: `q-static-pic`,
          data: nodes,
          id,
          targetId: nodes.targetId,
        });
        return id;
      }
  }
}

function switchNgBottomComponent({ element, nodes, name } = {}) {
  const { id, targetRoot } = nodes;
  const targetComponentArr = targetRoot === "#inner-dropzone" ? vm.componentsArr : vm.componentsHideArr;
  if (nodes.legend) {
    targetComponentArr.push({
      name: `q-deep-chart`,
      data: nodes,
      id,
      targetId: nodes.targetId,
    });
    return id;
  } else {
    targetComponentArr.push({
      name: `q-static-pic`,
      data: nodes,
      id,
      targetId: nodes.targetId,
    });
    return id;
  }
}

/**
 * 发布
 * @param {*} ev
 */
function releaseUibuider(ev) {
  layer.open({
    title: `发布`,
    type: 1,
    anim: 2,
    area: ["315px", "240px"],
    shadeClose: true, //开启遮罩关闭
    btn: ["确定", "取消"], //按钮
    btnAlign: "c",
    content: `
      <div style="padding: 20px 40px 40px 0;" id="addParam">
        <div class="layui-form-item" style="margin-left: 17px;">
            <label class="layui-form-label" style="width:100px">发布平台：</label>
            <select id="release" style="height: 35px; width: 158px;"> 
              <option value="1">DI平台</option>
              <option value="2">应用</option>
            </select>
        </div> 
      </div> 
      `,
    yes: function (index, layero) {
      const releaseNumber = $("#release").val();
      const id = getQueryVariable("id");
      switch (releaseNumber) {
        case "1":
          release(() => {
            if (id) {
              saveInfo("update");
            }
          });
          break;
        case "2":
          releaseCharts((data) => {
            if (id) {
              saveInfo("update", data.data).then((res) => {
                window.open(
                  `./dist/index.html?id=${id}&time=${Date.now()}`,
                  "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
                );
              });
            }
          });
          break;
      }
      layer.close(index);
    },
  });
}
