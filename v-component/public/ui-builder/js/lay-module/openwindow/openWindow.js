(function (window) {
  var childWindow = {}; // 打开的哪些窗口, 按照 url路径：window或者 app名称:window
  var openWindow = {};
  var brothers = [];
  var mainFn = []; // 存入所有的监听回调方法
  var respFn = {}; // 响应方法集合
  // var parentUrl = ""; // 当前的父url
  var currentUrl = ""; // 当前被打开的url
  var firstSendDataFn = null; // 首次向子页面发送数据，需要先确定子页面已加载完成

  openWindow.receiveFn = (fn) => {
    mainFn.push(fn);
  }

  /**
   * 首次向子页面发送数据，需要先确定子页面已加载完成，配合子页面的readyComplete使用，只会执行一次，后面会情况
   * @param {*} fn 
   */
  openWindow.firstSendFn = (fn) => {
    firstSendDataFn = fn;
  }

  const $emit = (val) => {
    mainFn.map((fn) => {
      fn(val);
    });
  }

  const respEmit = (url, val) => {
    respFn[url].map((fn) => {
      fn(val);
    });
  }

  openWindow.off = (fn) => {
    if (fn) {
      let index = mainFn.indexOf(fn);
      if (index > -1) {
        mainFn.splice(index, 1);
      }
    } else {
      mainFn.length = 0;
      //设长度为0比mainFn[name] = []更优，因为如果是空数组则又开辟了一个新空间，设长度为0则不必开辟新空间
    }
  }

  // 绑定onmessage事件接收到的消息
  window.onmessage = function (event) { // 暂定义发送消息格式为 {type:'app',data:data}
    // TODO 判断方法需要根据接收到的具体数据格式修改
    console.log('接收消息', event);
    if (event.data.isComplete) { // 父接收到子窗口已加载完成的消息，这里不做处理，下面window.addEventListener('message', clientA);单独监听处理的
      noticeChildren();
      if(firstSendDataFn){
        firstSendDataFn();
        firstSendDataFn = null;
      }
      return;
    }
    if (event.data.brothers) { // 存所有同级子窗口
      brothers = event.data.brothers;
      return;
    }
    if (event.data.url) {
      currentUrl = event.data.url;
    }
    if (event.data && event.data.type === 'transfer') {
      openWindow.sendMessage(event.data.target, event.data.data)
      return;
    }
    if (event.data.data && event.data.data.type === 'app') {
      $emit(event.data.data);
    } else {
      if (event.data.response && event.data.responseUrl) {
        respEmit(event.data.responseUrl, event.data.response);
      } else {
        $emit(event.data.data);
      }
    }
  }

  // 获取所有同级子窗口
  openWindow.getBrothers = function () {
    console.log('获取所有同级子窗口', brothers);
    return brothers;
  }

  /**
   * 废弃此方法，使用sendMessage可兼容功能
   * @param {*} target 
   * @param {*} data 
   */
  openWindow.sendMessageToBrother = function (target, data) {
    if (window.opener) {
      if (!window.opener.closed) {
        var params = {
          target: target,
          type: 'transfer',
          data: data
        };
        window.opener.postMessage(params, '*');
      } else {
        alert("父窗口已关闭");
      }
    } else if ((self.frameElement && self.frameElement.tagName == "IFRAME") || window.frames.length != parent.frames.length || window.self !== window.parent) {
      var params = {
        target: target,
        type: 'transfer',
        data: data
      };
      window.parent.postMessage(params, '*');
    } else {
      alert("无父窗口");
    }
  }

  // 发送消息给父窗口
  openWindow.sendToParent = function (data) {
    console.log('给父发', data);
    var params = {
      data: data
    };
    if (window.opener) {
      if (!window.opener.closed) {
        window.opener.postMessage(params, '*');
      }
    } else if (window.self !== window.parent && window.parent.frames.length > 0) {
      window.parent.postMessage(params, '*');
    }
  }

  openWindow.sendMessage = function (url, data) {
    if (typeof url === 'string') {
      if (url === 'parent') {  // iframe or open新窗口
        sendMsgToParent(data);
      } else {
        sendMsg(url, data);
      }
    } else { // 嵌入式的iframe子窗口
      sendMsgToIfram(url, data);
    }
  }

  // 给被url打开的窗口发送消息
  function sendMsg(url, data) {
    var curWin = childWindow[url];
    if (!curWin || curWin.closed) {
      // alert("无子窗口，或子窗口已关闭");
      delete childWindow[url];
      sendMsgToIfram(url, data);
      // if (confirm("无子窗口或子窗口已关闭，是否打开子窗口再发送消息？")) {
      //   openWindow.openNewWindow(url, data);
      // }
    } else {
      var params = {
        url: url,
        data: data
      };
      curWin.postMessage(params, '*');
      console.log('发送子消息完毕', data);
    }
    if (window.opener && !window.opener.closed) {
      var params = {
        target: url,
        type: 'transfer',
        data: data
      };
      window.opener.postMessage(params, '*');
      console.log('通过父给url发消息', data);
    }
  }

  // 给父窗口发送消息
  function sendMsgToParent(data) {
    if (window.opener) {
      if (!window.opener.closed) {
        var params = {
          data: data
        };
        window.opener.postMessage(params, '*');
      } else {
        alert("父窗口已关闭");
      }
    } else if ((self.frameElement && self.frameElement.tagName == "IFRAME") || window.frames.length != parent.frames.length || window.self !== window.top) {
      var params = {
        data: data
      };
      window.parent.postMessage(params, '*');
    } else {
      alert("无父窗口");
    }
  }

  // 向iframe嵌入式窗口传数据，未经调试
  function sendMsgToIfram(url, data) {
    var params = {
      url: url,
      data: data
    };
    if (typeof url === 'string') {
      var frameX = getFrameByUrl(url);
      frameX.postMessage(params, "*")
      return;
    } else {
      url.postMessage(params, '*');
    }
  }


  // 打开子窗口，或者同时发送消息
  openWindow.openNewWindow = function (url, data) {
    if (data.type && data.type === 'app') { // 打开APP单独处理，不通用，DI内部app互开
      var curWin = childWindow[data.data.appname];
      if (curWin && !curWin.closed) {
        // 打开过再自动执行
        if (data) {
          var params = {
            url: url,
            data: data
          };
          curWin.postMessage(params, curWin.location.origin); // app打开是同源的，能获取到目标wi
        }
        // 已经打开过子窗口，且还存在
        curWin.focus();
      } else {
        if (data.data.autorun) {
          url = url + '&autorun=true' + (data.data.endPos ? '&endPos=' + data.data.endPos : '');
        }
        if (data.data.runId) {
          url = url + '&runId=' + data.data.runId;
        }
        curWin = window.open(url);
        childWindow[data.data.appname] = curWin;
      }
      return;
    }
    var curWin = childWindow[url];
    if (curWin && !curWin.closed) {
      // 打开过再自动执行
      if (data) {
        var params = {
          url: url,
          data: data
        };
        curWin.postMessage(params, '*');
      }
      // 已经打开过子窗口，且还存在
      curWin.focus();
    } else {
      curWin = window.open(url);
      childWindow[url] = curWin;
      noticeChildren();
      if (data) {
        console.log('等待发送消息');
        function clientA(event) { // TODO 暂定义发送消息格式为 {type:'app',data:data}
          // TODO 判断方法需要根据接收到的具体数据格式修改
          console.log('发送消息clientA', event);
          if (event.data.isComplete) {
            var params = {
              url: url,
              data: data
            };
            curWin.postMessage(params, '*');
            window.removeEventListener('message', clientA);
          }
        }
        window.addEventListener('message', clientA);
      }
    }
  }

  // 子页面加载完成发消息给父页面
  openWindow.readyComplete = function (isComplete) {
    if (isComplete) {
      if (window.opener) {
        console.log('isComplete-opener');
        window.opener.postMessage({ isComplete: true }, '*');
      }
      if ((self.frameElement && self.frameElement.tagName == "IFRAME") || window.frames.length != parent.frames.length || window.self !== window.parent) {
        console.log('isComplete-parent');
        window.parent.postMessage({ isComplete: true }, '*');
      }
    }
  };

  // 判断窗口是否存在，返回true/false
  openWindow.isExist = function (url) {
    if (url && typeof url !== 'string') {
      return true;
    }
    if (url === 'parent') {
      if (window.opener) {
        if (window.opener.closed) {
          window.opener = undefined;
          return false;
        } else {
          return true;
        }
      } else if (window.parent !== window.self && window.parent.frames.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      var curWin = childWindow[url];
      if (!curWin || curWin.closed) {
        delete childWindow[url];
        var frame = getFrameByUrl(url);
        if (frame) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }
  }

  openWindow.sendResponse = function (url, responseData) {
    if (typeof url === 'string') {
      var data = {
        response: responseData,
      }
      if (url === 'parent') {  // 子向父窗口发送响应数据
        data['responseUrl'] = currentUrl;
        if (window.opener) {
          window.opener.postMessage(data, '*');
        } else if (window.parent !== window.self && window.parent.frames.length > 0) {
          return window.parent.postMessage(data, '*');
        }
      } else {
        data['responseUrl'] = 'parent';
        if (childWindow[url]) {
          childWindow[url].postMessage(data, '*');
        } else if (getFrameByUrl(url)) {
          var frameX = getFrameByUrl(url);
          frameX.postMessage(data, '*');
        }
      }
    }
  };

  openWindow.receiveResponse = function (url, callback) {
    if (respFn[url]) {
      respFn[url] = [];
    }
    respFn[url].push(callback);
  };

  function getFrameByUrl(url) {
    if (window.frames.length > 0) {
      var framesEle = document.getElementsByTagName("iframe");
      for (let index = 0; index < framesEle.length; index++) {
        var frameX = framesEle[index];
        if (frameX.src === encodeURI(url)) {
          return frameX.contentWindow;
        }
      }
    }
    return false;
  }

  function noticeChildren() {
    var childUrlList = [];
    var childrenWin = [];
    for (var key in childWindow) {
      childUrlList.push(key);
      childrenWin.push(childWindow[key])
    }
    var data = {
      brothers: childUrlList,
    }
    console.log('发送所有子窗口', childUrlList);
    for (var win of childrenWin) {
      if (win && !win.closed) {
        win.postMessage(data, '*');
      }
    }
  }


  window.openWindow = openWindow;

})(window)