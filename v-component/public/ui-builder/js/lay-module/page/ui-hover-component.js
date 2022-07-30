/**
 * 清空拖动(在打包后生效)
 */
function clearDrag() {
  if (vm.editMode === "edit") return;
  rxjs.timer(200).subscribe(() => {
    $.makeArray($(".draggable2")).forEach((element) => {
      element.classList.add("draggable-disable");
      element.classList.remove("draggable2");
      element.classList.remove("focus");
    });
    $.makeArray($(".layui-event-btn")).forEach((element) => {
      element.remove();
    });
  });
}

async function configMethods(vm = {}) {
  await editService.systemConfig().then((res) => {
    $("html").data("config", res.results || {});
    const { pageInfo: { theme = "{}" } = {} } = $("html").data();
    const { app_cavans_color, app_theme_color, is_grid } = res.results || {};
    const { bgImage = "" } = JSON.parse(theme || "{}");
    if (Object.keys(vm).length) {
      vm.themeConfig.themeColors = app_theme_color;
      vm.themeConfig.canvasColors = app_cavans_color;
      vm.themeConfig.isGrid = is_grid;
    }
    if (res.results.used) {
      if ($(".header-logo").length) {
        $(".header-logo").text(res.results.website_name);
      }
      if (window.location.href.indexOf("/dist/") > 0 && !document.querySelector("#app_publish_path")) {
        $("body").append(`<script id="app_publish_path" type="module" src="${res.results.app_publish_path}"></script>`);
      }
      document.documentElement.style.setProperty("--theme-color", app_theme_color);
      document.documentElement.style.setProperty("--canvas-color", app_cavans_color);
      // 背景图优先展示
      if (!bgImage) {
        setBackgroundGrid({ isGrid: is_grid, canvasColors: app_cavans_color });
      }
    } else {
      editService
        .queryConfig()
        .then((data) => {
          let websiteName = data.results.find((item) => {
            return item.key.indexOf("web.uibuilder.website_name") >= 0;
          });
          let publishUrl = data.results.find((item) => {
            return item.key.indexOf("web.uibuilder.app_publish_path") >= 0;
          });
          if ($(".header-logo").length) {
            $(".header-logo").text(websiteName.config);
          }
          if (window.location.href.indexOf("/dist/") > 0) {
            $("body").append(`<script src="${publishUrl.config}"></script>`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

/**
 * 修改配置
 * @param {*} config 配置
 */
function changeConfig(config = {}, isMessage = true) {
  return new Promise((reslove, reject) => {
    editService
      .saveConfig(config)
      .then((res) => {
        if (isMessage) {
          antd.message.success("修改成功!");
        }
        reslove();
      })
      .catch((err) => {
        antd.message.error("修改失败,请稍后重试");
        console.log(err);
        reject();
      });
  });
}

/**
 * 设置背景网格
 * @param {*} config
 */
function setBackgroundGrid(config = { canvasColors: "#fffffff" }) {
  if (config.isGrid) {
    $("#inner-dropzone").css({
      background: "none",
      backgroundImage: `
            repeating-linear-gradient( 
            0deg,
            var(--canvas-fence-color) 0px,
            var(--canvas-fence-color) 0px,
            transparent 1px, transparent 16px ),
            repeating-linear-gradient(90deg,
            var(--canvas-fence-color) 0px,
            var(--canvas-fence-color) 0px,
            var(--canvas-color) 1px,
            var(--canvas-color) 16px )`,
    });
  } else {
    const bgColor =
      typeof config.canvasColors === `object`
        ? `rgba(${config.canvasColors.r},${config.canvasColors.g},${config.canvasColors.b},${config.canvasColors.a})`
        : config.canvasColors;
    $("#inner-dropzone").css({ backgroundColor: bgColor, backgroundImage: "none" });
  }
}

/**
 * 保存画布
 */
async function saveBackgroundImage() {
  async function compress(base64, rate) {
    return new Promise((reslove, reject) => {
      //处理缩放，转格式
      var _img = new Image();
      _img.src = base64;
      _img.onload = function () {
        var _canvas = document.createElement("canvas");
        var w = this.width / rate;
        var h = this.height / rate;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        var base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function (blob) {
          if (blob.size > 750 * 1334) {
            //如果还大，继续压缩
            compress(base64, rate);
          } else {
            reslove(base64);
          }
        }, "image/jpeg");
      };
    });
  }
  return new Promise((reslove, reject) => {
    const node = document.querySelector("#inner-dropzone");
    reslove("../../ui-builder/images/empty.png");
    // domtoimage
    //   .toPng(node, { imagePlaceholder: "../../ui-builder/images/empty.png" })
    //   .then(async (dataUrl) => {
    //     const img = new Image();
    //     img.src = dataUrl;
    //     reslove(await compress(dataUrl, 3));
    //   })
    //   .catch(function (error) {
    //     // console.error("oops, something went wrong!", error);
    //   })
    //   .finally(() => {
    //     reslove(`../../ui-builder/images/empty.png`);
    //   });
  });
}
