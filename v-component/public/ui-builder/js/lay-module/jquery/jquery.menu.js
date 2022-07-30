function startMenu(ulclass) {
  // 显示隐藏
  $($(ulclass + "> li")[0]).addClass("ub-active-menu");
  $(ulclass)
    .off()
    .on("mouseenter mouseleave click", "li", function (e) {
      if (e.type === `mouseleave`) {
        $(this).children("ul").hide();
        return;
      }
      $(this).children("ul").show();
    })
    .on("click", "li", function (e) {
      e.stopPropagation();
      if (location.href.includes("dist/index.html")) {
        return;
      }
      // addEvent(e.currentTarget, $(ulclass));
    });
  $(ulclass)
    .parent()
    .on("mouseenter", function (e) {
      $(this).css({ overflow: "initial" });
    });
  $(ulclass + "> li").on("click", function (e) {
    $(ulclass + "> li.ub-active-menu").removeClass("ub-active-menu");
    $(e.currentTarget).addClass("ub-active-menu");
  });
}

function findTreeInfo(treeInfo, key, dom) {
  let len = 0;
  while (treeInfo[len]) {
    if (treeInfo[len].domId === key) {
      treeInfo[len].dom = dom;
    }
    if (treeInfo[len].children) {
      findTreeInfo(treeInfo[len].children, key, dom);
    }
    len++;
  }
}

/**
 * 删除tree数据
 * @param {*} treeInfo
 * @param {*} key
 * @param {*} dom
 */
function deleteTreeInfo(treeInfo, key) {
  let len = 0;
  while (treeInfo[len]) {
    if (treeInfo[len].dom && treeInfo[len].dom.includes(key)) {
      delete treeInfo[len].dom;
    }
    if (treeInfo[len].children) {
      deleteTreeInfo(treeInfo[len].children, key);
    }
    len++;
  }
}
