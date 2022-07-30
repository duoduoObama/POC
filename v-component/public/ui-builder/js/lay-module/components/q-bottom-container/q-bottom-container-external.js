(function () {
  // $(document)
  //   .off()
  //   .on("click", (e) => {
  //     e.stopPropagation();
  //     const { target } = e;
  //     // 模拟点击被弹窗复制出来的元素
  //     if (!target || !target.id) return;
  //     let allElement;
  //     const customApp = $(target).parents("#customApp");
  //     if (customApp.length > 0) {
  //       allElement = customApp[0].querySelectorAll(`#${target.id}`);
  //     } else {
  //       allElement = document.querySelectorAll(`#${target.id}`);
  //     }
  //     if (allElement.length > 1 && target) {
  //       $(`#${target.id}`).click();
  //     }
  //   });
})();
