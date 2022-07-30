function comSwiper() {
  window.setTimeout(function () {
    if ((typeof vm !== "undefined" && vm.editMode === "edit") || location.href.includes("/ui-builder/dist")) return;
    if (!window.Swiper) return;
    const swiper = new Swiper(`.swiper-container`, {
      noSwiping: true, // 关闭手动切换
      paginationClickable: true,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
      autoplay: {
        delay: 2000, //2秒切换一次
        disableOnInteraction: false,
      },
      pagination: {
        el: `.swiper-pagination`,
      },
    });
    if (typeof vm === "undefined") {
      $(".yyui_menu1 > li").on("click", function (e) {
        $(e.currentTarget)
          .parent(".yyui_menu1")
          .children("li")
          .children(".ub-active-menu")
          .removeClass("ub-active-menu");
        $(e.currentTarget).children("a").addClass("ub-active-menu");
      });
      $(".layui-event-btn").remove();
    }
  }, 2000);
}
comSwiper();
