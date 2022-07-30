function ObservableMethods() {
  /**
   * 事件总线
   */
  this.obSubject = null;

  /**
   *
   * 所有subscribe订阅 Array[{observable:Subscriber}]
   */
  this.allSubscribe = [];

  /**
   * 设置事件发送
   * @param {*} eventName string | Array
   * @param {*} selectedPointsIfo
   */
  this.setSelectedPoint = (eventName, selectedPointsIfo = {}) => {
    if (typeof eventName === `string`) {
      this.obSubject.next({
        receiver: eventName,
        body: selectedPointsIfo,
        type: "info",
      });
    } else if (typeof eventName === `object`) {
      const { sender, receiver, type = "info" } = eventName;
      // type = "info" | "event"
      this.obSubject.next({
        sender,
        receiver,
        type,
        body: selectedPointsIfo,
      });
    }
  };

  /**
   * 事件订阅
   * @param {*} eventName
   */
  this.currentSelectedPoint = (eventName) => {
    this.createEvent();
    return this.obSubject.pipe(
      rxjs.operators.filter((x) => x !== 0),
      rxjs.operators.filter((x) => x.receiver.includes(eventName))
    );
  };

  /**
   * 多播总事件
   */
  this.createEvent = () => {
    if (!this.obSubject) {
      const subject = new rxjs.BehaviorSubject(0);
      this.obSubject = subject;
    }
  };
}

var obEvents = new ObservableMethods();
