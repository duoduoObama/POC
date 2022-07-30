(function () {
  var scrollSetp = 500,
    operationWidth = 90,
    leftOperationWidth = 30,
    animatSpeed = 150,
    linkframe = function (url, value, target) {
      if ((!url && !value) || !target) return;
      $("#" + target + " .menu-list a.active").removeClass("active");
      $("#" + target + " .menu-list a[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
      $("#" + target + " .page-content iframe.active").removeClass("active");
      $("#" + target + " .page-content .iframe-content[data-url='" + url + "'][data-value='" + value + "']").addClass(
        "active"
      );
      $("#" + target + " .menu-all-ul li.active").removeClass("active");
      $("#" + target + " .menu-all-ul li[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
    },
    move = function (selDom, target) {
      var nav = $("#" + target + " .menu-list");
      var releft = selDom.offset().left - $("#" + target + " .page-tab").offset().left;
      var wwidth = parseInt($("#" + target + " .page-tab").width());
      var left = parseInt(nav.css("margin-left"));

      if (releft < 0 && releft <= wwidth) {
        nav.animate(
          {
            "margin-left": left - releft + leftOperationWidth + "px",
          },
          animatSpeed
        );
      } else {
        if (releft + selDom.width() > wwidth - operationWidth) {
          nav.animate(
            {
              "margin-left": left - releft + wwidth - selDom.width() - operationWidth + "px",
            },
            animatSpeed
          );
        }
      }
    },
    createmove = function (target) {
      var nav = $("#" + target + " .menu-list");
      var wwidth = parseInt($("#" + target + " .page-tab").width());
      var navwidth = parseInt(nav.width());
      if (wwidth > navwidth && wwidth - operationWidth < navwidth) {
        nav.animate(
          {
            "margin-left": "-" + (navwidth - wwidth + operationWidth) + "px",
          },
          animatSpeed
        );
      }
    },
    closemenu = function (e, target) {
      $(e.target.parentElement).animate(
        {
          width: "0",
          padding: "0",
        },
        0,
        function () {
          var jthis = $(e.target.parentElement);
          if (jthis.hasClass("active")) {
            var linext = jthis.next();
            if (linext.length > 0) {
              linext.click();
              move(linext, target);
            } else {
              var liprev = jthis.prev();
              if (liprev.length > 0) {
                liprev.click();
                move(liprev, target);
              }
            }
          }
          jthis.remove();
          const removeArr = [
            { target: ".page-content", child: ".iframe-content" },
            { target: ".menu-all-ul", child: "li" },
          ];
          removeArr.map((it) => {
            $(
              `#${target} ${it.target} ${it.child}[data-url='${jthis.data("url")}'][data-value='${jthis.data(
                "value"
              )}']`
            ).remove();
          });
        }
      );
    },
    init = function (target) {
      $("#" + target + " .page-prev").on("click", function () {
        var nav = $("#" + target + " .menu-list");
        var left = parseInt(nav.css("margin-left"));
        if (left !== 0) {
          nav.animate(
            {
              "margin-left": (left + scrollSetp > 0 ? 0 : left + scrollSetp) + "px",
            },
            animatSpeed
          );
        }
        $("#" + target + " .menu-all").hide();
      });
      $("#" + target + " .page-next").on("click", function () {
        var nav = $("#" + target + " .menu-list");
        var left = parseInt(nav.css("margin-left"));
        var wwidth = parseInt($("#" + target + " .page-tab").width());
        var navwidth = parseInt(nav.width());
        var allshowleft = -(navwidth - wwidth + operationWidth);
        if (allshowleft !== left && navwidth > wwidth - operationWidth) {
          var temp = left - scrollSetp;
          nav.animate(
            {
              "margin-left": (temp < allshowleft ? allshowleft : temp) + "px",
            },
            animatSpeed
          );
        }
        $("#" + target + " .menu-all").hide();
      });
      $("#" + target + " .page-operation")
        .off()
        .on("click", function () {
          var menuall = $("#" + target + " .menu-all");
          if (menuall.is(":visible")) {
            menuall.hide();
          } else {
            menuall.show();
          }
        });
      $("body")
        .off()
        .on("mousedown", function (event) {
          if (
            !(
              event.target.className === "menu-all" ||
              event.target.className === "menu-all-ul" ||
              event.target.className === "page-operation" ||
              event.target.className === "iframe-target"
            )
          ) {
            $("#" + target + " .menu-all").hide();
          }
        });
    };
  $.fn.tab = function (target) {
    init(target);
    return this;
  };
  $.fn.creatIframe = function (data = { url: "", name: "" }, target) {
    if (!Object.keys(data).length) return;
    var linkUrl = data.url;
    var linkHtml = data.name;
    if (linkUrl === undefined || !linkHtml === undefined) return;
    var selDom = $("#" + target + " .menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']");
    if (selDom.length === 0) {
      var iel = $("<i>", {
        class: "menu-close",
      });
      $("<a>", {
        html: linkHtml,
        href: "javascript:void(0);",
        class: "menu-list-a",
        "data-url": linkUrl,
        "data-value": linkHtml,
      })
        .append(iel)
        .appendTo("#" + target + " .menu-list");
      $("<iframe>", {
        class: "iframe-content",
        "data-url": linkUrl,
        "data-value": linkHtml,
        src: linkUrl,
      }).appendTo("#" + target + " .page-content");
      $("<li>", {
        html: linkHtml,
        class: "iframe-target",
        "data-url": linkUrl,
        "data-value": linkHtml,
      }).appendTo("#" + target + " .menu-all-ul");
      createmove(target);
    } else {
      move(selDom, target);
    }
    linkframe(linkUrl, linkHtml, target);
  };
  $.fn.initWrap = function (target) {
    $(`#${target}`).find(".menu-list").css("margin-left", "0");
    $(`#${target}`).find(".menu-list").empty();
    $(`#${target}`).find(".menu-all-ul").empty();
    $(`#${target}`).find(".page-content").empty();
  };

  // 事件委托，防止jquery动态生成DOM时事件挂载失败
  $.fn.eventDelegation = function (target) {
    $(`#${target} .menu-content`).on("click", `.menu-close`, function (e) {
      closemenu(e, target);
    });
    $(`#${target} .menu-list`).on("click", `.menu-list-a`, function (e) {
      linkframe(e.target.dataset.url, e.target.dataset.value, target);
      $("#" + target + " .menu-all").hide();
    });
    $(`#${target} .menu-all-ul`).on("click", `.iframe-target`, function (e) {
      linkframe(e.target.dataset.url, e.target.dataset.value, target);
      move(
        $(
          "#" +
            target +
            " .menu-list a[data-url='" +
            e.target.dataset.url +
            "'][data-value='" +
            e.target.dataset.value +
            "']"
        ),
        target
      );
      $("#" + target + " .menu-all").hide();
      e.stopPropagation();
    });
  };
})();
(function () {
  window.setTimeout(function () {
    if ((typeof vm !== "undefined" && vm.editMode === "edit") || location.href.includes("/ui-builder/dist")) return;
    // 获取script标签上的iframe组件id
    document.querySelectorAll(".q-iframe-external").forEach((it) => {
      const target = it.getAttribute("data");
      $.fn.tab(target);
      $.fn.eventDelegation(target);
    });

    document.querySelectorAll("[data-elemnet-type='iframe']").forEach(async (element) => {
      let temp;
      temp =
        typeof JSON.parse(element.dataset.data).options === "string"
          ? JSON.parse(JSON.parse(element.dataset.data).options) === "string"
            ? JSON.parse(JSON.parse(JSON.parse(element.dataset.data).options))
            : JSON.parse(JSON.parse(element.dataset.data).options)
          : JSON.parse(element.dataset.data).options;
      temp.map((it) => {
        $.fn.creatIframe(it);
      });
    });
  }, 2000);
})();
