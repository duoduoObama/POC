import Moveable from "moveable";

var moveableDemo = new Moveable(document.body, {
  target: <any>document.querySelector("#drag-1af241gga121") || null, // movable元素
  // dragTarget: <any>document.querySelector("#drag-1af241gga121") || null, // movable元素
  snappable: true, // 是否初始化捕捉功能
  snapContainer: document.body, // 捕捉功能(辅助线)的容器
  snapThreshold: 5, // 捕捉效果触发的临界值,即元素与辅助线间距小于此数值,则自动贴边
  bounds: { left: 100, top: 100, right: 700, bottom: 600 }, // moveable操作元素的外边界值
  draggable: true, // 是否初始化拖拽
  resizable: true, // 是否初始化调整大小
  keepRatio: false, // 调整大小或缩放时，保持宽度、高度的比例
  throttleDrag: 0, // 拖拽的节流步长，即每次拖拽多少px，0则不节流
  throttleResize: 0, // 调整大小时的节流
  startDragRotate: 0, // 拖拽开始的角度
  throttleDragRotate: 0, // 旋转角度的节流，每次拖拽旋转多少度，0则不节流
  zoom: 1, // target辅助边框和操作点的大小
  origin: true, // 是否显示target中心辅助点
  padding: { left: 0, top: 0, right: 0, bottom: 0 }, // 在目标周围添加填充以增加拖动区域
  elementGuidelines: [], // 捕捉效果辅助线的dom列表
  snapGap: true, // 显示多组件间相等的间隙距离
  snapDirections: { left: true, top: true, right: true, bottom: true }, // 元素磁吸时当前target捕捉的方向
  elementSnapDirections: { left: true, top: true, right: true, bottom: true },
});

moveableDemo.on("dragStart", (e) => {
  console.log(moveableDemo.getRect());
});

moveableDemo.on("drag", (e) => {
  console.log(e);
  const element = <any>document.querySelector("#drag-1af241gga121");
  element.style.transform = e.transform;
});
