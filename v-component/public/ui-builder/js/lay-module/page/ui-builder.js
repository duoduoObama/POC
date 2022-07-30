let clientObject = {};
let isFocus = false;
let dropzoneElement = null;
let rulerObserver = null;
let nodesArray = [];
let eventsArray = [
  { id: 2, title: `上对齐`, icon: `arrow-up`, block: false },
  { id: 4, title: `下对齐`, icon: `arrow-down`, block: false },
  { id: 5, title: `左对齐`, icon: `arrow-left`, block: false },
  { id: 3, title: `右对齐`, icon: `arrow-right`, block: false },
  { id: 8, title: `等位宽高`, icon: `column-width`, block: false },
  { id: 6, title: `增加层级`, icon: `caret-up`, block: false },
  { id: 7, title: `降低层级`, icon: `caret-down`, block: false },
  { id: 1, title: `删除`, icon: `delete`, block: false },
];
// 导出全局变量
var lastFocusElement = null;

function interactStart() {
  if (vm.editMode !== "edit") return;
  interact(".dropzone").dropzone({
    // only accept elements matching this CSS selector
    accept: ".draggable2",
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:

    ondropactivate: (event) => {
      // add active dropzone feedback
      event.target.classList.add("drop-active");
      this.isIntoElement = true;
    },
    ondragenter: (event) => {
      const draggableElement = event.relatedTarget;
      const dropzoneElements = event.target;

      // feedback the possibility of a drop
      // dropBehaviors({ ...event });
      dropzoneElements.classList.add("drop-target");
      draggableElement.classList.add("can-drop");
    },
    ondragleave: (event) => {
      dropzoneElement = event.target;
      // remove the drop feedback style
      event.target.classList.remove("drop-target");
      event.relatedTarget.classList.remove("can-drop");
    },
    ondrop: (event) => {},
    ondropmove: (event) => {
      if (!rulerObserver) {
        rulerObserver = obEvents
          .currentSelectedPoint("ondropmove")
          .pipe(rxjs.operators.throttleTime(200))
          .subscribe((target) => {
            if ($(".focus").parent("#inner-dropzone").length) {
              vm.$emit("move", target.body, 0, 0);
            }
          });
      }
      obEvents.setSelectedPoint("ondropmove", event.relatedTarget);
    },
    ondropdeactivate: (event) => {
      // console.log(event.relatedTarget.dataset.data);

      setAttr(event.relatedTarget);
      vm.changeAttrObject();
      vm.$emit("unmove");
      // remove active dropzone feedback
      event.target.classList.remove("drop-active");
      event.target.classList.remove("drop-target");
    },
  });

  interact(".draggable2")
    .resizable({
      margin: 0,
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        start: (e) => {
          const targetId = e.target.id;
          const target = Array.from($(`#${targetId} .iframe-content`));
          target.forEach((element) => {
            $(element).css("pointer-events", "none");
          });
          removeTitleEvents();
        },
        move: updateResizable,
        end: (e) => {
          setAttr(e.target);
          vm.changeAttrObject();
          const targetId = e.target.id;
          const target = Array.from($(`#${targetId} .iframe-content`));
          target.forEach((element) => {
            $(element).css("pointer-events", "auto");
          });
          [...vm.componentsArr, ...vm.componentsHideArr].forEach((current) => {
            const { id, data } = current;
            const { id: id2 } = vm.attrObject;
            if (id === id2) {
              Object.assign(data, _.cloneDeep(vm.attrObject));
            }
          });
          vm.$store.commit("recordSnapshot");
          bindTitleEvents();
        },
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),

        // minimum size
        interact.modifiers.restrictSize({
          // min: { width: 100, height: 100 },
          //   max: {
          //     width: $("#inner-dropzone").width(),
          //     height: $("#inner-dropzone").height(),
          //   },
        }),
      ],
      inertia: true,
    })
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: false,
        }),
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      listeners: {
        start: (e) => {
          const targetId = e.target.id;
          const target = Array.from($(`#${targetId} .iframe-content`));
          target.forEach((element) => {
            $(element).css("pointer-events", "none");
          });
          removeTitleEvents();
        },
        move: dragMoveListener,
        end: (e) => {
          const targetId = e.target.id;
          const target = Array.from($(`#${targetId} .iframe-content`));
          target.forEach((element) => {
            $(element).css("pointer-events", "auto");
          });
          [...vm.componentsArr, ...vm.componentsHideArr].forEach((current) => {
            const { id, data } = current;
            const { id: id2 } = vm.attrObject;
            if (id === id2) {
              Object.assign(data, _.cloneDeep(vm.attrObject));
            }
          });
          vm.$store.commit("recordSnapshot");
          bindTitleEvents();
        },
      },
    })
    .on("doubletap", (event) => {
      event.currentTarget.getAttribute("data-index");
    });

  // 移动
  function dragMoveListener(event) {
    event.stopPropagation();
    const disabledAttrs = ["q-flow-panel", "container"];
    const { target, currentTarget } = event;
    const { elementType } = currentTarget.parentElement.dataset;

    if (disabledAttrs.includes(elementType) || vm.isSpaceKey) {
      return;
    }

    const oldx = parseFloat(target.getAttribute("data-x")),
      oldy = parseFloat(target.getAttribute("data-y"));

    // keep the dragged position in the data-x/data-y attributes
    const x = Number((parseFloat(target.getAttribute("data-x")) || 0) + event.dx).toFixed(0);
    const y = Number((parseFloat(target.getAttribute("data-y")) || 0) + event.dy).toFixed(0);
    // 多元素拖动
    if (vm.isCtrlKey) {
      const dvx = x - oldx;
      const dvy = y - oldy;
      allComsDrag({ dvx, dvy });
      return;
    }
    const { width, height } = vm.canvasStyleData;
    if (x > currentTarget.parentElement.offsetWidth || y > currentTarget.parentElement.offsetHeight) {
      return false;
    }
    const { percentOrabsolute } = vm;
    target.style.position = "absolute";
    if (percentOrabsolute === "absolute") {
      target.style.removeProperty("top");
      target.style.removeProperty("left");
      target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)";
    } else if (percentOrabsolute === "percent") {
      target.style.removeProperty("transform");
      target.style.top = ((y / target.parentElement.clientHeight) * 100).toFixed(3) + "%";
      target.style.left = ((x / target.parentElement.clientWidth) * 100).toFixed(3) + "%";
    }
    // translate the element

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
    return true;
  }

  // resize
  function updateResizable(event) {
    if (vm.isSpaceKey) {
      return;
    }
    const target = event.target;
    let x = parseFloat(target.getAttribute("data-x")) || 0;
    let y = parseFloat(target.getAttribute("data-y")) || 0;

    const { percentOrabsolute } = vm;
    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    if (percentOrabsolute === "absolute") {
      // update the element's style
      target.style.removeProperty("top");
      target.style.removeProperty("left");
      target.style.width = event.rect.width + "px";
      target.style.height = event.rect.height + "px";
    } else if (percentOrabsolute === "percent") {
      target.style.removeProperty("transform");
      target.style.width = ((event.rect.width / target.parentElement.clientWidth) * 100).toFixed(3) + "%";
      target.style.height = ((event.rect.height / target.parentElement.clientHeight) * 100).toFixed(3) + "%";
      target.style.left = ((x / target.parentElement.clientWidth) * 100).toFixed(3) + "%";
      target.style.top = ((y / target.parentElement.clientHeight) * 100).toFixed(3) + "%";
    }

    if (percentOrabsolute === "absolute") {
      target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";
    }
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
}

/**
 * 创建本地html组件
 * @param {*} data
 */
function createLocalElement(nodes = {}, x = 0, y = 0, dropzone) {
  const { name, datatype, childList, options, reapet, style = "", targetRoot, parentId } = nodes;
  let { image, data = {}, targetId } = nodes;
  const div = document.createElement(name && name.includes("jz") ? name : "div");
  const p = document.createElement("p");
  const img = document.createElement("img");
  const isReapet = $(`#${targetId}`);
  if (isReapet.length > 0 && !reapet) {
    targetId = createHashId();
  }

  p.textContent = name;
  img.src = data.image || image;
  img.alt = `${name}\n${nodes.text || data.text || ""}`;
  img.style.height = "100%";
  img.style.width = "100%";
  div.classList.add("draggable2");
  p.style = "background-color: aliceblue;color: #6e6868;";
  div.id = targetId;
  Reflect.deleteProperty(nodes, "dropzone");
  div.setAttribute("data-index", name);
  div.setAttribute("data-data", JSON.stringify(nodes));
  div.setAttribute("title", name);
  switch (vm.percentOrabsolute) {
    case "absolute":
      if (style.includes("transform")) {
        nodes.style = style;
      } else {
        nodes.style = `transform:translate(${x}px, ${y}px);z-index:1;${style}`;
      }
      break;
    case "percent":
      if (style.includes("left") && style.includes("top")) {
        nodes.style = style;
      } else {
        const parentWidth = parentId ? $(`#${parentId}`).width() : dropzone.width();
        const parentHeight = parentId ? $(`#${parentId}`).height() : dropzone.height();
        nodes.style = `left: ${((Number(x) / parentWidth) * 100).toFixed(3)}%;top: ${(
          (Number(y) / parentHeight) *
          100
        ).toFixed(3)}%;z-index:1;${style}`;
      }
      break;
  }

  nodes.id = div.id;
  nodes.targetId = nodes.id;
  nodes.x = x;
  nodes.y = y;
  nodes.alt = img.alt;
  let com = "";
  if (!datatype) {
    com = switchNgComponent({
      element: div,
      image,
      name,
      img,
      childList,
      nodes,
      options,
      targetRoot,
    });
    if (!com) {
      return div;
    }
    return com;
  }
  com = switchLocalComponent({
    element: div,
    image,
    name,
    img,
    nodes,
    options,
    targetRoot,
  });
  if (!com) {
    return div;
  }
  return com;
}

/**
 * 设置选中属性
 * @param {*} element
 */
function setAttr(element) {
  if (!element) return;
  let targetElement = element;
  const focusElement = $(".focus");
  const focusbottomElement = $(".focusbottom");
  const isNullElement = [...$(".focus"), ...$(".focusbottom")];
  const isMultiple = focusElement.length + focusbottomElement.length > 1;
  if (isMultiple || !element || !isNullElement.length) {
    vm.$data.attrObject = {};
    return;
  }
  let { data, x, y } = [...$(".focus"), ...$(".focusbottom")][0].dataset;
  if (element && (![...element.classList].includes("focus") || ![...element.classList].includes("focusbottom"))) {
    if (focusElement.length) {
      targetElement = focusElement[0];
    }
    if (focusbottomElement.length) {
      targetElement = focusbottomElement[0];
    }
  }
  try {
    data = JSON.parse(data);
    data.x = x;
    data.y = y;
    const tempELement = document.createElement("div");
    tempELement.style = data.style;
    targetElement.style.zIndex = tempELement.style.zIndex;
    data.style = targetElement.getAttribute("style") || "";
    targetElement.dataset.data = JSON.stringify(data);
  } catch (error) {
    data = {};
  }
  if (data.paramList && _.isString(data.paramList)) {
    data.paramList = JSON.parse(data.paramList);
  }
  const paramListArr = data.paramList || [];
  // 图元
  if (paramListArr[0]) {
    const first = paramListArr[0];
    if (first.cnName) {
      data.paramList = data.paramList.filter((current) => {
        current.title = current.cnName;
        return current.show === `true`;
      });
    }
  }
  if (!isMultiple) {
    Object.keys(data).forEach((key) => {
      if (key === `paramList`) {
        vm.$data.paramList = data[key];
        if (_.isString(data[key])) {
          vm.$data.paramList = JSON.parse(data[key]);
        }
      }
      if (_.isObject(data[key])) {
        data[key] = JSON.stringify(data[key]);
      }
    });
    if (!Reflect.has(data, "paramList")) {
      vm.$data.paramList = [];
    }
    vm.$data.attrObject = { ...data };
    return;
  }
}

/**
 * 设置选中
 * @param {*} element
 */
function setFocus(element) {
  const focusbottom = `focusbottom`;
  const focus = `focus`;
  if (vm.isCtrlKey) {
    if (!element || !element.classList.value.includes(focus)) {
      element.classList.add(focus);
      comsCombination();
      return;
    }
    // element.classList.remove(focus);
    return;
  }
  $(".draggable").removeClass(focusbottom);
  $(".draggable2").removeClass(focus);
  $(".focus").removeClass(focus);
  element.classList.add(focus);
  comsCombination();
}

/**
 * 设置事件
 * @param {*} e
 */
function setEvents(e) {
  if (e && !e.classList.contains("draggable2") && !e.classList.contains("draggable-info-disable")) {
    return;
  }
  if ($(".focus").length && $(".focusbottom").length) {
    eventsArray.filter((current) => current.id === 1);
  } else {
    vm.$data.events = eventsArray;
  }

  $("#events")
    .off()
    .on("click", "button", (element) => {
      const index = element.currentTarget.getAttribute("data-index");
      switch (Number(index)) {
        case 1:
          deleteEvent(e);
          break;
        case 2:
          vm.topAlign();
          break;
        case 3:
          vm.rightAlign();
          break;
        case 4:
          vm.bottomAlign();
          break;
        case 5:
          vm.leftAlign();
          break;
        case 6:
          vm.setzIndex("up");
          break;
        case 7:
          vm.setzIndex("down");
          break;
        case 8:
          vm.allelicWidthHeight();
          break;
      }
    });
}

/**
 * 删除事件
 * @param {*} e
 */
async function deleteEvent(e) {
  const focusbottomElement = _.uniqBy(
    [...$.makeArray($("#bottomcontent").find(".focus"), $("#bottomcontent").find(".focus").find("[data-data]"))].map(
      (current) => $(current).data("data")
    ),
    "id"
  );
  const focusbottomTempElement = focusbottomElement.map(({ id }) => $(`#${id}`));
  $("#bottomcontent").append(focusbottomTempElement);
  _.pullAllBy(vm.componentsHideArr, focusbottomElement, "id");

  // 画板组件
  const focusElement = _.uniqBy(
    [...$.makeArray($("#inner-dropzone").find(".focus"), $("#inner-dropzone").find(".focus").find("[data-data]"))].map(
      (current) => $(current).data("data")
    ),
    "id"
  );
  const focusTempElement = focusElement.map(({ id }) => $(`#${id}`));
  $("#inner-dropzone").append(focusTempElement);
  _.pullAllBy(vm.componentsArr, focusElement, "id");

  vm.$nextTick(() => {
    vm.$data.attrObject = {};
    vm.$data.events = [];
    vm.selectedKeys = [];
    vm.$store.commit("recordSnapshot");
    vm.getParentElement(vm.componentsArr);
    vm.getParentElement(vm.componentsHideArr);
    vm.$store.commit("setCurComponent", { component: null });
    rxjs.timer(200).subscribe(() => {
      saveInfo("../ui-builder/system-update", null, true);
    });
    vm.$forceUpdate();
  });

  const focusArr = [...focusElement, ...focusbottomElement];
  if (focusArr.length >= 1) {
    // 删除多组件后，去掉线框
    $(".spotBox").empty();

    // 删除组件后，是否隐藏title
    if (vm.componentTitle.showTitle && vm.componentTitle.id) {
      focusArr.forEach((item) => {
        if (item.id === vm.componentTitle.id) {
          vm.componentTitle.id = "";
          vm.componentTitle.title = "";
          vm.componentTitle.showTitle = false;
        }
      });
    }
  }
}

/**
 * tabs子组件和展示区容器拖放限制
 * @param {*} param0
 */
function checkUpParent(targetELement, element) {
  // tab类组件拖放逻辑
  const targetType = $(targetELement).attr("data-element-type") ? $(targetELement).attr("data-element-type") : "";
  const elementType = $(element).attr("data-element-type") ? $(element).attr("data-element-type") : "";
  if (targetType === `jz-option-panel` || targetType === `jz-tab-panel` || elementType === `jz-panel`) {
    const filterArr = [`jz-option-panel`, `jz-tab-panel`];
    const remove = (msg) => {
      $(element).remove();
      _.pullAllBy(vm.componentsArr, [$(element).data("data")], "id");
      vm.selectedKeys = [];
      antd.message.error(msg);
    };
    if (elementType === "jz-panel") {
      if (filterArr.includes(targetType)) {
        const jzPanel = $(`#${targetELement.id || targetELement[0].id} > div[data-element-type='jz-panel']`);
        if (jzPanel.length && jzPanel[0].id !== element.id) {
          remove("一个选项卡只能有一个展示区容器(jz-panel)!");
        }
      } else {
        remove("展示区容器(jz-panel)只能放入选项卡组件!");
      }
    } else {
      remove("请放入展示区容器(jz-panel)!");
    }
  }
}

/**
 * 防止冒泡
 * @param {*} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * 拖动事件
 * @param {*} ev
 */
function drag(ev) {
  ev.dataTransfer.setData("Text", ev.target.id);
  $(".mark-line").hide();
}

/**
 * 放下
 * @param {*} ev 事件
 */
async function drop(ev, root) {
  ev.preventDefault();
  ev.stopPropagation();

  let targetELement;
  const parents = $(ev.target).parents(".dropzone");
  if ($(ev.target).hasClass("dropzone")) {
    targetELement = $(ev.target);
  } else if (parents.length) {
    targetELement = $(parents[0]);
  } else {
    targetELement = root === "#inner-dropzone" ? $("#inner-dropzone") : $("#bottomcontent");
  }
  const { clientX, clientY } = ev;
  const { top, left } = targetELement.offset();
  const data = ev.dataTransfer.getData("Text");
  const isPercent = vm.percentOrabsolute === "percent";
  // console.log(data, ev.currentTarget.id, $(`#${data || ev.currentTarget.id}`));
  let targetInfos = [JSON.parse($(`#${data || ev.currentTarget.id}`).attr("data-data"))];

  const hasCustomId = targetInfos[0].hasOwnProperty("customId");
  if (hasCustomId) {
    targetInfos = targetInfos[0].components;

    let x, y;
    let clientXLeft = clientX - left;
    let clientYTop = clientY - top;
    targetInfos.map(async (it, i) => {
      let style = getElementLeftAndTop(it.style);
      let styleObj = styleToObj(it.style);
      if (i === 0) {
        x = clientXLeft - style.left;
        y = clientYTop - style.top;
      }
      if (it.parentId === "inner-dropzone") {
        clientXLeft = style.left + x;
        clientYTop = style.top + y;
      } else {
        clientXLeft = it.x;
        clientYTop = it.y;
      }

      it.x = clientXLeft;
      it.y = clientYTop;
      styleObj.transform = `translate(${it.x}px, ${it.y}px)`;
      it.style = "";
      for (const styleObjKey in styleObj) {
        it.style += `${styleObjKey}:${styleObj[styleObjKey]};`;
      }
    });
    const parent = targetInfos.filter((it) => it.parent === "inner-dropzone");
    const children = targetInfos.filter((it) => it.parent !== "inner-dropzone");
    // console.log(targetInfos);
    parent.map((it) => {
      let temp = [];
      if (Array.isArray(it.options) && it.options.length) {
        const recursion = function (data) {
          data.map((child, i) => {
            let idKey = "id";
            if (it.componentName === "q-tabs") idKey = "tabsId";
            children.map((childComs) => {
              if (childComs.parentId === child[idKey]) temp.push(childComs);
            });
            if (child.children && child.children.length) recursion(child.children);
          });
        };
        recursion(it.options);
      }
      menuTools.copy(it, { all: targetInfos, children: temp });
    });
    return;
  }
  targetInfos.map(async (it, i) => {
    let clientXLeft = clientX - left;
    let clientYTop = clientY - top;
    let targetInfo = it;

    if (!hasCustomId) {
      targetInfo.targetId = targetInfo.id = createHashId();
    }
    const innerWidth = targetELement.width();
    const innerHeight = targetELement.height();

    if (clientXLeft + 150 >= innerWidth) {
      clientXLeft = innerWidth - 150;
    }
    if (clientYTop + 150 >= innerHeight) {
      clientYTop = innerHeight - 150;
    }
    Object.assign(targetInfo, {
      targetRoot: root,
      parent: targetELement[0].id,
      parentId: targetELement[0].id,
      style: "visibility:hidden;",
    });
    if (targetInfo.pageId) {
      const { pageId, name } = targetInfo;
      changePublicPage({ id: pageId, name });
      return;
    }
    let element = createLocalElement(targetInfo, clientXLeft, clientYTop, targetELement);
    vm.getParentElement(vm.componentsArr);
    vm.getParentElement(vm.componentsHideArr);

    rxjs.timer(100).subscribe(() => {
      element = $(`#${element}`)[0];
      vm.selectedKeys = [element.id];
      setAttr(element);
      setFocus(element);
      setEvents(element);
      if (hasCustomId) {
        targetELement = $(`#${targetInfo.parent}`);
      }
      checkUpParent(targetELement, element);
      // Object.assign(targetInfo, changeInfo);
      if (vm.percentOrabsolute === "absolute") {
        vm.setabsolute();
      } else if (isPercent) {
        vm.setPercent();
      }
      Object.assign(targetInfo, {
        style: `${targetInfo.style};visibility:visible;`,
      });
      const initObj = Object.keys(targetInfo).reduce((prev, current) => {
        const isString = !_.isString(targetInfo[current]);

        prev[current] = isString ? JSON.stringify(targetInfo[current]) : targetInfo[current];
        return prev;
      }, {});
      vm.attrObject = initObj;
      vm.$store.commit("recordSnapshot");
    });
  });
}

/**
 * 刷新元素
 * @param {*} ev 事件
 */
async function changeElement(ev) {
  const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
  const { x, y, data } = ev;
  const { id, style } = data;
  let [xtarget, ytarget] = [x, y];
  $(focusElement)
    .attr("style", style)
    .attr("data-data", JSON.stringify(data))
    .attr("data-x", xtarget)
    .attr("data-y", ytarget);
  // 当嵌套或者其他组件从新到画板中重新生成vue组件
  if ($(focusElement).parent()[0].id !== `inner-dropzone`) return;
  let element = createLocalElement({ ...data, style: style }, Number(x), Number(y));
  if (_.isString(element)) {
    await new Promise((reslove2) => {
      rxjs.timer(0).subscribe(() => {
        reslove2();
      });
    });
    element = $(`#${element}`)[0];
  }
  element.setAttribute("style", style);
  element.setAttribute("data-x", x);
  element.setAttribute("data-y", y);
  element.style.transform = `translate(${x}px,${y}px)`;
  // $(focusElement).remove();

  // 检查组件
  vm.checkUp();
}

/**
 * 动态变更层级
 * @param {*} element
 */
function changeZIndex(element) {
  if (!element || !$(".focus").length) return;
  try {
    const maxIndex = getZIndexMax();
    $(element).css("z-index", maxIndex + 10);
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取最大层级
 */
function getZIndexMax() {
  const allZindex = $.makeArray($(".draggable2")).map((cur) => +cur.style.zIndex);
  const maxZindex = Math.max(...allZindex);
  return maxZindex;
}

/**
 * 绑定事件
 */
function addPublishEvents() {
  // 监听画板点击
  $("#inner-dropzone > div").on("click", (e) => {
    const element = e.currentTarget;
    const { events } = JSON.parse($(element).attr("data-data"));
    for (const event in events) {
      if (Object.hasOwnProperty.call(events, event)) {
        switch (event) {
          case "redirect":
            customEvents.redirect(events[event]);
            break;
          case "alert":
            customEvents.alert(events[event]);
            break;
        }
      }
    }
  });
  // 轮询事件 or 触发事件
  vm.componentsArr.forEach((target) => {
    const { events } = target.data;
    for (const event in events) {
      if (Object.hasOwnProperty.call(events, event) && event === "interval") {
        customEvents.interval(events[event], target);
      } else if (Object.hasOwnProperty.call(events, event) && event === "triggerEvent") {
        customEvents.triggerEvent(events[event], target);
      }
    }
  });
}

/**
 * 绑定事件
 */
function bindEvents() {
  // 监听画板点击
  $("#inner-dropzone,#bottomcontent").on("mousedown mouseup dblclick", ".draggable2", (e) => {
    e.stopPropagation();
    e.preventDefault();
    $("input,textarea").trigger("blur");
    const element = e.currentTarget;
    const { style } = JSON.parse($(element).attr("data-data"));
    const tempElement = document.createElement("div");
    tempElement.style.cssText = style;
    const bakzIndex = tempElement.style.zIndex || 1;
    switch (e.type) {
      case "mousedown":
        // 启用keyMove
        vm.keyMoveStatus = true;

        lastFocusElement = element;
        setFocus(element);
        setAttr(element);
        setEvents(element);
        changeZIndex(element);
        if (vm.isCtrlKey) {
          return;
        }
        if (!vm.attrObject.events) {
          vm.$set(vm.attrObject, "events", {});
        } else if (_.isString(vm.attrObject.events)) {
          vm.$set(vm.attrObject, "events", JSON.parse(vm.attrObject.events));
        }

        vm.$store.commit("setCurComponent", {
          component: vm.attrObject,
        });
        break;
      case "mouseup":
        $(element).css("z-index", bakzIndex);
        if (vm.isCtrlKey) {
          return;
        }
        break;
      case "dblclick":
        sendFocusMsg(element);
    }
  });

  //显示组件Title的事件监听
  bindTitleEvents();

  // 输入选中状态不允许删除
  $("body").on("focus blur", "input,textarea", (e) => {
    switch (e.type) {
      case "focusin":
        isFocus = true;
        vm.keyMoveStatus = false;
        vm.spaceKeyStatus = true;
        break;
      case "focusout":
        isFocus = false;
        vm.keyMoveStatus = true;
        vm.spaceKeyStatus = false;
        break;
    }
  });
  // 监听键盘按键
  $(document).on("keydown", (event) => {
    const { keyCode } = event;
    const isCtrlKey = keyCode === 17;
    const isSpaceKey = keyCode === 32;
    const isShiftKey = keyCode === 16;
    vm.$store.commit("setIsCtrlKey", { isCtrlKey });
    vm.$store.commit("setIsSpaceKey", { isSpaceKey });
    vm.$store.commit("setIsShiftKey", { isShiftKey });

    switch (keyCode) {
      case 37:
        vm.keyMove(event, "left");
        break;
      case 38:
        vm.keyMove(event, "up");
        break;
      case 39:
        vm.keyMove(event, "right");
        break;
      case 40:
        vm.keyMove(event, "down");
        break;
      default:
        break;
    }
  });

  $(document).on("keyup", (event) => {
    const { keyCode } = event;
    if (keyCode === 17) {
      vm.$store.commit("setIsCtrlKey", { isCtrlKey: false });
    }

    if (event.key === "Delete" && !isFocus) {
      deleteEvent();
    }

    if (keyCode === 32) {
      vm.$store.commit("setIsSpaceKey", { isSpaceKey: false });
      $("#inner-dropzone").removeClass("cursor-view-move");
      $("#inner-dropzone").removeClass("cursor-view-grab");
    }

    if (keyCode === 16) {
      vm.$store.commit("setIsShiftKey", { isShiftKey: false });
    }
  });

  // 画布大小监听
  $("#design-size").on("mousedown", "dd", (e) => {
    const targetIndex = $(e.target).attr("lay-value");
    if (Number(targetIndex) === -1) return;
    $("#design").find("input").val("");
    const t = $(e.currentTarget).text();
    const [width, height] = t.split("x");
    const [element1, element2] = $.makeArray($("#design input"));

    $(element1).val(width);
    $(element2).val(height);
    $("#inner-dropzone").css({ width: `${width}px`, height: `${height}px` });
  });

  // 提交事件
  $(".header-events").on(
    "click",
    "button",
    _.debounce((e) => {
      const { index } = e.target.dataset;
      const id = getQueryVariable("id");
      switch (Number(index)) {
        case 1:
          if (id) {
            saveInfo("update");
            return;
          }
          saveInfo();
          break;
        case 2:
          location.href = `/ui-builder/page/index.html`;
          break;
        case 3:
          releaseUibuider();
          break;
        default:
          break;
      }
    }, 1000)
  );
}

/*
 * 显示组件Title的事件监听
 */
function bindTitleEvents() {
  $("#inner-dropzone,#bottomcontent").on("mouseenter mousemove mouseleave", ".draggable2", (e) => {
    e.stopPropagation();
    e.preventDefault();
    switch (e.type) {
      case "mouseenter":
        vm.componentTitle.id = "";
        vm.componentTitle.title = "";
        vm.componentTitle.showTitle = false;
        break;
      case "mousemove":
        /*
         * 1.顶部菜单项大小设置打开时，不显示title，防止位置不够导致布局错乱。
         * 2.Title显示时，不做重复操作。
         */
        if (vm.themeSetting || vm.componentTitle.showTitle) return;
        let data = e.currentTarget.dataset.data;
        if (_.isString(data)) {
          data = JSON.parse(data);
        }
        vm.componentTitle.id = data.id;
        vm.componentTitle.title = `${data.name ? "【" + data.name + "】" : ""}${data.text ? data.text : ""}${
          data.wfName ? "\n【分析流】" + data.wfName : ""
        }`;
        vm.componentTitle.showTitle = true;
        break;
      case "mouseleave":
        vm.componentTitle.id = "";
        vm.componentTitle.title = "";
        vm.componentTitle.showTitle = false;
        break;
    }
  });
}
/*
 * 移除组件Title的事件监听
 */
function removeTitleEvents() {
  $("#inner-dropzone,#bottomcontent").off("mouseenter mousemove mouseleave", ".draggable2");
}

async function getPageJSON() {
  const tempObj = { id: getQueryVariable("id") };
  const filterArr = [`jz-option-panel`, `jz-tab-panel`, `tabs`];

  // 画布组件和底部组件和禁用组件
  const allComponent = [
    ...$.makeArray($(".draggable-grid")),
    ...$.makeArray($(".draggable2")),
    ...$.makeArray($("#bottomcontent .draggable")),
  ];
  allComponent.forEach((element) => {
    let { data } = element.dataset;
    data = JSON.parse(data);
    // 自定义组件还是元件
    let key = Number(data.datatype) === 1 ? `custom_componet` : `custom_model`;
    if (!tempObj[key]) {
      tempObj[key] = [];
    }
    let styles = $(element).attr("style");
    const targetType = $(element).attr("data-element-type");
    if (filterArr.includes(targetType)) {
      const childList = $.makeArray(
        $(element).children(".layui-tab-brief").children(".layui-tab-content").children()
      ).map((target) => ({
        tabsId: target.id,
        title: $(target).attr("name"),
      }));
      data.childList = childList;
      data.options = childList;
    }
    if (data.name && data.name.includes("菜单导航")) {
      styles = `${styles}overflow: initial !important;`;
    }
    if (styles && styles.includes(`position`)) {
      element.dataset.style = `${styles}position:absolute;`;
    } else {
      element.dataset.style = styles || ``;
    }
    data.style = styles;
    tempObj[key].push({ ...element.dataset, data });
  });

  tempObj.theme = await getThemeInfo(vm);
  tempObj.custom_result_componet = [];
  return tempObj;
}

/**
 * 保存数据
 * @param {*} type 新增还是保存
 * @param {object} resultInfo  DI弃用了给图元用,存有歧义
 * @param {boolean} ignore 忽略更新提示
 */
function saveInfo(type = `save`, resultInfo = null, ignore = false) {
  if (!ignore) {
    // vm.spinning = true;
  }
  return new Promise(async (reslove, reject) => {
    const tempObj = await getPageJSON();
    if (resultInfo) {
      tempObj.resultInfo = resultInfo;
    }
    const ajax = type === "save" ? editService.saveInfo(tempObj) : editService.updateSaveInfo(tempObj);

    ajax
      .then((data) => {
        const id = getQueryVariable("id");
        vm.spinning = false;
        if (ignore) {
          reslove();
          return;
        }
        if (id) {
          antd.message.success("保存成功");
          reslove();
          return;
        }
        reslove();
        antd.message.success("新增成功");
      })
      .catch((res) => {
        if (!res.abort) {
          vm.spinning = false;
        }
        reject();
      });
  });
}

/**
 * 发布
 */
async function release(callBack, showSchema) {
  const customModel = [];
  const hideScript = [];
  const tempObj = {};
  const allElement = [
    ...$.makeArray($(".draggable-grid")),
    ...$.makeArray($(".draggable2")),
    ...$.makeArray($(".draggable-info-disable")),
  ];
  const filterArr = [`jz-option-panel`, `jz-tab-panel`, `tabs`];
  let { wid = "", url = "", returnAddress = "", workflowId = "", workflowName = "" } = {};
  let resultInfo = null;
  if (!allElement.length) {
    // 显示schema时不提示
    if (showSchema) return;

    antd.message.info(`画布为空不允许发布！`);
    return;
  }
  const tempAllElement = getChildList(allElement);
  tempAllElement.forEach((element) => {
    let { childList = [] } = element;
    if (childList) {
      try {
        childList = _.isString(childList) ? JSON.parse(childList) : childList;
        childList.forEach((child) => {
          tempAllElement
            .filter((target) => child.tabsId === target.parentId)
            .forEach((current) => {
              if (!current.data) {
                current.data = {};
              }
              current.data.title = child.name;
              current.parent = element.id;
              // ui-builder使用
              current.parentId = child.tabsId;
            });
        });
        const targetType = $(`#${element.id}`).attr("data-element-type");
        if (filterArr.includes(targetType)) {
          element.options = childList.map((current) => ({
            ...current,
            title: current.name,
          }));
        }
      } catch (error) {}
    }
  });

  // 把jz组件属性加上
  tempAllElement.forEach((element) => {
    const { id, name, datatype } = element;
    const elementTarget = $(`#${id}`);
    let data = element;
    $(elementTarget).removeClass("focus");
    if (!data.data) {
      data.data = {};
    } else if (_.isString(data.data)) {
      try {
        data.data = JSON.parse(data.data);
      } catch (error) {
        data.data = {};
      }
    }
    if (data.paramList) {
      if (_.isString(data.paramList)) {
        data.paramList = JSON.parse(data.paramList) || [];
      }
      data.data = { ...data.data, ...getParamListData(data.paramList) };
      data.bakParamList = [...data.paramList];
      Reflect.deleteProperty(data, "paramList");
    }
    // if (name.includes("jz")) {
    //   Object.entries(element.data).forEach((current) => {
    //     if (_.isString(current[0]) && Number.isNaN(Number(current[0]))) {
    //       $(elementTarget).attr(current[0], current[1]);
    //     }
    //   });
    //   try {
    //     const tempDiv = document.createElement(name);
    //     $(elementTarget).each(function () {
    //       $.each(this.attributes, function () {
    //         if (this.specified) {
    //           tempDiv.setAttribute(this.name, this.value);
    //         }
    //       });
    //     });
    //     $(tempDiv).append(elementTarget.children());
    //     $(elementTarget).replaceWith(tempDiv);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    if (Number(datatype) === 1) {
      $(elementTarget).each(function () {
        $.each(this.attributes, function () {
          if (this.specified) {
            data.data[this.name] = this.value;
          }
        });
      });
    }
  });

  tempAllElement.forEach((element) => {
    const { id } = element;
    const elementTarget = $(`#${id}`);
    let data = element;
    let styles = $(elementTarget).attr("style") || "";
    $(elementTarget).removeClass("focus");
    const origin = location.origin;
    if (data.paramList) {
      if (_.isString(data.paramList)) {
        data.paramList = JSON.parse(data.paramList);
      }
      if (!data.data) {
        data.data = {};
      }
      data.data = { ...data.data, ...getParamListData(data.paramList) };
      Reflect.deleteProperty(data, "paramList");
    }
    // di需要dom
    if (data.name.includes("菜单导航")) {
      styles = `${styles}overflow: initial !important;`;
      $(elementTarget).attr("style", styles);
    }
    if (Number(data.datatype) === 1) {
      const tempNode = elementTarget[0].cloneNode(true);
      const eventBtn = tempNode.querySelector(".layui-event-btn");
      [...tempNode.querySelectorAll("[title]")].map((c) => (c.title = ""));
      if (eventBtn) {
        eventBtn.remove();
      }
      if (_.isString(data.scripts)) {
        data.scripts = JSON.parse(data.scripts || "[]");
      }

      const childListData = tempNode.querySelectorAll("[data-data]");
      childListData.forEach((element) => {
        element.remove();
      });
      const componentDom = tempNode.innerHTML;

      const { scripts = [] } = data;
      const { targetRoot } = data;
      const scriptStr = scripts.map((item) => `<script>${item.value}</script>`).join("");
      data.children = [
        `<link rel='stylesheet' type='text/css' href='${origin}/ui-builder/dist/css/ui-buider.pack.css'></link> 
       ${componentDom}
       ${scriptStr}
       <script src="${origin}/ui-builder/dist/js/ui-buider.pack.min.js"></script>
       <script src="${origin}/ui-builder/js/lay-module/swiper/swiper-bundle.min.js"></script>
       <script src="${origin}/ui-builder/js/lay-module/components/q-swiper-pic/swiper-object.js"></script>  
      `,
      ];
      if (targetRoot.includes("bottomcontent")) {
        hideScript.push(scriptStr);
      }
    }
    // di需要把名字换成div
    if (!data.name.includes(`jz`) || (Number(data.datatype) == 1 && data.name == "jz-panel")) {
      // 保存一次name
      if (!data.targetName) {
        data.targetName = data.name;
      }
      data.name = `div`;
    }
    if (data.name == "jz-chart") {
      data.data.optionpanelid =
        $("#" + data.id)
          .parent()
          .parent()
          .attr("data-element-type") === "jz-option-panel"
          ? $("#" + data.id)
              .parent()
              .parent()[0].id
          : "";
      data.data.panelId =
        $("#" + data.id)
          .parent()
          .attr("data-element-type") === "jz-panel"
          ? $("#" + data.id).parent()[0].id
          : "";
    } else {
      // 发给DI时去除非图元组件image数据，防止base64图片导致JSON数据量过大
      if (data.image) data.image = "";
    }
    if (!styles.includes(`position`)) {
      styles = `${styles}position:absolute;`;
    }
    if (data.targetName === `浮动菜单`) {
      styles = styles.replace("absolute", "fixed");
    }
    if (!styles.includes("width")) {
      data.style = `${styles}width:150px;height:150px;`;
      customModel.push(data);
      return;
    }
    // 不在画布节点下不允许重复展示
    Reflect.deleteProperty(data, "isShow");
    // if (document.querySelector(`#${data.id}`).parentNode.id !== "inner-dropzone") {
    //   const ignoreArr = [`jz-option-panel`, `jz-tab-panel`, `jz-pop-panel`];
    //   const isJzOptionPanel = tempAllElement.some((item) => {
    //     if (ignoreArr.includes(item.name)) {
    //       return document.querySelector(`#${item.id}`).contains(document.querySelector(`#${data.id}`));
    //       // return document.querySelector(`#${item.id}`).contains(document.querySelector(`#${data.parent}`));
    //     }
    //     return false;
    //   });
    //   if (!isJzOptionPanel) {
    //     data.isShow = false;
    //   }
    // }
    data.style = styles;
    // 避免di出现 title(存疑)
    // Reflect.deleteProperty(data.data, "title");
    customModel.push(data);
  });
  try {
    const { write_info = "{}", result_info = "{}" } = $("html").data("pageInfo");
    ({ wid, url, returnAddress, workflowId, workflowName } = JSON.parse(write_info));
    resultInfo = JSON.parse(result_info);
  } catch (error) {
    wid = null;
  }
  const hideElement = {
    id: "bottomcontent",
    name: "div",
    datatype: 1,
    options: "底部引用",
    description: "",
    style: "position: absolute;top:-1000px;left:-1000px",
    children: [
      `
    <script src="${origin}/ui-builder/js/lay-module/iframeResizer/iframeResizer.min.js"></script>
    <script src="${origin}/ui-builder/js/lay-module/iframeResizer/iframeResizer.contentWindow.min.js"></script>
    <script src="${origin}/ui-builder/js/lay-module/components/q-bottom-container/q-bottom-container-external.js"></script>
    ${hideScript.join("")}
    `,
    ],
    // ${$(`#bottomcontent`).html()}
  };
  // 页面配置
  const configElement = {
    id: "configElement",
    isShow: false,
    theme: await getThemeInfo(vm),
  };
  resultInfo.widgets = [...customModel.filter((current) => !current.disabled), hideElement, configElement];
  // 显示Schema，只取数据，不做发布操作
  if (showSchema) {
    return resultInfo.widgets;
  }
  Object.assign(tempObj, {
    wid,
    url,
    customModel: resultInfo.widgets,
    resultInfo,
    returnAddress,
    workflowId,
    workflowName,
  });
  // console.log(JSON.stringify(tempObj));
  vm.spinning = true;
  const isParent = openWindow.isExist("parent");
  vm.spinning = false;
  if (!isParent && returnAddress) {
    openWindow.openNewWindow(returnAddress, tempObj);

    return;
  } else if (!returnAddress) {
    editService
      .systemRelease(tempObj)
      .then((data) => {
        const id = getQueryVariable("id");
        vm.spinning = false;
        if (id) {
          antd.message.success("发布成功");
          callBack && callBack();
          return;
        }
      })
      .catch((res) => {
        vm.spinning = false;
      });
    // antd.message.warn("没有跳转DI路径,请确保由DI创建本条实例!");
    return;
  }
  openWindow.sendMessage("parent", tempObj);
}

/**
 * 发布到图元
 */
function releaseCharts(callBack) {
  const tempObj = { data: [] };
  const allElement = $.makeArray($(".draggable2"));
  if (!allElement.length) {
    antd.message.warning(`画布为空不允许发布！`);
    return;
  }
  allElement.forEach((element) => {
    let { data } = element.dataset;
    const tempChildObj = {};
    data = JSON.parse(data);
    if (data.paramList && _.isString(data.paramList)) {
      data.paramList = JSON.parse(data.paramList);
    }
    data.paramList &&
      data.legend &&
      [{ key: "chart_id" }, { key: "fresh_time" }, ...data.paramList].forEach((current) => {
        let { key, type } = current;
        try {
          if (type === `Array`) {
            current.default = JSON.parse(current.default || "[]");
          }
        } catch (error) {
          current.default = [];
          console.log(`${key}参数类型转换错误~~~`);
          throw error;
        }
        tempChildObj[key] = current.default;
      });
    console.log(tempChildObj);
    // 自定义组件还是元件
    if (Reflect.ownKeys(tempChildObj).length) {
      tempObj.data.push(tempChildObj);
    }
  });
  vm.spinning = true;
  callBack && callBack(tempObj);
  vm.spinning = false;
}

/**
 * 初始化页面
 */
function reloadPage() {
  return new Promise(async (reslove, reject) => {
    try {
      const data = await editService.systemFind({ id: getQueryVariable("id") });
      const {
        results: [pageInfo = {}],
        info: { msg = `fail` },
      } = data;
      if (msg === `fail` || !Object.values(pageInfo).length) {
        antd.message.error("获取失败,ui-builder实例不存在!");
        setTimeout(() => {
          location.href = `/ui-builder/page/index.html`;
        }, 3000);
        return;
      }

      // 存储所有数据
      $("html").data("pageInfo", pageInfo);
      let { custom_componet, custom_model, custom_result_componet } = pageInfo;
      initCanvas(pageInfo);

      // bottom组件
      const bottomComponet = [
        ...(custom_componet ? JSON.parse(custom_componet).filter((element) => element.tag === "bottom") : []),
        ...(custom_model ? JSON.parse(custom_model).filter((element) => element.tag === "bottom") : []),
      ];

      custom_componet = custom_componet
        ? JSON.parse(custom_componet).filter((element) => element.tag === "up" || !element.tag)
        : [];
      custom_model = custom_model
        ? JSON.parse(custom_model).filter((element) => element.tag === "up" || !element.tag)
        : [];
      custom_result_componet = custom_result_componet ? JSON.parse(custom_result_componet) : [];

      // 自定义组件
      const customComponet = await Promise.all(
        custom_componet.map(async (target) => {
          const dataInfo = _.isObject(target.data) ? target.data : JSON.parse(target.data);
          const { x, y, style } = target;

          if (dataInfo.datatype === "1") {
            dataInfo.hasOwnProperty("data") && Reflect.deleteProperty(dataInfo, "data");
          }

          if (dataInfo.datatype === "1" && dataInfo.type === "媒体") {
            dataInfo.image =
              "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE0MzAxODM0Mzk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMCAxMDI0VjBoMTAyNHYxMDI0SDB6TTkzMy42NDcwNTkgOTAuMzUyOTQxSDkwLjM1Mjk0MXY3NjguNTIyMDM5TDM1MS4zNzI1NDkgNDcxLjg0MzEzN2wyMjAuODYyNzQ1IDI2MS4wMTk2MDggMTQwLjU0OTAyLTExMC40MzEzNzIgMjIwLjg2Mjc0NSAyMjkuMDQ0NzA1VjkwLjM1Mjk0MXpNNjcyLjYyNzQ1MSAzMzEuMjk0MTE4YTkwLjM1Mjk0MSA5MC4zNTI5NDEgMCAxIDEgOTAuMzUyOTQxIDkwLjM1Mjk0MSA5MC4zNTI5NDEgOTAuMzUyOTQxIDAgMCAxLTkwLjM1Mjk0MS05MC4zNTI5NDF6IiBwLWlkPSIyNzI3IiBmaWxsPSIjYmZiZmJmIj48L3BhdGg+PC9zdmc+";
          }

          let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
          if (_.isString(element)) {
            await new Promise((reslove2) => {
              rxjs.timer(0).subscribe(() => {
                reslove2();
              });
            });
            element = $(`#${element}`)[0];
            $(element).attr("data-tag", "up");
          }
          return element;
        })
      );

      // 元件
      const customModel = await Promise.all(
        custom_model.map(async (target) => {
          const dataInfo = _.isObject(target.data) ? target.data : JSON.parse(target.data);
          const { x, y, style } = target;

          custom_result_componet.forEach((item) => {
            if (dataInfo.name === item.name && dataInfo.name !== "jz-chart") {
              dataInfo.image = item.image;
            }
          });

          let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
          if (_.isString(element)) {
            await new Promise((reslove2) => {
              rxjs.timer(0).subscribe(() => {
                reslove2();
              });
            });
            element = $(`#${element}`)[0];
          }
          return element;
        })
      );

      // 元件
      const bottomComponetElement = await Promise.all(
        bottomComponet.map(async (target) => {
          const dataInfo = _.isObject(target.data) ? target.data : JSON.parse(target.data);
          const { x, y, style } = target;
          let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
          if (_.isString(element)) {
            await new Promise((reslove2) => {
              rxjs.timer(0).subscribe(() => {
                reslove2();
              });
            });
            element = $(`#${element}`)[0];
          }
          $(element).attr("data-tag", "bottom");
          return element;
        })
      );
      clearDrag();
      reslove(pageInfo);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function changePublicPage({ id, name }) {
  const targetPageId = getQueryVariable("id");
  antd.Modal.confirm({
    title: "页面直接导入",
    content: `将删除当前[id=${targetPageId}]页面所有组件，确定直接覆盖导入页面 [${name}] 吗？`,
    okText: "确认",
    cancelText: "取消",
    autoFocusButton: null,
    onOk: async () => {
      const { results = {} } = await editService.getPublicPage({ id });
      const { content } = results;

      await editService.updateSaveInfo({ ...content, id: targetPageId });
      location.reload();
    },
  });
}

/**
 * 设置画布大小
 */
const initCanvas = async (pageInfo = {}) => {
  const gridLine =
    "repeating-linear-gradient(0deg,var(--canvas-fence-color) 0,var(--canvas-fence-color) 0,transparent 1px,transparent 16px),repeating-linear-gradient(90deg,var(--canvas-fence-color) 0,var(--canvas-fence-color) 0,var(--canvas-color) 1px,var(--canvas-color) 16px)";
  let {
    width = 1920,
    height = 1080,
    theme = "#24292e",
    canvas = "#ffffff",
    bgImage = "",
    components = "all",
    charts = "all",
    percentOrabsolute = "absolute",
  } = JSON.parse(pageInfo.theme || "{}");
  let bgImagePath;
  if (vm.editMode !== "edit") {
    bgImagePath = `../${bgImage}`;
    if (!bgImage) {
      bgImagePath = gridLine;
    }
  } else {
    bgImagePath = bgImage;
  }
  [width, height] = [width, height].map(Number);
  vm.$store.commit("setCanvasStyle", { width, height });
  vm.$store.commit("setPercentOrabsolute", { percentOrabsolute });
  vm.percentOrabsolute = percentOrabsolute;
  $("#inner-dropzone")
    .css({
      opacity: 1,
    })
    .data("bgImage", bgImagePath)
    .data("components", components)
    .data("charts", charts);
  if (bgImagePath) {
    $("#inner-dropzone").css({
      background: `url(${bgImagePath})`,
      backgroundSize: "cover",
    });
  }
};

$(function () {
  interactStart();
  bindEvents();
  if (vm.editMode === "read") {
    setTimeout(() => {
      addPublishEvents();
    }, 1000);
  }
});
