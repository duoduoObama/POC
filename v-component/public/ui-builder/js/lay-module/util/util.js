/**
 * 获取参数
 * @param {*} variable
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * 创建title
 * @param {*} text
 */
function createTitle(text = ``) {
  const div = document.createElement("div");
  div.classList.add("layui-elem-quote");
  div.textContent = text;
  return div;
}

/**
 * 创建card
 * @param {*} text
 */
function createCard() {
  const div = document.createElement("div");
  div.classList.add("layui-card");
  div.style.maxHeight = `480px`;
  div.style.overflowY = "auto";
  return div;
}

/**
 * debounce 函数接受一个函数和延迟执行的时间作为参数
 * @param {*} fn 方法
 * @param {*} delay 时间
 */
function debounce(fn, delay) {
  // 维护一个 timer
  let timer = null;

  return function () {
    // 获取函数的作用域和变量
    let context = this;
    let args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * 生成hashid
 * @param {*} hashLength
 */
function createHash(hashLength) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
}

/**
 * 生成onlyid
 * @param {*} hashLength
 * @param {*} key
 */
function createHashId(hashLength = 12, key = `drag-`) {
  let probeId = `${key}${createHash(hashLength)}`;
  while ($(`#${probeId}`).length) {
    // dom存在即重新构成
    probeId = `${key}${createHash(hashLength)}`;
  }
  return probeId;
}

/**
 * 获取tree
 * @param {*} list
 * @param {*} parentId
 */
function getTrees(list, parentId = "") {
  let parentObj = {};
  list.forEach((o) => {
    parentObj[o.key] = o;
  });
  const nodes = !parentId
    ? list.filter(
        (o) =>
          !parentObj[o.parentId] &&
          ($(`#${o.key}`).parents("[data-data]")[0] ? !parentObj[$(`#${o.key}`).parents("[data-data]")[0].id] : true)
      )
    : list.filter(
        (o) =>
          o.parentId == parentId ||
          ($(`#${o.key}`).parents("[data-data]")[0] ? $(`#${o.key}`).parents("[data-data]")[0].id == parentId : false)
      );
  return nodes.map((o) => {
    o.children = getTrees(list, o.key);
    return o;
  });
}

/**
 * tab类组件添加子节点数组
 * @param {*} tempAllElement
 */
function getChildList(tempAllElement = []) {
  const filterArr = [`jz-option-panel`, `jz-tab-panel`];
  return tempAllElement.map((element) => {
    const targetType = $(element).attr("data-element-type");
    const data = JSON.parse($(element).attr("data-data"));
    data.style = $(element).attr("style");
    data.x = $(element).attr("data-x");
    data.y = $(element).attr("data-y");
    if (filterArr.includes(targetType)) {
      const childList = $.makeArray(
        $(element).children(".layui-tab-brief").children(".layui-tab-content").children()
      ).map((target) => ({
        tabsId: target.id,
        name: $(target).attr("name"),
      }));
      data.childList = childList;
    }
    return data;
  });
}

/**
 * 转换paranmlist数据给di
 * @param {*} paramList
 */
function getParamListData(paramList = []) {
  if (!paramList || !paramList.length) return [];
  const data = paramList
    .map((element) => {
      const { key } = element;
      return { [key]: element.default };
    })
    .reduce((pre, cur) => {
      pre = { ...pre, ...cur };
      return pre;
    }, {});
  return data;
}

/**
 * 驼峰转css
 */
function hump(str) {
  var reg = /([A-Z])/g;
  str = str.replace(reg, function (match) {
    return "-" + match.toLowerCase();
  });
  return str;
}

/**
 * css转驼峰
 */
function cssStyle2DomStyle(sName) {
  var ucfirst = function (s, delim) {
    delim = delim || "-";
    return s
      .split(delim)
      .map(function (s) {
        var c = s.charCodeAt(0);
        if (65 <= c && c < 65 + 26) {
          return s;
        }
        if (97 <= c && c < 97 + 26) {
          c = c & 0xdf;
        }
        return String.fromCharCode(c) + s.substr(1);
      })
      .join("");
  };
  var lowerFirstLetter = function (s) {
    var i = 0,
      c = s.charCodeAt(i);
    while (i < s.length) {
      if (97 <= c && c < 97 + 26) {
        return s;
      }
      if (65 <= c && c < 65 + 26) {
        c = c | 0x20;
        break;
      } else {
        c = s.charCodeAt(++i);
      }
    }
    return String.fromCharCode(c) + s.substr(i + 1);
  };
  var s = ucfirst(sName);
  return lowerFirstLetter(s);
}

// 主题和画布颜色
async function getThemeInfo(vm) {
  const theme = document.documentElement.style.getPropertyValue("--theme-color");
  const canvas = document.documentElement.style.getPropertyValue("--canvas-color");
  const { bgImage = ``, components = `all`, charts = `all` } = $("#inner-dropzone").data();
  const screenImage = await saveBackgroundImage();
  const percentOrabsolute = vm.percentOrabsolute;
  // 主题字段数据
  return {
    width: vm.canvasStyleData.width,
    height: vm.canvasStyleData.height,
    // leftWidth: vm.layoutData.leftWidth,
    middleWidth: vm.layoutData.middleWidth,
    rightWidth: vm.layoutData.rightWidth,
    middleTopHeight: vm.layoutData.middleTopHeight,
    middleCenterHeight: vm.layoutData.middleCenterHeight,
    middleBottomHeight: vm.layoutData.middleBottomHeight,
    theme,
    canvas,
    bgImage,
    components,
    charts,
    screenImage,
    percentOrabsolute,
  };
}

async function reloadComponent(customComponet = [], customModel = [], bottomComponetElement = []) {
  // 自定义组件
  const customComponetResult = await Promise.all(
    customComponet.map(async (target) => {
      const dataInfo = typeof target.data === `object` ? target.data : JSON.parse(target.data);
      const { x, y, style, id } = dataInfo;
      // if ($(`#${id}`).length) return;
      if (Number(dataInfo.datatype) === 1) {
        dataInfo.hasOwnProperty("data") && Reflect.deleteProperty(dataInfo, "data");
      }

      let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
      if (typeof element === `string`) {
        await new Promise((reslove2) => {
          rxjs.timer(0).subscribe(() => {
            reslove2();
          });
        });
        element = $(`#${element}`)[0];
        $(element).attr("data-tag", "up");
      }
      return element;
    })
  );

  // DI元件
  const customModelResult = await Promise.all(
    customModel.map(async (target) => {
      const dataInfo = typeof target.data === `object` ? target.data : JSON.parse(target.data);
      const { x, y, style, id } = dataInfo;
      // if ($(`#${id}`).length) return;
      let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
      if (typeof element === `string`) {
        await new Promise((reslove2) => {
          rxjs.timer(0).subscribe(() => {
            reslove2();
          });
        });
        element = $(`#${element}`)[0];
      }
      return element;
    })
  );

  // 底部元件
  const bottomComponetElementResult = await Promise.all(
    bottomComponetElement.map(async (target) => {
      const dataInfo = typeof target.data === `object` ? target.data : JSON.parse(target.data);
      const { x, y, style, id } = dataInfo;
      // if ($(`#${id}`).length) return;
      let element = createLocalElement({ ...dataInfo, style }, Number(x), Number(y));
      if (typeof element === `string`) {
        await new Promise((reslove2) => {
          rxjs.timer(0).subscribe(() => {
            reslove2();
          });
        });
        element = $(`#${element}`)[0];
      }
      $(element).attr("data-tag", "bottom");
      return element;
    })
  );

  $("#inner-dropzone").append(customComponetResult, customModelResult);
  $("#bottomcontent").append(bottomComponetElementResult);
  rxjs.timer(50).subscribe(() => {
    [...customComponetResult, ...customModelResult].forEach(async (target) => {
      if (!target) return;
      await new Promise((res) => {
        setTimeout(() => {
          const childData = JSON.parse($(target).attr("data-data"));
          if (childData.paramList && typeof childData.paramList === `string`) {
            childData.paramList = JSON.parse(childData.paramList);
          }
          let currentElement = $(`#${childData.parentId}`);
          if (!childData.parentId || !currentElement.length) return;
          currentElement.append(target);
          res();
        }, 50);
      });
    });
  });
}

//获取元素的left和top
function getElementLeftAndTop(style) {
  if (!style) return;
  let styleObj = styleToObj(style);
  let left, top, unit;
  let { width, height } = styleObj;
  if (vm.$root.percentOrabsolute === "absolute") {
    const transform = styleObj["transform"].replace("translate", "").replace(/[(|)]/g, "").split(",");
    left = parseFloat(transform[0].replace("px", ""));
    top = parseFloat(transform[1].replace("px", ""));
    unit = "px";
  } else {
    left = styleObj["left"];
    top = styleObj["top"];
    [left, top] = [left, top].map((it) => {
      return parseFloat(it.replace("%", ""));
    });
    unit = "%";
  }
  [width, height] = [width, height].map((it) => {
    return parseFloat(it.replace(unit, ""));
  });
  return { left, top, width, height };
}

function trim(str, isglobal) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (isglobal && isglobal.toLowerCase() === "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}
function styleToObj(style) {
  if (!style || style == "") {
    return;
  }
  var Arr = style.split(";");
  Arr = Arr.map((item) => trim(item)).filter((item) => {
    return item != "" && item != "undefined";
  });
  let str = "";
  Arr.forEach((item) => {
    let test = "";
    trim(item)
      .split(":")
      .forEach((item2) => {
        test += '"' + trim(item2) + '":';
      });
    str += test + ",";
  });
  str = str.replace(/:,/g, ",");
  str = str.substring(0, str.lastIndexOf(","));
  str = "{" + str + "}";
  return JSON.parse(str);
}

function styleToObj(style) {
  if (!style || style == "") {
    return;
  }
  var Arr = style.split(";");
  Arr = Arr.map((item) => this.trim(item)).filter((item) => {
    return item != "" && item != "undefined";
  });
  let str = "";
  Arr.forEach((item) => {
    let test = "";
    this.trim(item)
      .split(":")
      .forEach((item2) => {
        test += '"' + this.trim(item2) + '":';
      });
    str += test + ",";
  });
  str = str.replace(/:,/g, ",");
  str = str.substring(0, str.lastIndexOf(","));
  str = "{" + str + "}";
  return JSON.parse(str);
}
