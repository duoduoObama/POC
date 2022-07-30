(function () {
  const getParamListData = (paramList = []) => {
    return paramList.reduce((pre, cur) => {
      const { key, default: value } = cur;
      pre[key] = value;
      return pre;
    }, {});
  };
  // Define default settings
  var settings = {
    contextMenuClass: "contextMenuPlugin",
    gutterLineClass: "",
    headerClass: "header",
    seperatorClass: "divider",
    title: "",
    items: [],
  };
  function createMenu(e) {
    var menu = $(
      '<ul class="' + settings.contextMenuClass + '"><div class="' + settings.gutterLineClass + '"></div></ul>'
    ).appendTo(document.body);
    if (settings.title) {
      $('<li class="' + settings.headerClass + '"></li>')
        .text(settings.title)
        .appendTo(menu);
    }
    settings.items.forEach(function (item) {
      if (item) {
        var rowCode = '<li><a href="javascript:void(0);"><span></span></a></li>';
        // if(item.icon)
        //   rowCode += '<img>';
        // rowCode +=  '<span></span></a></li>';
        var row = $(rowCode).appendTo(menu);
        if (item.icon) {
          var icon = $("<img>");
          icon.attr("src", item.icon);
          icon.insertBefore(row.find("span"));
        } 
        row.find("span").text(item.label);
        if (item.action) {
          row.find("a").click(function () {
            item.action(e);
          });
        }
      } else {
        $('<li class="' + settings.seperatorClass + '"></li>').appendTo(menu);
      }
    });
    menu.find("." + settings.headerClass).text(settings.title);
    return menu;
  }

  function start(e) {
    var menu = createMenu(e).show();

    var left = e.pageX + 5 /* nudge to the right, so the pointer is covering the title */,
      top = e.pageY;
    if (top + menu.height() >= $(window).height()) {
      top -= menu.height();
    }
    if (left + menu.width() >= $(window).width()) {
      left -= menu.width();
    }

    const { bgImage, bgColor, fontColor } = e;
    const initialCss = { zIndex: 1000001, left: left, top: top };
    if (bgImage) {
      Object.assign(initialCss, {
        outline: "none",
        borderImage: `url("${bgImage}") 10`,
        borderWidth: "10px",
      });
    }
    if (bgColor) {
      menu.children("li").css({ backgroundColor: bgColor });
    }
    if (fontColor) {
      menu.find("a").css({ color: fontColor });
    }
    // Create and show menu
    menu.css(initialCss).bind("contextmenu", function () {
      return false;
    });

    // Cover rest of page with invisible div that when clicked will cancel the popup.
    var bg = $("<div></div>")
      .css({ left: 0, top: 0, width: "100%", height: "100%", position: "absolute", zIndex: 1000000 })
      .appendTo(document.body)
      .bind("contextmenu click", function () {
        // If click or right click anywhere else on page: remove clean up.
        bg.remove();
        menu.remove();
        return false;
      });

    // When clicking on a link in menu: clean up (in addition to handlers on link already)
    menu.find("a").click(function () {
      bg.remove();
      menu.remove();
    });

    // Cancel event, so real browser popup doesn't appear.
    return false;
  }
  window.setTimeout(function () {
    let paramListInfo = [];

    $("[data-element-type='q-contextmenu']")
      .off()
      .on("contextmenu", function (e) {
        e.stopPropagation();
        e.preventDefault();
        const { target } = e;
        let { paramList = [] } = JSON.parse(target.dataset.data);
        if (typeof paramList === "string") {
          try {
            paramListInfo = JSON.parse(paramList);
          } catch (error) {
            paramListInfo = [];
            console.log(error);
          }
        } else {
          paramListInfo = paramList;
        }
        const { curId, bindId, contextmenu = "[]", bgColor, bgImage, fontColor } = getParamListData(paramListInfo);
        if (curId !== target.id) return;

        const items = JSON.parse(contextmenu);

        if (bindId) {
          $(`#${bindId}`)
            .off()
            .on("contextmenu", function (e) {
              e.stopPropagation();
              e.preventDefault();
              let { paramList = [] } = JSON.parse($(`#${curId}`).attr("data-data"));
              if (typeof paramList === "string") {
                try {
                  paramListInfo = JSON.parse(paramList);
                } catch (error) {
                  paramListInfo = [];
                  console.log(error);
                }
              } else {
                paramListInfo = paramList;
              }
              const openLayer = {
                // title: "My Popup Menu",
                items: items
                  .filter(({ isShow = true }) => isShow)
                  .map((current) => {
                    const { title, id } = current;
                    return {
                      label: title,
                      action: function (e) {
                        const element = document.querySelector(`#${id}`);
                        if (!element) return antd.message.error("组件未找到!");
                        $(element).trigger("click");
                        // const temp = element.cloneNode(true);
                        // const temp = element;
                        // temp.style.transform = "none";
                        // temp.dataset.x = 0;
                        // temp.dataset.y = 0;
                        // layer.open({ content: temp.outerHTML, area: ["500px", "300px"], title: "功能操作", btn: false });
                      },
                    };
                  }),
              };
              Object.assign(settings, openLayer);
              Object.assign(e, { bgImage, bgColor, fontColor });
              start(e);
            });
        }
      });

    $("[data-element-type='q-contextmenu']").trigger("contextmenu");
  }, 2000);
})();
