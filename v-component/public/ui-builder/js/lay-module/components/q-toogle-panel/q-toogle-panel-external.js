// di和ui-builder脱离组件控制折叠代码
(function () {
  window.setTimeout(function () {
    $(".panel-toggle-icon")
      .off()
      .on("click", function (e) {
        const headerElement = e.currentTarget.nextElementSibling;
        const result = headerElement.classList.toggle("panel-top-header-block");
        e.currentTarget.style = result ? "margin-top:45px" : "margin-top:-5px";
      });
    $(".q-toogle-panel")
      .off()
      // .on("click", ".icons-list>button", function (e) {
      .on("click", ".external-wrap", function (e) {
        const { delegateTarget } = e;
        const [left, right, bottom] = [
          $(delegateTarget).find(".tpanel-left-horizontal")[0],
          $(delegateTarget).find(".tpanel-right-horizontal")[0],
          $(delegateTarget).find(".tpanel-container-horizontal")[0],
        ];
        // const index = $(this).index();
        const index = +$(this).attr("data-index");
        // [left, right, bottom][index].classList.toggle("panel-content-none");
        $([left, right, bottom][index]).find(".tpanel-content-horizontal")[0].classList.toggle("panel-content-none");
        if (index === 2) {
          const node = $(bottom).find(".tpanel-content-horizontal");
          const parent = node.parent();
          const height = parseFloat(parent.attr("data-height") || "200");
          const marginTop = parseFloat(parent.css("marginTop"));
          if (node.hasClass("panel-content-none")) {
            parent.css("marginTop", marginTop + height + "px");
          } else {
            parent.css("marginTop", marginTop - height + "px");
          }
        }
      });
  }, 2000);
})();
