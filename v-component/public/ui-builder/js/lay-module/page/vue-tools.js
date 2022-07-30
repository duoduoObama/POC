/**
 * 对齐方法
 */
var alignment = {
  /**
   * 左对齐
   */
  leftAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const minX = Math.min(...elementArr.map((element) => element.getAttribute("data-x")));
    const minLeft = Math.min(...elementArr.map((element) => element.style.left.replace("px", "").replace("%", "")));
    elementArr.forEach((element) => {
      const dataY = element.getAttribute("data-y");
      element.setAttribute("data-x", minX);
      if (vm.percentOrabsolute === "absolute") {
        element.style.transform = `translate(${minX}px,${dataY}px)`;
      } else {
        element.style.left = `${minLeft}%`;
      }
    });
    this.combination();
  },
  /**
   * 右对齐
   */
  rightAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const parentWidth = $(elementArr[0].parentElement).width();
    const maxX = Math.max(...elementArr.map((element) => Number(element.getAttribute("data-x")) + $(element).width()));
    const maxRight = Math.max(
      ...elementArr.map(
        (element) =>
          Number(element.style.left.replace("px", "").replace("%", "")) +
          Number(element.style.width.replace("px", "").replace("%", ""))
      )
    );
    elementArr.forEach((element) => {
      const dataY = element.getAttribute("data-y");
      element.setAttribute("data-x", (parentWidth < maxX ? parentWidth : maxX) - $(element).width());
      if (vm.percentOrabsolute === "absolute") {
        element.style.transform = `translate(${
          (parentWidth < maxX ? parentWidth : maxX) - $(element).width()
        }px,${dataY}px)`;
      } else {
        const width = Number(element.style.width.replace("px", "").replace("%", ""));
        element.style.left = `${maxRight < 100 ? maxRight - width : 100 - width}%`;
      }
    });
    this.combination();
  },
  /**
   * 水平对齐
   */
  centerAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    if ($(".focus").length <= 1) {
      return;
    }
    const isLast = $(lastFocusElement).hasClass("focus");
    const elementArr = $.makeArray($(".focus"));
    const parentHeight = $(elementArr[0].parentElement).height(); // 父级高度用于边界处理，防止超出边界
    function change(ele) {
      elementArr.forEach((element) => {
        if (element.id === ele.id) return;
        const dataX = element.getAttribute("data-x");
        let targetY = Number($(ele).attr("data-y")) + $(ele).height() / 2 - $(element).height() / 2;
        targetY =
          targetY < 0 ? 0 : targetY + $(element).height() > parentHeight ? parentHeight - $(element).height() : targetY;
        let targetTop =
          Number(ele.style.top.replace("px", "").replace("%", "")) +
          Number(ele.style.height.replace("px", "").replace("%", "")) / 2 -
          Number(element.style.height.replace("px", "").replace("%", "")) / 2;
        const height = Number(element.style.height.replace("px", "").replace("%", ""));
        targetTop = targetTop < 0 ? 0 : targetTop + height > 100 ? 100 - height : targetTop;
        element.setAttribute("data-y", targetY);
        if (vm.percentOrabsolute === "absolute") {
          element.style.transform = `translate(${dataX}px,${targetY}px)`;
        } else {
          element.style.top = `${targetTop}%`;
        }
      });
    }
    if (isLast) {
      change(lastFocusElement);
      this.combination();
      return;
    }
    change(elementArr[0]);
    this.combination();
  },
  /**
   * 垂直对齐
   */
  verticalAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    if ($(".focus").length <= 1) {
      return;
    }
    const isLast = $(lastFocusElement).hasClass("focus");
    const elementArr = $.makeArray($(".focus"));
    const parentWidth = $(elementArr[0].parentElement).width(); // 父级宽度用于边界处理，防止超出边界
    function change(ele) {
      elementArr.forEach((element) => {
        if (element.id === ele.id) return;
        const dataY = element.getAttribute("data-y");
        let targetX = Number($(ele).attr("data-x")) + $(ele).width() / 2 - $(element).width() / 2;
        targetX =
          targetX < 0 ? 0 : targetX + $(element).width() > parentWidth ? parentWidth - $(element).width() : targetX;
        let targetLeft =
          Number(ele.style.left.replace("px", "").replace("%", "")) +
          Number(ele.style.width.replace("px", "").replace("%", "")) / 2 -
          Number(element.style.width.replace("px", "").replace("%", "")) / 2;
        const width = Number(element.style.width.replace("px", "").replace("%", ""));
        targetLeft = targetLeft < 0 ? 0 : targetLeft + width > 100 ? 100 - width : targetLeft;
        element.setAttribute("data-x", targetX);
        if (vm.percentOrabsolute === "absolute") {
          element.style.transform = `translate(${targetX}px,${dataY}px)`;
        } else {
          element.style.left = `${targetLeft}%`;
        }
      });
    }
    if (isLast) {
      change(lastFocusElement);
      this.combination();
      return;
    }
    change(elementArr[0]);
    this.combination();
  },
  /**
   * 顶端对齐
   */
  topAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    if ($(".focus").length <= 1) {
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const minY = Math.min(...elementArr.map((element) => element.getAttribute("data-y")));
    const minTop = Math.min(...elementArr.map((element) => element.style.top.replace("px", "").replace("%", "")));
    elementArr.forEach((element) => {
      const dataX = element.getAttribute("data-x");
      element.setAttribute("data-y", minY);
      if (vm.percentOrabsolute === "absolute") {
        element.style.transform = `translate(${dataX}px,${minY}px)`;
      } else {
        element.style.top = `${minTop}%`;
      }
    });
    this.combination();
  },
  /**
   * 底部对齐
   */
  bottomAlign() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    if ($(".focus").length <= 1) {
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const parentHeight = $(elementArr[0].parentElement).height();
    const maxY = Math.max(...elementArr.map((element) => Number(element.getAttribute("data-y")) + $(element).height()));
    const maxBottom = Math.max(
      ...elementArr.map(
        (element) =>
          Number(element.style.top.replace("px", "").replace("%", "")) +
          Number(element.style.height.replace("px", "").replace("%", ""))
      )
    );
    elementArr.forEach((element) => {
      const dataX = element.getAttribute("data-x");
      element.setAttribute("data-y", (parentHeight < maxY ? parentHeight : maxY) - $(element).height());
      if (vm.percentOrabsolute === "absolute") {
        element.style.transform = `translate(${dataX}px,${
          (parentHeight < maxY ? parentHeight : maxY) - $(element).height()
        }px)`;
      } else {
        const height = Number(element.style.height.replace("px", "").replace("%", ""));
        element.style.top = `${maxBottom < 100 ? maxBottom - height : 100 - height}%`;
      }
    });
    this.combination();
  },
  /**
   * 等尺寸
   */
  allelicWidthHeight() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    if ($(".focus").length <= 1) {
      return;
    }
    const isLast = $(lastFocusElement).hasClass("focus");
    const allFocus = $.makeArray($(".focus"));
    if (isLast) {
      let width = lastFocusElement.style.width;
      let height = lastFocusElement.style.height;
      allFocus.forEach((current) => {
        current.style.width = width;
        current.style.height = height;
      });
      this.combination();
      return;
    }
    width = allFocus[0].style.width;
    height = allFocus[0].style.height;
    allFocus.forEach((current) => {
      current.style.width = width;
      current.style.height = height;
    });
    this.combination();
  },
  /**
   * 横向分布
   */
  centerDistribution() {
    const elementArr = $.makeArray($(".focus"));
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    } else if (elementArr.length === 2) {
      return;
    }
    const allElementNumber = [...elementArr].map((current) => Number($(current).attr("data-x")));
    const min = Math.min(...allElementNumber);
    const max = Math.max(...allElementNumber);
    const minIndex = allElementNumber.indexOf(min);
    allElementNumber.splice(minIndex, 1);
    elementArr.splice(minIndex, 1);
    const maxIndex = allElementNumber.indexOf(max);
    allElementNumber.splice(maxIndex, 1);
    elementArr.splice(maxIndex, 1);
    const targetLen = (max - min) / ($(".focus").length - 1);
    const parentWidth = $(elementArr[0].parentElement).width(); // 父级宽度用于边界处理，防止超出边界
    let len = targetLen;
    elementArr.forEach((current, index) => {
      const dataY = $(current).attr("data-y");
      len = (index + 1) * targetLen + min;
      len = len + $(current).width() > parentWidth ? parentWidth - $(current).width() : len;
      current.setAttribute("data-x", len);
      if (vm.percentOrabsolute === "absolute") {
        current.style.transform = `translate(${len}px,${dataY}px)`;
      } else {
        current.style.left = `${Number((len / parentWidth) * 100).toFixed(2)}%`;
      }
    });
    this.combination();
  },
  /**
   * 垂直分布
   */
  verticalDistribution() {
    const elementArr = $.makeArray($(".focus"));
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    } else if (elementArr.length === 2) {
      return;
    }
    const allElementNumber = [...elementArr].map((current) => Number($(current).attr("data-y")));
    const min = Math.min(...allElementNumber);
    const max = Math.max(...allElementNumber);
    const minIndex = allElementNumber.indexOf(min);
    const maxIndex = allElementNumber.indexOf(max);
    allElementNumber.splice(minIndex, 1);
    allElementNumber.splice(maxIndex, 1);
    elementArr.splice(minIndex, 1);
    elementArr.splice(maxIndex, 1);
    const targetLen = (max - min) / ($(".focus").length - 1);
    const parentHeight = $(elementArr[0].parentElement).height(); // 父级高度用于边界处理，防止超出边界
    let len = targetLen;
    elementArr.forEach((current, index) => {
      const dataX = $(current).attr("data-x");
      len = (index + 1) * targetLen + min;
      len = len + $(current).height() > parentHeight ? parentHeight - $(current).height() : len;
      current.setAttribute("data-y", len);
      if (vm.percentOrabsolute === "absolute") {
        current.style.transform = `translate(${dataX}px,${len}px)`;
      } else {
        current.style.top = `${Number((len / parentHeight) * 100).toFixed(2)}%`;
      }
    });
    this.combination();
  },
  /**
   * 等高
   */
  equalAltitude() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    const isLast = $(lastFocusElement).hasClass("focus");
    const allFocus = $.makeArray($(".focus"));
    if (isLast) {
      let height = lastFocusElement.style.height;
      allFocus.forEach((current) => {
        // 解决不生效的问题
        current.style.height = height;
      });
      this.combination();
      return;
    }
    height = allFocus[0].style.height;
    allFocus.forEach((current) => {
      // 解决不生效的问题
      current.style.height = height;
    });
    this.combination();
  },
  /**
   * 等宽
   */
  equalWidth() {
    if (!isPlane()) {
      antd.message.warning("操作元素需要在一个父节点下!");
      return;
    }
    const isLast = $(lastFocusElement).hasClass("focus");
    const allFocus = $.makeArray($(".focus"));
    if (isLast) {
      let width = lastFocusElement.style.width;
      allFocus.forEach((current) => {
        current.style.width = width;
      });
      this.combination();
      return;
    }
    width = allFocus[0].style.width;
    allFocus.forEach((current) => {
      current.style.width = width;
    });
    this.combination();
  },

  setzIndex(type = ``) {
    const elementArr = $.makeArray($(".focus"));
    if (type === `up`) {
      elementArr.forEach((target) => {
        const zIndex = $(target).css("z-index");
        if (zIndex === `auto`) {
          $(target).css("z-index", 1);
        } else {
          $(target).css("z-index", Number(zIndex) + 1);
        }
        const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
        const index = $(focusElement).attr("index");
        const targetInfo = JSON.parse($(target).attr("data-data"));
        targetInfo.style = $(target).attr("style");
        $(target).attr("data-data", JSON.stringify(targetInfo));
        vm.$set(vm.$data.attrObject, "style", $(target).attr("style"));
        if (!index && focusElement.length === 1) {
          changeElement({
            ...focusElement[0].dataset,
            data: vm.$data.attrObject,
          });
        }
      });
      return;
    }
    elementArr.forEach((target) => {
      const zIndex = $(target).css("z-index");
      if (zIndex === `auto` || Number(zIndex) === 0) {
        $(target).css("z-index", 0);
      } else {
        $(target).css("z-index", Number(zIndex) - 1);
      }
      const focusElement = $(".focus").length ? $(".focus") : $(".focusbottom");
      const index = $(focusElement).attr("index");
      const targetInfo = JSON.parse($(target).attr("data-data"));
      targetInfo.style = $(target).attr("style");
      $(target).attr("data-data", JSON.stringify(targetInfo));
      vm.$set(vm.$data.attrObject, "style", $(target).attr("style"));
      if (!index && focusElement.length === 1) {
        changeElement({
          ...focusElement[0].dataset,
          data: vm.$data.attrObject,
        });
      }
    });
  },
  /**
   * 键盘移动组件
   */
  keyMove(event, key) {
    // 防止影响输入框方向键
    if (!vm.keyMoveStatus) return;

    event.preventDefault();
    let differentLevels = false;
    const elementArr = $.makeArray($(".focus"));
    elementArr.forEach((element) => {
      if (element.parentElement.id !== elementArr[0].parentElement.id) differentLevels = true;
    });
    if (!elementArr.length || differentLevels) {
      this.disableTips();
      return;
    }
    elementArr.forEach((element) => {
      const x = Number(element.getAttribute("data-x"));
      const y = Number(element.getAttribute("data-y"));
      const width = Number(element.style.width.replace("px", "").replace("%", ""));
      const height = Number(element.style.height.replace("px", "").replace("%", ""));
      const top = Number(element.style.top.replace("px", "").replace("%", ""));
      const left = Number(element.style.left.replace("px", "").replace("%", ""));
      const parentWidth = element.parentElement.clientWidth;
      const parentHeight = element.parentElement.clientHeight;
      switch (key) {
        case "left":
          if (x <= 0) return;
          element.setAttribute("data-x", x - 1);
          if (vm.percentOrabsolute === "absolute") {
            element.style.transform = `translate(${x - 1}px,${y}px)`;
          } else {
            element.style.left = `${(((x - 1) / parentWidth) * 100).toFixed(2)}%`;
          }
          break;
        case "right":
          if (vm.percentOrabsolute === "absolute" ? x + width >= parentWidth : left + width >= 100) return;
          element.setAttribute("data-x", x + 1);
          if (vm.percentOrabsolute === "absolute") {
            element.style.transform = `translate(${x + 1}px,${y}px)`;
          } else {
            element.style.left = `${(((x + 1) / parentWidth) * 100).toFixed(2)}%`;
          }
          break;
        case "up":
          if (y <= 0) return;
          element.setAttribute("data-y", y - 1);
          if (vm.percentOrabsolute === "absolute") {
            element.style.transform = `translate(${x}px,${y - 1}px)`;
          } else {
            element.style.top = `${(((y - 1) / parentHeight) * 100).toFixed(2)}%`;
          }
          break;
        case "down":
          if (vm.percentOrabsolute === "absolute" ? y + height >= parentHeight : top + height >= 100) return;
          element.setAttribute("data-y", y + 1);
          if (vm.percentOrabsolute === "absolute") {
            element.style.transform = `translate(${x}px,${y + 1}px)`;
          } else {
            element.style.top = `${(((y + 1) / parentHeight) * 100).toFixed(2)}%`;
          }
          break;
        default:
          break;
      }
      if (elementArr.length === 1) {
        this.changeStyle(element);
      }
    });
    this.combination();
  },
  changeStyle: _.debounce(function (element) {
    vm.$set(vm.$data.attrObject, "style", $(element).attr("style"));
  }, 300),
  combination: _.debounce(function () {
    comsCombination();
  }, 300),
  disableTips: _.throttle((e) => {
    antd.message.warning("所选组件来自不同层级，多组件移动已禁用！");
  }, 3500),

  allAlignmentEvents(e) {
    switch (e.key) {
      case `1`:
        this.leftAlign();
        break;
      case `2`:
        this.rightAlign();
        break;
      case `3`:
        this.topAlign();
        break;
      case `4`:
        this.bottomAlign();
        break;
      case `5`:
        this.centerAlign();
        break;
      case `6`:
        this.verticalAlign();
        break;
      case `7`:
        this.centerDistribution();
        break;
      case `8`:
        this.verticalDistribution();
        break;
      case `9`:
        this.equalAltitude();
        break;
      case `10`:
        this.equalWidth();
        break;
      case `11`:
        this.allelicWidthHeight();
        break;
    }
  },
};

/**
 * 是否一个平面
 * @returns
 */
function isPlane() {
  const elementArr = $.makeArray($(".focus"));
  const [first] = elementArr;
  return elementArr.every((element) => element.parentNode.id === first.parentNode.id);
}

/**
 * 标尺工具
 */
var rulersTools = {
  bindMarkEvent() {
    // 监听元素移动和不移动的事件
    this.$on("move", (dragNode, isDownward, isRightward) => {
      this.showLine(dragNode, isDownward, isRightward);
    });

    this.$on("unmove", () => {
      this.hideLine();
    });
  },
  hideLine() {
    Object.keys(this.lineStatus).forEach((line) => {
      this.lineStatus[line] = false;
    });
  },
  showLine(dragNode, isDownward, isRightward) {
    const lines = this.$refs;
    const components = $.makeArray($(dragNode).siblings(".draggable2"));
    const dragNodeRectInfo = this.getNodeRelativePosition(dragNode);
    const dragNodeHalfwidth = dragNodeRectInfo.width / 2;
    const dragNodeHalfHeight = dragNodeRectInfo.height / 2;

    this.hideLine();
    components.forEach((node) => {
      if (node == dragNode) return;
      const { top, height, bottom, left, width, right } = this.getNodeRelativePosition(node);
      const nodeHalfwidth = width / 2;
      const nodeHalfHeight = height / 2;

      const conditions = {
        top: [
          {
            isNearly: this.isNearly(dragNodeRectInfo.top, top),
            lineNode: lines.xt[0], // xt
            line: "xt",
            dragShift: top,
            lineShift: top,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.bottom, top),
            lineNode: lines.xt[0], // xt
            line: "xt",
            dragShift: top - dragNodeRectInfo.height,
            lineShift: top,
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: this.isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, top + nodeHalfHeight),
            lineNode: lines.xc[0], // xc
            line: "xc",
            dragShift: top + nodeHalfHeight - dragNodeHalfHeight,
            lineShift: top + nodeHalfHeight,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.top, bottom),
            lineNode: lines.xb[0], // xb
            line: "xb",
            dragShift: bottom,
            lineShift: bottom,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.bottom, bottom),
            lineNode: lines.xb[0], // xb
            line: "xb",
            dragShift: bottom - dragNodeRectInfo.height,
            lineShift: bottom,
          },
        ],
        left: [
          {
            isNearly: this.isNearly(dragNodeRectInfo.left, left),
            lineNode: lines.yl[0], // yl
            line: "yl",
            dragShift: left,
            lineShift: left,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.right, left),
            lineNode: lines.yl[0], // yl
            line: "yl",
            dragShift: left - dragNodeRectInfo.width,
            lineShift: left,
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: this.isNearly(dragNodeRectInfo.left + dragNodeHalfwidth, left + nodeHalfwidth),
            lineNode: lines.yc[0], // yc
            line: "yc",
            dragShift: left + nodeHalfwidth - dragNodeHalfwidth,
            lineShift: left + nodeHalfwidth,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.left, right),
            lineNode: lines.yr[0], // yr
            line: "yr",
            dragShift: right,
            lineShift: right,
          },
          {
            isNearly: this.isNearly(dragNodeRectInfo.right, right),
            lineNode: lines.yr[0], // yr
            line: "yr",
            dragShift: right - dragNodeRectInfo.width,
            lineShift: right,
          },
        ],
      };

      const needToShow = [];
      Object.keys(conditions).forEach((key) => {
        if (!this.isRuler) {
          return;
        }
        // 遍历符合的条件并处理
        conditions[key].forEach((condition) => {
          if (!condition.isNearly || $(".focus").length > 1) return;
          // 修改当前组件位移
          const [xTarget, yTarget] = $(".focus").css("transform").replace(")", "").split(",").slice(-2).map(Number);
          if (key === `left`) {
            $(".focus")
              .css("transform", `translate(${condition.dragShift}px,${yTarget}px)`)
              .attr("data-x", condition.dragShift);
          } else {
            $(".focus")
              .css("transform", `translate(${xTarget}px,${condition.dragShift}px)`)
              .attr("data-y", condition.dragShift);
          }
          condition.lineNode.style[key] = `${condition.lineShift}px`;
          needToShow.push(condition.line);
        });
      });

      // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
      // 同一方向上的线只显示一条，例如多条横条只显示一条横线
      if (needToShow.length) {
        this.chooseTheTureLine(needToShow, isDownward, isRightward);
      }
    });
  },
  chooseTheTureLine(needToShow, isDownward, isRightward) {
    // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
    // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
    if (isRightward) {
      if (needToShow.includes("yr")) {
        this.lineStatus.yr = true;
      } else if (needToShow.includes("yc")) {
        this.lineStatus.yc = true;
      } else if (needToShow.includes("yl")) {
        this.lineStatus.yl = true;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes("yl")) {
        this.lineStatus.yl = true;
      } else if (needToShow.includes("yc")) {
        this.lineStatus.yc = true;
      } else if (needToShow.includes("yr")) {
        this.lineStatus.yr = true;
      }
    }

    if (isDownward) {
      if (needToShow.includes("xb")) {
        this.lineStatus.xb = true;
      } else if (needToShow.includes("xc")) {
        this.lineStatus.xc = true;
      } else if (needToShow.includes("xt")) {
        this.lineStatus.xt = true;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes("xt")) {
        this.lineStatus.xt = true;
      } else if (needToShow.includes("xc")) {
        this.lineStatus.xc = true;
      } else if (needToShow.includes("xb")) {
        this.lineStatus.xb = true;
      }
    }
  },
  isNearly(dragValue, targetValue) {
    return Math.abs(dragValue - targetValue) <= this.diff;
  },
  // 获取节点相对编辑器的位置
  getNodeRelativePosition(node) {
    let { top, height, bottom, left, width, right } = node.getBoundingClientRect();
    const editorRectInfo = $(node).parent()[0].getBoundingClientRect();

    left -= editorRectInfo.left;
    top -= editorRectInfo.top;
    right -= editorRectInfo.left;
    bottom -= editorRectInfo.top;

    return { top, height, bottom, left, width, right };
  },
};

var menuTools = {
  copy(target, combination = { all: [], children: [] }) {
    const getElement = (comArr) => {
      const arr = !combination.all.length
        ? [$(target), ...$(target).find("[data-data]")].map((c) => JSON.parse($(c).attr("data-data")))
        : [target, ...combination.children];
      return comArr.length !== 0
        ? arr.map((c) => {
            const targetObj = comArr.find((_) => _.id === c.id) || {};
            return Object.keys(targetObj).length
              ? {
                  ...c,
                  name: targetObj.data.name,
                }
              : targetObj;
          })
        : [];
    };
    const allElement = [
      ...getElement(vm.componentsArr, false),
      ...getElement(vm.componentsHideArr, false),
      ...getElement(
        combination.all.map((it) => {
          return {
            data: it,
            name: it.componentName,
            id: it.id,
            targetId: it.id,
          };
        }),
        false
      ),
    ].filter((it) => Object.keys(it).length !== 0);

    allElement.forEach((current) => {
      const id = createHashId();
      try {
        if (typeof current.options === `string`) {
          current.options = JSON.parse(current.options);
        }
      } catch {}
      if (Array.isArray(current.options) && current.options.length) {
        if (current.options[0].tabsId) {
          current.options.forEach((targetElement) => {
            const parentId = createHashId();
            allElement.forEach((alltarget) => {
              if (targetElement.tabsId === alltarget.parent) {
                alltarget.parent = parentId;
                alltarget.parentId = parentId;
              }
            });
            targetElement.tabsId = parentId;
          });
        } else if (current.options[0].id) {
          const recursion = function (data) {
            data.map((option) => {
              if (option.hasOwnProperty("id")) {
                const createId = createHashId();
                allElement.map((el) => {
                  if (option.id === el.parentId) {
                    el.parentId = createId;
                    el.special = true;
                    option.parentName && (el.parentName = option.parentName);
                  }
                });
                option.id = createId;
                if (option.children && option.children.length) recursion(option.children);
              }
            });
          };
          recursion(current.options);
        }
      }
      allElement.forEach((alltarget) => {
        if (current.id === alltarget.parent || current.id === alltarget.parentId) {
          alltarget.parent = id;
          alltarget.parentId = id;
        }
      });
      current.id = id;
      current.targetId = id;
    });

    allElement.forEach((c) => {
      const { x, y, style } = c;
      Object.assign(c, {
        style: `${style};visibility:hidden;`,
      });
      createLocalElement(c, x, y);
      rxjs.timer(500).subscribe(() => {
        Object.assign(c, {
          style: `${style};visibility:visible`,
        });
      });
    });
    return allElement;
  },
  autoSave() {
    const element = document.querySelector("#inner-dropzone");
    const subject = new rxjs.Subject();
    let isReady = true;

    subject.pipe(rxjs.operators.debounceTime(2000)).subscribe(async (e) => {
      try {
        if (isReady) {
          isReady = false;
          await saveInfo("update", null, true);
          isReady = true;
        }
      } catch (error) {
        isReady = true;
      }
    });

    const callBack = (e) => {
      if (isReady) {
        subject.next(e);
      }
    };

    const observer = new MutationObserver(callBack);
    observer.observe(element, {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      attributes: true, // 观察属性变动
      subtree: false, // 观察后代节点，默认为 false
    });
    return observer;
  },
};

/**
 * 布局设置
 */
var displayTools = {
  setabsolute() {
    [...vm.componentsArr, ...vm.componentsHideArr].forEach(({ id }) => {
      const element = $(`#${id}`)[0];
      if (!element || element.classList.contains("draggable-grid")) return;
      if (element.parentElement.dataset.elementType !== "container") {
        element.style.removeProperty("top");
        element.style.removeProperty("left");
      }
      let { x, y } = element.dataset;
      const { clientHeight, clientWidth } = element;
      [x, y] = [Number(x), Number(y)];
      element.style.transform = `translate(${x}px, ${y}px)`;
      if (element.classList.contains("focus")) {
        element.style.width = `${clientWidth + 2}px`;
        element.style.height = `${clientHeight + 2}px`;
      } else if (element.classList.value.includes("draggable-grid") || (!clientWidth && !clientHeight)) {
        // TODO
      } else {
        clientWidth && (element.style.width = `${clientWidth}px`);
        clientHeight && (element.style.height = `${clientHeight}px`);
      }
      const data = JSON.parse(element.dataset.data);
      data.style = element.style.cssText;
      element.dataset.data = JSON.stringify(data);
    });
  },
  setPercent() {
    rxjs.timer(500).subscribe(() => {
      [...vm.componentsArr, ...vm.componentsHideArr].forEach(({ id }) => {
        const element = $(`#${id}`)[0];
        if (!element || element.classList.contains("draggable-grid")) return;
        element.style.removeProperty("transform");
        let { x, y } = element.dataset;
        [x, y] = [Number(x), Number(y)];
        const { height, width } = element.getBoundingClientRect();
        let pHeight = element.parentElement.clientHeight;
        let pWidth = element.parentElement.clientWidth;

        element.style.top = `${new BigNumber(y).div(pHeight).multipliedBy(100).dp(3).toNumber()}%`;
        element.style.left = `${new BigNumber(x).div(pWidth).multipliedBy(100).dp(3).toNumber()}%`;
        if (element.classList.value.includes("draggable-grid") || (!width && !height)) {
          // TODO
        } else {
          const percentBNWidth = new BigNumber(width).div(pWidth).multipliedBy(100).dp(3).toNumber();
          const percentBNHeight = new BigNumber(height).div(pHeight).multipliedBy(100).dp(3).toNumber();
          const percentWidth = percentBNWidth > 100 ? 100 : percentBNWidth;
          const percentHeight = percentBNHeight > 100 ? 100 : percentBNHeight;
          element.style.width = `${percentWidth}%`;
          element.style.height = `${percentHeight}%`;
        }
        const data = JSON.parse(element.dataset.data);
        data.style = element.style.cssText;
        element.dataset.data = JSON.stringify(data);
      });
      this.setCanvas();
    });
  },
  setCanvas() {
    rxjs.timer(1000).subscribe(() => {
      if (vm.editMode === "read" && vm.percentOrabsolute === "percent") {
        const element = document.querySelector("#inner-dropzone");
        element.style.height = "100vh";
        element.style.width = "100vw";
      }
    });
  },
};
