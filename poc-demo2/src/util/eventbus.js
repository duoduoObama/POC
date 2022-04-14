import { obEvents } from "./rx";
/**
 * 获取数据类型
 * @param {*} value 值
 * @returns
 */
const getType = (value) =>
  Object.prototype.toString
    .call(value)
    .match(/\[object (.*?)\]/)[1]
    .toLocaleLowerCase();

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
} = {}) => {
  staticRoute.forEach((current) => {
    const { title, target, trigger = [], receive = [] } = current;
    const { type } = eventData;
    if (type === "reply") return;
    // 是否存在当前发送者同时发送类型匹配,在路由配置是否存在&& trigger.includes(type)
    if (target === sender) {
      receive.forEach((cur) => {
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
} = {}) => {
  const { type } = eventData;
  if (type !== "reply" || !Array.isArray(reply)) return;
  console.log(`事件总线接收回流消息:`, data);
  reply.forEach((current) => {
    const { source, event, script = "return data" } = current;
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
const eventBusSubscribe = (treeData = []) => { 
  obEvents.currentSelectedPoint("eventBus").subscribe((data) => {
    Reflect.deleteProperty(data, "header");
    const router = [...document.querySelectorAll("q-router-config")].map(
      (current) => JSON.parse(current.dataset.data).options
    );
    router.forEach((route) => { 
      eventBusProcess({ ...data, staticRoute: route, data });
    });
    eventBusReply({ ...data, data });
  });
  if (!obEvents.allSubscribe.length) {
    const loopMethod = (allSubscribe, treeArr) => {
      if (!treeArr || !treeArr.length) return;
      allSubscribe.push(
        ...treeArr.map((element) => {
          const { id, children } = element;
          console.log(`组件${id}:被创建~~~`);
          loopMethod(allSubscribe, children);
          return {
            [id]: element,
            id,
            // 订阅id所属的消息挂载到总线
            observable: obEvents.currentSelectedPoint(id).subscribe((data) => {
              console.log(`组件${id}接收总线消息:`, data);
            }),
          };
        })
      );
    };
    loopMethod(obEvents.allSubscribe, treeData);
  } else {
    const loopMoreMethod = (allSubscribe, treeArr) => {
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
            observable: obEvents.currentSelectedPoint(id).subscribe((data) => {
              console.log(`组件${id}接收总线消息:`, data);
            }),
          });
        }
        loopMoreMethod(allSubscribe, children);
        addLen++;
      }
    };

    loopMoreMethod(obEvents.allSubscribe, treeData);

    const loopDelMethod = (allSubscribe) => {
      let len = 0;
      // 删除rxbus逻辑节点
      while (allSubscribe[len]) {
        const { id } = allSubscribe[len];
        const target = getTargetElement(id);
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

export { eventBusProcess, eventBusSubscribe };
