import { BehaviorSubject, filter } from "rxjs";
// import { pageScript } from "../page/index";

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
   * @param {
   * sender:string 发送者
   * node:stirng 节点
   * receiver:string 接受点
   * event:string [] 事件接受点
   * type:string 事件类型
   * eventData:object 事件触发元数据
   * body:any 消息数据
   *
   * } eventName string | Object
   * @param {*} selectedPointsIfo
   */
  this.setSelectedPoint = (eventName, selectedPointsIfo = {}) => {
    pageScript(eventName, selectedPointsIfo);
    if (typeof eventName === `string`) {
      this.obSubject.next({
        receiver: eventName,
        body: selectedPointsIfo,
        type: "info",
      });
    } else if (typeof eventName === `object`) {
      const {
        sender,
        receiver,
        eventData = {},
        replyStatus = false,
        reply = [],
        header = {},
      } = eventName;
      this.obSubject.next({
        sender,
        receiver,
        header,
        eventData,
        replyStatus,
        reply,
        body: selectedPointsIfo,
      });
    }
  };

  this.setSelectedAllPoint = (selectedPointsIfo = []) => {
    selectedPointsIfo.forEach((item) => {
      this.obSubject.next({
        sender: item.sendId,
        receiver: item.receiveId,
        // type,
        body: item,
      });
    });
  };

  /**
   * 事件订阅
   * @param {*} eventName
   */
  this.currentSelectedPoint = (eventName) => {
    this.createEvent();
    return this.obSubject.pipe(
      filter((x) => x !== 0),
      filter((x) => x.receiver && x.receiver.includes(eventName))
      // debounceTime(500)
    );
  };

  /**
   * 多播总事件
   */
  this.createEvent = () => {
    if (!this.obSubject) {
      const subject = new BehaviorSubject(0);
      this.obSubject = subject;
    }
  };
}

export const obEvents = new ObservableMethods();
