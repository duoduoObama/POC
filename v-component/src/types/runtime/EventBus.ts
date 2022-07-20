import { EVENTBUS_NAME } from "../../components/constent";
import { IEventBus } from "./IEventBus";
import { IMessage } from "./IMessage";
import { IRouterConfig } from "./IRouterConfig";

class EventBus implements IEventBus {

  /**
   * 总线初始化
   */
  eventBusInit = () => {
    eventBus.registerEventHandlers(EVENTBUS_NAME, (data: any) => {
      const { detail } = data;
      const {
        header: { src },
      } = detail;

      const router = [...document.querySelectorAll("q-router-config")].map(
        (current: any) => JSON.parse(current.dataset.data).router
      ) as IRouterConfig[]; 

      router.forEach((target: { [key: string]: any }) => {
        const route = target[src];
        if (!route) return;
        console.log(`事件总线接收消息:`, {
          staticRoute: route,
          data: data?.detail ?? {},
        });
        this.messageDispatch({ staticRoute: route, data: data?.detail ?? {} });
      });
    });
  }

  /**
   * 事件总线分发
   * @param param0 
   * @returns 
   */
   messageDispatch = ({ staticRoute = {} as never, data: iMessage = {} } = {}) => {
    const {
      header: { src, srcType, reply },
      body,
    } = iMessage as IMessage;
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
          const conventInfo = dataScript(body, iMessage) || null;

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
  }

  /**
   * 注册事件
   * @param eventName 事件名称
   * @param callBack
   */
  registerEventHandlers(eventName: string, callBack: Function): void {
    window.addEventListener(eventName, (event: any) => {
      callBack && callBack(event);
    });
  }

  sendMessage(imessage: IMessage) {

    return new Promise((resolve, reject) => {
      const { header } = imessage;
      Object.assign(header, { reply: { resolve, reject } });
      const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: imessage });

      window.dispatchEvent(customEvent);
    });
  };
}

export const eventBus = new EventBus();
