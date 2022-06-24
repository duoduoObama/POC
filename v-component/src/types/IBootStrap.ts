import { IconfigData } from "./IEventBus";

/**
 * 启动函数接口
 */
export interface IBootStrap {
    bootStrap: (config: IconfigData) => any;
}