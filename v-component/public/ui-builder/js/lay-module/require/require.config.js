/**
 * 在amd环境下做忽略作用
 */
var bakDefine = void 0;
if (typeof define === "function" && define.amd) {
  bakDefine = define;
  define = null;
}
