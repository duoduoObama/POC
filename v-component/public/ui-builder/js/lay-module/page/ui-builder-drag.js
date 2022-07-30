/**
 * 可切换图层
 * @param {*} target
 * @param {*} focusElement
 */
function changePanelElement(target = null) {
  if (!target) return;
  return $.makeArray($(".dropzone")).filter((element) => {
    if (target.id !== element.id && target.parentElement.id !== element.id && !target.contains(element)) {
      return true;
    }
    return false;
  });
}

(function () {
  /*
   * 框选
   */
  document.onmousedown = function (e) {
    if (e.target.id !== "inner-dropzone" || !vm.isShiftKey || store.state.editMode !== "edit") return;
    e.preventDefault();
    $("#mouseboxwrap").css("display", "block");
    var posx = e.clientX;
    var posy = e.clientY;
    var div = document.createElement("div");
    div.style.left = e.clientX + "px";
    div.style.top = e.clientY + "px";
    $(div).attr("class", "mouseboxwrap main-mouseboxwrap");
    $(div).attr(
      "style",
      `position:absolute;
       background: #eff6ff;
       border: 1px solid #000;
       opacity: 0.4;
       z-index: 999;`
    );
    $("body").css("overflow", "hidden");
    $("body").append(div);

    document.onmousemove = function (ev) {
      if (!$(ev.target).hasClass("mouseboxwrap")) return;
      div.style.left = Math.min(ev.clientX, posx) + "px";
      div.style.top = Math.min(ev.clientY, posy) + "px";
      div.style.width = Math.abs(posx - ev.clientX) + "px";
      div.style.height = Math.abs(posy - ev.clientY) + "px";
      const moneyToChooseSingle = (targetElement) => {
        if ($(".focus").length === 1 && targetElement.length) {
          const targetData = JSON.parse(targetElement.attr("data-data"));
          if (targetData.id !== vm.attrObject.id) {
            vm.attrObject = {};
            Object.keys(targetData).forEach((key) => {
              if (typeof targetData[key] !== `string`) {
                targetData[key] = JSON.stringify(targetData[key]);
              }
            });
            Object.assign(vm.attrObject, targetData);
          }
        }
      };
      handleRectSelection(moneyToChooseSingle);
      document.onmouseup = function () {
        div.parentNode.removeChild(div);
        $("#mouseboxwrap").css("display", "none");
        document.onmousemove = null;
        document.onmouseup = null;
        comsCombination();
        vm.onClickNode();
      };
    };
  };

  /**
   *核心相交算法
   * @param rect1{x1,y1,x2,y2}
   * @param rect2 {x1,y1,x2,y2}
   */
  function isCross(rect1, rect2) {
    let xNotCross = true; //x方向上不重合
    let yNotCross = true; //y方向上不重合
    xNotCross = rect1.x1 > rect2.x2 || rect2.x1 > rect1.x2;
    yNotCross = rect1.y1 > rect2.y2 || rect2.y1 > rect1.y2;
    return !(xNotCross || yNotCross);
  }

  /**
   *获取元素的矩形的起始点坐标与其对角点坐标
   * @param $el
   * @return {{y1, x1, y2: *, x2: *}}
   */
  function getRect($el) {
    if (!$el && !$el.offset) return;
    const { left = 0, top = 0 } = $el.offset() || {};
    let x1 = left;
    let y1 = top;
    let x2 = x1 + $el.outerWidth();
    let y2 = y1 + $el.outerHeight();
    return { x1, x2, y1, y2 };
  }

  //框选处理 如果元素与选择框相交则设置样式
  function handleRectSelection(callBack) {
    const selectionReact = getRect($(".main-mouseboxwrap"));
    vm.$data.componentsArr.map((it) => {
      const targetElement = $(`#${it.id}`);
      const rect = getRect(targetElement);
      if (isCross(selectionReact, rect)) {
        targetElement.addClass("focus");
        callBack && callBack(targetElement);
      } else {
        targetElement.removeClass("focus");
      }
    });
  }
})();

/*
 *
 */
function getSingleRootResult(type) {
  let result = $(".focus").filter((i, it) => {
    const data = JSON.parse(it.dataset.data);
    const typeResult = type === "inner" ? "#inner-dropzone" : "#bottomcontent";
    return data.targetRoot === typeResult;
  });
  if (result.length < 2) return undefined;

  let spotBoxw,
    spotBoxh,
    rxArr = [],
    lxArr = [],
    byArr = [],
    ldvArr = [],
    tdvArr = [],
    tyArr = [];
  result.each((e, it) => {
    const { parent } = JSON.parse(it.dataset.data);
    if (parent !== "inner-dropzone") return;
    if (vm.$root.percentOrabsolute === "absolute") {
      const transform = $(it).css("transform").replace("matrix", "").replace(/[(|)]/g, "").split(",");
      rxArr.push(parseInt(transform[4]) + $(it).width());
      lxArr.push(parseInt(transform[4]));
      byArr.push(parseInt(transform[5]) + $(it).height());
      tyArr.push(parseInt(transform[5]));
    } else {
      let { left, top, width, height } = it.style;
      [left, top, width, height] = [left, top, width, height].map((it) => {
        return parseFloat(it.replace("%", ""));
      });
      rxArr.push(BigNumber.sum(left, width));
      lxArr.push(left);
      byArr.push(BigNumber.sum(top, height));
      tyArr.push(top);
    }
  });
  // 左侧到父容器的最近距离
  let minlx = Math.min.apply(null, lxArr);
  // 右侧侧到父容器的最远距离
  let maxrx = Math.max.apply(null, rxArr);
  // 顶部到父容器的最近距离
  let minty = Math.min.apply(null, tyArr);
  // 顶部到父容器的最远距离
  let maxty = Math.max.apply(null, byArr);
  //组合后组件到父组件的距离
  lxArr.map((it) => {
    ldvArr.push(new BigNumber(it).minus(minlx));
  });

  tyArr.map((it) => {
    tdvArr.push(new BigNumber(it).minus(minty));
  });
  // spotBox 容器宽高
  spotBoxw = new BigNumber(maxrx).minus(minlx);
  spotBoxh = new BigNumber(maxty).minus(minty);
  const unit = vm.$root.percentOrabsolute === "absolute" ? "px" : "%";
  return { unit, minlx, minty, spotBoxw, spotBoxh, ldvArr, tdvArr, length: lxArr.length };
}

/**
 * 组件组合
 */
async function computeCombination() {
  let result = {
    innerArr: {},
    bottomArr: {},
  };
  result.innerArr = getSingleRootResult("inner");
  result.bottomArr = getSingleRootResult();
  return _.pickBy(result);
}

/**
 * 组件组合
 */
async function comsCombination() {
  vm.$data.seletComs = [];
  let differentLevels = false;
  $(".focus").each((i, it) => {
    vm.$data.seletComs.push($(it).attr("id"));
    if (it.parentElement.id !== "inner-dropzone" && it.parentElement.id !== "bottomcontent") differentLevels = true;
  });
  setTimeout(async function () {
    $(".spotBox").empty();
    if ($(".focus").length <= 1 || differentLevels) return;
    // const { minlx, minty, spotBoxw, spotBoxh, length, unit, ldvArr, tdvArr } = await computeCombination();
    const { innerArr, bottomArr } = await computeCombination();
    if (innerArr) createFrame(innerArr, $("#spotBox"));
    if (bottomArr) createFrame(bottomArr, $("#spotBoxBottom"));
  });
}

function createFrame(data, root) {
  const { minlx, minty, spotBoxw, spotBoxh, length, unit, ldvArr, tdvArr } = data;
  let dataData;
  let style = `
    position: absolute;
    z-index: 99;
    border: dashed 1px rgba(0, 0, 0, 0.5);
    box-shadow: none;`;
  if (vm.$root.percentOrabsolute === "absolute") {
    style += `  
      width: ${spotBoxw.plus(length + 2)}px;
      height: ${spotBoxh.plus(length + 2)}px;
      transform:translate(${minlx - length}px,${minty - length}px)`;
    dataData = JSON.stringify({
      spotBoxw: spotBoxw.plus(length + 2),
      spotBoxh: spotBoxh.plus(length + 2),
      minlx: minlx - length,
      minty: minty - length,
      unit,
      ldvArr,
      tdvArr,
    });
  } else {
    style += `width:${spotBoxw}%;height:${spotBoxh}%;left:${minlx}%;top:${minty}%`;
    dataData = JSON.stringify(computeCombination());
  }
  root.append(
    ` <div
    class="eightSpotBox"
    style="${style}"
    data-data=${dataData}
  ></div>`
  );
}

/**
 * 多元素拖动
 * @param {*} target
 * @param {*} dvx,dvy移动差值
 */
function allComsDrag({ dvx, dvy }) {
  let differentLevels = false;
  $(".focus").each((e, it) => {
    if (it.parentElement.id !== $(".focus")[0].parentElement.id) differentLevels = true;
  });
  if (differentLevels) {
    disableTips();
    return;
  }
  const { isBoundaryX, isBoundaryY } = checkBoundary(dvx, dvy);
  if (isBoundaryX && isBoundaryY) return;
  $(".spotBox").empty();
  if (isBoundaryX && !isBoundaryY) {
    allComsMove("y", dvx, dvy);
  } else if (!isBoundaryX && isBoundaryY) {
    allComsMove("x", dvx, dvy);
  } else {
    allComsMove("all", dvx, dvy);
  }
}

/*
 * 检查多组件边界
 */
function checkBoundary(dvx, dvy) {
  let isBoundaryX = false;
  let isBoundaryY = false;
  let parentWidth, parentHeight;
  if ($(".focus")[0]) {
    parentWidth = $(".focus")[0].parentElement.clientWidth;
    parentHeight = $(".focus")[0].parentElement.clientHeight;
  } else {
    return { isBoundaryX: true, isBoundaryY: true };
  }
  $(".focus").each((e, it) => {
    const x = parseFloat($(it).attr("data-x")) + dvx;
    const y = parseFloat($(it).attr("data-y")) + dvy;
    const width = it.clientWidth;
    const height = it.clientHeight;
    if (x < 0 || x + width > parentWidth) isBoundaryX = true;
    if (y < 0 || y + height > parentHeight) isBoundaryY = true;
  });
  return { isBoundaryX, isBoundaryY };
}

/*
 * 多组件移动
 */
function allComsMove(move, dvx, dvy) {
  let x, y;
  $(".focus").each((e, it) => {
    switch (move) {
      case "x":
        x = parseFloat($(it).attr("data-x")) + dvx;
        y = parseFloat($(it).attr("data-y"));
        break;
      case "y":
        x = parseFloat($(it).attr("data-x"));
        y = parseFloat($(it).attr("data-y")) + dvy;
        break;
      case "all":
        x = parseFloat($(it).attr("data-x")) + dvx;
        y = parseFloat($(it).attr("data-y")) + dvy;
        break;
    }
    if (vm.$root.percentOrabsolute === "absolute") {
      $(it).css("transform", "translate(" + x + "px, " + y + "px)");
    } else if (vm.$root.percentOrabsolute === "percent") {
      $(it).css("top", (y / it.parentElement.clientHeight) * 100 + "%");
      $(it).css("left", (x / it.parentElement.clientWidth) * 100 + "%");
    }
    $(it).attr("data-x", x);
    $(it).attr("data-y", y);
  });
}

/*
 * 多组件拖拽禁用提示
 */
const disableTips = _.throttle((e) => {
  antd.message.warning("所选组件来自不同层级，多组件拖拽已禁用！");
}, 3500);

/**
 * 按住拖动
 * @param {*} options
 */
const useDelegateButtonMov = () => {
  const delegateObj = { mouseHandler: {} };
  const keyPressMove = (options = {}) => {
    const { el, key, handler, cursor, isPreventDefault } = options;
    /**
     * div绑定键盘事件必须有这个东西,它原本是使用`tab`来定位元素的方式
     */
    if (!el) {
      return;
    } else if (!el.getAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    el.style.outline = "none";
    el.style.cursor = cursor.default;
    // 引用信息
    const info = {
      // 是否按住
      isPress: false,
      // 是否正在拖拽
      isGrabbing: false,
    };
    // 拖拽的起点
    const startInfo = {
      x: 0,
      y: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
    // 拖拽的偏移值
    const diffInfo = {
      x: 0,
      y: 0,
    };

    // 指定键按下
    const keyDownHandler = (e) => {
      if (vm.spaceKeyStatus) return; // 有输入框聚焦时，防止影响输入框
      const { srcElement } = delegateObj.mouseHandler;
      isPreventDefault && e.key === key && e.preventDefault();

      if (e.key === key && !info.isPress && el.contains(srcElement)) {
        info.isPress = true;
        el.style.cursor = cursor.grab;
        addMouseEvent();
        delegateObj.isMov = false;
      }
    };
    // 指定键松开
    const keyUpHandler = (e) => {
      isPreventDefault && e.key === key && e.preventDefault();
      if (e.key === key) {
        info.isPress = false;
        info.isGrabbing = false;
        el.style.cursor = cursor.default;
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        delegateObj.isMov = true;

        removeMouseEvent();
      }
    };
    // 鼠标区块信息
    const mouseHandler = (e) => {
      delegateObj.mouseHandler = e;
    };

    // 绑定
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousedown", mouseHandler);

    // 鼠标按下
    const mouseDownHandler = (e) => {
      e.stopImmediatePropagation();
      const { pageX, pageY } = e;
      if (info.isPress) {
        info.isGrabbing = true;
        startInfo.x = pageX;
        startInfo.y = pageY;
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        el.style.cursor = cursor.grabbing;
      }
    };
    // 鼠标移动
    const mousemoveHandler = (e) => {
      e.stopImmediatePropagation();
      const { pageX, pageY } = e;
      if (info.isPress && info.isGrabbing) {
        diffInfo.x = startInfo.x - pageX;
        diffInfo.y = startInfo.y - pageY;
        el.scrollLeft = startInfo.scrollLeft + diffInfo.x;
        el.scrollTop = startInfo.scrollTop + diffInfo.y;
      }
    };
    // 鼠标松开
    const mouseUpHandler = (e) => {
      e.stopImmediatePropagation();
      info.isGrabbing = false;
      if (info.isPress) {
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        el.style.cursor = cursor.grab;
      } else {
        el.style.cursor = cursor.default;
      }
    };
    // 鼠标丢失
    const mouseLeaveHandler = (e) => {
      e.stopImmediatePropagation();
      mouseUpHandler(e);
    };
    const addMouseEvent = () => {
      // console.log("添加了鼠标事件");
      el.addEventListener("mousemove", mousemoveHandler, true);
      el.addEventListener("mousedown", mouseDownHandler, true);
      el.addEventListener("mouseup", mouseUpHandler, true);
      el.addEventListener("mouseleave", mouseLeaveHandler, true);
    };
    const removeMouseEvent = () => {
      // console.log("移除了鼠标事件");
      el.removeEventListener("mousemove", mousemoveHandler, true);
      el.removeEventListener("mouseup", mouseUpHandler, true);
      el.removeEventListener("mousedown", mouseDownHandler, true);
      el.removeEventListener("mouseleave", mouseLeaveHandler, true);
    };

    // 业务逻辑一般通过这个handler来处理,由于是传递的引用对象,那么业务代码也能拿到改变后的信息
    handler && handler(info);
  };
  return {
    keyPressMove,
  };
};
const { keyPressMove } = useDelegateButtonMov();
// 主画布拖动
keyPressMove({
  el: $(".auto-size-inner-dropzone")[0],
  key: " ",
  cursor: {
    default: "default",
    grab: "grab",
    grabbing: "grabbing",
  },
  isPreventDefault: true,
  handler(info) {
    console.log(info);
  },
});
// 平台服务组件画布拖动
keyPressMove({
  el: $(".bottom-container")[0],
  key: " ",
  cursor: {
    default: "default",
    grab: "grab",
    grabbing: "grabbing",
  },
  isPreventDefault: true,
});
