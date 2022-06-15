// di和ui-builder脱离组件控制折叠代码
(function () {
  window.setTimeout(function () {
    $(".q-tabs-toogle-direction")
      .off()
      .on("click", function (e) {
        console.log(e);
        const content =
          e.target.parentElement.parentElement.parentElement.parentElement;
        const header = e.target.parentElement.parentElement;
        const { tag, toogleWidth, toogle } = e.target.dataset;
        switch (tag) {
          case "top":
            if (toogle === "open") {
              e.target.dataset.toogle = "close";
              $(content).height($(header).height());
            } else {
              e.target.dataset.toogle = "open";
              $(content).height(toogleWidth);
            }
            break;
          case "right":
            if (toogle === "open") {
              e.target.dataset.toogle = "close";
              $(content).width($(header).width());
            } else {
              e.target.dataset.toogle = "open";
              $(content).width(toogleWidth);
            }
            break;
        }
      });
  }, 2000);
})();
