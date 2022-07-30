var client = (function () {
  //呈现引擎
  var engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,

    //版本号
    ver: null,
  };

  //浏览器
  var browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,

    //版本号
    ver: null,

    // 控制台输出版本信息
    consoleVesion: "UIBuilder-DI1.7 测试版",
  };

  //操作系统
  var system = {
    win: false,
    mac: false,
    x11: false,

    //移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,
  };

  //检测呈现引擎和版本
  var ua = navigator.userAgent;
  if (window.opera) {
    engine.ver = browser.ver = window.opera.version();
    engine.operae = browser.opera = parseFloat(engine.ver);
  } else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp["$1"];
    engine.webkit = parseFloat(engine.ver);

    //确定是chrome还是safari
    if (/Chrome\/(\S+)/.test(ua)) {
      browser.ver = RegExp["$1"];
      browser.chrome = parseFloat(browser.ver);
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp["$1"];
      browser.safari = parseFloat(browser.ver);
    } else {
      var safariVersion = 1;
      if (engine.webkit < 100) {
        safariVersion = 1;
      } else if (engine.webkit < 312) {
        safariVersion = 1.2;
      } else if (engine.webkit < 412) {
        safariVersion = 1.3;
      } else {
        safariVersion = 2;
      }

      browser.safari = browser.ver = safariVersion;
    }
  } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp["$1"];
    engine.khtml = browser.konq = parseFloat(engine.ver);
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp["$1"];
    engine.gecko = parseFloat(engine.ver);

    //确定是否firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp["$1"];
      browser.firefox = parseFloat(browser.ver);
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp["$1"];
    engine.ie = browser.ie = parseFloat(engine.ver);
  }

  //检测操作系统
  var p = navigator.platform;
  system.win = p.indexOf("Win") == 0;
  system.mac = p.indexOf("Mac") == 0;
  system.x11 = p.indexOf("X11") == 0 || p.indexOf("Linux") == 0;

  //检测移动设备
  system.iphone = ua.indexOf("iPhone") > -1;
  system.ipod = ua.indexOf("iPod") > -1;
  system.ipad = ua.indexOf("iPad") > -1;
  system.nokiaN = ua.indexOf("nokiaN") > -1;
  if (system.win == "CE") {
    system.winMobile = system.win;
  } else if (system.win == "Ph") {
    if (/Window Phone OS (\d+.\d+)/.test(ua)) {
      system.win = "Phone";
      system.winMobile = parseFloat(RegExp["$1"]);
    }
  }
  if (system.mac && ua.indexOf("Mobile") > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
      system.ios = parseFloat(RegExp.$1.replace("_", "."));
    } else {
      system.ios = 2;
    }
  }
  if (/Android (\d+\.\d+)/.test(ua)) {
    system.android = parseFloat(RegExp.$1);
  }

  return {
    engine: engine,
    browser: browser,
    system: system,
  };
})();

/**
 * 加载模板页面
 */
function reloadTemplatePage(client) {
  var browser = client.browser;
  setTimeout(
    console.log.bind(
      console,
      `%c${browser.consoleVesion}`,
      "text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:18px;background-color: #8BC2FF;color: #fff;padding: 5px 10px;border-radius: 6px;font-weight: 600"
    )
  );
  setTimeout(console.log.bind(console, browser));
  var targetBrowser = Object.keys(browser).filter(function (current) {
    return browser[current];
  })[0];
  switch (targetBrowser) {
    case "chrome":
      if (browser[targetBrowser] < 60) {
        location.href = "/ui-builder/page/404.html";
      }
      break;
    case "firefox":
      if (browser[targetBrowser] < 60) {
        location.href = "/ui-builder/page/404.html";
      }
      break;
    case "ie":
      if (browser[targetBrowser] < 11) {
        location.href = "/ui-builder/page/404.html";
      }
      break;
    case void 0:
      location.href = "/ui-builder/page/404.html";
      break;
    default:
      break;
  }
}

reloadTemplatePage(client);
