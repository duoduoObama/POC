(function () {
  const getParamListData = (paramList = []) => {
    return paramList.reduce((pre, cur) => {
      const { key, default: value } = cur;
      pre[key] = value;
      return pre;
    }, {});
  };
  window.setTimeout(function () {
    $(".q-shrink")
      .off()
      .on("click", ".panel-put-away", (e) => {
        // 父节点
        e.stopPropagation();
        e.preventDefault();
        const obj = { left: "width", right: "width", top: "height", bottom: "height" };
        const positionMap = { right: "left", bottom: "top" };
        const parent = $(e.currentTarget).parent();
        const stringData = parent.attr("data-data");
        const data = stringData && _.isString(stringData) && JSON.parse(stringData);
        let paramList = _.isString(data.paramList) ? JSON.parse(data.paramList) : data.paramList;
        if (_.isString(paramList)) {
          paramList = JSON.parse(paramList);
        }
        let { isShow, position, oldValue } = getParamListData(paramList);
        const child = parent.find(".q-shrink-content");
        if (isShow === "close" && !child.hasClass("q-shrink-content-hide")) {
          child.addClass("q-shrink-content-hide");
        } else {
          child[0].classList.toggle("q-shrink-content-hide");
        }

        isShow === "close" ? (isShow = "open") : (isShow = "close");
        paramList.map((item) => {
          if (item.key === "isShow") {
            item.default = isShow;
          }
        });
        vm.componentsArr.forEach((target) => {
          if (target.id === data.id && vm.attrObject.id === data.id) {
            vm.$set(vm.attrObject, "paramList", JSON.stringify(paramList));
            vm.$set(target.data, "paramList", JSON.stringify(paramList));
          }
        });

        // app环境下逻辑
        // setTimeout(() => {
        // 关闭
        //判断时绝对布局还是百分比布局
        const isPosition = parent.css("transform") === "none";
        const pHeight = parent.parent()[0].scrollHeight;
        const pWidth = parent.parent()[0].scrollWidth;
        let [targetLeft, targetTop] = [0, 0];
        const value = Number(oldValue.replace("px", "").replace("%", ""));
        if (!isPosition) {
          // 绝对值布局时取translate的偏移量
          const translates = _.cloneDeep(document.defaultView.getComputedStyle(parent[0], null).transform);
          const coordinate = translates.replace(")", "").split(",");
          targetLeft = Number(coordinate[coordinate.length - 2]);
          targetTop = Number(coordinate[coordinate.length - 1]);
        } else {
          // 百分比布局时取left,top计算偏移量
          targetLeft = (Number(parent[0].style.left.substring(0, parent[0].style.left.length - 1)) / 100) * pWidth;
          targetTop = (Number(parent[0].style.top.substring(0, parent[0].style.top.length - 1)) / 100) * pHeight;
        }

        if (child.hasClass("q-shrink-content-hide")) {
          //绝对布局
          if (!isPosition) {
            // 取translate的偏移值
            const translates = document.defaultView.getComputedStyle(parent[0], null).transform;
            const coordinate = translates.replace(")", "").split(",");
            let [targetLeft, targetTop] = [
              Number(coordinate[coordinate.length - 2]),
              Number(coordinate[coordinate.length - 1]),
            ];
            switch (position) {
              case "right":
                targetLeft = targetLeft + value - 8;
                parent.css("transform", `translate(${targetLeft}px, ${targetTop}px)`).width(8);
                parent.attr("data-x", targetLeft);
                break;
              case "left":
                parent.css("transform", `translate(${targetLeft}px, ${targetTop}px)`).width(8);
                break;
              case "top":
                parent.css("transform", `translate(${targetLeft}px, ${targetTop}px)`).height(8);
                break;
              case "bottom":
                targetTop = targetTop + value - 8;
                parent.css("transform", `translate(${targetLeft}px, ${targetTop}px)`).height(8);
                parent.attr("data-y", targetTop);
                break;
            }
          } else {
            //百分比
            let abstargetLeft = 0;
            let abstargetTop = 0;
            switch (position) {
              case "right":
                // pWidth / 100
                abstargetLeft = ((targetLeft + value * pWidth - 8) / pWidth) * 100 + "%";
                targetLeft = targetLeft + value * pWidth - 8;
                parent.css({ left: abstargetLeft, width: "8px" });
                parent.attr("data-x", targetLeft);
                break;
              case "left":
                parent.css({ width: "8px" });
                break;
              case "top":
                parent.css({ height: "8px" });
                break;
              case "bottom":
                abstargetTop = ((targetTop + value * pHeight - 8) / pHeight) * 100 + "%";
                targetTop = targetTop + value * pHeight - 8;
                parent.css({ top: abstargetTop, height: "8px" });
                parent.attr("data-y", targetTop);
                break;
            }
          }
          parent.css("box-shadow", "none");
        } else {
          let oldX = null;
          let oldY = null;
          let oldWidth = null;
          let oldHeight = null;
          if (!isPosition) {
            switch (position) {
              case "right":
                oldX = targetLeft - value + 8;
                oldY = targetTop;
                oldWidth = value;
                oldHeight = parent.height();
                break;
              case "left":
                oldX = targetLeft;
                oldY = targetTop;
                oldWidth = value;
                oldHeight = parent.height();
                break;
              case "top":
                oldX = targetLeft;
                oldY = targetTop;
                oldWidth = parent.width();
                oldHeight = value;
                break;
              case "bottom":
                oldX = targetLeft;
                oldY = targetTop - value + 8;
                oldWidth = parent.width();
                oldHeight = value;
                break;
            }
          } else {
            switch (position) {
              case "right":
                oldX = targetLeft - value * pWidth + 8;
                oldY = targetTop;
                oldWidth = value * pWidth;
                oldHeight = parent.height();
                break;
              case "left":
                oldX = targetLeft;
                oldY = targetTop;
                oldWidth = value * pWidth;
                oldHeight = parent.height();
                break;
              case "top":
                oldX = targetLeft;
                oldY = targetTop;
                oldWidth = parent.width();
                oldHeight = value * pHeight;
                break;
              case "bottom":
                oldX = targetLeft;
                oldY = targetTop - value * pHeight + 8;
                oldWidth = parent.width();
                oldHeight = value * pHeight;
                break;
            }
          }

          if (!isPosition) {
            parent[obj[position]](value)
              .css("transform", `translate(${oldX}px, ${oldY}px)`)
              .attr("data-x", oldX)
              .attr("data-y", oldY);
          } else {
            //百分比
            targetLeft = (oldX / pWidth) * 100 + "%";
            targetTop = (oldY / pHeight) * 100 + "%";
            targetWidth = (oldWidth / pWidth) * 100 + "%";
            targetHeight = (oldHeight / pHeight) * 100 + "%";
            parent.css({ left: targetLeft, top: targetTop, width: targetWidth, height: targetHeight });
          }
          parent.attr("data-x", oldX).attr("data-y", oldY);
        }
      });
  }, 2000);
})();
