// 编辑器自定义事件
var customEvents = {
  redirect(param) {
    if (param) {
      const { url } = param;
      window.open(url);
    }
  },

  alert(param) {
    if (param) {
      const { message } = param;
      alert(message);
    }
  },

  interval(param, target) {
    if (param) {
      const { time } = param;
      const getMethod = () => {
        rxjs.timer(time || 2000).subscribe(() => {
          fetch(`../transfer-data`, {
            method: "POST",
            body: JSON.stringify(param),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              obEvents.setSelectedPoint({ sender: "轮询事件", receiver: target.data.id }, data.results);
              getMethod();
            });
        });
      };
      getMethod();
    }
  },

  message(param) {
    if (param) {
      const { message } = param;
      alert(message);
    }
  },

  triggerEvent(param, target) {
    if (param) {
      const { applyTime, isEventLoop = 0 } = param;
      const getMethod = () => {
        rxjs.timer(applyTime || 2000).subscribe(() => {
          obEvents.setSelectedPoint({ sender: "触发事件", receiver: target.data.id, type: "event" }, param);
          if (isEventLoop === 1) {
            getMethod();
          }
        });
      };
      getMethod();
    }
  },
};

var eventList = [
  {
    key: "redirect",
    label: "跳转事件",
    event: customEvents.redirect,
    param: "",
  },
  {
    key: "alert",
    label: "alert事件",
    event: customEvents.alert,
    param: "",
  },
  {
    key: "interval",
    label: "轮询事件",
    event: customEvents.interval,
    param: "",
  },
  {
    key: "triggerEvent",
    label: "触发事件",
    event: customEvents.triggerEvent,
    param: "",
  },
];
