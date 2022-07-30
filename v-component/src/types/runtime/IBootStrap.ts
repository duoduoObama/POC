import { IconfigData } from "./IConfigData";

/**
 * 启动函数接口
 */
export interface IBootStrap {
    bootStrap: (root: HTMLElement | string, config: IconfigData) => any;
}