import { CustomEventMap } from "vite/types/customEvent";
import { EVENTBUS_NAME } from "../components/constent";
import { IMessage } from "../types/IComponent";

/**
 * 获取数据类型
 * @param {*} value 值
 * @returns
 */
const getType = (value: any) => {
    return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase();
}

/**
* 总线转换
* @param {*} param0
*/
const eventBusProcess = ({ staticRoute = [], data = {} } = {}) => {
    const { header: { src, srcType }, body } = data as IMessage;
    staticRoute.forEach((current) => {
        const { title, target, trigger = [], receive = [] } = current;

        if (srcType === "reply") return;
        // 目标是否为当前组件,事件是否与触发器匹配
        if (target === src && trigger.includes(srcType as never)) {
            receive.forEach((cur) => {
                let { source, event = [], script = "return data", replyStatus, reply } = cur;
                if (!script.length) {
                    script = "return data";
                }
                try {
                    const dataScript = new Function("data", "{body={},title}", String(script));
                    const conventInfo = dataScript(body, { title, body }) || null;
                    const message = {
                        header: {
                            src: EVENTBUS_NAME,
                            srcType: getType(body),
                            dst: source,
                            dstType: event[0],
                            fn: dataScript,
                        },
                        body: conventInfo,
                    };
                    console.log(`事件总线分发消息:`, message);
                    const customEvent = new CustomEvent(source, { detail: message });
                    window.dispatchEvent(customEvent);
                } catch (error) {
                    console.log(error);
                }
            });
            return;
        }
    });
};

// /**
// * 总线回调
// * @param {*} param0
// */
// const eventBusReply = ({ sender = "", eventData = {}, body = {}, reply = [], data } = {}) => {
//     const { type } = eventData;
//     if (type !== "reply" || !Array.isArray(reply)) return;
//     console.log(`事件总线接收回流消息:`, data);
//     reply.forEach((current) => {
//         const { source, event, script = "return data" } = current;
//         if (!script.length) {
//             script = "return data";
//         }
//         const dataScript = new Function("data", "{eventData={},title}", String(script));
//         const conventInfo = dataScript(body, { title: "返回数据", eventData }) || null;
//         const header = {
//             src: [sender],
//             srcType: getType(body),
//             dst: event,
//             dstType: getType(conventInfo),
//             fn: dataScript,
//         };
//         obEvents.setSelectedPoint({ sender, receiver: source, header, eventData }, conventInfo);
//     });
// };

/**
* 总线订阅
* @param {*} treeData
*/
export const eventBusSubscribe = () => {
    window.addEventListener(EVENTBUS_NAME, (data: any) => {

        const router = [...document.querySelectorAll("q-router-config")].map(
            (current: any) => JSON.parse(current.dataset.data).router
        );

        router.forEach((route) => {
            console.log(`事件总线接收消息:`, { staticRoute: route, data: data?.detail ?? {} });

            eventBusProcess({ staticRoute: route, data: data?.detail ?? {} });
        });
        // eventBusReply({ ...data, data });
    });
};