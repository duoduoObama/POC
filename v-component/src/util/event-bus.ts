import { EVENTBUS_NAME } from "../components/constent";
import { eventBus } from "../types/EventBus";
import { IMessage } from "../types/IComponent";

console.log(EVENTBUS_NAME);
/**
 * 总线事件分发
 * @param {*} param0
 */
const eventBusProcess = ({ staticRoute = {} as never, data = {} } = {}) => {
  const {
    header: { src, srcType, reply },
    body,
  } = data as IMessage;
  const { src: targetSrc, trigger = [], receive = [] } = staticRoute;

  // 目标是否为当前组件,事件是否与触发器匹配
  if (targetSrc === src && trigger.includes(srcType as never)) {
    receive.forEach((cur) => {
      let { target, event = [], script = "return data" } = cur;
      if (!script.length) {
        script = "function (body, data){return data}";
      }
      try {
        const dataScript = new Function(`return ${script}`)();
        const conventInfo = dataScript(body, data) || null;

        const message = {
          header: {
            src,
            srcType,
            dst: target,
            dstType: event[0],
            fn: dataScript,
            reply,
          },
          body: conventInfo,
        };
        console.log(`事件总线分发消息:`, message);
        const dom = document.querySelector(`#${target}`) as any;
        // dom存在即向dom发送消息
        if (dom) {
          dom.onMessage(message);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
    return;
  }
};

/**
 * 总线订阅
 */
export const eventBusSubscribe = () => {
  eventBus.onMessage(EVENTBUS_NAME, (data: any) => {
    const { detail } = data;
    const {
      header: { src },
    } = detail;

    const router = [...document.querySelectorAll("q-router-config")].map(
      (current: any) => JSON.parse(current.dataset.data).router
    ) as { [key: string]: any };

    router.forEach((target: { [key: string]: any }) => {
      const route = target[src];
      if (!route) return;
      console.log(`事件总线接收消息:`, {
        staticRoute: route,
        data: data?.detail ?? {},
      });
      eventBusProcess({ staticRoute: route, data: data?.detail ?? {} });
    });
  });
};
