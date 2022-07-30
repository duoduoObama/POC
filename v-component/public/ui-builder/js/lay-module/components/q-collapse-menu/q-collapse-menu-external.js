(function () {
  window.setTimeout(function () {
    if ((typeof vm !== "undefined" && vm.editMode === "edit") || location.href.includes("/ui-builder/dist")) return;
    document.querySelectorAll(".metismenu").forEach((element) => {
      $(element).metisMenu("dispose");
      $(element).metisMenu();
    });
  }, 2000);
})();
