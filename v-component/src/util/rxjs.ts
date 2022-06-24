import { IMessage } from "../types/IComponent";
import { getTargetElement } from "./utils";
import rxjs from "rxjs";

function ObservableMethods() {
  /**
   * 事件总线
   */
  let obSubject = <any>null;

  /**
   *
   * 所有subscribe订阅 Array[{observable:Subscriber}]
   */
  const allSubscribe = [];

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
  const setSelectedPoint = (eventName: IMessage, selectedPointsIfo = {}) => {
    const {} = eventName;
    obSubject.next({
      body: selectedPointsIfo,
    });
  };

  const setSelectedAllPoint = (selectedPointsIfo = []) => {
    selectedPointsIfo.forEach((item: any) => {
      obSubject.next({
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
  const currentSelectedPoint = (eventName: any) => {
    createEvent();
    return obSubject.pipe(
      (rxjs as any).operators.filter((x: any) => x !== 0),
      (rxjs as any).operators.filter(
        (x: any) => x.receiver && x.receiver.includes(eventName)
      )
      // rxjs.operators.debounceTime(500)
    );
  };

  /**
   * 多播总事件
   */
  const createEvent = () => {
    if (!obSubject) {
      const subject = new rxjs.BehaviorSubject(0);
      obSubject = subject;
    }
  };
}

export var obEvents = new (ObservableMethods as any)();
console.log(obEvents);

/**
 * 获取数据类型
 * @param {*} value 值
 * @returns
 */
const getType = (value: any) => {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase();
};

/**
 * 总线转换
 * @param {*} param0
 */
const eventBusProcess = ({
  sender = "",
  eventData = {},
  body = {},
  staticRoute = [],
  data,
}: any = {}) => {
  staticRoute.forEach((current: any) => {
    const { title, target, trigger = [], receive = [] } = current;
    const { type } = eventData;
    if (type === "reply") return;
    // 是否存在当前发送者同时发送类型匹配,在路由配置是否存在
    if (target === sender && trigger.includes(type)) {
      receive.forEach((cur: any) => {
        let { source, event, script = "return data", replyStatus, reply } = cur;
        if (!script.length) {
          script = "return data";
        }
        try {
          console.log(`事件总线接收消息:`, data);
          const dataScript = new Function(
            "data",
            "{eventData={},title}",
            String(script)
          );
          const conventInfo = dataScript(body, { title, eventData }) || null;
          const header = {
            src: [sender],
            srcType: getType(body),
            dst: event,
            dstType: getType(conventInfo),
            fn: dataScript,
          };
          obEvents.setSelectedPoint(
            { sender, receiver: source, header, replyStatus, reply, eventData },
            conventInfo
          );
        } catch (error) {
          console.log(error);
        }
      });
      return;
    }
  });
};

/**
 * 总线回调
 * @param {*} param0
 */
const eventBusReply = ({
  sender = "",
  eventData = {},
  body = {},
  reply = [],
  data,
}: any = {}) => {
  const { type } = eventData;
  if (type !== "reply" || !Array.isArray(reply)) return;
  console.log(`事件总线接收回流消息:`, data);
  reply.forEach((current) => {
    let { source, event, script = "return data" } = current;
    if (!script.length) {
      script = "return data";
    }
    const dataScript = new Function(
      "data",
      "{eventData={},title}",
      String(script)
    );
    const conventInfo =
      dataScript(body, { title: "返回数据", eventData }) || null;
    const header = {
      src: [sender],
      srcType: getType(body),
      dst: event,
      dstType: getType(conventInfo),
      fn: dataScript,
    };
    obEvents.setSelectedPoint(
      { sender, receiver: source, header, eventData },
      conventInfo
    );
  });
};

/**
 * 总线订阅
 * @param {*} treeData
 */
export const eventBusSubscribe = (treeData = []) => {
  obEvents.currentSelectedPoint("eventBus").subscribe((data: any) => {
    Reflect.deleteProperty(data, "header");
    const router = [...document.querySelectorAll("q-router-config")].map(
      (current) => JSON.parse(<any>current.dataset.data).options
    );
    router.forEach((route) => {
      eventBusProcess({ ...data, staticRoute: route, data });
    });
    eventBusReply({ ...data, data });
  });
  if (!obEvents.allSubscribe.length) {
    const loopMethod = (allSubscribe: Array<any>, treeArr: Array<any>) => {
      allSubscribe.push(
        ...treeArr.map((element) => {
          const { id, children } = element;
          console.log(`组件${id}:被创建~~~`);
          loopMethod(allSubscribe, children);
          return {
            [id]: element,
            id,
            // 订阅id所属的消息挂载到总线
            observable: obEvents
              .currentSelectedPoint(id)
              .subscribe((data: any) => {
                console.log(`组件${id}接收总线消息:`, data);
              }),
          };
        })
      );
    };
    loopMethod(obEvents.allSubscribe, treeData);
  } else {
    const loopMoreMethod = (allSubscribe: Array<any>, treeArr: Array<any>) => {
      let addLen = 0;

      // 查找新进的节点
      while (treeArr[addLen]) {
        const { id, children } = treeArr[addLen];
        const addArr = allSubscribe.find((_) => _.id === id);
        if (!addArr) {
          console.log(`组件${id}:被创建~~~`);
          allSubscribe.push({
            [id]: treeArr[addLen],
            id,
            // 新增订阅id所属的消息挂载到总线
            observable: obEvents
              .currentSelectedPoint(id)
              .subscribe((data: any) => {
                console.log(`组件${id}接收总线消息:`, data);
              }),
          });
        }
        loopMoreMethod(allSubscribe, children);
        addLen++;
      }
    };

    loopMoreMethod(obEvents.allSubscribe, treeData);

    const loopDelMethod = (allSubscribe: Array<any>) => {
      let len = 0;
      // 删除rxbus逻辑节点
      while (allSubscribe[len]) {
        const { id } = allSubscribe[len];
        const target = <any>getTargetElement(id);
        if (!target) {
          // 取消被删除节点的订阅
          allSubscribe[len].observable &&
            allSubscribe[len].observable.unsubscribe();
          allSubscribe.splice(len, 1);
          console.log(`组件${id}:被销毁~~~`);
          continue;
        }
        target[id] = allSubscribe[len];
        len++;
      }
    };

    loopDelMethod(obEvents.allSubscribe);
  }
};
